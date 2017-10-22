
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
}

function getNodeSizeScale () {
  var sizeScale = d3.scaleLinear()
    .domain([getMin(nodeData, "value")["value"], getMax(nodeData, "value")["value"]])
    .range([50, 100])
  
  return sizeScale;
}

function getNodeSize (node) {
  return radiusScale(node.value);
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



function graph(rootElement, baseData) {

  console.log("graph()");

  function selectNode(selectedNode) {
    d3.select("#" + selectedNode.id)
      .transition().duration(blinkTime).attr("r", (1.3*getNodeSize(selectedNode)))
      .style("fill", getNodeColor(selectedNode, strokeColorLevel))
      .style("stroke", getNodeColor(selectedNode, nodeColorLevel))
      .transition().duration(blinkTime).attr("r", getNodeSize(selectedNode))
      .style("fill", getNodeColor(selectedNode, nodeColorLevel))
      .style("stroke", getNodeColor(selectedNode, strokeColorLevel));
  }

function resetData() {
  var nodeIds = nodeData.map(function (node) { return node.id })
  baseData.nodes.forEach(function (node) {
    if (nodeIds.indexOf(node.id) === -1) {
      nodeData.push(node)
    }
  })
  linkData = baseData.links
}

function updateGraph() {
  //console.log("updateGraph")
  linkElements = linkGroup.selectAll('line')
    .data(linkData, function (link) {
      return link.target.id + link.source.id
    })
  linkElements.exit().remove()
  var linkEnter = linkElements
    .enter().append('line')
    .attr("class", "link")

  linkElements = linkEnter.merge(linkElements)

  nodeElements = nodeGroup.selectAll('circle')
    .data(nodeData, function (node) { return node.id })

  nodeElements.exit().remove()

  radiusScale = getNodeSizeScale()
  
  var nodeEnter = nodeElements
    .enter()
    .append('circle')
    .attr('r', function(node) {return getNodeSize(node)})
    .attr('id', function(node) {return node.id})
    .attr('class', 'node') 
    .style('fill', function(node) {return getNodeColor(node, nodeColorLevel)})
    .attr('stroke', function(node) {return getNodeColor(node, strokeColorLevel)})
    .style("cursor", "pointer")
    .call(dragDrop)
    .on('click', selectNode)

  nodeElements = nodeEnter.merge(nodeElements)
  textElements = textGroup.selectAll('text')
    .data(nodeData, function (d) { return d.id })
  
  textElements.exit().remove()
  
  var textEnter = textElements
    .enter()
    .append('text')
    .text(function(d) {return d.label;})
    .attr('font-size', 10)
    .attr('dx',  function(d) {return (-2*d.label.length);})
    .attr('dy',function(node) {return getNodeSize(node) + 10;})
  
  textElements = textEnter.merge(textElements)

  imageElements = imageGroup.selectAll('image')
    .data(nodeData, function (d) { return d.id })
  
  imageElements.exit().remove()
  
  var imageEnter = imageElements
    .enter()
    .append("image")
    .attr("xlink:href", function(node) {return "imgs/animalsFlat/" + animalBehaviors[node.behavior] + ".png"})
    .attr('id', function (node) {return "i" + node.id})
    .attr("width", function(node) { return 2.0*getNodeSize(node)})
    .attr("height",  function(node) { return 2.0*getNodeSize(node)})
    .attr('class', 'node')
    .style("cursor", "pointer")
    .call(dragDrop)
    .on('click', selectNode)
    .on("mouseover", function() {
      d3.select(this).attr("xlink:href", function(node) {return "imgs/animalsLine/" + animalBehaviors[node.behavior] + ".png"})
    })
    .on("mouseout", function(){
      d3.select(this)
      .attr("xlink:href", function(node) {return "imgs/animalsFlat/" + animalBehaviors[node.behavior] + ".png"})
    })

  imageElements = imageEnter.merge(imageElements)
}

function updateSimulation() {
  updateGraph()
  simulation.nodes(nodeData).on('tick', () => {
    nodeElements
      .attr('cx', function (node) { return node.x })
      .attr('cy', function (node) { return node.y })
    imageElements
      .attr('x', function (node) { return node.x - getNodeSize(node) })
      .attr('y', function (node) { return node.y - getNodeSize(node) + 3 })
    textElements
      .attr('x', function (node) { return node.x })
      .attr('y', function (node) { return node.y })
    linkElements
      .attr('x1', function (link) { return link.source.x })
      .attr('y1', function (link) { return link.source.y })
      .attr('x2', function (link) { return link.target.x })
      .attr('y2', function (link) { return link.target.y })
  })
  simulation.force('link').links(linkData)
  simulation.alphaTarget(0.2).restart()
}


nodeData = [...baseData.nodes];
linkData = [...baseData.links];

var linkElements,
  nodeElements,
  textElements;

rootElement.selectAll("g").remove();

var linkGroup = rootElement.append('g').attr('class', 'links');
var nodeGroup = rootElement.append('g').attr('class', 'nodes');
var textGroup = rootElement.append('g').attr('class', 'texts');
var imageGroup = rootElement.append('g').attr('class', 'images');

//selectedId;

var linkForce = d3.forceLink()
  .id(function (d) {return d.id })
  .strength(function (d) { return d.strength });

var simulation = d3.forceSimulation()
  .force('center', d3.forceCenter(.5*chartWidth, .5*chartHeight))
  .force('link', linkForce)
  .force('charge', d3.forceManyBody().strength(-600).distanceMin(35).distanceMax(300));
  

var dragDrop = d3.drag().on('start', function (node) {
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

updateSimulation();
}



