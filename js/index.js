//styles
fontColor = "#131313";
offFontColor = "#ccc";
textColor = "#131313";
linkColor = "#131313";
offLinkColor = "#ccc";
addNodeMode = false;
chartWidth = 450;
chartHeight = 450;
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

narrativeStatus = 0;
modeStatus = 0;
cullTheWeak = true;

primaryColor = ['#06799F', '#216278', '#024E68', '#3AAACF', '#62B4CF'];
secondayColor = ['#FFB400', '#BF9530', '#A67500', '#FFC740', '#FFD673'];
tertiaryColor = ['#FF2800', '#BF4630', '#A61A00', '#FF5D40', '#FF8973'];
nodeColors = [primaryColor, secondayColor, tertiaryColor];
nodeColorLevel = 4;
strokeColorLevel = 0;

var baseData0 = {
    "nodes": [{
        "id": "alpha",
        "label": "alpha",
        "group": 0,
        "level": 1,
        "behavior": "cooperator",
        "value": 0, 
        "playbook": []
    }, {
        "id": "beta",
        "label": "beta",
        "group": 1,
        "level": 1,
        "behavior": "cooperator",
        "value": 0, 
        "playbook": []
    }],
    "links": [{
        "source": "alpha",
        "target": "beta",
        "strength": 0.5,
        "invStrength": .995
    }]
}

var baseData1 = {
    "nodes": [{
        "id": "alpha",
        "label": "alpha",
        "group": 0,
        "level": 1,
        "behavior": "cooperator",
        "value": 3, 
        "playbook": []
    }, {
        "id": "beta",
        "label": "beta",
        "group": 1,
        "level": 1,
        "behavior": "cooperator",
        "value": 3, 
        "playbook": []
    }, {
        "id": "alpha2",
        "label": "alpha2",
        "group": 0,
        "level": 2,
        "behavior": "cooperator",
        "value": 1, 
        "playbook": []
    }, {
        "id": "alpha3",
        "label": "alpha3",
        "group": 0,
        "level": 2,
        "behavior": "cooperator",
        "value": 1, 
        "playbook": []
    },{
        "id": "alpha4",
        "label": "alpha4",
        "group": 0,
        "level": 2,
        "behavior": "cooperator",
        "value": 1, 
        "playbook": []
    }, {
      "id": "beta2",
        "label": "beta2",
        "group": 1,
        "level": 2,
        "behavior": "cooperator",
        "value": 1, 
        "playbook": []
    }, {
      "id": "beta3",
        "label": "beta3",
        "group": 1,
        "level": 2,
        "behavior": "cooperator",
        "value": 1, 
        "playbook": []
    }, {
      "id": "beta4",
        "label": "beta4",
        "group": 1,
        "level": 2,
        "behavior": "cooperator",
        "value": 1, 
        "playbook": []
    }],
    "links": [{
        "source": "alpha",
        "target": "beta",
        "strength": .05,
        "invStrength": .05
    },{
        "source": "alpha2",
        "target": "alpha",
        "strength": .5,
        "invStrength": .05
    },{
        "source": "alpha3",
        "target": "alpha",
        "strength": .5,
        "invStrength": .05
    },{
        "source": "alpha4",
        "target": "alpha",
        "strength": .5,
        "invStrength": .05
    },{
        "source": "beta2",
        "target": "beta",
        "strength": .5,
        "invStrength": .005
    },{
        "source": "beta3",
        "target": "beta",
        "strength": .5,
        "invStrength": .05
    },{
        "source": "beta4",
        "target": "beta",
        "strength": .5,
        "invStrength": .05
    }]
};

var baseData2 = {
    "nodes": [{
        "id": "alpha",
        "label": "alpha",
        "group": 0,
        "level": 1,
        "behavior": "cooperator",
        "value": 1, 
        "r": 17
    }, {
        "id": "beta",
        "label": "beta",
        "group": 1,
        "level": 1,
        "behavior": "cooperator",
        "value": 1,   
        "r": 23
    }, {
        "id": "gamma",
        "label": "gamma",
        "group": 2,
        "level": 1,
        "behavior": "cheater",
        "value": 1,  
        "r": 14
    }, {
        "id": "delta",
        "label": "delta",
        "group": 0,
        "level": 2,
        "behavior": "cooperator",
        "value": 1,  
        "r": 8
    }, {
        "id": "epsilon",
        "label": "epsilon",
        "group": 0,
        "level": 2,
        "behavior": "cooperator",
        "value": 1,  
        "r": 8
    }, {
      "id": "zeta",
        "label": "zeta",
        "group": 1,
        "level": 2,
        "behavior": "cooperator",
        "value": 1,  
        "r": 10
    }, {
      "id": "theta",
        "label": "theta",
        "group": 2,
        "level": 2,
        "behavior": "cooperator",
        "value": 1,  
        "r": 5
    }, {
      "id": "kappa",
        "label": "kappa",
        "group": 2,
        "level": 2,
        "behavior": "cooperator",
        "value": 1,  
        "r": 5
    }, {
      "id": "lambda",
        "label": "lambda",
        "group": 2,
        "level": 2,
        "behavior": "cooperator",
        "value": 1,  
        "r": 8
    }, {
      "id": "omega",
        "label": "omega",
        "group": 2,
        "level": 2,
        "behavior": "cooperator",
        "value": 1,  
        "r": 4
    }],
    "links": [{
        "source": "alpha",
        "target": "beta",
        "strength": .1,
        "invStrength": .05
    },{
        "source": "beta",
        "target": "gamma",
        "strength": .1,
        "invStrength": .05
    },{
        "source": "gamma",
        "target": "delta",
        "strength": .1,
        "invStrength": .05
    },{
        "source": "delta",
        "target": "epsilon",
        "strength": .1,
        "invStrength": .05
    },{
        "source": "epsilon",
        "target": "zeta",
        "strength": .1,
        "invStrength": .05
    },{
        "source": "zeta",
        "target": "theta",
        "strength": .1,
        "invStrength": .005
    },{
        "source": "theta",
        "target": "kappa",
        "strength": .1,
        "invStrength": .05
    },{
        "source": "kappa",
        "target": "lambda",
        "strength": .1,
        "invStrength": .05
    },{
        "source": "lambda",
        "target": "omega",
        "strength": 0.1,
        "invStrength": .995
    }, {
        "source": "omega",
        "target": "alpha",
        "strength": 0.1,
        "invStrength": .995
    }]
}

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
} 

baseData = baseData1;
nodeData = [...baseData.nodes];
linkData = [...baseData.links];

function getNeighbors(node) {
  return baseData.links.reduce(function (neighbors, link) {
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

function isNeighborLink(node, link) {
  return link.target.id === node.id || link.source.id === node.id
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

function getNodeSizeScale () {
  var sizeScale = d3.scaleLinear()
    .domain([getMin(nodeData, "value")["value"], getMax(nodeData, "value")["value"]])
		.range([20,40])
  
  return sizeScale;
  }

function getNodeSize (node) {
  return radiusScale(node.value);
}

function getNodeColor (node, variation) {
  return nodeColors[node.group][variation];
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

var chartSvg = d3.select("body .wrapper .leftDiv")
	.append("svg")
	.attr("overflow", "visible")
	.attr('viewBox', '0, 0, ' + chartWidth + ', ' + chartHeight);

var linkElements,
	nodeElements,
	textElements;

var linkGroup = chartSvg.append('g').attr('class', 'links');
var nodeGroup = chartSvg.append('g').attr('class', 'nodes');
var textGroup = chartSvg.append('g').attr('class', 'texts');

var selectedId;

var linkForce = d3.forceLink()
	.id(function (d) {return d.id })
	.strength(function (d) { return d.strength });

var simulation = d3.forceSimulation()
  .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
  .force('link', linkForce)
  .force('charge', d3.forceManyBody().strength(-600).distanceMin(35).distanceMax(300));
  
//charge and force variations
// 	.force('charge', d3.forceManyBody().strength(-120)) 
// 	.force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
//             //.force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
            //.force("charge", d3.forceManyBody())
            //.force("charge", d3.forceManyBody().strength(-700).distanceMin(100).distanceMax(1000)) 
            //.force("link", d3.forceLink().id(function(d) { return d.index })) 
            //.force("center", d3.forceCenter(chartWidth / 2, chartWidth / 2))
            //.force("y", d3.forceY(0.01))
            //.force("x", d3.forceX(0.01))

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


function selectNode(selectedNode) {
  
  d3.selectAll("body .wrapper .rightDiv .selectedInfo").remove()
  
  d3.select("body .wrapper #" + selectedNode.id)
    .transition().duration(blinkTime).attr("r", (1.3*getNodeSize(selectedNode)))
    .style("fill", getNodeColor(selectedNode, strokeColorLevel))
    .style("stroke", getNodeColor(selectedNode, nodeColorLevel))
    .transition().duration(blinkTime).attr("r", getNodeSize(selectedNode))
    .style("fill", getNodeColor(selectedNode, nodeColorLevel))
    .style("stroke", getNodeColor(selectedNode, strokeColorLevel));

  if ((modeStatus === 0) && (narrativeStatus > 0)) { 
    nodeBehaviorButtons(selectedNode);
  }

  var manageNodes = false;

  if ((modeStatus === 1) && (manageNodes)) { 
    if (selectedId === selectedNode.id) {
      selectedId = undefined;
      resetData();
      updateSimulation();
    } else {
      selectedId = selectedNode.id;
      updateData(selectedNode);
      updateSimulation();
    }
  var neighbors = getNeighbors(selectedNode);
  nodeElements.style('fill', function (node) { return getNodeColor(node, neighbors) })
  textElements.attr('fill', function (node) { return getTextColor(node, neighbors) })
  linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
  } 
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

// diff and mutate the data
function updateData(selectedNode) {
  var neighbors = getNeighbors(selectedNode)
  var newNodes = baseData.nodes.filter(function (node) {
    return neighbors.indexOf(node.id) > -1 || node.level === 1
  })
  var diff = {
    removed: nodeData.filter(function (node) { return newNodes.indexOf(node) === -1 }),
    added: newNodes.filter(function (node) { return nodeData.indexOf(node) === -1 })
  }
  diff.removed.forEach(function (node) { nodeData.splice(nodeData.indexOf(node), 1) })
  diff.added.forEach(function (node) { nodeData.push(node) })
  linkData = baseData.links.filter(function (link) {
    return link.target.id === selectedNode.id || link.source.id === selectedNode.id
  })
}

function updateGraph() {
	console.log("updateGraph")
  // links
  linkElements = linkGroup.selectAll('line')
    .data(linkData, function (link) {
      return link.target.id + link.source.id
    })
  linkElements.exit().remove()
  var linkEnter = linkElements
    .enter().append('line')
    .attr("class", "link")

  linkElements = linkEnter.merge(linkElements)
  // nodes
  nodeElements = nodeGroup.selectAll('circle')
    .data(nodeData, function (node) { return node.id })
  nodeElements.exit().remove()
 

  radiusScale = getNodeSizeScale()
  
    var nodeEnter = nodeElements
    .enter()
    .append('circle')
    .attr('r', function (node) {return getNodeSize(node)})
    .attr('id', function (node) {return node.id})
    .attr('fill', function (node) {return getNodeColor(node, nodeColorLevel)})
    .attr('stroke', function (node) {return getNodeColor(node, strokeColorLevel)})
    .attr('class', 'node')
    .style("cursor", "pointer")
    .call(dragDrop)
    .on('click', selectNode)
    .on("mouseover", function() {
        d3.select(this).style("fill", function (node) {return getNodeColor(node, strokeColorLevel)})
    })
    .on("mouseout", function(){
        d3.select(this).transition().duration(blinkTime).style("fill", function (node) {return getNodeColor(node, nodeColorLevel)}) 
    })

  nodeElements = nodeEnter.merge(nodeElements)

  textElements = textGroup.selectAll('text')
    .data(nodeData, function (d) { return d.id })
  textElements.exit().remove()
  var textEnter = textElements
    .enter()
    .append('text')
    .text(function (d) { return d.label })
    .attr('font-size', 10)
    .attr('dx',  5)
    .attr('dy', -5)
  textElements = textEnter.merge(textElements)
}

function updateSimulation() {
  updateGraph()
  simulation.nodes(nodeData).on('tick', () => {
    nodeElements
      .attr('cx', function (node) { return node.x })
      .attr('cy', function (node) { return node.y })
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

updateSimulation();

var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;
 
function resetMouseVars() {
  mousedown_node = null;
  mouseup_node = null;
  mousedown_link = null;
}

lastNodeIndex = nodeData.length;

function mouseDown() {
 
  if(d3.event.ctrlKey || mousedown_node || mousedown_link) return;
 
  // insert new node at point
  var point = d3.mouse(this),
      node = {id: lastNodeIndex};
    

      node = {
        "id": "newNode",
        "label": "newNode",
        "group": 0,
        "level": 0,
        "behavior": "cooperator",
        "value": 0, 
    }

  node.x = point[0];
  node.y = point[1];
  node.cx = point[0];
  node.cy = point[1];
  nodeData.push(node)

  updateSimulation()
}

linkStrength = .01;
fullWin = 2 ;//* linkStrength;
fullFail = 0 ;//* linkStrength;
fail = -1 ;//linkStrength;
win = 3 ;//linkStrength;

function trial(alpha, beta) {

//copycat starts with cooperation, then does what opponent does in next round
//grudger starts with cooperator, then always cheats if opponent cheats even once
//cheater always cheats
//cooperator always cooperators
//detective starts with [cooperator,  cheat, cooperator, cooperator] afterwards, if opponent ever retaliates with cheat it plays like copycat, else plays like always cheat
//copykitten
//simpelton
//random
//steps: 
// play round (a rund has N matches?) tally up scores
// remove losers based on loser criteria
// replace losers with winners on winner criteria

	// TT	|  FT
	// ---    ---
	// TF   |  FF

	if (alpha && beta) {
		return [fullWin, fullWin];
		}

	if (alpha && !beta) {
		return [fail, win];
		}

	if (!alpha && beta) {
		return [win, fail];
		}

	if (!alpha && !beta) {
		return [fullFail, fullFail];
		}	
}

function getBehavior(source, target) {
  if (source.behavior === "cooperator") {
    return true;
  }
  if (source.behavior === "cheater") {
    return false;
  }

  if (source.behavior === "copycat") {
    console.log("an innovator!")
    if (target.playbook.length >= 1) {
      lastMove = target.playbook[target.playbook.length-1];
      if (lastMove === false) {
        return false;
      }
      else {
        return true;
      }
    }
    else {// no moves played yet
      return true;
    }
  } 

  if (source.behavior === "clever") { 
// clever fox tries to cheat!
    if (target.playbook.length === 0) {
      //console.log("innovator defaults to cooperate on 1st round")
      return true;
    }
    if (target.playbook.length === 1) {
      //console.log("innovator defaults to cheat on 2nd round")
      return false;
    }

    if (target.playbook.length >= 2) {
      lastMove = target.playbook[target.playbook.length-1];
      penultimateMove = target.playbook[target.playbook.length-2];
      if ((lastMove === false) && (penultimateMove === false)) {
        return false;
      }
      if ((lastMove === true) && (penultimateMove === false)) {
        return true;
      }
      if ((lastMove === true) && (penultimateMove === true)) {
        return false;
      }
      if ((lastMove === false) && (penultimateMove === true)) {
        return true;
      }
    }
  } 
}

function mostDangerousGame() {
  var i = 0
  if (linkData.length > 10 ) {
    intervalDelay = 1000/linkData.length;
	}
  else {
	 var intervalDelay = 50;
  }
  
  var	intervalLoop = setInterval(function(){ game(i) }, intervalDelay);

  function game() {		
    if (i != 0 ) {
      radiusScale = getNodeSizeScale();
      gameBlinkTime = 500;

    	d3.select("body .wrapper #" + linkData[i-1].target.id)
    		.transition()
    		.duration(gameBlinkTime)
    		.style("fill", getNodeColor (linkData[i-1].target, nodeColorLevel))
    		.attr("r", getNodeSize(linkData[i-1].target));

    	//to-do add link interaction visual
    	d3.select("body .wrapper #" + linkData[i-1].source.id)
    		.transition()
    		.duration(gameBlinkTime)
    		.style("fill", getNodeColor (linkData[i-1].source, nodeColorLevel))
    		.attr("r", getNodeSize(linkData[i-1].source));
    }

    if (i >= linkData.length) {
		  clearInterval(intervalLoop)
		  return
    }	

  	d3.select("body .wrapper #" + linkData[i].target.id)
  		.style("fill", "white")

  	d3.select("body .wrapper #" + linkData[i].source.id)
  		.style("fill", "white")


    var targetBehavior = getBehavior(linkData[i].target, linkData[i].source);
    var sourceBehavior = getBehavior(linkData[i].source, linkData[i].target);

    //console.log("targetBehavior: " + targetBehavior)
    //console.log("sourceBehavior:" + sourceBehavior)
  	trialResult = trial(sourceBehavior, targetBehavior);


    linkData[i].source.playbook.push(sourceBehavior);
    linkData[i].target.playbook.push(targetBehavior);

    //console.log("linkData[i].source.playbook: " + linkData[i].source.playbook)
    //console.log("linkData[i].target.playbook: " + linkData[i].target.playbook)


  	linkData[i].source.value += trialResult[0]
  	linkData[i].target.value += trialResult[1]


    trialResult[0] = trialResult[0] * linkStrength;
    trialResult[1] = trialResult[1] * linkStrength;

  	if (linkData[i].strength + trialResult[0] <= 0 ) {
  		if (cullTheWeak) {
  			linkData.splice(i, 1);
  		}
  		else {
  			linkData[i].strength = 0;
  		}
  	}
    else if (linkData[i].strength + trialResult[0] > 1 ) {
  		linkData[i].strength = 1.0;
  	}
  	else {
  		linkData[i].strength += trialResult[0]
  	}

  	if (linkData[i].invStrength + trialResult[1] <= 0 ) {
  		linkData[i].invStrength = 0;
  	}
  	else if (linkData[i].invStrength + trialResult[1] > 1 ) {
  		linkData[i].invStrength = 1.0;
  	}
  	else {
  		linkData[i].invStrength += trialResult[1]; 			
  	}

  	i += 1;

    d3.select("body .wrapper .rightDiv")
      .selectAll("table")
      .remove();

    d3.select("body .wrapper .rightDiv")
      .selectAll("table")
      .remove();

    // these updates could be moved after looping for efficeny, but visually?
    tabulate(nodeData, ['label', 'behavior', 'value']);
    //linkTabulate(linkData, ['label', 'strength', 'invStrength']);
    updateSimulation();
  }  
}


function modeButtons() {
	var modeButtons = [ 'theory', 'unity','strategy']
	var modeButtonText = [ 'repeated trials in game theory', 'group cohesion and unity','strategies for decision cohesion']

	var buttonSvg = d3.select("body .wrapper .topRow")
		.append("svg")
		.attr("width", "100%")
		.attr("height", buttonBoxHeight)
		.attr('viewBox', '0, 0, ' + buttonBoxWidth + ', ' + buttonBoxHeight)
		.attr("overflow", "visible")

  rightDiv = d3.select("body .wrapper .rightDiv");

	var buttons = buttonSvg.append("g")
		.selectAll("g.modeButton")
		.data(modeButtons)
		.enter()
		.append("g")
		.attr("class", "alphaButtons")
    .attr("id", function(d) {return "button" + d;})
		.attr("opacity", buttonDefaultAlpha)
		.style("cursor", "pointer")
		.on("click", function(d, i) {

      modeStatus = i;
      if (modeStatus === 0) {
        rightDiv.selectAll("*")
          .remove();

        updateSimulation();
        narrativeProgress();
        gameButtons();
        payoffButtons();

        eventFire(document.getElementById('narrativeDot0'), 'click');

      }
      if (modeStatus === 1) {
        rightDiv.selectAll("*")
          .remove();
        
        rightDiv
          .append("h2")
          .style("text-align", "center")
          .style("postion", "relative")
          .style("transform", "translateX(-50%) translateY(60%)")
          .text(" Work in progress. Nothing here yet...")
        
        // for (var i=0; i < nodeData.length; i++) {
        //   d3.select("body .wrapper #" + nodeData[i].id)
        //     .transition().duration(blinkTime)
        //     .style("fill", "black")
        //   }

      }
      if (modeStatus === 2) {
        rightDiv.selectAll("*")
          .remove();
        
        rightDiv
          .append("h2")
          .style("text-align", "center")
          .style("postion", "relative")
          .style("transform", "translateX(-50%) translateY(60%)")
          .text(" Work in progress. Nothing here yet...")

        // for (var i=0; i < nodeData.length; i++) {
        //   d3.select("body .wrapper #" + nodeData[i].id)
        //     .transition().duration(blinkTime)
        //     .style("fill", "black")
        //   }
      }

    	d3.selectAll("g.alphaButtons")
				.attr("opacity", buttonDefaultAlpha)

			d3.select(this)
				.attr("opacity", buttonSelectedAlpha)
            
        })
    .on("mouseover", function(d,i) {
        	d3.select("#modeText" + i)
            	.style("opacity", buttonSelectedAlpha);
            if (d3.select(this).attr("opacity") != buttonSelectedAlpha) { 
                d3.select(this).attr("opacity", buttonHoverAlpha)}

        })
    .on("mouseout", function(d, i){
        	d3.select("#modeText" + i).style("opacity", 0)

            if (d3.select(this).attr("opacity") != buttonSelectedAlpha) { 
                d3.select(this).attr("opacity", buttonDefaultAlpha)}
        })
    .attr("opacity", function(d,i) { //setting inital opactiy when page is loaded
        	if (i == modeStatus) {return buttonSelectedAlpha}
           	else {return buttonDefaultAlpha}})

    buttons.append("text")
        .attr("class","buttonText")
        .attr("id", function(d, i) {return "modeText" + i;})
        .attr("x",function(d,i) {
            return 20 + (bWidth + bSpace)*i - modeButtonText[i].length*3;})
        .attr("y", bHeight + 8)
        //.attr("text-anchor", "bottom")
        .attr("dominant-baseline", "central")
        .attr("fill", fontColor)
        .style("opacity", 0)
        .text(function(d, i ) {return modeButtonText[i];});

    buttons.append("svg:image")
        .attr("x", function(d,i) {return x0 + (bWidth + bSpace)*i;})
        .attr("y", y0)
        .attr('width', bWidth)
        .attr('height', bHeight)
        .attr("xlink:href", function(i) {return "imgs/" + i + ".png";});
}


function payoffButtons() {
	var payoffButtons = ['up','down'];
	var payoffButtonsText = ['increase','decrease'];

	var payoffButtonsSvg = d3.select("body .wrapper .rightDiv #rules")
		.append("svg")
		.attr("width", "100%")
		.attr("height", buttonBoxHeight)
		.attr('viewBox', '0, 0, ' + buttonBoxWidth + ', ' + buttonBoxHeight)
		.attr("overflow", "visible");


	var delta = .1

	var payoffButtons = payoffButtonsSvg.append("g")
		.selectAll("g.payoffButtons")
		.data(payoffButtons)
		.enter()
		.append("g")
		.attr("class", "payoffButtons")
		.attr("opacity", buttonDefaultAlpha)
		.style("cursor", "pointer")
		.on("click", function(d, i) {
			d3.select(this)
				.transition()
				.duration(500)
				.attr("opacity", buttonSelectedAlpha)
				.transition()
				.duration(500)
				.attr("opacity", buttonDefaultAlpha)
				if (i == 0) {
             	if (baseData.links[0].strength + delta < 1) {
             		baseData.links[0].strength += delta
             	}
             	else {	
             		baseData.links[0].strength = 1
             	}
             	updateSimulation()
             	}
				if (i == 1 ) {              	
				
             	if (baseData.links[0].strength - delta > 0) {
             		baseData.links[0].strength -= delta
             	}
             	else {	
             		baseData.links[0].strength = 0
             	}
             	updateSimulation()
             }
            
        })
        .on("mouseover", function(d,i) {
        	d3.select(this).attr("opacity", buttonHoverAlpha)
        })
        .on("mouseout", function(){
        	d3.select(this).attr("opacity", buttonDefaultAlpha)
        })

    payoffButtons.append("svg:image")
        .attr("x", function(d,i) {return x0 + (bWidth + bSpace)*i;})
        .attr("y", y0)
        .attr('width', bWidth)
        .attr('height', bHeight)
        .attr("xlink:href", function(i) {return "imgs/" + i + ".png";});
}

function gameButtons() {
	var gameButtons = ['gogear', 'reset'];
	var gameButtonsText = ['run', 'reset'];

	var gameButtonsSvg = d3.select("body .wrapper .rightDiv")
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
        mostDangerousGame()
      }
      if (i === 1) {	//do reset animation and data update
		    for (var i=0; i < nodeData.length; i++) {
				  d3.select("body .wrapper #" + nodeData[i].id)
						//.transition().duration(blinkTime)
						.style("fill", "black")
						.transition().duration(blinkTime)
						.style("fill", getNodeColor (nodeData[i], nodeColorLevel))
          nodeData[i].value = 0
          }
                  	
        d3.select("body .wrapper .rightDiv")
          .selectAll("table")
          .remove();

        d3.select("body .wrapper .rightDiv")
          .selectAll("table")
          .remove();

        tabulate(nodeData, ['label', 'behavior', 'value']);
        //linkTabulate(baseData.links, ['label', 'strength', 'invStrength']);
		    updateSimulation();
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

  var toolTipButtons = ["dog", "snake", "cat", "fox", "elephant", "monkey"];
  var toolTipText = ["cooperator", "cheater", "copycat", "clever", "wise", "random"];
  var toolTipHeight = 150;
  var toolTipWidth = 285;

  d3.select("body .wrapper .leftDiv .tooltip").remove();

  //to-do make the nodebox scale with chartSvg element better
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

      rightDiv.selectAll("table")
        .remove();
      tabulate(nodeData, ['label', 'behavior', 'value']);

      nodeBoxSvg.transition().duration(2*blinkTime)
      .remove();  

      d3.select("body .wrapper .leftDiv .tooltip").transition().duration(2*blinkTime)
      .remove();

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
    .attr("xlink:href", function(d) {return "imgs/animals/" + d + ".png";});

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

narrativeStatus = 0;

function narrativeProgress() {

  var dots = [0, 1, 2];
  
  var rightDiv = d3.select("body .wrapper .rightDiv");

  function clearNarrative() {
    rightDiv.selectAll("p")
          .remove();
        rightDiv.selectAll("table")
          .remove();
        rightDiv.selectAll("ul")
          .remove();
  }

  var narrativeDots =      d3.select("body .wrapper .rightDiv").append("svg")
    .attr("width", "100%")
    .attr("height", buttonBoxHeight*.7)
    .attr('viewBox', '0, 0, ' + buttonBoxWidth + ', ' + buttonBoxHeight);
  narrativeDots.selectAll("circle")
    .data(dots)
    .enter().append("circle")
    .attr("id", function (d) {return "narrativeDot" + d;})
    .attr("r", "12")
    .style("fill", textColor)
    .style("fill-opacity", function (d) {
      if ( d === narrativeStatus ) {
        return buttonSelectedAlpha;}
      else { return 0;}
    })
    .style("stroke", textColor)
    .style("stroke-width", linkWidth)
    .attr("cx", function(d, i) { return i * 100 + 30; })
    .attr("cy", 30)
    .style("cursor", "pointer")
    .on("mouseover", function () {
      d3.select(this).style("fill-opacity", buttonSelectedAlpha)
    })
    .on("mouseout", function(d) {
      if ( d != narrativeStatus ) {
        d3.select(this).transition().duration(blinkTime).style("fill-opacity", 0)
        }
    })
    .on("click", function (d) {
      narrativeStatus = d;
      narrativeDots.selectAll("circle").style("fill-opacity", 0);
      d3.select(this).transition().duration(blinkTime).style("fill-opacity", buttonSelectedAlpha);
      clearNarrative();

      if (narrativeStatus === 0) {
        
        rightDiv
          .append("p")
          .text("Game theory is the science of logical decision making in the face of uncertainty.  " +
            "A classic problem in game theory is the prisonner's dillema.  " +
            "Two agents face off with a decision to cooperate or cheat with the other.  " +
            "The payoff for a given agent's behavior depends upon the other agent's behavior: "
            )
        rightDiv.append("ul");
        rightDiv.select("ul").append("li").text("If an agent cooperates and the other agent cheats, the first agent loses (-1) and other wins big (3).")
        rightDiv.select("ul").append("li").text("If an agent cooperates and the other agent cooperates too, then both win (2).")
        rightDiv.select("ul").append("li").text("If an agent cheats and the other agent cooperates, then the first agent wins big (3) and other loses (-1).")
        rightDiv.select("ul").append("li").text("If an agent cheats and the other agent cheats too, then they all break even (0).")
        rightDiv
          .append("p")
          .text("Play the game by hitting the rotating gear icon...")
        
      }

      if (narrativeStatus === 1) {  
        rightDiv
          .append("p")
          .text("Our two agents are cooperating and winning together.  " + 
            "But what happens if we change their behavior?  Click an agent to change its behavior and try the game again...")

      }

      if (narrativeStatus === 2) {  
        baseData = baseData0;
        nodeData = [...baseData.nodes];
        linkData = [...baseData.links];
        //updateData();
        //resetData();
        updateSimulation();

        rightDiv.append("p")
          .text("Nothing here yet. Work in progress...")
      }
  })
}

function tabulate(data, columns) {
	var table = d3.select("body .wrapper .rightDiv")
  	.append('table')

	var tableHead = table.append('thead')
	var	tableBody = table.append('tbody');

  tableHead.append('tr')
		.selectAll('th')
		.data(columns).enter()
		.append('th')
		.text(function (column) { return column; });

	var rows = tableBody.selectAll('tr')
		.data(data)
		.enter()
		.append('tr');

  sform = d3.format(".4n")
	var cells = rows.selectAll('td')
		.data(function (row) {
		  return columns.map(function (column) {
		    return {column: column, value: row[column]};
		  });
		})
		.enter()
		.append('td')
		.text(function (d,i ) {
      if ( i === 2) {
        return sform(d.value);
      } 
      else {
        return d.value;
      }
    });

	return table;
}

function linkTabulate(data, columns) {

  var table = d3.select("body .wrapper .rightDiv")
  	.append('table')

	var tableHead = table.append('thead')
	var	tableBody = table.append('tbody');

  tableHead.append('tr')
		.selectAll('th')
		.data(columns).enter()
		.append('th')
		.text(function (column) { return column; });

	var rows = tableBody.selectAll('tr')
		.data(data)
		.enter()
		.append('tr');

  sform = d3.format(".4n")  

  var cells = rows.selectAll('td')
    .data(function (row) {
		  return columns.map(function (column) {
		    if (column === "label") {
		      return {column: column, value: row.source[column] + "-" + row.target[column] }
		  	}
		  	else {
		  		return {column: column, value: row[column]}
		  	}
		  });
		})
    .enter()
		.append('td')
		.text(function (d, i) { 
      if ( i === 1 || i === 2) {
        return sform(d.value);
      } 
    else {
      return d.value;
      }
    })
	
  return table;
}

modeButtons();

eventFire(document.getElementById('buttontheory'), 'click');
eventFire(document.getElementById('narrativeDot0'), 'click');

