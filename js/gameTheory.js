linkStrengthNormalization = 0.1; 
// fullWin = 2 ;//* linkStrength;
// fullFail = 0 ;//* linkStrength;
// fail = -1 ;//linkStrength;
// win = 3 ;//linkStrength;


//var payoffNormalForm = [[[2,2],[-1,2]],[[2,-1],[0,0]]];
//payoffNormalForm = [[[3,3],[-1,3]],[[3,-1],[-2,-2]]]

function trial(alpha, beta) {
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
    //return [fullWin, fullWin];
    //console.log("payoffNormalForm[0][0]: " +  payoffNormalForm[0][0])
    return payoffNormalForm[0][0];
  }

  if (alpha && !beta) {
    //return [fail, win];
    return payoffNormalForm[0][1];
  }

  if (!alpha && beta) {
    //return [win, fail];
    return payoffNormalForm[1][0];
  }

  if (!alpha && !beta) {
    //return [fullFail, fullFail];
    return payoffNormalForm[1][1];
  } 
}

function getBehavior(source, target) {
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

  if (source.behavior === "random") { 
    if (Math.random() < .5) { return false;}
    else {return true;}
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


function mostDangerousGame(rootElement) {
  var i = 0;
  
  while (i < linkData.length) {
    var targetBehavior,
    sourceBehavior,
    trialResult;

    targetBehavior = getBehavior(linkData[i].target, linkData[i].source);
    sourceBehavior = getBehavior(linkData[i].source, linkData[i].target);

    trialResult = trial(sourceBehavior, targetBehavior);

    linkData[i].source.playbook.push(sourceBehavior);
    linkData[i].target.playbook.push(targetBehavior);

    linkData[i].source.value += trialResult[0]
    linkData[i].target.value += trialResult[1]

    sourceStrengthDelta = trialResult[0] * linkStrengthNormalization;
    targetStengthDelta = trialResult[1] * linkStrengthNormalization;

    /* link strength schemes
    summation: the sum of both trailResults
    target-sum: the target trailResult is added
    source-sum: the source trailResult is added
    quadrature: ?

    cullTheWeak option makes the link break if stength falls below zero

    strengthByTarget: strength determined by target only
    strengthBySource: strength determiend by source only
    strengthBySum: strength determined by sum of source and target
    strengthByValue: strength determined by more valued node
    strengthByWeightedValue: strength determined by value weighted sum of source and target
    */

    //console.log("trialResult[0]: ", trialResult[0])
    // var linkBehavior = "strengthDefault";
    //var linkBehavior = "strengthBySource";
    //console.log("linkBehavior: " + linkBehavior);

    switch(linkBehavior) {
      case "strengthDefault":
        break;
      case "strengthBySource":
        //console.log("case strengthBySource")
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


    //console.log("i: " + i)
    if (linkData[i].strength <= 0 ) {
      if (cullTheWeak) {
        //console.log("link broken!")
        //console.log("linkData.length() "+ linkData.length)
        linkData.splice(i, 1);
        updateLinks();
        //console.log("linkData.length() "+ linkData.length)
        //linkData[i].strength = 0.01;
      }
      else {
        console.log("link strength at zero")
        linkData[i].strength = 0.0;
      }
    }

    //console.log("linkData[i].strength: " + linkData[i].strength)

    i += 1;

    // d3.select(rootElement)
    //   .selectAll("table")
    //   .remove();

    // // these updates could be moved after looping for efficeny, but visually?
//    tabulate(rootElement, nodeData, ['id', 'behavior', 'value']);
    //linkTabulate(linkData, ['label', 'strength', 'invStrength']);
    //updateSimulation();
  }  
}

function tabulate(rootElement, data, columns) {
  var table = d3.select(rootElement)
  // var table = d3.select("body .wrapper .rightDiv")
    .append('table')

  var tableHead = table.append('thead')
  var tableBody = table.append('tbody');

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
