// Game Theory simulation logic
// Handles different behavioral strategies and their interactions

/**
 * Run a trial between two players based on their behaviors
 * @param {boolean} alpha - First player's move (cooperate=true, cheat=false)
 * @param {boolean} beta - Second player's move (cooperate=true, cheat=false)
 * @param {Object} cfg - Configuration with payoff matrix
 * @returns {Array} Payoff for both players [alphaPayoff, betaPayoff]
 */
export function trial(alpha, beta, cfg) {
  // Payoff matrix mapping:
  // TT (both cooperate) | FT (alpha cheats, beta cooperates)
  // TF (alpha cooperates, beta cheats) | FF (both cheat)
  
  if (alpha && beta) {
    return cfg.payoffNormalForm[0][0];
  }
  if (alpha && !beta) {
    return cfg.payoffNormalForm[0][1];
  }
  if (!alpha && beta) {
    return cfg.payoffNormalForm[1][0];
  }
  if (!alpha && !beta) {
    return cfg.payoffNormalForm[1][1];
  } 
}

/**
 * Determine behavior strategy for a player based on their type
 * @param {Object} source - Source player node
 * @param {Array} alphaPlaybook - Source player's move history
 * @param {Object} target - Target player node
 * @param {Array} betaPlaybook - Target player's move history
 * @returns {boolean} Move decision (cooperate=true, cheat=false)
 */
export function getBehavior(source, alphaPlaybook, target, betaPlaybook) {
  // Cooperator: Always cooperate
  if (source.behavior === "cooperator") {
    return true;
  }
  
  // Cheater: Always cheat
  if (source.behavior === "cheater") {
    return false;
  }

  // Aesop's fable characters with fixed behaviors
  if (source.behavior === "aesopMonkey") {
    return false;
  }
  if (source.behavior === "aesopGoat") {
    return false;
  }
  if (source.behavior === "aesopMouse") {
    return true;
  }
  if (source.behavior === "aesopLion") {
    return true;
  }
  if (source.behavior === "aesopCat") {
    return true;
  }

  // Copycat (Tit-for-tat): Copy opponent's last move
  if (source.behavior === "copycat") {
    if (alphaPlaybook.length >= 1) {
      const lastMove = betaPlaybook[betaPlaybook.length - 1];
      return lastMove;
    }
    // Start with cooperation if no history
    return true;
  } 

  // Random: 50% chance of either move
  if (source.behavior === "random") { 
    return Math.random() >= 0.5;
  }

  // Clever fox: Does opposite of opponent's last move
  if (source.behavior === "clever") { 
    if (alphaPlaybook.length >= 1) {
      const lastMove = betaPlaybook[betaPlaybook.length - 1];
      return !lastMove;
    }
    // Start with cheating
    return false;
  } 

  // Wise (Detective): Strategic behavior based on opponent type
  if (source.behavior === "wise") { 
    if ((target.behavior === "cheater") || 
        (target.behavior === "cooperator") || 
        (target.behavior === "random") || 
        (target.behavior === "clever")) {
      return false;
    }
    if (target.behavior === "copycat") {
      return true;
    }
  }
  
  // Default fallback
  return true;
}

/**
 * Execute one round of the game for all links in the graph
 * @param {string} rootElement - D3 selector for root element
 * @param {Object} graphElement - D3 selection for the graph SVG
 * @param {Object} cfg - Configuration object
 * @param {Array} nodeData - Array of node objects
 * @param {Array} linkData - Array of link objects
 * @param {Function} getNeighbors - Function to get node neighbors
 * @param {Function} updateLinks - Function to update link display
 * @returns {Object} Updated nodeData and linkData
 */
export function mostDangerousGame(rootElement, graphElement, cfg, nodeData, linkData, getNeighbors, updateLinks) {
  let i = 0;
  const brokenLinks = [];
  
  while (i < linkData.length) {
    // Determine each player's move
    const targetBehavior = getBehavior(
      linkData[i].target, 
      linkData[i].targetPlaybook, 
      linkData[i].source, 
      linkData[i].sourcePlaybook
    );
    const sourceBehavior = getBehavior(
      linkData[i].source, 
      linkData[i].sourcePlaybook, 
      linkData[i].target, 
      linkData[i].targetPlaybook
    );

    // Run trial and get results
    const trialResult = trial(sourceBehavior, targetBehavior, cfg);

    // Record moves in playbooks
    linkData[i].source.playbook.push(sourceBehavior);
    linkData[i].target.playbook.push(targetBehavior);
    linkData[i].sourcePlaybook.push(sourceBehavior);
    linkData[i].targetPlaybook.push(targetBehavior);

    // Update scores
    linkData[i].source.value += trialResult[0];
    linkData[i].target.value += trialResult[1];

    const sourceStrengthDelta = trialResult[0] * cfg.linkStrengthNormalization;
    const targetStrengthDelta = trialResult[1] * cfg.linkStrengthNormalization;

    // Update link strength based on behavior scheme
    switch(cfg.linkBehavior) {
      case "strengthDefault":
        break;
      case "strengthByFreewill":
        if (sourceBehavior && targetBehavior) {
          linkData[i].strength += 2 * cfg.linkStrengthNormalization;
        } else if (sourceBehavior && !targetBehavior) {
          linkData[i].strength -= 1 * cfg.linkStrengthNormalization;
        } else if (!sourceBehavior && targetBehavior) {
          linkData[i].strength -= 1 * cfg.linkStrengthNormalization;
        } else if (!sourceBehavior && !targetBehavior) {
          linkData[i].strength -= 1 * cfg.linkStrengthNormalization;
        }
        break;
      case "strengthBySource":
        linkData[i].strength += sourceStrengthDelta;
        break;
      case "strengthByTarget":
        linkData[i].strength += targetStrengthDelta;
        break;
      case "strengthBySum":
        linkData[i].strength += sourceStrengthDelta + targetStrengthDelta;
        break;
      case "strengthByValue":
        if (linkData[i].source.value >= linkData[i].target.value) {
          linkData[i].strength += sourceStrengthDelta; 
        } else {
          linkData[i].strength += targetStrengthDelta;
        }
        break;
      case "strengthByWeightedValue":
        linkData[i].strength += linkData[i].source.value * sourceStrengthDelta + 
          linkData[i].target.value * targetStrengthDelta;
        break;
    }

    // Clamp strength to [0, 1] range
    if (linkData[i].strength > 1) {
      linkData[i].strength = 1.0;
    }

    if (linkData[i].strength <= 0) {
      if (cfg.severable) {
        brokenLinks.push(i);
      } else {
        linkData[i].strength = 0.01;
      }
    }

    i += 1;
  }

  // Remove broken links (in reverse order to maintain indices)
  const sortedBrokenLinks = brokenLinks.sort((a, b) => a - b);
  for (let q = sortedBrokenLinks.length - 1; q >= 0; q--) {  
    linkData.splice(sortedBrokenLinks[q], 1); 
  }

  updateLinks();

  // Find and remove isolated nodes
  const isolatedNodes = [];
  for (let g = nodeData.length - 1; g >= 0; g--) {
    if (getNeighbors(nodeData[g]).length <= 1) {
      if (nodeData[g].id !== "center") {
        isolatedNodes.push(g);
        console.log(nodeData[g].id + " is isolated");
      }
    }
  }

  const sortedIsolatedNodes = isolatedNodes.sort((a, b) => a - b);
  for (let q = sortedIsolatedNodes.length - 1; q >= 0; q--) {  
    console.log("removing: " + nodeData[sortedIsolatedNodes[q]].id);
    
    // Fade out node visuals
    graphElement.select("#" + nodeData[sortedIsolatedNodes[q]].id)
      .transition().duration(100)
      .style('opacity', 0);

    graphElement.select("#i" + nodeData[sortedIsolatedNodes[q]].id)
      .transition().duration(100)
      .style('opacity', 0)
      .remove();
    
    nodeData.splice(sortedIsolatedNodes[q], 1); 
  }

  return { nodeData, linkData };
}
