
// function aesopButtons(rootElement) {
//   var gameButtons = ['gogear', 'reset'];
//   var gameButtonsText = ['run', 'reset'];

//   var gameButtonsSvg = d3.select(rootElement)
//     .append("svg")
//     .attr("width", "100%")
//     .attr("height", buttonBoxHeight)
//     .attr('viewBox', '0, 0, ' + buttonBoxWidth + ', ' + buttonBoxHeight)
//     .attr("overflow", "visible");

//   var gameButtons = gameButtonsSvg.append("g")
//     .selectAll("g.gameButtons")
//     .data(gameButtons)
//     .enter()
//     .append("g")
//     .attr("class", "gameButtons")
//     .attr("opacity", buttonDefaultAlpha)
//     .style("cursor", "pointer")
//     .on("click", function(d, i) {

//       d3.select(this)
//         .style("opacity", buttonSelectedAlpha)
//         .transition().duration(blinkTime).style("opacity", buttonDefaultAlpha)

//       if (i === 0) {
//         //sizeScale = getNodeSizeScale([50,120]); 

//           for (var i=0; i < nodeData.length; i++) {
//             d3.select("#" + nodeData[i].id)
//               .style("fill", "white")
//               .style("r", getNodeSize(nodeData[i].id))

//           d3.select("#i" + nodeData[i].id)
//             .attr("x", -getNodeSize(nodeData[i].id))
//             .attr("y", -getNodeSize(nodeData[i].id))
//             .attr("width", 2.0*getNodeSize(nodeData[i].id))
//             .attr("height", 2.0*getNodeSize(nodeData[i].id))
//           }
//         }

//         mostDangerousGame(rootElement);
//       //}//
      
//     //   if (i === 1) {  //do reset animation and data update
//     //     for (var i=0; i < nodeData.length; i++) {
//     //       d3.select("body .wrapper #" + nodeData[i].id)
//     //         .style("fill", "black")
//     //       nodeData[i].value = 0;
//     //       //nodeData = baseData0;
//     //     }

//     //   }

//     // updateGraph();

//     // d3.select(rootElement)
//     //     .selectAll("table")
//     //     .remove();

//     //   tabulate(rootElement, nodeData, ['id', 'behavior', 'value']);
//     })
//     .on("mouseover", function(d,i) {
//       d3.select(this).style("opacity", buttonHoverAlpha)})
//     .on("mouseout", function(){
//       d3.select(this).style("opacity", buttonDefaultAlpha)})

//   gameButtons.append("svg:image")
//     .attr("x", function(d,i) {return x0 + (bWidth + bSpace)*i;})
//     .attr("y", y0)
//     .attr('width', bWidth)
//     .attr('height', bHeight)
//     .attr("xlink:href", function(i) {return "imgs/" + i + ".png";});
// }

function animateAndUpdate() {
  var interval = 0;
  var intervalDelay;

  if (linkData.length > 10 ) {
    intervalDelay = 1500 / linkData.length;
  }
  else {
    intervalDelay = 150;
  }

  var intervalLoop = setInterval(blinky, intervalDelay);
 
  function blinky() {

    if (interval != 0 ) {
      d3.select("#" + nodeData[interval-1].id)
        .transition().duration(intervalDelay)
        .style("fill", getNodeColor (nodeData[interval-1], nodeColorLevel))
    }

    if (interval >= nodeData.length) {
      clearInterval(intervalLoop);
      updateGraph();
    }
    else {
    d3.select("#" + nodeData[interval].id)
      .style("fill", "white")
    }
  interval += 1
  }
}



function gameButtons(rootElement) {
  var gameButtons = ['gogear', 'reset'];
  var gameButtonsText = ['run', 'reset'];

  var gameButtonsSvg = d3.select(rootElement)
    .append("svg")
    .attr("width", "100%")
    .attr("height", buttonBoxHeight)
    .attr('viewBox', '0, 0, ' + buttonBoxWidth + ', ' + buttonBoxHeight)
    .attr("overflow", "visible");

  var gameButtons = gameButtonsSvg.append("g")
    .selectAll("g.gameButtons")
    .data(gameButtons)
    .enter()
    .append("g")
    .attr("class", "gameButtons")
    .attr("opacity", buttonDefaultAlpha)
    .style("cursor", "pointer")
    .on("click", function(d, i) {

      d3.select(this)
        .style("opacity", buttonSelectedAlpha)
        .transition().duration(blinkTime).style("opacity", buttonDefaultAlpha)

      if (i === 0) {
        var nTrials = 1;
        var q = 0
        while (q < nTrials) {
          mostDangerousGame(rootElement);
          q += 1;
        }
        animateAndUpdate();
      }
      
      if (i === 1) {  //do reset animation and data update
        for (var i=0; i < nodeData.length; i++) {
          d3.select("#" + nodeData[i].id)
            .style("fill", "black")
          nodeData[i].value = 0;
          // todo make copy of basedata for reset reference
          //nodeData = baseData0;
          updateGraph();
        }

      }

    d3.select(rootElement)
        .selectAll("table")
        .remove();

      tabulate(rootElement, nodeData, ['id', 'behavior', 'value']);
    })
    .on("mouseover", function(d,i) {
      d3.select(this).style("opacity", buttonHoverAlpha)})
    .on("mouseout", function(){
      d3.select(this).style("opacity", buttonDefaultAlpha)})

  gameButtons.append("svg:image")
    .attr("x", function(d,i) {return x0 + (bWidth + bSpace)*i;})
    .attr("y", y0)
    .attr('width', bWidth)
    .attr('height', bHeight)
    .attr("xlink:href", function(i) {return "imgs/" + i + ".png";});
}


function nodeBehaviorButtons(node) {

  //to-do make the nodebox scale with chartSvg rootElement better

  bWidth = 35;
  bHeight = 35;
  var toolTipHeight = 105;
  var toolTipWidth = 250;
  var hoverBoxExtra = 80;
  var toolTipButtons = ["dog", "snake", "cat", "fox", "owl", "chimpanzee"];
  var toolTipText = ["cooperator", "cheater", "copycat", "clever", "wise", "random"];

  d3.select(".tooltip").remove();

  var nodeBox = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("width",  (hoverBoxExtra + toolTipWidth) + "px")
  .style("height", (hoverBoxExtra + toolTipHeight) + "px")
  .style("left", (d3.event.pageX - hoverBoxExtra/2) + "px")
  .style("top", (d3.event.pageY + 10 - hoverBoxExtra/2) + "px")

$(".tooltip").mouseleave(function(){
d3.select(".tooltip").remove();
});

  var nodeBoxSvg = nodeBox
    .append("svg")
    .style("display", "block")
    .style("margin", "auto")
    .style("margin-top", (hoverBoxExtra / 2) + "px")
    //.style("border", "3px solid tan")
    .style("background-color", "#E9E9E9")
    .style("border", "3px solid #ccc")
    .attr("width", toolTipWidth)
    .attr("height", toolTipHeight)
    .attr("overflow", "visible")
    .attr('viewBox', '0, 0, ' + toolTipWidth + ', ' + toolTipHeight)



  var nodeButtons = nodeBoxSvg.append("g")
    .selectAll("g.toolTipButtons")
    .data(toolTipButtons)
    .enter()
    .append("g")
    .attr("class", "toolTipButtons")
    //.attr("opacity", .9)//buttonDefaultAlpha)
    .style("cursor", "pointer")
    .on("click", function(d, i) {

      //console.log("NODE: " + "#i" + node.id)
      //console.log(d + " " + i)
      d3.select(this)
        .style("opacity", .5)
        .transition().duration(blinkTime)
        .style("opacity", 1.0)

      d3.select("#i" + node.id)
        .attr("xlink:href", "imgs/animalsFlat/" + d + ".png");

      node.behavior = toolTipText[i];

      d3.select(".tooltip").remove();
      
    })
    .on("mouseover", function(d,i) {
      d3.select("#nodeText" + i).style("opacity", 1.0)
      d3.select("#nodeButtonImage" + i).attr("xlink:href", function(d) {return "imgs/animalsLine/" + d + ".png";});



      d3.select("#page6 .behaviorInfo .text").remove();

      if ( i == 0 ) {
        d3.select("#page6 .behaviorInfo").text("The simple dog always cooperates.");
      }    
      if ( i == 2 ) {
        d3.select("#page6 .behaviorInfo").text("The copycat starts by cooperating, and each round thereafter does what opponent did in the previous round.");
      }
      if ( i == 1 ) {
        d3.select("#page6 .behaviorInfo").text("The cheater snake always cheats.")
      }
      if ( i == 3 ) {
        d3.select("#page6 .behaviorInfo").text("The clever fox tries to trick copycats. On the 2 rounds it cheats then ...")
      }

    })
    .on("mouseout", function(d, i){
       d3.select("#nodeButtonImage" + i).attr("xlink:href", function(d) {return "imgs/animalsFlat/" + d + ".png";});
      d3.select("#nodeText" + i).style("opacity", 0)
    })

  x0 = 15;

  nodeButtons.append("svg:image")
    .attr("x", function(d,i) {
        if (i < 3) {
          return x0 + (bWidth + bSpace)*i;
        }
        else {
          return x0 + (bWidth + bSpace)*(i-3); 
        }
    })
    .attr("y", function(d,i) { 
      if (i < 3) {
          return y0 + 5;
      }
      else {
          return y0 + bHeight + 20;
      }
    })
    .attr('width', bWidth)
    .attr('height', bHeight)
    .attr("xlink:href", function(d) {return "imgs/animalsFlat/" + d + ".png";})
    .attr("id", function(d,i) {return "nodeButtonImage" + i;})

  nodeButtons.append("text")
        .attr("class","nodeButtonText")
        .attr("id", function(d,i) {return "nodeText" + i;})
        .attr("x",function(d,i) {
            if (i < 3) {
              return x0 + 20 + (bWidth + bSpace)*i - toolTipText[i].length*3;
            }
            else {
              return x0 + 20 + (bWidth + bSpace)*(i-3) - toolTipText[i].length*3;
            }
          })
        .attr("y", function(d,i) { 
          if (i < 3) {
            return bHeight + 10;
          }
          else {
            return y0 + 2*bHeight + 25;
          }
        })
        .attr("dominant-baseline", "central")
        .attr("fill", fontColor)
        .style("opacity", 0)
        .text(function(d, i ) {return toolTipText[i];})
}