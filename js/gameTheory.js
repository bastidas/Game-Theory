// cfg.linkStrengthNormalization = 0.9; 
// fullWin = 2 ;//* linkStrength;
// fullFail = 0 ;//* linkStrength;
// fail = -1 ;//linkStrength;
// win = 3 ;//linkStrength;


//var payoffNormalForm = [[[2,2],[-1,2]],[[2,-1],[0,0]]];
//payoffNormalForm = [[[3,3],[-1,3]],[[3,-1],[-2,-2]]]

function trial(alpha, beta, cfg) {
//copycat starts with cooperation, then does what opponent does in next round
//grudger starts with cooperator, then always cheats if opponent cheats even once
//cheater always cheats
//cooperator always cooperators
//detective starts with [cooperator,  cheat, cooperator, cooperator] afterwards, if opponent ever retaliates with cheat it plays like copycat, else plays like always cheat
//copykitten
//simpelton
//randomab
//steps: 
// play round (a rund has N matches?) tally up scores
// remove losers based on loser criteria
// replace losers with winners on winner criteria
// TT |  FT
// ---    ---
// TF   |  FF

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

function getBehavior(source, alphaPlaybook, target, betaPlaybook) {
  if (source.behavior === "cooperator") {
    return true;
  }
  if (source.behavior === "cheater") {
    return false;
  }

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

  if (source.behavior === "copycat") {
    if (alphaPlaybook.length >= 1) {
      //lastMove = target.playbook[target.playbook.length-1];
      lastMove = betaPlaybook[betaPlaybook.length-1];
      if (lastMove === false) {
        //console.log("last move false, playing false")
        return false;
      }
      else {
        //console.log("last move true, playing true")
        return true;
      }
    }
    else {// no moves played yet
      //console.log("no moves playing true")
      return true;
    }
  } 

  if (source.behavior === "random") { 
    if (Math.random() < .5) { return false;}
    else {return true;}
  }

  if (source.behavior === "clever") { 
  // clever fox tries to cheat!
    if (alphaPlaybook.length >= 1) {
      //lastMove = target.playbook[target.playbook.length-1];
      lastMove = betaPlaybook[betaPlaybook.length-1];
      if (lastMove === false) {
        //console.log("last move false, playing true")
        return true;
      }
      else {
        //console.log("last move true, playing true")
        return false;
      }
    }
    else {// no moves played yet
      ///console.log("no moves playing true")
      return false;
    }
  } 

  if (source.behavior === "wise") { 
//detective starts with [cooperator,  cheat, cooperator, cooperator] afterwards, if opponent ever retaliates with cheat it plays like copycat, else plays like always cheat
    if ((target.behavior === "cheater") || (target.behavior === "cooperator") || (target.behavior === "random") || (target.behavior === "clever")) {
      return false;
    }
    if (target.behavior === "copycat") {
      return true;
    }
  } 
}


function mostDangerousGame(rootElement, graphElement, cfg) {
  var i = 0;
  brokenLinks = [];
  while (i < linkData.length) {
    var targetBehavior,
    sourceBehavior,
    trialResult;

    targetBehavior = getBehavior(linkData[i].target, linkData[i].targetPlaybook, linkData[i].source, linkData[i].sourcePlaybook);
    sourceBehavior = getBehavior(linkData[i].source, linkData[i].sourcePlaybook, linkData[i].target, linkData[i].targetPlaybook);

    trialResult = trial(sourceBehavior, targetBehavior, cfg);

    linkData[i].source.playbook.push(sourceBehavior);
    linkData[i].target.playbook.push(targetBehavior);

    linkData[i].sourcePlaybook.push(sourceBehavior);
    linkData[i].targetPlaybook.push(targetBehavior);

    linkData[i].source.value += trialResult[0]
    linkData[i].target.value += trialResult[1]

    sourceStrengthDelta = trialResult[0] * cfg.linkStrengthNormalization;
    targetStengthDelta = trialResult[1] * cfg.linkStrengthNormalization;

    /* link strength schemes
    summation: the sum of both trailResults
    target-sum: the target trailResult is added
    source-sum: the source trailResult is added
    quadrature: ?

    severable option makes the link break if stength falls below zero

    strengthByTarget: strength determined by target only
    strengthBySource: strength determiend by source only
    strengthBySum: strength determined by sum of source and target
    strengthByValue: strength determined by more valued node
    strengthByWeightedValue: strength determined by value weighted sum of source and target
    */

    switch(cfg.linkBehavior) {
      case "strengthDefault":
        break;
      case "strengthByFreewill":
        if (sourceBehavior && targetBehavior) {
          linkData[i].strength += 2*cfg.linkStrengthNormalization;}
        if (sourceBehavior && !targetBehavior) {
          linkData[i].strength -= 1*cfg.linkStrengthNormalization;}
        if (!sourceBehavior && targetBehavior) {
          linkData[i].strength -= 1*cfg.linkStrengthNormalization;}
        if (!sourceBehavior && !targetBehavior) {
          //console.log('betrayals!')
          linkData[i].strength -= 1*cfg.linkStrengthNormalization;}        
        break;
      case "strengthBySource":
        linkData[i].strength += sourceStrengthDelta;
        break;
      case "strengthByTarget":
        console.log("case strengthByTarget")
        linkData[i].strength += targetStengthDelta ;
        break;
      case "strengthBySum":
        //console.log("case strengthBySum")
        linkData[i].strength += sourceStrengthDelta + targetStengthDelta ;
        break;
      case "strengthByValue":
        if (linkData[i].source.value >= linkData[i].target.value) {
          linkData[i].strength += sourceStrengthDelta; 
        }
        else {
          linkData[i].strength += targetStengthDelta;
        }
      case "strengthByWeightedValue":
        //console.log("case strengthByWeightedValue")
        linkData[i].strength += linkData[i].source.value * sourceStrengthDelta + 
        linkData[i].target.value * targetStengthDelta ;
        break;
    }

    if (linkData[i].strength > 1 ) {
      linkData[i].strength = 1.0;
      }

    if (linkData[i].strength <= 0 ) {
      if (cfg.severable) {
        //console.log("link broken, pushing: ", linkData[i].source.id, "-", linkData[i].target.id)
        brokenLinks.push(i);
      }
      else {
        //console.log("link strength at zero, setting to 0.01 floor")
        linkData[i].strength = 0.01;
      }
    }

    i += 1;

    // updates could be moved after looping for efficeny, but visually?
    // tabulate(rootElement, nodeData, ['id', 'behavior', 'value']);
    // linkTabulate(linkData, ['label', 'strength', 'invStrength']);
    // updateSimulation();
  }

  var sortedBrokenLinks =  brokenLinks.sort(function(a,b) {return a - b; });

  //console.log(sortedBrokenLinks)
  for (var q = sortedBrokenLinks.length - 1; q >= 0; q--) {  
    //console.log("removing: ", sortedBrokenLinks[q], " : ", linkData[sortedBrokenLinks[q]].source.id,"-",linkData[sortedBrokenLinks[q]].target.id)
    linkData.splice(sortedBrokenLinks[q], 1); 
    //cfg.data.links.splice(sortedBrokenLinks[q], 1);
    }
  //for (var g = linkData.length - 1; g >= 0; g--) {  
    // console.log("links after rmd: ", g, " : ", linkData[g].source.id,"-",linkData[g].target.id) 
  //}

  for (var g = nodeData.length - 1; g >= 0; g--) {  
    //console.log("nodes: ", g, " : ", nodeData[g].id); //,"-",linkData[g].target.id) 
  }
  updateLinks();

  var isolatedNodes = [];
  for (var g = nodeData.length - 1; g >= 0; g--) {
      
    if (getNeighbors(nodeData[g]).length <= 1) {
        if (nodeData[g].id != "center") {
          isolatedNodes.push(g);
          console.log(nodeData[g].id + " is isolated")
        }
    }
    else {
        continue;
    }
  }

  var sortedIsolatedNodes =  isolatedNodes.sort(function(a,b) {return a - b; });

  for (var q = sortedIsolatedNodes.length - 1; q >= 0; q--) {  
    console.log("removing: " + nodeData[sortedIsolatedNodes[q]].id)
    // to-do node not removed synchronously, ie if the animation duration is too long it remains
    
    //d3.selectAll("#" + nodeData[sortedIsolatedNodes[q]].id)
    //d3.select(graphElement).select("#" + nodeData[sortedIsolatedNodes[q]].id)
    graphElement.select("#" + nodeData[sortedIsolatedNodes[q]].id)
      .transition().duration(100)
      .style('opacity', 0)

    //d3.selectAll("#i" + nodeData[sortedIsolatedNodes[q]].id)
    //d3.select(graphElement).select("#i" + nodeData[sortedIsolatedNodes[q]].id)
    graphElement.select("#i" + nodeData[sortedIsolatedNodes[q]].id)
      .transition().duration(100)
      .style('opacity', 0)
      .remove();
    
    nodeData.splice(sortedIsolatedNodes[q], 1); 
  }

  //  for (var g = nodeData.length - 1; g >= 0; g--) {  
  //  console.log("nodes after gametheory: ", g, " : ", nodeData[g].id); //,"-",linkData[g].target.id) 
  //}

}

