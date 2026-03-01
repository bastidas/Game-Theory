// D3.js force-directed graph visualization (D3 v7)
import * as d3 from 'd3';
import { nodeBehaviorButtons } from './modFunctions.js';

// Fallback image if node image fails to load
function handleImageError(element) {
  element.attr("xlink:href", "imgs/magic.png");
}

export const graphChangeTime = 1000;

/**
 * Get all neighbors of a node
 */
export function getNeighbors(node, linkData) {
  return linkData.reduce((neighbors, link) => {
    if (link.target.id === node.id) {
      neighbors.push(link.source.id);
    } else if (link.source.id === node.id) {
      neighbors.push(link.target.id);
    }
    return neighbors;
  }, [node.id]);
}

function getMax(arr, prop) {
  let max;
  for (let i = 0; i < arr.length; i++) {
    if (!max || arr[i][prop] > max[prop]) {
      max = arr[i];
    }
  }
  return max;
}

function getMin(arr, prop) {
  let min;
  for (let i = 0; i < arr.length; i++) {
    if (!min || arr[i][prop] < min[prop]) {
      min = arr[i];
    }
  }
  return min;
}

function getNodeSizeScale(nodeData, sizeRange) {
  if (sizeRange === "absolute") {
    return (value) => 35.0 + 25.0 * Math.tanh(value / 10.0); // asymptotic scaling function
  }
  return d3.scaleLinear()
    .domain([getMin(nodeData, "value")["value"], getMax(nodeData, "value")["value"]])
    .range(sizeRange);
}

function getNodeColor(node, variation, nodeColors) {
  if (node.group === "center") {
    return "none";
  }
  return nodeColors[node.group][variation];
}

function isNeighborLink(node, link) {
  return link.target.id === node.id || link.source.id === node.id;
}

function getLinkColor(node, link, linkColor, offLinkColor) {
  return isNeighborLink(node, link) ? linkColor : offLinkColor;
}

function getTextColor(node, neighbors, fontColor, offFontColor) {
  return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? fontColor : offFontColor;
}

export function selectNode(selectedNode, event, cfg, nodeColors, sizeScale, blinkTime, nodeColorLevel, strokeColorLevel) {
  d3.select("#" + selectedNode.id)
    .transition().duration(blinkTime)
    .attr("r", (1.3 * sizeScale(selectedNode.value)))
    .style("fill", getNodeColor(selectedNode, strokeColorLevel, nodeColors))
    .style("stroke", getNodeColor(selectedNode, nodeColorLevel, nodeColors))
    .transition().duration(blinkTime)
    .attr("r", sizeScale(selectedNode.value))
    .style("fill", getNodeColor(selectedNode, nodeColorLevel, nodeColors))
    .style("stroke", getNodeColor(selectedNode, strokeColorLevel, nodeColors));

  if (cfg.chooseBehavior) {
    nodeBehaviorButtons(selectedNode, event);
  }
}

export function updateLinks(link, linkData) {
  link = link.data(linkData);

  // Exit old links
  link.exit().remove();

  link.attr("class", "link").enter();
  
  return link;
}

export function updateGraph(cfg, node, nodeImages, link, simulation, nodeData, linkData, animalBehaviors, nodeColors, nodeColorLevel, strokeColorLevel, chartWidth, chartHeight) {
  const sizeScale = getNodeSizeScale(nodeData, cfg.sizeRange);

  // Join new nodes with old
  node = node.data(nodeData, (d) => d.id);

  // Exit old nodes
  node.exit().remove();

  // Update node elements
  node.transition().duration(graphChangeTime)
    .attr('r', (node) => sizeScale(node.value))
    .style('fill', (node) => getNodeColor(node, nodeColorLevel, nodeColors))
    .style('stroke', (node) => getNodeColor(node, strokeColorLevel, nodeColors));

  // Exit old images
  nodeImages.exit().remove();

  // Update node images
  nodeImages.transition().duration(graphChangeTime)
    .attr("class", "nodes")
    .attr("xlink:href", (node) => {
      if (node.behavior !== "null") {
        return "imgs/animals_flat/" + animalBehaviors[node.behavior] + ".png";
      }
    })
    .attr("x", (node) => -sizeScale(node.value))
    .attr("y", (node) => -sizeScale(node.value))
    .attr("width", (node) => 2.0 * sizeScale(node.value))
    .attr("height", (node) => 2.0 * sizeScale(node.value));

  simulation.nodes(nodeData);
  simulation.force("link").links(linkData); 
  simulation.alpha(0.3).restart();

  return { node, nodeImages };
}

export function graph(element, cfg, animalBehaviors, nodeColors, nodeColorLevel, strokeColorLevel, chartWidth, chartHeight, blinkTime) {
  let nodeData = [...cfg.data.nodes];
  let linkData = [...cfg.data.links];
  let link, node, nodeImages, simulation;

  // Clear existing elements
  element.selectAll("g").remove();

  // Create force simulation
  const linkForce = d3.forceLink()
    .id((d) => d.id)
    .strength((d) => d.strength);

  simulation = d3.forceSimulation()
    .force('center', d3.forceCenter(0.5 * chartWidth, 0.5 * chartHeight))
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-1500).distanceMin(45).distanceMax(170));

  // D3 v7: event is now passed as parameter
  const dragDrop = d3.drag()
    .on('start', function(event, node) {
      node.fx = node.x;
      node.fy = node.y;
    })
    .on('drag', function(event, node) {
      simulation.alphaTarget(0.75).restart();
      node.fx = event.x;
      node.fy = event.y;
    })
    .on('end', function(event, node) {
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      node.fx = null;
      node.fy = null;
    });

  // Create links
  link = element.append("g")
    .attr("class", "link")
    .selectAll("line")
    .data(linkData)
    .enter()
    .append("line");

  const sizeScale = getNodeSizeScale(nodeData, cfg.sizeRange);

  // Create nodes
  node = element.append("g")
    .attr("overflow", "visible")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodeData)
    .enter().append("circle")
    .attr('r', (node) => sizeScale(node.value))
    .attr('id', (node) => node.id)
    .attr('class', 'node')
    .style('fill', (node) => getNodeColor(node, nodeColorLevel, nodeColors))
    .style('stroke', (node) => getNodeColor(node, strokeColorLevel, nodeColors))
    .style("cursor", (node) => node.id !== "center" ? "pointer" : null)
    .call(dragDrop)
    .on('click', function(event, node) {
      return selectNode(node, event, cfg, nodeColors, sizeScale, blinkTime, nodeColorLevel, strokeColorLevel);
    });

  // Create node images
  nodeImages = element.select(".nodes")
    .selectAll("image")
    .data(nodeData)
    .enter().append("image")
    .attr("xlink:href", (node) => {
      if (node.behavior !== "null") {
        return "imgs/animals_flat/" + animalBehaviors[node.behavior] + ".png";
      }
    })
    .on("error", function() { handleImageError(d3.select(this)); })
    .attr("x", (node) => -sizeScale(node.value))
    .attr("y", (node) => -sizeScale(node.value))
    .attr('id', (node) => "i" + node.id)
    .attr("width", (node) => 2.0 * sizeScale(node.value))
    .attr("height", (node) => 2.0 * sizeScale(node.value))
    .style("cursor", "pointer")
    .call(dragDrop)
    .on('click', function(event, node) {
      return selectNode(node, event, cfg, nodeColors, sizeScale, blinkTime, nodeColorLevel, strokeColorLevel);
    })
    .on("mouseover", function(event, node) {
      d3.select(this).attr("xlink:href", () => {
        if (node.behavior !== "null") {
          return "imgs/animals_line/" + animalBehaviors[node.behavior] + ".png";
        }
      })
      .on("error", function() { handleImageError(d3.select(this)); });
    })
    .on("mouseout", function(event, node) {
      d3.select(this).attr("xlink:href", () => {
        if (node.behavior !== "null") {
          return "imgs/animals_flat/" + animalBehaviors[node.behavior] + ".png";
        }
      })
      .on("error", function() { handleImageError(d3.select(this)); });
    });

  // Add center node if configured
  if ((cfg.center === true) && (nodeData[0].id !== "center")) {
    console.log("adding center");
    const centeringNode = {
      id: "center",
      label: "center",
      group: "center",
      behavior: "null",
      level: 0,
      playbook: [],
      value: 0,
      fx: 0.5 * chartWidth,
      fy: 0.5 * chartHeight
    };
    nodeData.unshift(centeringNode);
  }

  // Tick function for animation
  const ticked = () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    nodeImages
      .attr("transform", (d) => `translate(${d.x},${d.y})`);
    node
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);
  };

  simulation
    .nodes(nodeData)
    .on("tick", ticked);
    
  simulation.force("link").links(linkData);

  // Return references for later updates
  return {
    nodeData,
    linkData,
    node,
    nodeImages,
    link,
    simulation
  };
}
