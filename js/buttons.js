
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
        mostDangerousGame(rootElement);
      }
      if (i === 1) {  //do reset animation and data update
        for (var i=0; i < nodeData.length; i++) {
          d3.select("body .wrapper #" + nodeData[i].id)
            //.transition().duration(blinkTime)
            .style("fill", "black")
            .transition().duration(blinkTime)
            .style("fill", getNodeColor (nodeData[i], nodeColorLevel))
          nodeData[i].value = 0
          }
                    
        d3.select(rootElement)
          .selectAll("table")
          .remove();

        tabulate(rootElement, nodeData, ['label', 'behavior', 'value']);
        //linkTabulate(baseData.links, ['label', 'strength', 'invStrength']);
        //updateSimulation();
    }
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

  var toolTipButtons = ["dog", "snake", "cat", "fox", "owl", "chimpanzee"];
  var toolTipText = ["cooperator", "cheater", "copycat", "clever", "wise", "random"];
  var toolTipHeight = 150;
  var toolTipWidth = 285;

  d3.select("body .wrapper .leftDiv .tooltip").remove();

  //to-do make the nodebox scale with chartSvg rootElement better
  var nodeBox = d3.select("body .wrapper .leftDiv")
  .append("div")
  .attr("class", "tooltip")
  .style("width",  toolTipWidth + "px")
  .style("height", toolTipHeight + "px")
  .style("left", (d3.event.pageX - 25) + "px")
  .style("top", (d3.event.pageY - toolTipHeight)+ "px");

  var nodeBoxSvg = d3.select("body .wrapper .leftDiv .tooltip")
    .append("svg")
    .attr("width", "100%")
    //.attr("height", buttonBoxHeight)
    .attr('viewBox', '0, 0, ' + toolTipWidth + ', ' + toolTipHeight)
    .attr("overflow", "visible");

  var nodeButtons = nodeBoxSvg.append("g")
    .selectAll("g.toolTipButtons")
    .data(toolTipButtons)
    .enter()
    .append("g")
    .attr("class", "toolTipButtons")
    .attr("opacity", .9)//buttonDefaultAlpha)
    .style("cursor", "pointer")
    .on("click", function(d, i) {

      d3.select(this)
        //.transition().duration(blinkTime)
        .style("opacity", .9)
        .transition().duration(blinkTime)
        .style("opacity", 1.0)

      node.behavior = toolTipText[i];


      d3.select("body .wrapper #i" + node.id)
        .attr("xlink:href", function(node) {return "imgs/animalsFlat/" + animalBehaviors[node.behavior] + ".png"})

      rightDiv.selectAll("table")
        .remove();

      tabulate(rootElement, nodeData, ['label', 'behavior', 'value']);

      nodeBoxSvg.transition().duration(2*blinkTime)
      .remove();  

      d3.select("body .wrapper .leftDiv .tooltip").transition().duration(2*blinkTime)
      .remove();

      //updateData(node);
      //updateSimulation();
      //updateData(node);
      ///updateGraph();
    })
    .on("mouseover", function(d,i) {
      d3.select(this).style("opacity", 1.0)
      d3.select("#nodeText" + i).style("opacity", 1.0)
    })
    .on("mouseout", function(d, i){
      d3.select(this).style("opacity", .9)
      d3.select("#nodeText" + i).style("opacity", 0)
    })

  x0 = 5;
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
          return y0;
      }
      else {
          return y0 + bHeight + 25;
      }
    })
    .attr('width', bWidth)
    .attr('height', bHeight)
    .attr("xlink:href", function(d) {return "imgs/animal/" + d + ".png";});

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
            return bHeight + 8;
          }
          else {
            return y0 + 2*bHeight + 35;
          }
        })
        .attr("dominant-baseline", "central")
        .attr("fill", fontColor)
        .style("opacity", 0)
        .text(function(d, i ) {return toolTipText[i];})
}