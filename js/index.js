//styles
var backgroundColor = "#E9E9E9";
var fontColor = "#131313";
var offFontColor = "#ccc";
var textColor = "#131313";
var linkColor = "#131313";
var offLinkColor = "#ccc";
//var addNodeMode = false;
var chartWidth = 500;
var chartHeight = 500;
var linkWidth = 3;
var blinkTime = 300;
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
//var linkStrengthNormalization = 0.5; 


animalBehaviors = {"cooperator": "dog", "clever": "fox", "cheater": "snake", "copycat": "cat", "wise": "owl", 
"random": "chimpanzee", "aesopGoat": "goat", 
"aesopMouse": "mouse", "aesopLion": "lion", "aesopCat": "cat", "aesopMonkey": "chimpanzee", "crane": "crane", "wolf":"wolf"}


primaryColor = ['#06799F', '#216278', '#024E68', '#3AAACF', '#62B4CF'];
secondayColor = ['#FFB400', '#BF9530', '#A67500', '#FFC740', '#FFD673'];
tertiaryColor = ['#FF2800', '#BF4630', '#A61A00', '#FF5D40', '#FF8973'];
nodeColors = [primaryColor, secondayColor, tertiaryColor];
nodeColorLevel = 4;
strokeColorLevel = 0;

//nodeStatus = 0;
var windowWidth = window.innerWidth, 
  windowHeight = window.innerHeight 

var width = windowWidth,
  height = windowHeight


/* title/page0
Title with text that exapands on scroll down 
*/
var aesopSvg =  d3.select("#page0")
  .append("svg")
  .attr("viewBox", "0 0 " + windowWidth + " " + windowHeight)
  .attr("class", "aesopSvg");

aesopSvg.append("image")
  .attr("xlink:href", "imgs/fables/crow.png")
  .attr("x", .1 * width)
  .attr("y", 0)
  .attr("width", .2 * width)
  .attr("height", .2 * height);

aesopSvg.append("image")
  .attr("xlink:href", "imgs/fables/fox.png")
  .attr("x", .65 * width) 
  .attr("y", .5 * height)
  .attr("width", .35 * width)
  .attr("height", .35 * height);

titleText(0);

function titleText (scroll) {
  aesopSvg.selectAll("text").remove();

  aesopSvg.append("text")
    .attr("x", .1 * width)
    .attr("y", .25 * height)
    .text("Game")
    .attr("textLength", (5 + windowWidth / 4 + 10 * scroll))
    .attr("class", "aesopTitle");  

  aesopSvg.append("text")
    .attr("x", .1 * width)
    .attr("y", .36 * height)
    .text("Theory")
    .attr("textLength", (25 + windowWidth / 4 + 10 * scroll))
    .attr("class", "aesopTitle");  
}

/* chapter1/page1
Introduction
*/
d3.select("#page1").append("p")
  .text("Game theory is the science of logical decision making in the face of uncertainty.  " +
    // "A classic problem in game theory is the prisonner's dillema.  " +
    "Let's consider two individuals facing off with a decision to cooperate or oppose each other.  " +
    // "Two individuals face off with a decision to cooperate or oppose.  " +
    "The payoff for a given individual's behavior depends upon the other individual's behavior.  " + 
    "How should one play?");

d3.select("#page1").append("p")
  .text("Consider the various strategies taken by the animal's of Aesop's Fables...");

d3.select("#page1").append("img")
  .style("margin", "0 auto")
  .style("display", "block")
  .attr("src", "imgs/dice.png")
  .attr("width", "225")
  .attr("height", "160")

/* chapter2/page2
Tell Aesop's fables in 3 slides
Better to use background image or svg?
*/
d3.select("#aesopSlide1")
  .style("background-image", "url('imgs/fables/lionmouse_.png')")
  .style("background-repeat", "no-repeat")

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
d3.select("#aesopSlide3 #goatSVG")
  //.attr("position", absolute)
  .attr("width", windowWidth)
  .attr("height", .5 * windowHeight)
  .attr("viewBox", "0 0 " + windowWidth + " " + .5 * windowHeight)
  // .style("border", "3px solid tan")
  .append("image")
  .attr("xlink:href", "imgs/fables/goat.png")
  .attr("x", 0.3 * width)
  .attr("y", 0.0 * height)
  .attr("height", .4*height)
  .attr("width", .4*width)
  .style("opacity", ".4")

/* chapter3/page3
Examine how Aesop's characters behave visually
*/

page4Graph1 = d3.select("#aesopGameSlide1").append("div").attr("class", "leftDiv")
  .append("svg")
  .attr("overflow", "visible")
  //.style("border", "3px solid tan")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

d3.select("#aesopGameSlide1").append("div").attr("class", "rightDiv")

d3.select("#aesopGameSlide1 .rightDiv")
.text("Aesop's fables demonstrate that an individual's behavior and their counterpart's behavior determines the outcome.  " + 
  "The lion took a chance cooperating with the mouse and in return the kind mouse cooperated with the lion so they both were better off.  " +
  "But the monkey cheated with the cat while the cat was cooperating, and so the monkey won while the cat lost.  " +
  "The two stubborn goats were fools together and both lost.  " +
  "Lets visualize these results. We can run a little simulation by clicking the rotating gear icon.")

var graphOptions4Slide0 = {
  linkBehavior: "strengthBySource",
  chooseBehavior: false,
  sizeRange: "absolute",
  severable: false,
  payoffNormalForm: [[[3,3],[-1,3]],[[3,-1],[-2,-2]]],
  linkStrengthNormalization: 0.1,
  tabulations: [],
  data: $.extend(true, {}, lionAndMouse),
  baseData: lionAndMouse,
  center: false
  };
gameButtons("#aesopGameSlide1 .rightDiv", page4Graph1, graphOptions4Slide0);

page4Graph2 = d3.select("#aesopGameSlide2").append("div").attr("class", "leftDiv")
.append("svg")
  .attr("overflow", "visible")
  //.style("border", "3px solid tan")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

d3.select("#aesopGameSlide2").append("div").attr("class", "rightDiv")
  .text("See how those stubborn goats lose.  " + 
    "Notice that the link between those who harm each other weakens. Notice that losers belittle themselves.")

var graphOptions4Slide1 = {
  linkBehavior: "strengthBySource",
  chooseBehavior: false,
  sizeRange: "absolute",
  severable: false,
  payoffNormalForm: [[[3,3],[-1,3]],[[3,-1],[-2,-2]]],
    linkStrengthNormalization: 0.1,
  tabulations: [],
  data: $.extend(true, {}, goatAndGoat),
  baseData: goatAndGoat,
  center: false
  };
gameButtons("#aesopGameSlide2 .rightDiv", page4Graph2, graphOptions4Slide1);

page4Graph3 = d3.select("#aesopGameSlide3").append("div").attr("class", "leftDiv")
  .append("svg")
  .attr("overflow", "visible")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

d3.select("#aesopGameSlide3").append("div").attr("class", "rightDiv")
  .text("See how the monkey tricks the cat.  " +
        "Notice that winners embiggen themseleves and losers belittle themselves.");

var graphOptions4Slide2 = {
  linkBehavior: "strengthBySource",
  chooseBehavior: false,
  sizeRange: "absolute",
  severable: false,
  payoffNormalForm: [[[3,3],[-1,3]],[[3,-1],[-2,-2]]],
    linkStrengthNormalization: 0.1,
  tabulations: [],
  data: $.extend(true, {}, monkeyAndCat),
  baseData: monkeyAndCat,
  center: false
  };

gameButtons("#aesopGameSlide3 .rightDiv", page4Graph3, graphOptions4Slide2);



/* chapter4/page4
*/

d3.select("#page4").append("div").attr("class", "leftDiv").text(" A Wolf had been feasting too greedily, and a bone had stuck crosswise in his throat. He could get it neither up nor down, and of course he could not eat a thing. Naturally that was an awful state of affairs for a greedy Wolf." +
" So away he hurried to the Crane. He was sure that she, with her long neck and bill, would easily be able to reach the bone and pull it out." +
"'I will reward you very handsomely,' said the Wolf, 'if you pull that bone out for me.'"+
  "");

var graphOptions4 = {
  linkBehavior: "strengthBySource",
  chooseBehavior: false,
  sizeRange: "absolute",
  severable: false,
  payoffNormalForm: [[[3,3],[-1,3]],[[3,-1],[-2,-2]]],
  linkStrengthNormalization: 0.1,
  tabulations: [],
  data: $.extend(true, {}, craneAndWolf),
  baseData: craneAndWolf,
  center: false
  };

page4Graph = d3.select("#page4").append("div").attr("class", "rightDiv")
  .append("svg")
  .attr("overflow", "visible")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

craneAndWolfButtons("#page4 .leftDiv", page4Graph, graphOptions4);

d3.select("#page4 .leftDiv").append("div")
.text("The Crane, as you can imagine, was very uneasy about putting her head in a Wolf's throat. But she was grasping in nature, so she did what the Wolf asked her to do." +
"When the Wolf felt that the bone was gone, he started to walk away." +
"'But what about my reward!'' called the Crane anxiously." +
"'What!'' snarled the Wolf, whirling around. 'Haven't you got it? Isn't it enough that I let you take your head out of my mouth without snapping it off?'" +
"")
.style("display", "none")



/* chapter5/page5

*/

d3.select("#page5").append("div").attr("class", "leftDiv").style("display", "inline")

d3.select("#page5 .leftDiv").text("" +
  " In many situations working together is a great solution, but under certain circumstances this assumption is strained." +
  " What happens when the individual payoff for betrayl is greater than the individual payoff for cooperation and further you can't trust the other players or you simply can't coordinate with them?" +
  " This is a classic problem in game theory similar to the ")
d3.select("#page5 .leftDiv").append("div").style("display", "inline").style("whitespace", "nowrap")
  .html("<a href='https://en.wikipedia.org/wiki/Prisoner%27s_dilemma'>prisonner's dillema</a>")
d3.select("#page5 .leftDiv").append("div").style("display", "inline").style("whitespace", "nowrap")
  .text(": two individuals face off with a decision to cooperate or betray one another, but they are unable to coordinate their behaviors. They payoffs for various behaviors are shown in the table at left or described as follows: ")

prisonerList = d3.select("#page5 .leftDiv").append("ul")
prisonerList.append("li").text("If Player 1 and Player 2 each betray the other, each receives a bad outcome.")
prisonerList.append("li").text("If Player 1 betrays Player 2 but Player 2 cooperates, Player 1 will be get the best outcome, but Player 2 will get the worst outcome (and vice versa).")
prisonerList.append("li").text("If Player 1 and Player 2 both cooperate, both will have a mediocre result.")

d3.select("#page5 .leftDiv").append("div").style("display", "inline").style("whitespace", "nowrap")
  .text("In the classic prisoner's dilemma scenario betrayal offers a greater reward than cooperating; thus purely rational self-interested players would betray the other and in so doing the outcome for two purely rational players is the worst case!" +
    " Pursuit of individual reward logically leads to betrayal, however a better outcome would occur if they cooperated." +
    "")
d3.select("#page5").append("div").attr("class", "rightDiv")

normalFormTable("#page5 .rightDiv", {payoffNormalForm: [[[1,1],[-1,2]],[[2,-1],[0,0]]]})

/* chapter6/page6
Enable node behavior changing.
*/
d3.select("#page6").append("div").attr("class", "leftDiv")
  .text("Let's examine the prisonners dillema with some simulations of different kind of players. " +
    " Each animal will represent some archetype with some kind of behavior." +
    " Some individual's will change their behavior in repeated encounters." +
    " Self-interested behavior encrouages betrayl, but if your opponent knows your strategy of betrayl it wont work so well." +
    " Lets see what winning strategies evolve when attempting to maximize outcome in repeated encounters of prisoner's dillemna." +
  //   "Repeatedly running trials of the prissoner's dillema shows us that some strategies are better than others...")
    "");

characterList = d3.selectAll("#page6 .leftDiv").append("ul")
characterList.append("li").text("The simple dog always cooperates.");
characterList.append("li").text("The copycat starts by cooperating, and each round thereafter does what opponent " +
  "did in the previous round.");
characterList.append("li").text("The cheater snake always cheats.")
characterList.append("li").text("The crazy fox starts with betrayl, and each round thereafter does the opposite of what the opponent " +
  "did in the previous round.")
characterList.append("li").text("The owl learns about each opponent and plays wisely.")
characterList.append("li").text("The monkey plays randomly.")

d3.select("#page6 .leftDiv").append("div")
  .text(" We can run one round of a prisnnoer's dillemma between each player and their connections by clicking the rotating gear icon. " +
    " Each player faces off and gains or loses acoording the prinsonner's dillemma payoff matrix." + 
    " Who do you think will win? Who will win after many rounds?" +
    "");

page6Graph = d3.select("#page6").append("div").attr("class", "rightDiv")
  .append("svg")
  .attr("overflow", "visible")
  .attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

baseData6 = fullyConnected({"behaviors": ["cooperator", "copycat", "cheater", "clever", "random", "wise"], 
  "n":[1, 1, 1, 1, 1, 1] });

var graphOptions6 = {
  linkBehavior: "strengthByFreewill",
  chooseBehavior: true,
  sizeRange: [20,45],
  severable: false,
  payoffNormalForm: [[[1,1],[-1,2]],[[2,-1],[0,0]]],
  linkStrengthNormalization: 0.1,
  tabulations: ['id', 'behavior', 'value'],
  data: $.extend(true, {}, baseData6),
  baseData: baseData6,
  center: true
  };

gameButtons("#page6 .leftDiv", page6Graph, graphOptions6);

gameTabs("#page6 .leftDiv", graphOptions6);

payoffTable("#page6 #payoff", graphOptions6)


/* chapter7/page7
*/

baseData7 = fullyConnected({"behaviors": ["cooperator", "copycat", "cheater", "clever", "random", "wise"], 
  "n":[1, 1, 1, 1, 1, 1] });


var graphOptions7 = {
  linkBehavior: "strengthByFreewill",
  chooseBehavior: true,
  sizeRange: [15,35],
  severable: true,
  payoffNormalForm: [[[1,1],[-1,2]],[[2,-1],[0,0]]],
  linkStrengthNormalization: 0.25,
  tabulations: ['id', 'behavior', 'value'],
  data: $.extend(true, {}, baseData7),
  baseData: baseData7,
  center: true
  };

d3.select("#page7").append("div").attr("class", "rightDiv")
  .text(" So it looks like strategies of betrayal are very effective." +
    " In almost every society in the world today if you don't like a situation you can just walk away from it. " +
    " In the previous simulations we saw how some nodes became closer and some got more distant. " +
    " Generally, social as well as economic transactions are carried out only upon the will of both parties: either party can unilaterally sever relations." +
    " At first the cheater does well, but after many rounds they are no longer part of the network." +
    "");

d3.select("#page7 .right").append("div")
  .text(" well " + 
    "");

gameTabs("#page7 .rightDiv", graphOptions7);

payoffTable("#page7 #payoff", graphOptions7)

/* PAGE 8
*/

d3.select("#page8").append("div").attr("class", "leftDiv")
   .text(" But how easily can links be broken and can links be unbroken?" + 
    " Imagine a community that lives beyond a river with a bridge that is very old." +
    " In order to repalce the bridge the community gets together and decides to money by asking everyone to pay." +
    " The community tries to coordinate the payments, but it is possible to cheat." +
    " -There are 100 people in the community. If you lie and don't put in your cost is 0, but your benefit is ");


/* page9/chapter9
*/

d3.select("#page9").append("div").attr("class", "leftDiv")
//rivalTable("#page9 .leftDiv")
normalFormTable("#page9 .leftDiv", {payoffNormalForm: [[[1,1],[-1,0]],[[0,-1],[-2,-2]]]})

d3.select("#page9").append("div").attr("class", "rightDiv")
  .text("There exists this fundamental situation where pursuit of self-interest by each individual leads to outcomes that no one would desire if everyone could cooperate." +
    " How can we ensure that everyone gets the best possible outcome in all situations?" +
    " First, we need to identify situations where following self-interest could defeating." +
    " Then, we need to either ensure cooperation or change the payoff's of betral and cooperation." +
   "")

d3.select("#page9 .rightDiv").append("p")
  .text(" There is nothing inately wrong with following self-interest!" +
    " Indeed in some situations following self-interest can be benefical to society." +
    " Consider the new payoff matrix shown to the left." +
    "");
  coopList = d3.select("#page9 .rightDiv").append("ul")
  coopList.append("li").text("If Player 1 and Player 2 each betray the other, each receives the worst outcome.")
  coopList.append("li").text("If Player 1 betrays Player 2 but Player 2 cooperates, Player 1 will be get nothing, but Player 2 will get a bad outcome (and vice versa).")
  coopList.append("li").text("If Player 1 and Player 2 both cooperate, both will have the best result.");

d3.select("#page9 .rightDiv").append("div").style("display", "inline").style("whitespace", "nowrap")
  .text("In this situation betrayl of the other players is worth nothing and hurts the other player; thus purely rational self-interested players would always cooperate." +
    " Pursuit of individual reward logically leads to group cooperation" +
    " Indeed, in reality humans display a systemic bias towards cooperative behavior." +
    "")