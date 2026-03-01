// Main application entry point
import * as d3 from 'd3';
import { graph, getNeighbors } from './graph.js';
import { mostDangerousGame } from './gameTheory.js';
import * as graphData from './graphData.js';
import { gameButtons, animateAndUpdate, tabulate, payoffTable, gameTabs, normalFormTable, craneAndWolfButtons } from './modFunctions.js';
import { config, animalBehaviors, nodeColors, nodeColorLevel, strokeColorLevel, deepClone } from './config.js';

// Handle window resize for responsive charts
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    config.updateDimensions();
    console.log('Window resized, chart dimensions updated:', config.chartWidth, config.chartHeight);
    // Note: Full chart redraw would require rebuilding all visualizations
    // For now, SVG viewBox will handle scaling automatically
  }, 250);
});

// Initialize the application
function init() {
  const { windowWidth, windowHeight } = config;
  const width = windowWidth;
  const height = windowHeight;

  // Page 0: Title page
  const aesopSvg = d3.select("#page0")
    .append("svg")
    .attr("viewBox", `0 0 ${windowWidth} ${windowHeight}`)
    .attr("class", "aesopSvg");

  const crowImage = aesopSvg.append("image")
    .attr("id", "crowImage")
    .attr("class", "animate-in")
    .attr("xlink:href", "imgs/fables/crow_crouching.png")
    .attr("x", 0.1 * width)
    .attr("y", 0)
    .attr("width", 0.2 * width)
    .attr("height", 0.2 * height);

  aesopSvg.append("image")
    .attr("xlink:href", "imgs/fables/fox.png")
    .attr("x", 0.46 * width)
    .attr("y", 0.4 * height)
    .attr("width", 0.6 * width)
    .attr("height", 0.6 * height);

  // Simple title text with CSS animations
  aesopSvg.append("text")
    .attr("x", 0.1 * width)
    .attr("y", 0.25 * height)
    .text("Game")
    .attr("textLength", (5 + windowWidth / 4))
    .attr("class", "aesopTitle animate-in animate-delay-1");

  aesopSvg.append("text")
    .attr("x", 0.1 * width)
    .attr("y", 0.36 * height)
    .text("Theory")
    .attr("textLength", (25 + windowWidth / 4))
    .attr("class", "aesopTitle animate-in animate-delay-2");

  // Page 1: Introduction
  d3.select("#page1").append("p")
    .text("Game theory is the science of logical decision making in the face of uncertainty. " +
      "Let's consider two individuals facing off with a decision to cooperate or oppose each other. " +
      "The payoff for a given individual's behavior depends upon the other individual's behavior. " +
      "How should one play?");

  d3.select("#page1").append("p")
    .text("Consider the various strategies taken by the animals of Aesop's Fables...");

  d3.select("#page1").append("img")
    .style("margin", "0 auto")
    .style("display", "block")
    .attr("src", "imgs/dice.png")
    .attr("width", "225")
    .attr("height", "160");

  // Page 2: Aesop's Fables slides
  setupFablesSlides();

  // Page 3: Aesop's game simulations
  setupAesopGames();

  // Page 4: Crane and Wolf
  setupCraneWolf();

  // Page 5: Prisoner's Dilemma intro
  setupPrisonerIntro();

  // Page 6: Full simulation
  setupFullSimulation();

  // Page 7: Network severing
  setupPage7();

  // Page 8: Bridge community (stub)
  setupPage8();

  // Page 9: Cooperation dynamics
  setupPage9();

  // Initialize scroll snap navigation
  console.log('Initializing scroll snap navigation...');
  createSlideNavigation();
  createVerticalNavigation();
  setupSectionCallbacks();
  setupKeyboardNavigation();
  console.log('Scroll snap navigation initialized');

  // Set up custom navigation for fables slides
  setupFablesNavigation();
  
  // Set up custom navigation for games slides
  setupGamesNavigation();
}

// Replace fullpage_api calls with native scroll
function createSlideNavigation() {
  // Find all slide containers
  const slideContainers = document.querySelectorAll('[data-slides-container]');
  
  slideContainers.forEach(container => {
    const slides = container.querySelectorAll('.slide');
    
    // Navigation methods
    function moveSlideLeft() {
      const currentScroll = container.scrollLeft;
      const slideWidth = container.clientWidth;
      container.scrollTo({
        left: currentScroll - slideWidth,
        behavior: 'smooth'
      });
    }
    
    function moveSlideRight() {
      const currentScroll = container.scrollLeft;
      const slideWidth = container.clientWidth;
      container.scrollTo({
        left: currentScroll + slideWidth,
        behavior: 'smooth'
      });
    }
    
    function moveTo(index) {
      const slideWidth = container.clientWidth;
      container.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
    }
    
    // Store methods on container for external access
    container.slideNavigation = {
      moveLeft: moveSlideLeft,
      moveRight: moveSlideRight,
      moveTo: moveTo
    };
  });
}

// Create vertical navigation dots
function createVerticalNavigation() {
  const sections = document.querySelectorAll('.section');
  const nav = document.createElement('nav');
  nav.id = 'section-nav';
  nav.setAttribute('aria-label', 'Section navigation');
  
  sections.forEach((section, index) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.setAttribute('aria-label', `Go to section ${index + 1}`);
    dot.dataset.section = index;
    
    // Click handler - scroll to section
    dot.addEventListener('click', () => {
      const fullpage = document.getElementById('fullpage');
      fullpage.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
    });
    
    nav.appendChild(dot);
  });
  
  document.body.appendChild(nav);
  
  // Update active dot on scroll using IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(sections).indexOf(entry.target);
          document.querySelectorAll('.nav-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
          });
        }
      });
    },
    { threshold: 0.5 }
  );
  
  sections.forEach(section => observer.observe(section));
}

// Setup section callbacks using IntersectionObserver
function setupSectionCallbacks() {
  const sections = document.querySelectorAll('.section');
  let currentSection = 0;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const sectionIndex = Array.from(sections).indexOf(entry.target);
        
        if (entry.isIntersecting) {
          // Equivalent to afterLoad callback
          console.log(`Loaded section ${sectionIndex + 1}`);
          currentSection = sectionIndex;
        } else if (entry.boundingClientRect.top < 0) {
          // Equivalent to onLeave callback (scrolling down)
          console.log(`Leaving section ${sectionIndex + 1}`);
        }
      });
    },
    { threshold: 0.5 }
  );
  
  sections.forEach(section => observer.observe(section));
}

// Setup keyboard navigation for accessibility
function setupKeyboardNavigation() {
  const sections = document.querySelectorAll('.section');
  const fullpage = document.getElementById('fullpage');
  
  document.addEventListener('keydown', (e) => {
    // Get current section based on scroll position
    const currentSection = Math.round(fullpage.scrollTop / window.innerHeight);
    
    // Up/Down arrows and PageUp/PageDown for sections
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const nextIndex = Math.min(currentSection + 1, sections.length - 1);
      const nextSection = sections[nextIndex];
      if (nextSection) {
        fullpage.scrollTo({
          top: nextIndex * window.innerHeight,
          behavior: 'smooth'
        });
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const prevIndex = Math.max(currentSection - 1, 0);
      const prevSection = sections[prevIndex];
      if (prevSection) {
        fullpage.scrollTo({
          top: prevIndex * window.innerHeight,
          behavior: 'smooth'
        });
      }
    }
    
    // Left/Right arrows for slides (if currently in a section with slides)
    const currentSectionElement = sections[currentSection];
    if (currentSectionElement && currentSectionElement.classList.contains('has-slides')) {
      const activeSlideContainer = currentSectionElement.querySelector('[data-slides-container]');
      if (activeSlideContainer && activeSlideContainer.slideNavigation) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          activeSlideContainer.slideNavigation.moveLeft();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          activeSlideContainer.slideNavigation.moveRight();
        }
      }
    }
    
    // Home/End keys for first/last section
    if (e.key === 'Home') {
      e.preventDefault();
      fullpage.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else if (e.key === 'End') {
      e.preventDefault();
      fullpage.scrollTo({
        top: (sections.length - 1) * window.innerHeight,
        behavior: 'smooth'
      });
    }
  });
}

function setupFablesNavigation() {
  // Create custom navigation for fables section
  const page2 = document.querySelector('#page2');
  
  // Create the custom navigation container
  const navContainer = document.createElement('div');
  navContainer.className = 'custom-slides-nav';
  
  // Create left arrow
  const leftArrow = document.createElement('div');
  leftArrow.className = 'custom-nav-arrow left';
  leftArrow.setAttribute('aria-label', 'Previous fable');
  navContainer.appendChild(leftArrow);
  
  // Create dots container
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'custom-nav-dots';
  
  // Create three dots for three slides
  const slideNames = ['Lion and Mouse', 'Cat and Monkey', 'Two Goats'];
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'custom-nav-dot';
    dot.setAttribute('data-slide', i);
    dot.setAttribute('aria-label', slideNames[i]);
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
  }
  
  navContainer.appendChild(dotsContainer);
  
  // Create right arrow
  const rightArrow = document.createElement('div');
  rightArrow.className = 'custom-nav-arrow right';
  rightArrow.setAttribute('aria-label', 'Next fable');
  navContainer.appendChild(rightArrow);
  
  // Add to page
  page2.appendChild(navContainer);
  
  // Navigation state
  let currentSlide = 0;
  const totalSlides = 3;
  
  // Function to update navigation state
  function updateNavigation(slideIndex) {
    currentSlide = slideIndex;
    
    // Update dots
    const dots = dotsContainer.querySelectorAll('.custom-nav-dot');
    dots.forEach((dot, index) => {
      if (index === slideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Update arrow states
    if (slideIndex === 0) {
      leftArrow.classList.add('disabled');
    } else {
      leftArrow.classList.remove('disabled');
    }
    
    if (slideIndex === totalSlides - 1) {
      rightArrow.classList.add('disabled');
    } else {
      rightArrow.classList.remove('disabled');
    }
  }
  
  // Get the page2 slide container
  const page2Container = document.querySelector('#page2 [data-slides-container]');
  
  // Click handlers for arrows
  leftArrow.addEventListener('click', () => {
    if (currentSlide > 0) {
      page2Container.slideNavigation.moveLeft();
    }
  });
  
  rightArrow.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
      page2Container.slideNavigation.moveRight();
    }
  });
  
  // Click handlers for dots
  const dots = dotsContainer.querySelectorAll('.custom-nav-dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      page2Container.slideNavigation.moveTo(index);
    });
  });
  
  // Update navigation on scroll
  page2Container.addEventListener('scroll', () => {
    const slideWidth = page2Container.clientWidth;
    const scrollLeft = page2Container.scrollLeft;
    const newSlide = Math.round(scrollLeft / slideWidth);
    
    if (newSlide !== currentSlide) {
      updateNavigation(newSlide);
    }
  });
  
  // Initialize with first slide active
  updateNavigation(0);
}

function setupGamesNavigation() {
  // Create custom navigation for games section
  const page3 = document.querySelector('#page3');
  
  // Create the custom navigation container
  const navContainer = document.createElement('div');
  navContainer.className = 'custom-slides-nav';
  
  // Create left arrow
  const leftArrow = document.createElement('div');
  leftArrow.className = 'custom-nav-arrow left';
  leftArrow.setAttribute('aria-label', 'Previous game');
  navContainer.appendChild(leftArrow);
  
  // Create dots container
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'custom-nav-dots';
  
  // Create three dots for three game slides
  const gameNames = ['Lion & Mouse', 'Two Goats', 'Cat & Monkey'];
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'custom-nav-dot';
    dot.setAttribute('data-slide', i);
    dot.setAttribute('aria-label', gameNames[i]);
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
  }
  
  navContainer.appendChild(dotsContainer);
  
  // Create right arrow
  const rightArrow = document.createElement('div');
  rightArrow.className = 'custom-nav-arrow right';
  rightArrow.setAttribute('aria-label', 'Next game');
  navContainer.appendChild(rightArrow);
  
  // Add to page
  page3.appendChild(navContainer);
  
  // Navigation state
  let currentSlide = 0;
  const totalSlides = 3;
  
  // Function to update navigation state
  function updateNavigation(slideIndex) {
    currentSlide = slideIndex;
    
    // Update dots
    const dots = dotsContainer.querySelectorAll('.custom-nav-dot');
    dots.forEach((dot, index) => {
      if (index === slideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Update arrow states
    if (slideIndex === 0) {
      leftArrow.classList.add('disabled');
    } else {
      leftArrow.classList.remove('disabled');
    }
    
    if (slideIndex === totalSlides - 1) {
      rightArrow.classList.add('disabled');
    } else {
      rightArrow.classList.remove('disabled');
    }
  }
  
  // Get the page3 slide container
  const page3Container = document.querySelector('#page3 [data-slides-container]');
  
  // Click handlers for arrows
  leftArrow.addEventListener('click', () => {
    if (currentSlide > 0) {
      page3Container.slideNavigation.moveLeft();
    }
  });
  
  rightArrow.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
      page3Container.slideNavigation.moveRight();
    }
  });
  
  // Click handlers for dots
  const dots = dotsContainer.querySelectorAll('.custom-nav-dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      page3Container.slideNavigation.moveTo(index);
    });
  });
  
  // Update navigation on scroll
  page3Container.addEventListener('scroll', () => {
    const slideWidth = page3Container.clientWidth;
    const scrollLeft = page3Container.scrollLeft;
    const newSlide = Math.round(scrollLeft / slideWidth);
    
    if (newSlide !== currentSlide) {
      updateNavigation(newSlide);
    }
  });
  
  // Initialize with first slide active
  updateNavigation(0);
}

function setupFablesSlides() {
  const { windowWidth, windowHeight } = config;
  const width = windowWidth;
  const height = windowHeight;

  // Slide 1: Lion and Mouse
  const slide1 = d3.select("#aesopSlide1");
  
  slide1.append("div")
    .attr("class", "fable-text")
    .style("padding", "40px")
    .style("max-width", "600px")
    .style("margin", "0 auto")
    .style("color", "black")
    .html("<h2>The Lion and the Mouse</h2>" +
      "<p>A Lion lay asleep in the forest, his great head resting on his paws. " +
      "A timid little Mouse came upon him unexpectedly, and in her fright and haste to get away, ran across the Lion's nose. " +
      "Roused from his nap, the Lion laid his huge paw angrily on the tiny creature to kill her.</p>" +
      "<p>'Spare me!' begged the poor Mouse. 'Please let me go and some day I will surely repay you.'</p>" +
      "<p>The Lion was much amused to think that a Mouse could ever help him. But he was generous and finally let the Mouse go.</p>" +
      "<p>Some days later, while stalking his prey in the forest, the Lion was caught in the toils of a hunter's net. " +
      "Unable to free himself, he filled the forest with his angry roaring. The Mouse knew the voice and quickly found the Lion struggling in the net. " +
      "Running to one of the great ropes that bound him, she gnawed it until it parted, and soon the Lion was free.</p>" +
      "<p><em>'You laughed when I said I would repay you,' said the Mouse. 'Now you see that even a Mouse can help a Lion.'</em></p>" +
      "<p><em><p><i>A kindness is never wasted</i></p>" +
				"<p><b>or</b></p>" +
				"<p><i>two cooperators succeed together.</i></p></em></p>");

  // const slide1Svg = slide1.append("svg")
  //   .attr("width", windowWidth)
  //   .attr("height", windowHeight * 0.3)
  //   .style("position", "absolute")
  //   .style("bottom", "0")
  //   .style("left", "0");

  // slide1Svg.append("image")
  //   .attr("xlink:href", "imgs/fables/lion.png")
  //   .attr("x", 0.1 * width)
  //   .attr("y", 0)
  //   .attr("height", windowHeight * 0.25)
  //   .attr("width", windowWidth * 0.3);

  // Slide 2: Cat and Monkey
  const slide2 = d3.select("#aesopSlide2");
  
  slide2.append("div")
    .attr("class", "fable-text")
    .style("padding", "40px")
    .style("max-width", "600px")
    .style("margin", "0 auto")
    .style("color", "black")
    .html("<h3>The Monkey and the Cat</h2>" +
      "<p>Once upon a time a Cat and a Monkey lived as pets in the same house. They were friends and were constantly in all sorts of mischief together. One day they were sitting by the fire, watching some chestnuts roasting on the hearth. How to get them was the question.</p>" +
      "<p>\"I would gladly get them,\" said the cunning Monkey, \"but you are much more skillful at such things than I am. Pull them out and I'll divide them between us.\"</p>" +
      "<p>Mistress Cat stretched out her paw very carefully, pushed aside some of the cinders, and drew back her paw very quickly. Then she tried it again, this time pulling a chestnut half out of the fire. A third time and she drew out the chestnut. This performance she went through several times, each time singeing her paw severely. As fast as she pulled the chestnuts out of the fire, the Monkey ate them up.</p>" +
      "<p>Now the housekeeper came in, and away scampered the rascals, Mistress Cat with a burnt paw and no chestnuts. From that time on, they say, she contented herself with mice and rats and had little to do with Sir Monkey.</p>" +
      "<div style=\"text-align: center;\">" +
      "<p><i>The flatterer seeks some benefit at your expense</i></p>" +
      "<p><b>or</b></p>" +
      "<p><i>a deceiver exploits a cooperator.</i></p>" +
      "</div>");

  // Slide 3: Two Goats  
  const slide3 = d3.select("#aesopSlide3")
    .style("position", "relative");
  
  // Create a semi-transparent background layer
  slide3.append("div")
    .style("position", "absolute")
    .style("top", "0")
    .style("left", "0")
    .style("width", "100%")
    .style("height", "100%")
    .style("background-image", "url('imgs/fables/goat.png')")
    .style("background-repeat", "no-repeat")
    .style("background-position", "center bottom")
    .style("background-size", "50%")
    .style("opacity", "0.2")
    .style("pointer-events", "none")
    .style("z-index", "0");
  
  slide3.append("div")
    .attr("class", "fable-text")
    .style("padding", "40px")
    .style("max-width", "600px")
    .style("margin", "0 auto")
    .style("color", "black")
    .style("position", "relative")
    .style("z-index", "1")
    .html("<h2>The Two Goats</h2>" +
      "<p>Two Goats, carousing on the rocky steeps of a mountain valley, chanced to meet, one on each side of a deep chasm through which poured a mighty mountain torrent. " +
      "The trunk of a fallen tree formed the only means of crossing the chasm, and on this not even two squirrels could have passed each other in safety. " +
      "The narrow path would have made the bravest tremble. Not so our Goats. Their pride would not permit either to stand aside for the other.</p>" +
      "<p>One set her foot on the log. The other did likewise. In the middle they met horn to horn. Neither would give way, and so they both fell, to be swept away by the roaring torrent below.</p>" +
      "<div style=\"text-align: center;\">" +
      "<p><i>It is better to yield than to come to misfortune through stubbornness</i></p>" +
      "<p><b>or</b></p>" +
      "<p><i>two cheaters fail together.</i></p>" +
      "</div>");
}

function setupAesopGames() {
  const { chartWidth, chartHeight } = config;

  // Slide 1: Lion and Mouse
  const page4Graph1 = d3.select("#aesopGameSlide1")
    .append("div").attr("class", "leftDiv")
    .append("svg")
    .attr("overflow", "visible")
    .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`);

  d3.select("#aesopGameSlide1").append("div").attr("class", "rightDiv")
    .style("padding", "20px")
    .style("color", "black")
    .style("display", "block")
    .style("visibility", "visible")
    .text("Aesop's fables demonstrate that an individual's behavior and their counterpart's behavior determines the outcome. " +
      "The lion took a chance cooperating with the mouse and in return the kind mouse cooperated with the lion so they both were better off. " +
      "Let's visualize these results. We can run a little simulation by clicking the rotating gear icon.");

  const graphOptions1 = {
    linkBehavior: "strengthBySource",
    chooseBehavior: false,
    sizeRange: "absolute",
    severable: false,
    payoffNormalForm: [[[3,3],[-1,3]],[[3,-1],[-2,-2]]],
    linkStrengthNormalization: 0.1,
    tabulations: [],
    data: deepClone(graphData.lionAndMouse),
    baseData: graphData.lionAndMouse,
    center: false
  };
  
  // Initialize the graph visualization
  const graphState1 = graph(page4Graph1, graphOptions1, animalBehaviors, nodeColors, nodeColorLevel, strokeColorLevel, config.chartWidth, config.chartHeight, config.blinkTime);
  graphOptions1.graphState = graphState1;
  gameButtons("#aesopGameSlide1 .rightDiv", page4Graph1, graphOptions1);

  // Slide 2: Goat and Goat
  const page4Graph2 = d3.select("#aesopGameSlide2")
    .append("div").attr("class", "leftDiv")
    .append("svg")
    .attr("overflow", "visible")
    .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`);

  d3.select("#aesopGameSlide2").append("div").attr("class", "rightDiv")
    .style("padding", "20px")
    .style("color", "black")
    .style("display", "block")
    .style("visibility", "visible")
    .text("See how those stubborn goats lose. Notice that the link between those who harm each other weakens.");

  const graphOptions2 = {
    linkBehavior: "strengthBySource",
    chooseBehavior: false,
    sizeRange: "absolute",
    severable: false,
    payoffNormalForm: [[[3,3],[-1,3]],[[3,-1],[-2,-2]]],
    linkStrengthNormalization: 0.1,
    tabulations: [],
    data: deepClone(graphData.goatAndGoat),
    baseData: graphData.goatAndGoat,
    center: false
  };
  
  // Initialize the graph visualization
  const graphState2 = graph(page4Graph2, graphOptions2, animalBehaviors, nodeColors, nodeColorLevel, strokeColorLevel, config.chartWidth, config.chartHeight, config.blinkTime);
  graphOptions2.graphState = graphState2;
  gameButtons("#aesopGameSlide2 .rightDiv", page4Graph2, graphOptions2);

  // Slide 3: Monkey and Cat
  const page4Graph3 = d3.select("#aesopGameSlide3")
    .append("div").attr("class", "leftDiv")
    .append("svg")
    .attr("overflow", "visible")
    .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`);

  d3.select("#aesopGameSlide3").append("div").attr("class", "rightDiv")
    .style("padding", "20px")
    .style("color", "black")
    .style("display", "block")
    .style("visibility", "visible")
    .text("See how the monkey tricks the cat. Notice that winners grow and losers shrink.");

  const graphOptions3 = {
    linkBehavior: "strengthBySource",
    chooseBehavior: false,
    sizeRange: "absolute",
    severable: false,
    payoffNormalForm: [[[3,3],[-1,3]],[[3,-1],[-2,-2]]],
    linkStrengthNormalization: 0.1,
    tabulations: [],
    data: deepClone(graphData.monkeyAndCat),
    baseData: graphData.monkeyAndCat,
    center: false
  };
  
  // Initialize the graph visualization
  const graphState3 = graph(page4Graph3, graphOptions3, animalBehaviors, nodeColors, nodeColorLevel, strokeColorLevel, config.chartWidth, config.chartHeight, config.blinkTime);
  graphOptions3.graphState = graphState3;

  gameButtons("#aesopGameSlide3 .rightDiv", page4Graph3, graphOptions3);
}

function setupCraneWolf() {
  const { chartWidth, chartHeight } = config;
  
  d3.select("#page4").append("div").attr("class", "leftDiv")
    .text("A Wolf had been feasting too greedily, and a bone had stuck crosswise in his throat. " +
      "So away he hurried to the Crane. He was sure that she, with her long neck and bill, would easily be able to reach the bone and pull it out. " +
      "'I will reward you very handsomely,' said the Wolf, 'if you pull that bone out for me.'");

  const graphOptions4 = {
    linkBehavior: "strengthBySource",
    chooseBehavior: false,
    sizeRange: "absolute",
    severable: false,
    payoffNormalForm: [[[3,3],[-1,3]],[[3,-1],[-2,-2]]],
    linkStrengthNormalization: 0.1,
    tabulations: [],
    data: deepClone(graphData.craneAndWolf),
    baseData: graphData.craneAndWolf,
    center: false
  };

  const page4Graph = d3.select("#page4").append("div").attr("class", "rightDiv")
    .append("svg")
    .attr("overflow", "visible")
    .attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`);

  // Initialize the graph visualization
  const graphState4 = graph(page4Graph, graphOptions4, animalBehaviors, nodeColors, nodeColorLevel, strokeColorLevel, config.chartWidth, config.chartHeight, config.blinkTime);
  graphOptions4.graphState = graphState4;

  craneAndWolfButtons("#page4 .leftDiv", page4Graph, graphOptions4);

  d3.select("#page4 .leftDiv").append("div")
    .text("The Crane, as you can imagine, was very uneasy about putting her head in a Wolf's throat. But she was grasping in nature, so she did what the Wolf asked her to do." +
      "When the Wolf felt that the bone was gone, he started to walk away." +
      "'But what about my reward!' called the Crane anxiously." +
      "'What!' snarled the Wolf, whirling around. 'Haven't you got it? Isn't it enough that I let you take your head out of my mouth without snapping it off?'")
    .style("display", "none");
}

function setupPrisonerIntro() {
  d3.select("#page5").append("div").attr("class", "leftDiv")
    .text("In many situations working together is a great solution, but under certain circumstances this assumption is strained. " +
      "What happens when the individual payoff for betrayal is greater than the individual payoff for cooperation?");

  d3.select("#page5").append("div").attr("class", "rightDiv");
  
  normalFormTable("#page5 .rightDiv", {
    payoffNormalForm: [[[1,1],[-1,2]],[[2,-1],[0,0]]]
  });
}

function setupFullSimulation() {
  const container = d3.select("#page6");
  
  // Text context
  const textDiv = container.append("div").attr("class", "page6-text")
    .style("padding", "20px")
    .style("max-width", "800px")
    .style("margin", "0 auto");
  
  textDiv.append("p")
    .text("Let's examine the prisoner's dilemma with some simulations of different kinds of players. " +
      "Each animal will represent some archetype with some kind of behavior.");

  const characterList = textDiv.append("ul");
  characterList.append("li").text("The simple dog always cooperates.");
  characterList.append("li").text("The copycat starts by cooperating, and each round thereafter does what opponent did in the previous round.");
  characterList.append("li").text("The cheater snake always cheats.");
  characterList.append("li").text("The crazy fox does the opposite of the opponent's last move.");
  characterList.append("li").text("The wise owl learns about each opponent and plays strategically.");
  characterList.append("li").text("The monkey plays randomly.");

  // Three buttons container
  const buttonsContainer = container.append("div").attr("class", "page6-buttons")
    .style("text-align", "center")
    .style("padding", "20px");

  const { buttonBoxWidth, buttonBoxHeight, bWidth, bHeight, bSpace, blinkTime } = config;
  const totalButtonWidth = 3 * bWidth + 2 * bSpace; // Calculate actual width needed for 3 buttons
  const buttonsSvg = buttonsContainer.append("svg")
    .attr("width", "100%")
    .attr("height", buttonBoxHeight)
    .attr('viewBox', `0 0 ${totalButtonWidth} ${buttonBoxHeight}`);

  const baseData6 = graphData.fullyConnected({
    behaviors: ["cooperator", "copycat", "cheater", "clever", "random", "wise"],
    n: [1, 1, 1, 1, 1, 1]
  });

  const graphOptions6 = {
    linkBehavior: "strengthByFreewill",
    chooseBehavior: true,
    sizeRange: [20, 45],
    severable: false,
    payoffNormalForm: [[[1,1],[-1,2]],[[2,-1],[0,0]]],
    linkStrengthNormalization: 0.1,
    tabulations: ['id', 'behavior', 'value'],
    data: deepClone(baseData6),
    baseData: baseData6,
    center: true
  };

  // Graph container (visible by default)
  const graphContainer = container.append("div").attr("class", "page6-graph-container")
    .style("display", "block")
    .style("padding", "20px")
    .style("text-align", "center");

  const page6Graph = graphContainer.append("svg")
    .attr("width", "100%")
    .attr("height", "500px")
    .attr("overflow", "visible")
    .attr('viewBox', `0 0 ${config.chartWidth} ${config.chartHeight}`)
    .style("max-width", `${config.chartWidth}px`)
    .style("margin", "0 auto")
    .style("display", "block");

  // Tabs container (hidden by default)
  const tabsContainer = container.append("div").attr("class", "page6-tabs-container")
    .style("display", "none")
    .style("padding", "20px");

  gameTabs(".page6-tabs-container", graphOptions6);
  payoffTable("#page6 #payoff", graphOptions6);

  // Initialize the graph visualization
  const graphState6 = graph(page6Graph, graphOptions6, animalBehaviors, nodeColors, nodeColorLevel, strokeColorLevel, config.chartWidth, config.chartHeight, config.blinkTime);
  graphOptions6.graphState = graphState6;

  // Create three buttons
  const buttonData = [
    { id: 'run', icon: 'imgs/icons/gear.png', iconHover: 'imgs/icons/gear_filled.png', x: 0 },
    { id: 'reset', icon: 'imgs/icons/reset.png', iconHover: 'imgs/icons/reset_filled.png', x: bWidth + bSpace },
    { id: 'adjust', icon: 'imgs/icons/dice.png', iconHover: 'imgs/icons/dice_filled.png', x: 2 * (bWidth + bSpace) }
  ];

  let showingGraph = true;

  const buttons = buttonsSvg.selectAll('g.button')
    .data(buttonData)
    .enter()
    .append('g')
    .attr('class', 'button')
    .style('cursor', 'pointer')
    .on('click', function(event, d) {
      d3.select(this).style('opacity', 0.5)
        .transition().duration(blinkTime)
        .style('opacity', 1.0);

      if (d.id === 'run') {
        let nodeData = graphOptions6.graphState ? graphOptions6.graphState.nodeData : graphOptions6.data.nodes;
        let linkData = graphOptions6.graphState ? graphOptions6.graphState.linkData : graphOptions6.data.links;
        
        const result = mostDangerousGame(
          '#page6',
          page6Graph,
          graphOptions6,
          nodeData,
          linkData,
          (node) => getNeighbors(node, linkData),
          () => {}
        );
        
        if (graphOptions6.graphState) {
          graphOptions6.graphState.nodeData = result.nodeData;
          graphOptions6.graphState.linkData = result.linkData;
        }
        graphOptions6.data.nodes = result.nodeData;
        graphOptions6.data.links = result.linkData;
        
        animateAndUpdate(graphOptions6, page6Graph, '#page6');
      } else if (d.id === 'reset') {
        graphOptions6.data = deepClone(graphOptions6.baseData);
        for (let i = 0; i < graphOptions6.data.nodes.length; i++) {
          d3.select('#' + graphOptions6.data.nodes[i].id)
            .style('fill', 'black');
        }
        const graphResult = graph(
          page6Graph,
          graphOptions6,
          animalBehaviors,
          nodeColors,
          nodeColorLevel,
          strokeColorLevel,
          config.chartWidth,
          config.chartHeight,
          config.blinkTime
        );
        graphOptions6.graphState = graphResult;
      } else if (d.id === 'adjust') {
        showingGraph = !showingGraph;
        graphContainer.style('display', showingGraph ? 'block' : 'none');
        tabsContainer.style('display', showingGraph ? 'none' : 'block');
      }
    })
    .on('mouseover', function(event, d) {
      d3.select(this).select('image')
        .attr('xlink:href', d.iconHover);
    })
    .on('mouseout', function(event, d) {
      d3.select(this).select('image')
        .attr('xlink:href', d.icon);
    });

  buttons.append('image')
    .attr('x', d => d.x)
    .attr('y', 0)
    .attr('width', bWidth)
    .attr('height', bHeight)
    .attr('xlink:href', d => d.icon);
}

function setupPage7() {
  const container = d3.select("#page7");
  
  // Text context
  container.append("div").attr("class", "page7-text")
    .style("padding", "20px")
    .style("max-width", "800px")
    .style("margin", "0 auto")
    .text("So it looks like strategies of betrayal are very effective. " +
      "In almost every society in the world today if you don't like a situation you can just walk away from it. " +
      "In the previous simulations we saw how some nodes became closer and some got more distant. " +
      "Generally, social as well as economic transactions are carried out only upon the will of both parties: either party can unilaterally sever relations. " +
      "At first the cheater does well, but after many rounds they are no longer part of the network.");

  // Three buttons container
  const buttonsContainer = container.append("div").attr("class", "page7-buttons")
    .style("text-align", "center")
    .style("padding", "20px");

  const { buttonBoxWidth, buttonBoxHeight, bWidth, bHeight, bSpace, blinkTime } = config;
  const totalButtonWidth = 3 * bWidth + 2 * bSpace; // Calculate actual width needed for 3 buttons
  const buttonsSvg = buttonsContainer.append("svg")
    .attr("width", "100%")
    .attr("height", buttonBoxHeight)
    .attr('viewBox', `0 0 ${totalButtonWidth} ${buttonBoxHeight}`);

  const baseData7 = graphData.fullyConnected({
    behaviors: ["cooperator", "copycat", "cheater", "clever", "random", "wise"],
    n: [1, 1, 1, 1, 1, 1]
  });

  const graphOptions7 = {
    linkBehavior: "strengthByFreewill",
    chooseBehavior: true,
    sizeRange: [15, 35],
    severable: true,
    payoffNormalForm: [[[1,1],[-1,2]],[[2,-1],[0,0]]],
    linkStrengthNormalization: 0.25,
    tabulations: ['id', 'behavior', 'value'],
    data: deepClone(baseData7),
    baseData: baseData7,
    center: true
  };

  // Graph container (visible by default)
  const graphContainer = container.append("div").attr("class", "page7-graph-container")
    .style("display", "block")
    .style("padding", "20px")
    .style("text-align", "center");

  const page7Graph = graphContainer.append("svg")
    .attr("width", "100%")
    .attr("height", "500px")
    .attr("overflow", "visible")
    .attr('viewBox', `0 0 ${config.chartWidth} ${config.chartHeight}`)
    .style("max-width", `${config.chartWidth}px`)
    .style("margin", "0 auto")
    .style("display", "block");

  // Tabs container (hidden by default)
  const tabsContainer = container.append("div").attr("class", "page7-tabs-container")
    .style("display", "none")
    .style("padding", "20px");

  gameTabs(".page7-tabs-container", graphOptions7);
  payoffTable("#page7 #payoff", graphOptions7);

  // Initialize the graph visualization
  const graphState7 = graph(page7Graph, graphOptions7, animalBehaviors, nodeColors, nodeColorLevel, strokeColorLevel, config.chartWidth, config.chartHeight, config.blinkTime);
  graphOptions7.graphState = graphState7;

  // Create three buttons
  const buttonData = [
    { id: 'run', icon: 'imgs/icons/gear.png', iconHover: 'imgs/icons/gear_filled.png', x: 0 },
    { id: 'reset', icon: 'imgs/icons/reset.png', iconHover: 'imgs/icons/reset_filled.png', x: bWidth + bSpace },
    { id: 'adjust', icon: 'imgs/icons/dice.png', iconHover: 'imgs/icons/dice_filled.png', x: 2 * (bWidth + bSpace) }
  ];

  let showingGraph = true;

  const buttons = buttonsSvg.selectAll('g.button')
    .data(buttonData)
    .enter()
    .append('g')
    .attr('class', 'button')
    .style('cursor', 'pointer')
    .on('click', function(event, d) {
      d3.select(this).style('opacity', 0.5)
        .transition().duration(blinkTime)
        .style('opacity', 1.0);

      if (d.id === 'run') {
        let nodeData = graphOptions7.graphState ? graphOptions7.graphState.nodeData : graphOptions7.data.nodes;
        let linkData = graphOptions7.graphState ? graphOptions7.graphState.linkData : graphOptions7.data.links;
        
        const result = mostDangerousGame(
          '#page7',
          page7Graph,
          graphOptions7,
          nodeData,
          linkData,
          (node) => getNeighbors(node, linkData),
          () => {}
        );
        
        if (graphOptions7.graphState) {
          graphOptions7.graphState.nodeData = result.nodeData;
          graphOptions7.graphState.linkData = result.linkData;
        }
        graphOptions7.data.nodes = result.nodeData;
        graphOptions7.data.links = result.linkData;
        
        animateAndUpdate(graphOptions7, page7Graph, '#page7');
      } else if (d.id === 'reset') {
        graphOptions7.data = deepClone(graphOptions7.baseData);
        for (let i = 0; i < graphOptions7.data.nodes.length; i++) {
          d3.select('#' + graphOptions7.data.nodes[i].id)
            .style('fill', 'black');
        }
        const graphResult = graph(
          page7Graph,
          graphOptions7,
          animalBehaviors,
          nodeColors,
          nodeColorLevel,
          strokeColorLevel,
          config.chartWidth,
          config.chartHeight,
          config.blinkTime
        );
        graphOptions7.graphState = graphResult;
      } else if (d.id === 'adjust') {
        showingGraph = !showingGraph;
        graphContainer.style('display', showingGraph ? 'block' : 'none');
        tabsContainer.style('display', showingGraph ? 'none' : 'block');
      }
    })
    .on('mouseover', function(event, d) {
      d3.select(this).select('image')
        .attr('xlink:href', d.iconHover);
    })
    .on('mouseout', function(event, d) {
      d3.select(this).select('image')
        .attr('xlink:href', d.icon);
    });

  buttons.append('image')
    .attr('x', d => d.x)
    .attr('y', 0)
    .attr('width', bWidth)
    .attr('height', bHeight)
    .attr('xlink:href', d => d.icon);
}

function setupPage8() {
  const container = d3.select("#page8");
  
  // Text context
  container.append("div").attr("class", "page8-text")
    .style("padding", "20px")
    .style("max-width", "800px")
    .style("margin", "0 auto")
    .text("But how easily can links be broken and can links be unbroken? " +
      "Imagine a community that lives beyond a river with a bridge that is very old. " +
      "In order to replace the bridge the community gets together and decides to money by asking everyone to pay. " +
      "The community tries to coordinate the payments, but it is possible to cheat. " +
      "There are 100 people in the community. If you lie and don't put in your cost is 0, but your benefit is...");

  // Three buttons container
  const buttonsContainer = container.append("div").attr("class", "page8-buttons")
    .style("text-align", "center")
    .style("padding", "20px");

  const { buttonBoxWidth, buttonBoxHeight, bWidth, bHeight, bSpace, blinkTime } = config;
  const totalButtonWidth = 3 * bWidth + 2 * bSpace; // Calculate actual width needed for 3 buttons
  const buttonsSvg = buttonsContainer.append("svg")
    .attr("width", "100%")
    .attr("height", buttonBoxHeight)
    .attr('viewBox', `0 0 ${totalButtonWidth} ${buttonBoxHeight}`);

  // Placeholder for future graph data
  const baseData8 = graphData.fullyConnected({
    behaviors: ["cooperator", "cheater"],
    n: [5, 5]
  });

  const graphOptions8 = {
    linkBehavior: "strengthByFreewill",
    chooseBehavior: true,
    sizeRange: [15, 35],
    severable: true,
    payoffNormalForm: [[[1,1],[-1,2]],[[2,-1],[0,0]]],
    linkStrengthNormalization: 0.25,
    tabulations: ['id', 'behavior', 'value'],
    data: deepClone(baseData8),
    baseData: baseData8,
    center: true
  };

  // Graph container (visible by default)
  const graphContainer = container.append("div").attr("class", "page8-graph-container")
    .style("display", "block")
    .style("padding", "20px")
    .style("text-align", "center");

  const page8Graph = graphContainer.append("svg")
    .attr("width", "100%")
    .attr("height", "500px")
    .attr("overflow", "visible")
    .attr('viewBox', `0 0 ${config.chartWidth} ${config.chartHeight}`)
    .style("max-width", `${config.chartWidth}px`)
    .style("margin", "0 auto")
    .style("display", "block");

  // Tabs container (hidden by default)
  const tabsContainer = container.append("div").attr("class", "page8-tabs-container")
    .style("display", "none")
    .style("padding", "20px");

  gameTabs(".page8-tabs-container", graphOptions8);
  payoffTable("#page8 #payoff", graphOptions8);

  // Initialize the graph visualization
  const graphState8 = graph(page8Graph, graphOptions8, animalBehaviors, nodeColors, nodeColorLevel, strokeColorLevel, config.chartWidth, config.chartHeight, config.blinkTime);
  graphOptions8.graphState = graphState8;

  // Create three buttons
  const buttonData = [
    { id: 'run', icon: 'imgs/icons/gear.png', iconHover: 'imgs/icons/gear_filled.png', x: 0 },
    { id: 'reset', icon: 'imgs/icons/reset.png', iconHover: 'imgs/icons/reset_filled.png', x: bWidth + bSpace },
    { id: 'adjust', icon: 'imgs/icons/dice.png', iconHover: 'imgs/icons/dice_filled.png', x: 2 * (bWidth + bSpace) }
  ];

  let showingGraph = true;

  const buttons = buttonsSvg.selectAll('g.button')
    .data(buttonData)
    .enter()
    .append('g')
    .attr('class', 'button')
    .style('cursor', 'pointer')
    .on('click', function(event, d) {
      d3.select(this).style('opacity', 0.5)
        .transition().duration(blinkTime)
        .style('opacity', 1.0);

      if (d.id === 'run') {
        let nodeData = graphOptions8.graphState ? graphOptions8.graphState.nodeData : graphOptions8.data.nodes;
        let linkData = graphOptions8.graphState ? graphOptions8.graphState.linkData : graphOptions8.data.links;
        
        const result = mostDangerousGame(
          '#page8',
          page8Graph,
          graphOptions8,
          nodeData,
          linkData,
          (node) => getNeighbors(node, linkData),
          () => {}
        );
        
        if (graphOptions8.graphState) {
          graphOptions8.graphState.nodeData = result.nodeData;
          graphOptions8.graphState.linkData = result.linkData;
        }
        graphOptions8.data.nodes = result.nodeData;
        graphOptions8.data.links = result.linkData;
        
        animateAndUpdate(graphOptions8, page8Graph, '#page8');
      } else if (d.id === 'reset') {
        graphOptions8.data = deepClone(graphOptions8.baseData);
        for (let i = 0; i < graphOptions8.data.nodes.length; i++) {
          d3.select('#' + graphOptions8.data.nodes[i].id)
            .style('fill', 'black');
        }
        const graphResult = graph(
          page8Graph,
          graphOptions8,
          animalBehaviors,
          nodeColors,
          nodeColorLevel,
          strokeColorLevel,
          config.chartWidth,
          config.chartHeight,
          config.blinkTime
        );
        graphOptions8.graphState = graphResult;
      } else if (d.id === 'adjust') {
        showingGraph = !showingGraph;
        graphContainer.style('display', showingGraph ? 'block' : 'none');
        tabsContainer.style('display', showingGraph ? 'none' : 'block');
      }
    })
    .on('mouseover', function(event, d) {
      d3.select(this).select('image')
        .attr('xlink:href', d.iconHover);
    })
    .on('mouseout', function(event, d) {
      d3.select(this).select('image')
        .attr('xlink:href', d.icon);
    });

  buttons.append('image')
    .attr('x', d => d.x)
    .attr('y', 0)
    .attr('width', bWidth)
    .attr('height', bHeight)
    .attr('xlink:href', d => d.icon);
}

function setupPage9() {
  d3.select("#page9").append("div").attr("class", "leftDiv");
  normalFormTable("#page9 .leftDiv", {
    payoffNormalForm: [[[1,1],[-1,0]],[[0,-1],[-2,-2]]]
  });

  d3.select("#page9").append("div").attr("class", "rightDiv")
    .text("There exists this fundamental situation where pursuit of self-interest by each individual leads to outcomes that no one would desire if everyone could cooperate. " +
      "How can we ensure that everyone gets the best possible outcome in all situations? " +
      "First, we need to identify situations where following self-interest could be defeating. " +
      "Then, we need to either ensure cooperation or change the payoffs of betrayal and cooperation.");

  d3.select("#page9 .rightDiv").append("p")
    .text("There is nothing innately wrong with following self-interest! " +
      "Indeed in some situations following self-interest can be beneficial to society. " +
      "Consider the new payoff matrix shown to the left.");

  const coopList = d3.select("#page9 .rightDiv").append("ul");
  coopList.append("li").text("If Player 1 and Player 2 each betray the other, each receives the worst outcome.");
  coopList.append("li").text("If Player 1 betrays Player 2 but Player 2 cooperates, Player 1 will get nothing, but Player 2 will get a bad outcome (and vice versa).");
  coopList.append("li").text("If Player 1 and Player 2 both cooperate, both will have the best result.");

  d3.select("#page9 .rightDiv").append("div").style("display", "inline").style("whitespace", "nowrap")
    .text("In this situation betrayal of the other players is worth nothing and hurts the other player; thus purely rational self-interested players would always cooperate. " +
      "Pursuit of individual reward logically leads to group cooperation. " +
      "Indeed, in reality humans display a systemic bias towards cooperative behavior.");
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { d3, graph, getNeighbors, mostDangerousGame };
