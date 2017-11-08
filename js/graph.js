var graphChangeTime = 1000;
var selectedNode;
var link;
var sizeScale;
var node, nodeImages;
var nodeEnter; 


function getMax(arr, prop) {
  var max;
  for (var i=0 ; i<arr.length ; i++) {
    if (!max || arr[i][prop] > max[prop])
      max = arr[i];
    }
  return max;
}

function getMin(arr, prop) {
  var min;
    for (var i=0 ; i<arr.length ; i++) {
      if (!min || arr[i][prop] < min[prop])
        min = arr[i];
    }
  return min;
  //return Math.min.apply(null, arr[prop]);
}

function getNodeSizeScale (sizeRange) {
  //console.log(sizeRange)
  if (sizeRange == "absolute") {
    //console.log("absolute size scale")
    function sizeScale(value) {
      return 35.0 + 25.0 * Math.tanh(value / 10.0) // asymptotic scaling function
    }
  }
  else {
    var sizeScale = d3.scaleLinear()
      .domain([getMin(nodeData, "value")["value"], getMax(nodeData, "value")["value"]])
      .range(sizeRange)
  }
  return sizeScale;
}

function getNodeSize (node) {
  //console.log("sizeScale(node.value)" + sizeScale(node.value))
  return sizeScale(node.value);
}

function getNodeColor(node, variation) {
  return nodeColors[node.group][variation];
}

function getLinkColor(node, link) {
  return isNeighborLink(node, link) ? linkColor : offLinkColor;
}

function getTextColor(node, neighbors) {
  return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? fontColor : offFontColor;
}

//function updateSimulation(simulation, nodeGroup, linkGroup, imageGroup) {
function updateSimulation() {
  console.log("updateSimulation()");
  //updateGraph();
}

//function updateGraph(nodeGroup, linkGroup, imageGroup, dragDrop) {
function updateGraph() {
  console.log("updateGraph()");
}



function selectNode(node) {
  selectedNode = node;
  //console.log( "selectedNode.id: " + selectedNode.id  )
  //console.log( "node.id: " + node)
  //console.log('this' + this)
  d3.select("#" + node.id)
  //d3.select(this)
    .transition().duration(blinkTime)
    .attr("r", (1.3*getNodeSize(selectedNode)))
    .style("fill", getNodeColor(selectedNode, strokeColorLevel))
    .style("stroke", getNodeColor(selectedNode, nodeColorLevel))
    .transition().duration(blinkTime)
    .attr("r", getNodeSize(selectedNode))
    .style("fill", getNodeColor(selectedNode, nodeColorLevel))
    .style("stroke", getNodeColor(selectedNode, strokeColorLevel));

  if (chooseBehavior) {
     nodeBehaviorButtons(selectedNode);
  }
}


function updateLinks() {

  //link = link.data(linkData)


  link = link.data(linkData)

  //  exit old nodes
  link.exit()
    .transition().duration(graphChangeTime)
    .style("stroke-width", 0)
    .remove();

//  link = transition().duration(graphChangeTime)
    //.attr("class", "link")
    //.selectAll("line")
    //.data(linkData)
    //.enter()
    //.append("line")
    //.attr("stroke", "black")

  //enter new elements
  // link = link //.transition().duration(graphChangeTime)
  //   .enter()
  //   .append("line")
  //   .style("stroke", "red")

  //   .merge(link);

}


function updateGraph() {
  console.log('updateGraph')
  // join new nodes with old
  node = node.data(nodeData, function(d) { return d.id;});

  //exit old nodes
  node.exit();

  // update elements
  sizeScale = getNodeSizeScale(sizeRange); 

  node.transition().duration(graphChangeTime)
    .attr('r', function(node) {return getNodeSize(node);})
    //.attr('id', function(node) {return node.id})
    //.attr('class', 'node') 
    .style('fill', function(node) {return getNodeColor(node, nodeColorLevel)})
    .style('stroke', function(node) {return getNodeColor(node, strokeColorLevel)})
    // .style("cursor", "pointer")
    // .call(dragDrop)
    // .on('click', function(node) {return selectNode(node)})
    // .merge(node);


  nodeImages.transition().duration(graphChangeTime)
    //.attr("class", "nodes")
    .attr("xlink:href", function(node) {return "imgs/animalsFlat/" + animalBehaviors[node.behavior] + ".png"})
    .attr("x", function(node) { return -getNodeSize(node)})
    .attr("y", function(node) { return -getNodeSize(node)})
   // .attr('id', function (node) {return "i" + node.id})
    .attr("width", function(node) { return 2.0*getNodeSize(node)})
    .attr("height",  function(node) { return 2.0*getNodeSize(node)})
    // .style("cursor", "pointer")
    // .call(dragDrop)
    // .on('click', function(node) {return selectNode(node)})
    // .on("mouseover", function() {
    //   d3.select(this).attr("xlink:href", function(node) {return "imgs/animalsLine/" + 
    //     animalBehaviors[node.behavior] + ".png"})
    // })
    // .on("mouseout", function(){
    //   d3.select(this)
    //   .attr("xlink:href", function(node) {return "imgs/animalsFlat/" + animalBehaviors[node.behavior] + ".png"})
    // })

  simulation.nodes(nodeData);
  //simulation.force("link").links(links);
  simulation.alpha(.5).restart();
}

function changeNodes() {
  // join new nodes with old
  node = node.data(nodeData, function(d) { return d.id;});

  // exit old nodes
  node.exit()
    .transition().duration(graphChangeTime)
    .attr("r", 0)
    .remove();

  // update old elements
  sizeScale = getNodeSizeScale(sizeRange); 

  node.transition().duration(graphChangeTime)
    .attr('r', function(node) {return getNodeSize(node);})
    //.attr('id', function(node) {return node.id})
    //.attr('class', 'node') 
    .style('fill', function(node) {return getNodeColor(node, nodeColorLevel)})
    .attr('stroke', function(node) {return getNodeColor(node, strokeColorLevel)})
    // .style("cursor", "pointer")
    // .call(dragDrop)
    // .on('click', function(node) {return selectNode(node)})
    // .merge(node);


      //enter new elements
// node = node.transition().duration(graphChangeTime)
//     .enter()
//     .append("circle")
//     //.attr('r', function(node) {console.log("node.id: " + node.id + ", getNodeSize(node): " + getNodeSize(node));
//     .attr('r', function(node) {return getNodeSize(node);})
//     .attr('id', function(node) {return node.id})
//     .attr('class', 'node') 
//     .style('fill', "blue")//function(node) {return getNodeColor(node, nodeColorLevel)})
//     .attr('stroke', function(node) {return getNodeColor(node, strokeColorLevel)})
//     // .style("cursor", "pointer")
//     // .call(dragDrop)
//     // .on('click', function(node) {return selectNode(node)})
//     // .merge(node);
//     .merge(node);

}

function graph(element, baseData, sizeRange) {
//  console.log("graph()");

  nodeData = [...baseData.nodes];
  linkData = [...baseData.links];

  element.selectAll("g").remove();

  linkForce = d3.forceLink()
    .id(function (d) {return d.id })
    .strength(function (d) { return d.strength });

  simulation = d3.forceSimulation()
    .force('center', d3.forceCenter(.5*chartWidth, .5*chartHeight))
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-2000).distanceMin(45).distanceMax(160))
    //.attr('class', 'simulation')  

  dragDrop = d3.drag().on('start', function (node) {
    node.fx = node.x
    node.fy = node.y
  }).on('drag', function (node) {
    simulation.alphaTarget(0.7).restart()
    node.fx = d3.event.x
    node.fy = d3.event.y
  }).on('end', function (node) {
    if (!d3.event.active) {
      simulation.alphaTarget(0)
    }
    node.fx = null
    node.fy = null
  })


  svg = element;

  link = svg.append("g")
    .attr("class", "link")
    .selectAll("line")
    .data(linkData)
    .enter()
    .append("line")
    //.attr("stroke", "black")


  sizeScale = getNodeSizeScale(sizeRange); 
  
  node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodeData)
    .enter().append("circle")
    //.attr('r', function(node) {console.log("node.id: " + node.id + ", getNodeSize(node): " + getNodeSize(node));
    //.attr('r', function(node) {console.log("node: " + node.id +  " value:" + node.value + " size:" +  getNodeSize(node) );    return getNodeSize(node);})
    .attr('r', function(node) { return getNodeSize(node);})
    .attr('id', function(node) {return node.id})
    .attr('class', 'node') 
    .style('fill', function(node) {return getNodeColor(node, nodeColorLevel)})
    .style('stroke', function(node) {return getNodeColor(node, strokeColorLevel)})
    .style("cursor", "pointer")
    .call(dragDrop)
    .on('click', function(node) {return selectNode(node)});

  nodeImages = svg.append("g")
    .attr("class", "nodes")
    .selectAll("image")
    .data(nodeData)
    .enter().append("image")
    .attr("xlink:href", function(node) {return "imgs/animalsFlat/" + animalBehaviors[node.behavior] + ".png"})
    .attr("x", function(node) { return -getNodeSize(node)})
    .attr("y", function(node) { return -getNodeSize(node)})
    .attr('id', function (node) {return "i" + node.id})
    .attr("width", function(node) { return 2.0*getNodeSize(node)})
    .attr("height",  function(node) { return 2.0*getNodeSize(node)})
    .style("cursor", "pointer")
    .call(dragDrop)
    .on('click', function(node) {return selectNode(node)})
    .on("mouseover", function() {
      d3.select(this).attr("xlink:href", function(node) {return "imgs/animalsLine/" + 
        animalBehaviors[node.behavior] + ".png"})
    })
    .on("mouseout", function(){
      d3.select(this)
      .attr("xlink:href", function(node) {return "imgs/animalsFlat/" + animalBehaviors[node.behavior] + ".png"})
    })

  var ticked = function() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
    nodeImages
      .attr("transform", function(d) { return "translate(" + d.x + "," 
        + d.y + ")";});
    node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  }  

  simulation
    .nodes(nodeData)
    .on("tick", ticked);
    
  simulation.force("link")
    .links(linkData); 
}




