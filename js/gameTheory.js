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
//randomab
//steps: 
// play round (a rund has N matches?) tally up scores
// remove losers based on loser criteria
// replace losers with winners on winner criteria
// TT |  FT
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
    //console.log("copycat")
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





function mostDangerousGame(rootElement) {
  var i = 0
  if (linkData.length > 10 ) {
    intervalDelay = 1000/linkData.length;
  }
  else {
    var intervalDelay = 100;
  }
  
  var intervalLoop = setInterval(function(){ game(i) }, intervalDelay);

  function game() {   
    if (i != 0 ) {
      radiusScale = getNodeSizeScale();
      //gameBlinkTime = 500;
      gameBlinkTime = intervalDelay;

      console.log("#" + linkData[i-1].target.id)

      //d3.select("body .wrapper #" + linkData[i-1].target.id)
      d3.select("#" + linkData[i-1].target.id)
        .transition()
        .duration(gameBlinkTime)
        .style("fill", getNodeColor (linkData[i-1].target, nodeColorLevel))
        .attr("r", getNodeSize(linkData[i-1].target));

      //to-do add link interaction visual
      //d3.select("body .wrapper #" + linkData[i-1].source.id)
      d3.select("#" + linkData[i-1].source.id)
        .transition()
        .duration(gameBlinkTime)
        .style("fill", getNodeColor (linkData[i-1].source, nodeColorLevel))
        .attr("r", getNodeSize(linkData[i-1].source));

     //   updateSimulation();
    }

    if (i >= linkData.length) {
      clearInterval(intervalLoop)
      return
    } 


    //d3.select("body .wrapper #" + linkData[i].target.id)
    d3.select("#" + linkData[i].target.id)
      .style("fill", "white")


    //d3.select("body .wrapper #" + linkData[i].source.id)
    d3.select("#" + linkData[i].source.id)
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

    console.log("trialResult[0]: ", trialResult[0])

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

    d3.select(rootElement)
      .selectAll("table")
      .remove();

    // d3.select("body .wrapper .rightDiv")
    //   .selectAll("table")
    //   .remove();

    // // these updates could be moved after looping for efficeny, but visually?
    tabulate(rootElement, nodeData, ['label', 'behavior', 'value']);
    //linkTabulate(linkData, ['label', 'strength', 'invStrength']);
//    updateSimulation();
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
