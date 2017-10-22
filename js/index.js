//styles
backgroundColor = "#E9E9E9";
fontColor = "#131313";
offFontColor = "#ccc";
textColor = "#131313";
linkColor = "#131313";
offLinkColor = "#ccc";
addNodeMode = false;
chartWidth = 500;
chartHeight = 500;
linkWidth = 3;
blinkTime = 300; // animation fade time
var buttonBoxWidth = 250;
var buttonBoxHeight = 70;
var buttonDefaultAlpha = .3;
var buttonHoverAlpha = .6;
var buttonSelectedAlpha = 1.0;
var bWidth = 55;
var bHeight = 55;
var bSpace = 55;
var x0 = 0;
var y0 = 0;


// page 1
var windowWidth = window.innerWidth, 
  windowHeight = window.innerHeight 

var width = windowWidth,
  height = windowHeight

var aesopSvg =  d3.select("#page1")
  .append("svg")
  .attr("viewBox", "0 0 " + windowWidth + " " + windowHeight)
  //.style("border", "3px solid tan")
  .attr("class", "aesopSvg");

aesopSvg.append("image")
  .attr("xlink:href", "imgs/fables/crow.png")
  .attr("x", .1 * width)
  .attr("y", 0)
  .attr("width", .2*width)
  .attr("height", .2*height);

aesopSvg.append("image")
  .attr("xlink:href", "imgs/fables/fox.png")
  .attr("x", .65 * width) 
  .attr("y", .5 * height)
  .attr("width", .35*width)
  .attr("height", .35*height);

titleText(0);

function titleText (scroll) {;
  aesopSvg.selectAll("text").remove();

  aesopSvg.append("text")
    .attr("x", .1 * width)
    .attr("y", .25 * height)
    .text("Game")
    .style("letter-spacing", .4*scroll)
    .attr("textLength", (windowWidth/4+ 10*scroll)) /* firefox bug fix */
    .attr("class", "aesopTitle");  

  aesopSvg.append("text")
    .attr("x", .1 * width)
    .attr("y", .36 * height)
    .text("Theory")
    .style("letter-spacing", .4*scroll)
    .attr("textLength", (windowWidth/4 + 10*scroll)) /* firefox bug fix */
    .attr("class", "aesopTitle");  
}

//page 2
d3.select("#page2").append("p")
  .text("Game theory is the science of logical decision making in the face of uncertainty.  " +
    "A classic problem in game theory is the prisonner's dillema.  " +
    "Two individuals face off with a decision to cooperate or oppose.  " +
    "The payoff for a given individual's behavior depends upon the other individual's behavior.  " + 
    "How should one play?");

d3.select("#page2").append("p")
  .text("Consider the various strategies taken by the animal's of Aesop's Fables...");

// page 3 slide 1
var fabelSvg1 = d3.select("#aesopSlide1").append("svg").attr("viewBox", "0 0 " + width + " " + height/2)
  //.style("border", "3px solid tan")
  .style("margin-top", (-height/2));

fabelSvg1.append("image")
  .attr("xlink:href", "imgs/fables/mouse.png")
  .attr("x", .9 * width)
  .attr("y", 0.75 * height/2)
  .attr("height", .1*height)
  .attr("width", .1*width)
  .style("opacity", ".4")

fabelSvg1.append("image")
  .attr("xlink:href", "imgs/fables/lion.png")
  .attr("x", 0.0*width) 
  .attr("y", 0.0*height/2)
  .attr("height", .5*height)
  .attr("width", .5*width)
  .style("opacity", ".4")

// page 3 slide 3
var fabelSvg3 = d3.select("#aesopSlide3").append("svg").attr("viewBox", "0 0 " + width + " " + height/2)
  //.style("border", "3px solid tan")
  .style("margin-top", (-height/2));

fabelSvg3.append("image")
  .attr("xlink:href", "imgs/fables/goat.png")
  .attr("x", 0.3 * width)
  .attr("y", 0.0 * height/2)
  .attr("height", .5*height)
  .attr("width", .5*width)
  .style("opacity", ".4")

animalBehaviors = {"cooperator": "dog", "clever": "fox", "cheater": "snake", "copycat": "cat", "wise": "owl", 
"random": "chimpanzee", "aesopGoat": "goat", "aesopMouse": "mouse", "aesopLion": "lion", "aesopCat": "cat", "aesopMonkey": "chimpanzee"}

primaryColor = ['#06799F', '#216278', '#024E68', '#3AAACF', '#62B4CF'];
secondayColor = ['#FFB400', '#BF9530', '#A67500', '#FFC740', '#FFD673'];
tertiaryColor = ['#FF2800', '#BF4630', '#A61A00', '#FF5D40', '#FF8973'];
nodeColors = [primaryColor, secondayColor, tertiaryColor];
nodeColorLevel = 4;
strokeColorLevel = 0;

nodeStatus = 0;

// page4
page4Graph = d3.select("#page4").append("div").attr("class", "leftDiv")
  .append("svg")
  .attr("overflow", "visible")
  //.style("border", "3px solid tan")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

d3.select("#page4").append("div").attr("class", "rightDiv")

d3.select("#page4 .rightDiv")
.text("From the perspective of gamey theory, Aesop's fables demonstrate that an individual's behavior determines their benefit.  " + 
  "The lion took a chance on the mouse and they both were better off.  " +
  "The monkey tricked the cat and won while the cat lost.  " +
  "The two goats were fools together and bost lost.  " +
  "Let us make these results more quantitative.  The payoff for a given individual's behavior depends upon the other individual's behavior:")

gameButtons("#page4 .rightDiv");

d3.selectAll("#page4 .rightDiv").append("ul")
  .append("li").text("If an individual cooperates and the other individual cheats, the first individual loses (-1) and other wins big (3).");
d3.selectAll("#page4 .rightDiv").append("ul")
  .append("li").text("If an individual cooperates and the other individual cooperates too, then both win (2).");
d3.selectAll("#page4 .rightDiv").append("ul")
  .append("li").text("If an individual cheats and the other individual cheats too, then they all lose (0).");

// page5
page5Graph = d3.select("#page5").append("div").attr("class", "leftDiv")
  .append("svg")
  .attr("overflow", "visible")
  //.style("border", "3px solid tan")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

d3.select("#page5").append("div").attr("class", "rightDiv")
  .text("See how those stubborn goats lose")

gameButtons("#page5 .rightDiv");

// page6
page6Graph = d3.select("#page6").append("div").attr("class", "leftDiv")
  .append("svg")
  .attr("overflow", "visible")
  //.style("border", "3px solid tan")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

d3.select("#page6").append("div").attr("class", "rightDiv")
  .text("See how the monkey tricks the cat.")

gameButtons("#page6 .rightDiv");


activeSlide = "" 

function isActive(page) {
  if (d3.select(page).classed("active")) {
    activeSlide = page;
    return true;
  }
  return false;
}

function isNewlyActive(page) {
  if (d3.select(page).classed("active") && (activeSlide != page)) {
    console.log(page + " was triggered")
    activeSlide = page;
    return true;
  }
  return false;
}

$(window).scroll(function (event) {
  
//  if (isActive("#page1")) {
    var scroll = $(window).scrollTop();
    titleText(scroll * .1)
  //}

  if (isNewlyActive("#page4")) {
    graph(page4Graph, lionAndMouse);
  }

  if (isNewlyActive("#page5")) {
    graph(page5Graph, goatAndGoat);
  }
  
  if (isNewlyActive("#page6")) {
    graph(page6Graph, monkeyAndCat);
  }

});
