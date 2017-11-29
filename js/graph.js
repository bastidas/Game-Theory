var graphChangeTime = 1000;
var selectedNode;
var link;
var sizeScale;
var node, nodeImages;
var nodeEnter; 

function getNeighbors(node) {

  //return  linkData.links.reduce(function (neighbors, link) {
  return  linkData.reduce(function (neighbors, link) {
      if (link.target.id === node.id) {
        neighbors.push(link.source.id)
      } else if (link.source.id === node.id) {
        neighbors.push(link.target.id)
      }
      return neighbors
    },
    [node.id]
  )
}

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

function getNodeSizeScale(sizeRange) {
  if (sizeRange == "absolute") {
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
  return sizeScale(node.value);
}

function getNodeColor(node, variation) {
  if (node.group == "center") {
    return "none";
  }
  else {
    return nodeColors[node.group][variation];
  }
}


function getLinkColor(node, link) {
  return isNeighborLink(node, link) ? linkColor : offLinkColor;
}


function getTextColor(node, neighbors) {
  return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? fontColor : offFontColor;
}


function selectNode(selectedNode, cfg) {
  d3.select("#" + selectedNode.id)
    .transition().duration(blinkTime)
    .attr("r", (1.3*getNodeSize(selectedNode)))
    .style("fill", getNodeColor(selectedNode, strokeColorLevel))
    .style("stroke", getNodeColor(selectedNode, nodeColorLevel))
    .transition().duration(blinkTime)
    .attr("r", getNodeSize(selectedNode))
    .style("fill", getNodeColor(selectedNode, nodeColorLevel))
    .style("stroke", getNodeColor(selectedNode, strokeColorLevel));

  if (cfg.chooseBehavior) {
     nodeBehaviorButtons(selectedNode);
  }
}


function updateLinks(cfg) {
  link = link.data(linkData)

  //  exit old nodes with animation
  link.exit()
    //.transition().duration(graphChangeTime)
    //.style("stroke-width", 0)
    //.style("stroke", "red")
    .remove();

  //enter new elements with animation
  // link = link //.transition().duration(graphChangeTime)
  //  .enter()
  //  .append("line")
  //  .attr("stroke", "blue")
  //  .merge(link);

  link
    .attr("class", "link")
    .enter()
}


function updateGraph(cfg) {

  for (var g = nodeData.length - 1; g >= 0; g--) {  
    console.log("nodes in updategraph: ", g, " : ", nodeData[g].id);
  }

  // join new nodes with old
  node = node.data(nodeData, function(d) { return d.id;});

  // exit old nodes
  node.exit();

  // update elements
  sizeScale = getNodeSizeScale(cfg.sizeRange); 

  node.transition().duration(graphChangeTime)
    .attr('r', function(node) {return getNodeSize(node);})
    //.attr('id', function(node) {return node.id})
    //.attr('class', 'node') 
    // .style('opacity', function(node) {
    //   //console.log(node.id, " : ", getNeighbors(node));
    //   if (getNeighbors(node).length <= 1) {
    //     return .1;
    //   }
    //   else {
    //     return 1; //getNodeColor(node, nodeColorLevel);
    //   }
    // })
    // .attr('strength', function(node) {
    //   //console.log(node.id, " : ", getNeighbors(node));
    //   if (getNeighbors(node).length <= 1) {
    //     return -100;
    //   }
    //   else {
    //     return -1500; //getNodeColor(node, nodeColorLevel);
    //   }
    // })
    .style('fill', function(node) {return getNodeColor(node, nodeColorLevel)})
    .style('stroke', function(node) {return getNodeColor(node, strokeColorLevel)})


  // exit old images
  nodeImages.exit();

  nodeImages.transition().duration(graphChangeTime)
    .attr("class", "nodes")

    .attr("xlink:href", function(node) {
              if (node.behavior !== "null") {
          return "imgs/animalsFlat/" + animalBehaviors[node.behavior] + ".png"
        }
        //return "imgs/animalsFlat/" + animalBehaviors[node.behavior] + ".png"
    })
    .attr("x", function(node) { return -getNodeSize(node)})
    .attr("y", function(node) { return -getNodeSize(node)})
    //.attr('id', function (node) {return "i" + node.id})
    .attr("width", function(node) { return 2.0*getNodeSize(node)})
    .attr("height",  function(node) { return 2.0*getNodeSize(node)})

  simulation.nodes(nodeData);
  simulation.force("link")
    .links(linkData); 

  simulation.alpha(.3).restart();
}

function graph(element, cfg) {
  nodeData = [...cfg.data.nodes];
  linkData = [...cfg.data.links];

  // if ((cfg.center === true) && (nodeData[0].id == "center")){
  //   console.log("removing center")
  //   x = nodeData.splice(0, 1);
  // }

  element.selectAll("g").remove();

  linkForce = d3.forceLink()
    .id(function (d) {return d.id })
    .strength(function (d) { return d.strength });

  simulation = d3.forceSimulation()
    .force('center', d3.forceCenter(.5 * chartWidth, .5 * chartHeight))
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-1500).distanceMin(45).distanceMax(170)) 

  dragDrop = d3.drag().on('start', function (node) {
    node.fx = node.x
    node.fy = node.y
  })
  .on('drag', function (node) {
    simulation.alphaTarget(0.75).restart()
    node.fx = d3.event.x
    node.fy = d3.event.y
  })
  .on('end', function (node) {
    if (!d3.event.active) {
      simulation.alphaTarget(0)
  }
    node.fx = null
    node.fy = null
  })


  link = element.append("g")
    .attr("class", "link")
    .selectAll("line")
    .data(linkData)
    .enter()
    .append("line")

  sizeScale = getNodeSizeScale(cfg.sizeRange); 

  node = element.append("g").attr("overflow", "visible")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodeData)
    .enter().append("circle")
    .attr('r', function(node) { return getNodeSize(node);})
    .attr('id', function(node) {return node.id})
    .attr('class', 'node')
    .style('fill', function(node) {return getNodeColor(node, nodeColorLevel)})
    .style('stroke', function(node) {return getNodeColor(node, strokeColorLevel)})
    .style("cursor", function(node) {
      if (node.id !== "center") {
        //console.log("not center")
        return "pointer"
      }
    })
    .call(dragDrop)
    .on('click', function(node) {return selectNode(node, cfg)});

  nodeImages = element.select(".nodes")
    .selectAll("image")
    .data(nodeData)
    .enter().append("image")
    .attr("xlink:href", function(node) {
      if (node.behavior !== "null") {
        return "imgs/animalsFlat/" + animalBehaviors[node.behavior] + ".png"
      }
    })
    .attr("x", function(node) { return -getNodeSize(node)})
    .attr("y", function(node) { return -getNodeSize(node)})
    .attr('id', function (node) {return "i" + node.id})
    .attr("width", function(node) { return 2.0 * getNodeSize(node)})
    .attr("height",  function(node) { return 2.0 * getNodeSize(node)})
    .style("cursor", "pointer")
    .call(dragDrop)
    .on('click', function(node) {return selectNode(node, cfg)})
    .on("mouseover", function() {
      d3.select(this).attr("xlink:href", function(node) {
        if (node.behavior !== "null") {
          return "imgs/animalsLine/" + animalBehaviors[node.behavior] + ".png"
        }
      })
    })
    .on("mouseout", function(){
      //if (node.behavior !== "null") {
        //console.log("not null mouseout")
      d3.select(this)
          .attr("xlink:href", function(node) {
        if (node.behavior !== "null") {
          return "imgs/animalsFlat/" + animalBehaviors[node.behavior] + ".png"
        }
      })
    })

  if ((cfg.center === true) && (nodeData[0].id != "center")){
    console.log("adding center")
    var centeringNode = {"id": "center",  "label": "center", "group": "center", "behavior": "null", "level": 0, "playbook": [], "value": 0,
      "fx": .5 * chartWidth, "fy": .5 * chartHeight
    };
    nodeData.unshift(centeringNode)
    //cfg.data.nodes.unshift(centeringNode)
  }

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