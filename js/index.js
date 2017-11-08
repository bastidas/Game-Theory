//styles
var backgroundColor = "#E9E9E9";
var fontColor = "#131313";
var offFontColor = "#ccc";
var textColor = "#131313";
var linkColor = "#131313";
var offLinkColor = "#ccc";
var addNodeMode = false;
var chartWidth = 500;
var chartHeight = 500;
var linkWidth = 3;
var blinkTime = 300; // animation fade time
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
var sizeRange;// = [60, 80];
var payoffNormalForm;
var linkStrengthNormalization = 0.01; 
var payoffNormalForm;
var cullTheWeak;

animalBehaviors = {"cooperator": "dog", "clever": "fox", "cheater": "snake", "copycat": "cat", "wise": "owl", 
"random": "chimpanzee", "aesopGoat": "goat", 
"aesopMouse": "mouse", "aesopLion": "lion", "aesopCat": "cat", "aesopMonkey": "chimpanzee"}

primaryColor = ['#06799F', '#216278', '#024E68', '#3AAACF', '#62B4CF'];
secondayColor = ['#FFB400', '#BF9530', '#A67500', '#FFC740', '#FFD673'];
tertiaryColor = ['#FF2800', '#BF4630', '#A61A00', '#FF5D40', '#FF8973'];
nodeColors = [primaryColor, secondayColor, tertiaryColor];
nodeColorLevel = 4;
strokeColorLevel = 0;

nodeStatus = 0;


// page 1
var windowWidth = window.innerWidth, 
  windowHeight = window.innerHeight 

var width = windowWidth,
  height = windowHeight

var aesopSvg =  d3.select("#page1")
  .append("svg")
  .attr("viewBox", "0 0 " + windowWidth + " " + windowHeight)
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
    //.style("letter-spacing", 1 + .4*scroll)
    .attr("textLength", (5 + windowWidth/4+ 10*scroll)) /* firefox bug fix */
    .attr("class", "aesopTitle");  

  aesopSvg.append("text")
    .attr("x", .1 * width)
    .attr("y", .36 * height)
    .text("Theory")
    //.style("letter-spacing", 10 + .4*scroll)
    .attr("textLength", (25 + windowWidth/4 + 10*scroll)) /* firefox bug fix */
    .attr("class", "aesopTitle");  
}

//page 2
d3.select("#page2").append("p")
  .text("Game theory is the science of logical decision making in the face of uncertainty.  " +
    // "A classic problem in game theory is the prisonner's dillema.  " +
    "Let's consider two individuals facing off with a decision to cooperate or oppose each other.  " +
    // "Two individuals face off with a decision to cooperate or oppose.  " +
    "The payoff for a given individual's behavior depends upon the other individual's behavior.  " + 
    "How should one play?");

d3.select("#page2").append("p")
  .text("Consider the various strategies taken by the animal's of Aesop's Fables...");

d3.select("#page2").append("img")
  .style("margin", "0 auto")
  .style("display", "block")
  .attr("src", "imgs/dice.png")
  .attr("width", "225")
  .attr("height", "160")

// page 3 slide 1
//var fabelSvg1 = d3.select("#aesopSlide1").append("svg").attr("viewBox", "0 0 " + width + " " + height/2)
  //.style("border", "3px solid tan")
  //.style("margin-top", (-height/2));

// d3.select("#page3").append("img")
//   //.style("margin", "0 0 0 0")
//   .style("display", "inline")
//   .attr("src", "imgs/fables/lion.png")
//   .attr("height", .5*height)
//   .attr("width", .5*width)
//   .style("opacity", ".4")

// d3.select("#page3").append("img")
//   //.style("margin", "0 0 0 0")
//   .style("display", "block")
//   .attr("src", "imgs/fables/mouse.png")
//   .attr("height", .1*height)
//   .attr("width", .1*width)
//   .style("opacity", ".4")


//d3.select("#page3")
d3.select("#aesopSlide1")
  .style("background-image", "url('imgs/fables/lionmouse_.png')") //, url('imgs/fables/mouse.png')")
  .style("background-repeat", "no-repeat")
  //  .style("background-opacity", ".5")
    //(.append("img")
  //.style("margin", "0 0 0 0")
  // .style("display", "block")
  // .attr("src", "imgs/fables/mouse.png")
  // .attr("height", .1*height)
  // .attr("width", .1*width)
  // .style("opacity", ".4")



// fabelSvg1.append("image")
//   .attr("xlink:href", "imgs/fables/mouse.png")
//   .attr("x", .9 * width)
//   .attr("y", 0.75 * height/2)
//   .attr("height", .1*height)
//   .attr("width", .1*width)
//   .style("opacity", ".4")

// fabelSvg1.append("image")
//   .attr("xlink:href", "imgs/fables/lion.png")
//   .attr("x", 0.0*width) 
//   .attr("y", 0.0*height/2)
//   .attr("height", .5*height)
//   .attr("width", .5*width)
//   .style("opacity", ".4")

// page 3 slide 3
var fabelSvg3 = d3.select("#aesopSlide3").append("svg").attr("viewBox", "0 0 " + width + " " + height/2)
  //.style("border", "3px solid tan")
  //.style("margin-top", (-height/2));

fabelSvg3.append("image")
  .attr("xlink:href", "imgs/fables/goat.png")
  .attr("x", 0.3 * width)
  .attr("y", 0.0 * height/2)
  .attr("height", .5*height)
  .attr("width", .5*width)
  .style("opacity", ".4")

// page4
page4Graph1 = d3.select("#aesopGameSlide1").append("div").attr("class", "leftDiv")
  .append("svg")
  .attr("overflow", "visible")
  //.style("border", "3px solid tan")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

d3.select("#aesopGameSlide1").append("div").attr("class", "rightDiv")

d3.select("#aesopGameSlide1 .rightDiv")
.text("From the perspective of game theory, Aesop's fables demonstrate that an individual's behavior and their counterpart's behavior determines the outcome.  " + 
  "The lion took a chance cooperating with the mouse and in return the kind mouse cooperated with the lion so they both were better off.  " +
  "But the monkey cheated with the cat while the cat was cooperating, and so the monkey won while the cat lost.  " +
  "The two stubborn goats were fools together and both lost.  " +
  "Lets visualize these results. We can run a little simulation by clicking the rotating gear icon.")

// "Let make these results more quantitative.  The payoff for a given individual's behavior depends upon the other individual's behavior:")

//aesopButtons("#aesopGameSlide1 .rightDiv");

gameButtons("#aesopGameSlide1 .rightDiv");

page4Graph2 = d3.select("#aesopGameSlide2").append("div").attr("class", "leftDiv")
.append("svg")
  .attr("overflow", "visible")
  //.style("border", "3px solid tan")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

d3.select("#aesopGameSlide2").append("div").attr("class", "rightDiv")
  .text("See how those stubborn goats lose.  " + 
    "Notice that the link between those who mutually benefit grows stronger and the link between those who harm each other weakens.")


gameButtons("#aesopGameSlide2 .rightDiv");

page4Graph3 = d3.select("#aesopGameSlide3").append("div").attr("class", "leftDiv")
  .append("svg")
  .attr("overflow", "visible")
  //.style("border", "3px solid tan")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

d3.select("#aesopGameSlide3").append("div").attr("class", "rightDiv")
  .text("See how the monkey tricks the cat.  " +
        "Notice that winners embiggen themseleves and losers belittle themselves.");

gameButtons("#aesopGameSlide3 .rightDiv");
/////////////

// page5
d3.select("#page5").append("div").attr("class", "leftDiv")
  .text( "Lets define a few characters and their behavior:  ")

d3.selectAll("#page5 .leftDiv").append("ul")
  .append("li").text("The copycat starts by cooperating, and each round thereafter does what opponent did in the previous round.");
d3.selectAll("#page5 .leftDiv").append("ul")
  .append("li").text("The cheater always cheats.");
d3.selectAll("#page5 .leftDiv").append("ul")
  .append("li").text("The cooperator always cooperates.");


gameButtons("#page5 .leftDiv");

page5Graph = d3.select("#page5").append("div").attr("class", "rightDiv")
  .append("svg")
  .attr("overflow", "visible")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

// page6
d3.select("#page6").append("div").attr("class", "leftDiv")
//  .text( "Lets expand our range of characters. Click on a node to change its behavior:  ")
.text("What happens if we could change the behavior of our characters?  " +
    "Click on an animal's face to change its behavior.  " +
    //"Aesop's fables are about many things, perhaps it is simply attitude that matters most.  " +
    "Each animal will represent some archetype.  " + 
    "Some individual's will change their behavior in repeated encounters.  " +
    "Research shows new kinds of strategies evolve when attempting to maximize outcome in repeated encounters of prisoner's dillemna.  " +
    "Repeatedly running trials of the prissoner's dillema shows us that some strategies are better than others...")


d3.select("#page6 .leftDiv").append("div").attr("class", "behaviorInfo")
gameButtons("#page6 .leftDiv");

page6Graph = d3.select("#page6").append("div").attr("class", "rightDiv")
  .append("svg")
  .attr("overflow", "visible")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

// page7
baseData7 = fullyConnected({"behaviors": ["cooperator", "cheater"], "n":[6,6] });
page7Graph = d3.select("#page7").append("div").attr("class", "leftDiv")
  .append("svg")
  .attr("overflow", "visible")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

d3.select("#page7").append("div").attr("class", "rightDiv")
gameButtons("#page7 .rightDiv");

// page8
d3.select("#page8").append("div").attr("class", "leftDiv")
  .text("Let make these results more quantitative.  The payoff for a given individual's behavior depends upon the other individual's behavior:  ")
d3.selectAll("#page8 .leftDiv").append("ul")
  .append("li").text("If an individual cooperates and the other individual cheats, the first individual loses (-1) and other wins big (3).");
d3.selectAll("#page8 .leftDiv").append("ul")
  .append("li").text("If an individual cooperates and the other individual cooperates too, then both win (2).");
d3.selectAll("#page8 .leftDiv").append("ul")
  .append("li").text("If an individual cheats and the other individual cheats too, then they all lose (0).");
//page8Graph = d3.select("#page8").append("div").attr("class", "leftDiv")
  //.append("svg")
  //.attr("overflow", "visible")
  //.attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);
//gameButtons("#page8 .rightDiv");

//page9
page9Table = d3.select("#page9").append("table").style("width", "100%")
.append("tr").style("border", "1px solid black")
page9Table.append("td").style("border", "1px solid black").style("width","33%").attr("class", "t1").text("alpha")
page9Table.append("td").style("border", "1px solid black").style("width","33%").attr("class", "t2").text("beta")
page9Table.append("td").style("border", "1px solid black").style("width","33%").attr("class", "t1").text("gamma")

page9Graph1 = d3.select("#page9 .t1")
  .style("border", "1px dashed tan")
  .append("svg")
  .attr("overflow", "visible")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);


page9Graph2 = d3.select("#page9 .t2")
  .style("border", "1px dashed tan")
  .append("svg")
  .attr("overflow", "visible")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

