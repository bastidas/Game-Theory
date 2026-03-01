// UI interaction and modification functions
import * as d3 from 'd3';
import { graph, updateGraph, updateLinks, getNeighbors, graphChangeTime } from './graph.js';
import { mostDangerousGame } from './gameTheory.js';
import { config, animalBehaviors, nodeColors, nodeColorLevel, strokeColorLevel, deepClone } from './config.js';

export function animateAndUpdate(cfg, graphElement, rootElement) {
  const nodeData = cfg.data.nodes;
  const linkData = cfg.data.links;
  let interval = 0;
  const intervalDelay = linkData.length > 10 ? 1500 / linkData.length : 150;

  const intervalLoop = setInterval(intervalAnimation, intervalDelay);

  function intervalAnimation() {
    if (interval !== 0) {
      const node = nodeData[interval - 1];
      // Safety check: ensure node and group are valid before accessing nodeColors
      // Skip center nodes (which have group: "center" as a string)
      if (node && node.group !== "center" && typeof node.group === 'number' && nodeColors[node.group]) {
        d3.select("#" + node.id)
          .transition().duration(intervalDelay)
          .style("fill", nodeColors[node.group][nodeColorLevel]);
      }
    }

    if (interval >= nodeData.length) {
      clearInterval(intervalLoop);
      // Update graph after animation to make winners grow and losers shrink
      if (cfg.graphState) {
        const { node, nodeImages, link, simulation } = cfg.graphState;
        const result = updateGraph(
          cfg,
          node,
          nodeImages,
          link,
          simulation,
          cfg.data.nodes,
          cfg.data.links,
          animalBehaviors,
          nodeColors,
          nodeColorLevel,
          strokeColorLevel,
          config.chartWidth,
          config.chartHeight
        );
        // Update stored references
        cfg.graphState.node = result.node;
        cfg.graphState.nodeImages = result.nodeImages;
      }
      
      // Update tables after animation completes
      if (rootElement && cfg.tabulations && cfg.tabulations.length > 0) {
        d3.select(rootElement + " #players").selectAll("table").remove();
        d3.select(rootElement + " #links").selectAll("table").remove();
        // Use the actual node data that was updated by the simulation
        const displayNodes = cfg.graphState ? cfg.graphState.nodeData.filter(n => n.id !== "center") : nodeData;
        const displayLinks = cfg.graphState ? cfg.graphState.linkData : linkData;
        tabulate(rootElement + " #players", displayNodes, cfg.tabulations);
        tabulate(rootElement + " #links", displayLinks, ["source", "target", "strength"]);
      }
    } else {
      d3.select("#" + nodeData[interval].id)
        .style("fill", "white");
    }
    interval += 1;
  }
}

export function gameButtons(rootElement, graphElement, cfg) {
  const gameButtonsData = ['run_filled', 'reset'];
  const { buttonBoxWidth, buttonBoxHeight, bWidth, bHeight, bSpace, blinkTime } = config;

  const gameButtonsSvg = d3.select(rootElement)
    .append("svg")
    .attr("width", "100%")
    .attr("height", buttonBoxHeight)
    .attr('viewBox', `0 0 ${buttonBoxWidth} ${0.8 * buttonBoxHeight}`)
    .attr("overflow", "visible");

  // Detect if device supports hover (non-touch device)
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  
  let angle = 0;
  let gameMouse = false;
  let mouseOverLoop;

  const gameButtonsBox = gameButtonsSvg.append("g")
    .selectAll("g.gameButtons")
    .data(gameButtonsData)
    .enter()
    .append("g")
    .attr("class", "gameButtons")
    .style("cursor", "pointer")
    .on("click", function(event, d, i) {
      const index = gameButtonsData.indexOf(d);
      
      d3.select(this)
        .style("opacity", 0.5)
        .transition().duration(blinkTime)
        .style("opacity", 1.0);

      if (index === 0) { // Run simulation
        let nTrials = 1;
        // Use the actual nodeData and linkData from the graph state
        // because D3 has converted string IDs to object references
        let nodeData = cfg.graphState ? cfg.graphState.nodeData : cfg.data.nodes;
        let linkData = cfg.graphState ? cfg.graphState.linkData : cfg.data.links;
        
        for (let q = 0; q < nTrials; q++) {
          const result = mostDangerousGame(
            rootElement,
            graphElement,
            cfg,
            nodeData,
            linkData,
            (node) => getNeighbors(node, linkData),
            () => {} // updateLinks placeholder
          );
          nodeData = result.nodeData;
          linkData = result.linkData;
        }
        
        // Update both the graph state and cfg data
        if (cfg.graphState) {
          cfg.graphState.nodeData = nodeData;
          cfg.graphState.linkData = linkData;
        }
        cfg.data.nodes = nodeData;
        cfg.data.links = linkData;
        
        animateAndUpdate(cfg, graphElement, rootElement);
      }

      if (index === 1) { // Reset
        cfg.data = deepClone(cfg.baseData);
        const nodeData = cfg.data.nodes;
        const linkData = cfg.data.links;
        
        // Animate reset
        for (let i = 0; i < cfg.data.nodes.length; i++) {
          d3.select("#" + cfg.data.nodes[i].id)
            .style("fill", "black");
        }

        // Redraw graph
        const graphResult = graph(
          graphElement,
          cfg,
          animalBehaviors,
          nodeColors,
          nodeColorLevel,
          strokeColorLevel,
          config.chartWidth,
          config.chartHeight,
          blinkTime
        );
        
        // Update graphState with new references
        cfg.graphState = graphResult;

        // Update tables if they exist
        d3.select(rootElement + " #players").selectAll("table").remove();
        d3.select(rootElement + " #links").selectAll("table").remove();
        
        if (cfg.tabulations && cfg.tabulations.length > 0) {
          const displayNodes = graphResult.nodeData.filter(n => n.id !== "center");
          tabulate(rootElement + " #players", displayNodes, cfg.tabulations);
          tabulate(rootElement + " #links", graphResult.linkData, ["source", "target", "strength"]);
        }
      }
    })
    .on("mouseover", function(event, d, i) {
      // Only apply hover effects on desktop devices
      if (!isDesktop) return;
      
      const index = gameButtonsData.indexOf(d);
      const img = d3.select(this).select("image");
      clearInterval(mouseOverLoop);
      
      if (d === 'run_filled') {
        // Use animated gif for run button on hover
        img.attr("xlink:href", "imgs/gif/run_play.gif");
      } else if (d === 'reset') {
        // Rotate reset icon on hover
        gameMouse = true;
        const xOffset = 0 + (bWidth + bSpace) * index + bWidth / 2;
        mouseOverLoop = setInterval(() => {
          angle += 3;
          if (!gameMouse) {
            clearInterval(mouseOverLoop);
          } else {
            const rotateString = `rotate(${angle} ${xOffset} ${bHeight / 2})`;
            img.attr("transform", rotateString);
          }
        }, 50);
      }
    })
    .on("mouseout", function(event, d) {
      // Only apply hover effects on desktop devices
      if (!isDesktop) return;
      
      gameMouse = false;
      const img = d3.select(this).select("image");
      
      if (d === 'run_filled') {
        // Return to static icon
        img.attr("xlink:href", "imgs/icons/run_filled.png");
      } else if (d === 'reset') {
        // Stop rotation and reset
        img.attr("xlink:href", "imgs/icons/reset.png")
           .attr("transform", "rotate(0)");
      }
    });

  gameButtonsBox.append("svg:image")
    .attr("x", (d, i) => 0 + (bWidth + bSpace) * i)
    .attr("y", 0)
    .attr('width', 1.0 * bWidth)
    .attr('height', 1.0 * bHeight)
    .attr("xlink:href", (d) => `imgs/icons/${d}.png`);
}

// Helper to convert node ID to friendly display name
function getDisplayName(id, behavior) {
  // Extract the behavior type from the ID (e.g., "cooperator0" -> "cooperator")
  const match = id.match(/^([a-zA-Z]+)(\d+)$/);
  if (match) {
    const behaviorType = match[1];
    const index = parseInt(match[2]) + 1; // Convert 0-based to 1-based
    const animalName = animalBehaviors[behaviorType] || behaviorType;
    return animalName + index;
  }
  return id;
}

export function tabulate(element, data, columns) {
  if (!data || data.length === 0 || !columns || columns.length === 0) {
    return;
  }

  const table = d3.select(element)
    .append("table")
    .attr("class", "tabulateTable");

  const thead = table.append("thead");
  const tbody = table.append("tbody");

  // Header row
  thead.append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text((column) => column);

  // Data rows
  const rows = tbody.selectAll("tr")
    .data(data)
    .enter()
    .append("tr");

  rows.selectAll("td")
    .data((row) => {
      return columns.map((column) => {
        let value = row[column];
        // Handle nested properties (for source/target)
        if (typeof value === 'object' && value !== null) {
          value = value.id || value.label || JSON.stringify(value);
        }
        // Format the id column specially
        if (column === 'id' && typeof value === 'string') {
          value = getDisplayName(value, row.behavior);
        }
        // Format value numbers as integers
        if (column === 'value' && typeof value === 'number') {
          value = Math.round(value);
        }
        // Format other numbers with decimals
        else if (typeof value === 'number') {
          value = value.toFixed(2);
        }
        return { column, value };
      });
    })
    .enter()
    .append("td")
    .text((d) => d.value);

  return table;
}

// Helper function to create payoff adjustment buttons
function createPayoffButton(container, direction, onClick) {
  // Detect if device supports hover
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  
  const button = container.append("img")
    .attr("src", `imgs/icons/${direction}.png`)
    .attr("class", `payoff-button payoff-button-${direction}`)
    .attr("width", "24")
    .attr("height", "24")
    .style("cursor", "pointer")
    .on("click", function(event) {
      // Add active/pressed state with grow effect
      const btn = d3.select(this);
      btn.attr("src", `imgs/icons/${direction}_filled.png`)
         .classed("payoff-button-active", true);
      
      // Execute callback
      onClick.call(this, event);
      
      // Remove active state after animation
      setTimeout(() => {
        btn.classed("payoff-button-active", false);
        // Return to base if not hovering (desktop) or no hover support (mobile)
        if (!isDesktop || !btn.node().matches(':hover')) {
          btn.attr("src", `imgs/icons/${direction}.png`);
        }
      }, 200);
    })
    .on("mouseover", function() {
      // Only apply hover on desktop
      if (!isDesktop) return;
      d3.select(this).attr("src", `imgs/icons/${direction}_filled.png`);
    })
    .on("mouseout", function() {
      // Only apply hover on desktop
      if (!isDesktop) return;
      const btn = d3.select(this);
      // Don't change if actively being clicked
      if (!btn.classed("payoff-button-active")) {
        btn.attr("src", `imgs/icons/${direction}.png`);
      }
    });
  return button;
}

export function payoffTable(element, cfg, enableButtons = true) {
  const payoff = cfg.payoffNormalForm;
  
  d3.select(element).append("h3").text("Payoff Matrix");
  
  const table = d3.select(element).append("table")
    .attr("class", "payoff-table")
    .style("width", "95%");
  
  // Header row 1 - Player 1 label
  const tr0 = table.append("tr");
  tr0.append("td").attr("colspan", 2).attr("width", "10%");
  tr0.append("td")
    .attr("colspan", 2)
    .attr("width", "90%")
    .attr("class", "tableLabel player1")
    .text("Player 1");
  
  // Header row 2 - Column labels
  const tr1 = table.append("tr");
  tr1.append("td").attr("colspan", 2);
  tr1.append("td").attr("class", "tableLabel player1").text("cooperate");
  tr1.append("td").attr("class", "tableLabel player1").text("betray");
  
  // Data rows
  const rowLabels = ["cooperate", "betray"];
  
  // Row 1: Cooperate
  const tr2 = table.append("tr");
  tr2.append("td")
    .attr("rowspan", 2)
    .text("Player 2")
    .attr("class", "tableLabel rotateText player2");
  tr2.append("td")
    .text("cooperate")
    .attr("class", "tableLabel rotateText player2");
  
  // Cell [0,0] - Both cooperate
  const cell00 = tr2.append("td")
    .attr("class", "tableDat")
    .attr("id", "tableTT");
  const div00 = cell00.append("div").attr("class", "center");
  
  if (enableButtons) {
    createPayoffButton(div00, "up", function() {
      cfg.payoffNormalForm[0][0][0] += 1;
      cfg.payoffNormalForm[0][0][1] += 1;
      updatePayoffDisplay();
    });
  }
  
  div00.append("br").style("line-height", "0px");
  div00.append("div").attr("class", "player2 payoff-val-00-0").text(payoff[0][0][0]);
  div00.append("div").style("display", "inline-block").html(",&nbsp;");
  div00.append("div").attr("class", "player1 payoff-val-00-1").text(payoff[0][0][1]);
  div00.append("br").style("line-height", "0px");
  
  if (enableButtons) {
    createPayoffButton(div00, "down", function() {
      cfg.payoffNormalForm[0][0][0] -= 1;
      cfg.payoffNormalForm[0][0][1] -= 1;
      updatePayoffDisplay();
    });
  }
  
  // Cell [0,1] - Player 1 cooperates, Player 2 betrays
  const cell01 = tr2.append("td")
    .attr("class", "tableDat")
    .attr("id", "tableTF");
  const div01 = cell01.append("div").attr("class", "center");
  
  if (enableButtons) {
    const upContainer01 = div01.append("div").style("display", "inline-block");
    createPayoffButton(upContainer01, "up", function() {
      cfg.payoffNormalForm[0][1][0] += 1;
      cfg.payoffNormalForm[1][0][1] += 1;
      updatePayoffDisplay();
    });
    upContainer01.append("span").html("&nbsp;");
    createPayoffButton(upContainer01, "up", function() {
      cfg.payoffNormalForm[0][1][1] += 1;
      cfg.payoffNormalForm[1][0][0] += 1;
      updatePayoffDisplay();
    });
  }
  
  div01.append("br").style("line-height", "0px");
  div01.append("div").attr("class", "player2 payoff-val-01-0").text(payoff[0][1][0]);
  div01.append("div").style("display", "inline-block").html(",&nbsp;");
  div01.append("div").attr("class", "player1 payoff-val-01-1").text(payoff[0][1][1]);
  div01.append("br").style("line-height", "0px");
  
  if (enableButtons) {
    const downContainer01 = div01.append("div").style("display", "inline-block");
    createPayoffButton(downContainer01, "down", function() {
      cfg.payoffNormalForm[0][1][0] -= 1;
      cfg.payoffNormalForm[1][0][1] -= 1;
      updatePayoffDisplay();
    });
    downContainer01.append("span").html("&nbsp;");
    createPayoffButton(downContainer01, "down", function() {
      cfg.payoffNormalForm[0][1][1] -= 1;
      cfg.payoffNormalForm[1][0][0] -= 1;
      updatePayoffDisplay();
    });
  }
  
  // Row 2: Betray
  const tr3 = table.append("tr");
  tr3.append("td")
    .attr("class", "tableLabel rotateText player2")
    .text("betray")
    .style("padding", "0px");
  
  // Cell [1,0] - Player 1 betrays, Player 2 cooperates
  const cell10 = tr3.append("td")
    .attr("class", "tableDat")
    .attr("id", "tableFT");
  const div10 = cell10.append("div").attr("class", "center");
  
  if (enableButtons) {
    const upContainer10 = div10.append("div").style("display", "inline-block");
    createPayoffButton(upContainer10, "up", function() {
      cfg.payoffNormalForm[1][0][0] += 1;
      cfg.payoffNormalForm[0][1][1] += 1;
      updatePayoffDisplay();
    });
    upContainer10.append("span").html("&nbsp;");
    createPayoffButton(upContainer10, "up", function() {
      cfg.payoffNormalForm[1][0][1] += 1;
      cfg.payoffNormalForm[0][1][0] += 1;
      updatePayoffDisplay();
    });
  }
  
  div10.append("br").style("line-height", "0px");
  div10.append("div").attr("class", "player2 payoff-val-10-0").text(payoff[1][0][0]);
  div10.append("div").style("display", "inline-block").html(",&nbsp;");
  div10.append("div").attr("class", "player1 payoff-val-10-1").text(payoff[1][0][1]);
  div10.append("br").style("line-height", "0px");
  
  if (enableButtons) {
    const downContainer10 = div10.append("div").style("display", "inline-block");
    createPayoffButton(downContainer10, "down", function() {
      cfg.payoffNormalForm[1][0][0] -= 1;
      cfg.payoffNormalForm[0][1][1] -= 1;
      updatePayoffDisplay();
    });
    downContainer10.append("span").html("&nbsp;");
    createPayoffButton(downContainer10, "down", function() {
      cfg.payoffNormalForm[1][0][1] -= 1;
      cfg.payoffNormalForm[0][1][0] -= 1;
      updatePayoffDisplay();
    });
  }
  
  // Cell [1,1] - Both betray
  const cell11 = tr3.append("td")
    .attr("class", "tableDat")
    .attr("id", "tableFF");
  const div11 = cell11.append("div").attr("class", "center");
  
  if (enableButtons) {
    createPayoffButton(div11, "up", function() {
      cfg.payoffNormalForm[1][1][0] += 1;
      cfg.payoffNormalForm[1][1][1] += 1;
      updatePayoffDisplay();
    });
  }
  
  div11.append("br").style("line-height", "0px");
  div11.append("div").attr("class", "player2 payoff-val-11-0").text(payoff[1][1][0]);
  div11.append("div").style("display", "inline-block").html(",&nbsp;");
  div11.append("div").attr("class", "player1 payoff-val-11-1").text(payoff[1][1][1]);
  div11.append("br").style("line-height", "0px");
  
  if (enableButtons) {
    createPayoffButton(div11, "down", function() {
      cfg.payoffNormalForm[1][1][0] -= 1;
      cfg.payoffNormalForm[1][1][1] -= 1;
      updatePayoffDisplay();
    });
  }
  
  // Function to update all payoff displays
  function updatePayoffDisplay() {
    d3.select(element + " .payoff-val-00-0").text(cfg.payoffNormalForm[0][0][0]);
    d3.select(element + " .payoff-val-00-1").text(cfg.payoffNormalForm[0][0][1]);
    d3.select(element + " .payoff-val-01-0").text(cfg.payoffNormalForm[0][1][0]);
    d3.select(element + " .payoff-val-01-1").text(cfg.payoffNormalForm[0][1][1]);
    d3.select(element + " .payoff-val-10-0").text(cfg.payoffNormalForm[1][0][0]);
    d3.select(element + " .payoff-val-10-1").text(cfg.payoffNormalForm[1][0][1]);
    d3.select(element + " .payoff-val-11-0").text(cfg.payoffNormalForm[1][1][0]);
    d3.select(element + " .payoff-val-11-1").text(cfg.payoffNormalForm[1][1][1]);
  }
}

export function normalFormTable(element, cfg) {
  payoffTable(element, cfg, false); // Call payoffTable with buttons disabled
}

export function gameTabs(element, cfg) {
  const tabs = ['players', 'links', 'payoff'];
  
  const tabDiv = d3.select(element)
    .append("div")
    .attr("class", "tab");

  tabs.forEach((tab) => {
    tabDiv.append("button")
      .attr("class", "tablinks")
      .text(tab.charAt(0).toUpperCase() + tab.slice(1))
      .on("click", function(event) {
        // Hide all tab content
        d3.selectAll(".tabcontent").style("display", "none");
        // Show selected tab
        d3.select(`#${tab}`).style("display", "block");
        
        // Update button styles
        d3.selectAll(".tablinks").classed("active", false);
        d3.select(this).classed("active", true);
      });
  });

  // Create tab content containers
  tabs.forEach((tab) => {
    d3.select(element)
      .append("div")
      .attr("id", tab)
      .attr("class", "tabcontent")
      .style("display", tab === 'players' ? "block" : "none");
  });

  // Initialize with players data if available
  if (cfg.tabulations && cfg.tabulations.length > 0) {
    // Use graphState data if available (after graph initialization)
    const displayNodes = cfg.graphState ? cfg.graphState.nodeData.filter(n => n.id !== "center") : cfg.data.nodes;
    const displayLinks = cfg.graphState ? cfg.graphState.linkData : cfg.data.links;
    tabulate(element + " #players", displayNodes, cfg.tabulations);
    tabulate(element + " #links", displayLinks, ["source", "target", "strength"]);
  }
}

export function nodeBehaviorButtons(node, event) {
  // Popup menu to change a node's behavior
  const charBWidth = 35;
  const charBHeight = 35;
  const charX0 = 15;
  const charBSpace = 55;
  const toolTipHeight = 105;
  const toolTipWidth = 250;
  const hoverBoxExtra = 80;
  const toolTipButtons = ["dog", "snake", "cat", "fox", "owl", "chimpanzee"];
  const toolTipText = ["cooperator", "cheater", "copycat", "clever", "wise", "random"];
  const behaviorDescriptions = {
    "dog": "The simple dog always cooperates.",
    "snake": "The cheater snake always cheats.",
    "cat": "The copycat starts by cooperating, and each round thereafter does what opponent did in the previous round.",
    "fox": "The clever fox tries to trick copycats.",
    "owl": "The owl learns about each opponent and plays wisely.",
    "chimpanzee": "The monkey plays randomly."
  };

  d3.select(".tooltip").remove();

  const nodeBox = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("width", (hoverBoxExtra + toolTipWidth) + "px")
    .style("height", (hoverBoxExtra + toolTipHeight) + "px")
    .style("left", (event.pageX - hoverBoxExtra / 2) + "px")
    .style("top", (event.pageY + 10 - hoverBoxExtra / 2) + "px");

  nodeBox.node().addEventListener('mouseleave', () => {
    d3.select(".tooltip").remove();
  });

  const nodeBoxSvg = nodeBox
    .append("svg")
    .style("display", "block")
    .style("margin", "auto")
    .style("margin-top", (hoverBoxExtra / 2) + "px")
    .style("background-color", "#E9E9E9")
    .style("border", "3px solid #ccc")
    .attr("width", toolTipWidth)
    .attr("height", toolTipHeight)
    .attr("overflow", "visible")
    .attr('viewBox', `0 0 ${toolTipWidth} ${toolTipHeight}`);

  nodeBoxSvg.append("text")
    .attr("y", toolTipHeight + 20)
    .attr("class", "behaviorInfo");

  const nodeButtons = nodeBoxSvg.append("g")
    .selectAll("g.toolTipButtons")
    .data(toolTipButtons)
    .enter()
    .append("g")
    .attr("class", "toolTipButtons")
    .style("cursor", "pointer")
    .on("click", function(event, d, i) {
      const index = toolTipButtons.indexOf(d);
      
      d3.select(this)
        .style("opacity", 0.5)
        .transition().duration(config.blinkTime)
        .style("opacity", 1.0);

      d3.select("#i" + node.id)
        .attr("xlink:href", "imgs/animals_flat/" + d + ".png");

      node.behavior = toolTipText[index];
      d3.select(".tooltip").remove();
    })
    .on("mouseover", function(event, d) {
      const index = toolTipButtons.indexOf(d);
      d3.select("#nodeText" + index).style("opacity", 1.0);
      d3.select("#nodeButtonImage" + index)
        .attr("xlink:href", "imgs/animals_line/" + d + ".png");
      d3.select(".behaviorInfo").text(behaviorDescriptions[d] || "");
    })
    .on("mouseout", function(event, d) {
      const index = toolTipButtons.indexOf(d);
      d3.select(".behaviorInfo").text("");
      d3.select("#nodeButtonImage" + index)
        .attr("xlink:href", "imgs/animals_flat/" + d + ".png");
      d3.select("#nodeText" + index).style("opacity", 0);
    });

  nodeButtons.append("svg:image")
    .attr("x", (d, i) => {
      return i < 3 ? charX0 + (charBWidth + charBSpace) * i : charX0 + (charBWidth + charBSpace) * (i - 3);
    })
    .attr("y", (d, i) => {
      return i < 3 ? 5 : charBHeight + 20;
    })
    .attr('width', charBWidth)
    .attr('height', charBHeight)
    .attr("xlink:href", (d) => "imgs/animals_flat/" + d + ".png")
    .attr("id", (d, i) => "nodeButtonImage" + i);

  nodeButtons.append("text")
    .attr("class", "nodeButtonText")
    .attr("id", (d, i) => "nodeText" + i)
    .attr("x", (d, i) => {
      const baseX = i < 3 ? 
        charX0 + 20 + (charBWidth + charBSpace) * i : 
        charX0 + 20 + (charBWidth + charBSpace) * (i - 3);
      return baseX - toolTipText[i].length * 3;
    })
    .attr("y", (d, i) => {
      return i < 3 ? charBHeight + 10 : 2 * charBHeight + 25;
    })
    .attr("dominant-baseline", "central")
    .attr("fill", config.fontColor)
    .style("opacity", 0)
    .text((d, i) => toolTipText[i]);
}

export function craneAndWolfButtons(rootElement, graphElement, cfg) {
  const gameButtonsData = ['right', 'dislike'];
  const gameButtonsText = ['cooperate', 'betray'];
  const { buttonBoxWidth, buttonBoxHeight, bWidth, bHeight, bSpace, blinkTime } = config;

  // Detect if device supports hover
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const gameButtonsSvg = d3.select(rootElement)
    .append("svg")
    .attr("width", "100%")
    .attr("height", buttonBoxHeight)
    .attr('viewBox', `0 0 ${buttonBoxWidth} ${0.8 * buttonBoxHeight}`)
    .attr("overflow", "visible");

  const chooseButtons = gameButtonsSvg.append("g")
    .selectAll("g.gameButtons")
    .data(gameButtonsData)
    .enter()
    .append("g")
    .attr("class", "gameButtons crane-wolf-button")
    .style("cursor", "pointer")
    .on("click", function(event, d) {
      d3.select(rootElement).select("div").style("display", "inline-block");

      const btn = d3.select(this);
      const img = btn.select("image");
      
      // Active state with grow effect
      btn.classed("button-active", true)
         .style("opacity", 0.5)
         .transition().duration(blinkTime)
         .style("opacity", 1.0);
      
      img.attr("xlink:href", `imgs/icons/${d}_filled.png`);

      // Run game simulation
      let nodeData = cfg.data.nodes;
      let linkData = cfg.data.links;
      
      const result = mostDangerousGame(
        rootElement,
        graphElement,
        cfg,
        nodeData,
        linkData,
        (node) => getNeighbors(node, linkData),
        () => {}
      );
      
      cfg.data.nodes = result.nodeData;
      cfg.data.links = result.linkData;
      
      animateAndUpdate(cfg, graphElement);
      
      // Remove active state after animation
      setTimeout(() => {
        btn.classed("button-active", false);
        // Return to base if not hovering
        if (!isDesktop || !btn.node().matches(':hover')) {
          img.attr("xlink:href", `imgs/icons/${d}.png`);
        }
      }, 250);
    })
    .on("mouseover", function(event, d) {
      // Only apply hover on desktop
      if (!isDesktop) return;
      const btn = d3.select(this);
      if (!btn.classed("button-active")) {
        btn.select("image")
           .attr("xlink:href", `imgs/icons/${d}_filled.png`);
      }
    })
    .on("mouseout", function(event, d) {
      // Only apply hover on desktop
      if (!isDesktop) return;
      const btn = d3.select(this);
      if (!btn.classed("button-active")) {
        btn.select("image")
           .attr("xlink:href", `imgs/icons/${d}.png`);
      }
    });

  chooseButtons.append("svg:image")
    .attr("x", (d, i) => 0 + (bWidth + bSpace) * i)
    .attr("y", 0)
    .attr('width', 1.0 * bWidth)
    .attr('height', 1.0 * bHeight)
    .attr("xlink:href", (d) => `imgs/icons/${d}.png`);
}

