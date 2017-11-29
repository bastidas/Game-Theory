function animateAndUpdate(cfg) {
  nodeData = cfg.data.nodes
  linkData = cfg.data.links
  var interval = 0;
  var intervalDelay;

  if (linkData.length > 10 ) {
    intervalDelay = 1500 / linkData.length;
  }
  else {
    intervalDelay = 150;
  }

  var intervalLoop = setInterval(intervalAnimation, intervalDelay);
  //for (var g = nodeData.length - 1; g >= 0; g--) {  
  //  console.log("animation nodes: ", g, " : ", nodeData[g].id); //,"-",linkData[g].target.id) 
  //}
  function intervalAnimation() {

    if (interval != 0 ) {
      d3.select("#" + nodeData[interval-1].id)
        .transition().duration(intervalDelay)
        .style("fill", getNodeColor (nodeData[interval-1], nodeColorLevel))
    }

    if (interval >= nodeData.length) {
      clearInterval(intervalLoop);
      updateGraph(cfg);
      //updateLinks(); 
    }
    else {
      //if (nodeData[interval].id != "center {
        d3.select("#" + nodeData[interval].id)
          .style("fill", "white");
      //}
    }
  interval += 1
  }
}

function craneAndWolfButtons(rootElement, graphElement, cfg) {
  var gameButtons = ['pointing-right-3', 'dislike'];
  var gameButtonsText = ['cooperate', 'betray'];
  var gameBWidth = 55;
  var gameBHeight = 55;
  var gameBSpace = 55;
  var gameX0 = 0;
  var gameY0 = 0;

  var gameButtonsSvg = d3.select(rootElement)
    .append("svg")
    .attr("width", "100%")
    .attr("height", buttonBoxHeight)
    .attr('viewBox', '0, 0, ' + buttonBoxWidth + ', ' + .8 * buttonBoxHeight)
    .attr("overflow", "visible");

  var chooseButtons = gameButtonsSvg.append("g")
    .selectAll("g.gameButtons")
    .data(gameButtons)
    .enter()
    .append("g")
    .attr("class", "gameButtons")
    .style("cursor", "pointer")
    .on("click", function(d, i) {
      // to-do add slight button grow animation on click

      d3.select(rootElement).select("div").style("display", "inline-block")

      d3.select(this)
        .style("opacity", 0.5)
        .transition().duration(blinkTime).style("opacity", 1.0)

      if (i === 0) {
        mostDangerousGame(rootElement, graphElement, cfg);
        animateAndUpdate(cfg);
      }
      
      if (i === 1) {
        mostDangerousGame(rootElement, graphElement, cfg);
        animateAndUpdate(cfg);
      }
    })
    .on("mouseover", function(d, i) {
      img = d3.select(this).select("image")
      d3.select(this).select("image")
        .attr("xlink:href", function(d) {return "imgs/interactionColor/png/" + d + ".png";})      
    })
    .on("mouseout", function(){
      d3.select(this).select("image")
        .attr("xlink:href", function(d) {return "imgs/interactionBW/png/" + d + ".png";});  
    })

  chooseButtons.append("svg:image")
    .attr("x", function(d,i) {return x0 + (gameBWidth + gameBSpace)*i;})
    .attr("y", gameY0)
    .attr('width', 1.0 * gameBWidth)
    .attr('height', 1.0 * gameBHeight)
    .attr("xlink:href", function(i) {return "imgs/interactionBW/png/" + i + ".png";})
}


function gameButtons(rootElement, graphElement, cfg) {
  var gameButtons = ['gear', 'reset'];
  var gameButtonsText = ['run', 'reset'];
  var gameBWidth = 55;
  var gameBHeight = 55;
  var gameBSpace = 55;
  var gameX0 = 0;
  var gameY0 = 0;

  var gameButtonsSvg = d3.select(rootElement)
    .append("svg")
    .attr("width", "100%")
    .attr("height", buttonBoxHeight)
    .attr('viewBox', '0, 0, ' + buttonBoxWidth + ', ' + .8 * buttonBoxHeight)
    .attr("overflow", "visible")
    //.style("border", "1px dashed black")

  var angle = 0;
  var gameMouse;
  var mouseOverLoop;

  var gameButtonsBox = gameButtonsSvg.append("g")
    .selectAll("g.gameButtons")
    .data(gameButtons)
    .enter()
    .append("g")
    .attr("class", "gameButtons")
    .style("cursor", "pointer")
    .on("click", function(d, i) {
      // to-do add slight button grow animation on click
      d3.select(this)
        .style("opacity", 0.5)
        .transition().duration(blinkTime).style("opacity", 1.0)

      if (i === 0) {
        var nTrials = 1;
        var q = 0
        while (q < nTrials) {
          mostDangerousGame(rootElement, graphElement, cfg);
          q += 1;
        }
        animateAndUpdate(cfg);
      }
      
      if (i === 1) {  //do reset animation and data update
        for (var i=0; i < cfg.data.nodes.length; i++) {
          d3.select("#" + cfg.data.nodes[i].id)
          .style("fill", "black")
        }

        cfg.data = $.extend(true, {}, cfg.baseData);
        graph(graphElement, cfg);
        updateGraph(cfg);
        updateLinks(cfg);
      }

    d3.select(rootElement + " #players")
        .selectAll("table")
        .remove();

    d3.select(rootElement + " #links")
        .selectAll("table")
        .remove();
    tabulate(rootElement  + " #players", nodeData, cfg.tabulations);
    tabulate(rootElement + " #links", linkData, ["source", "target", "strength", "invStrength"]);
    })
    .on("mouseover", function(d, i) {
      img = d3.select(this).select("image")
      clearInterval(mouseOverLoop);
      d3.select(this).select("image")
        .attr("xlink:href", function(d) {return "imgs/flat/" + d + ".png";})      
      
      gameMouse = true;   
      xOffset = gameX0 + (gameBWidth + gameBSpace)*i + gameBWidth/2;
      mouseOverLoop = setInterval(rotateAnimation, 50, img)
      
      function rotateAnimation(img) {
        angle += 3;
        //console.log(angle)
        if (!gameMouse) {
          clearInterval(mouseOverLoop);
        }
        else {   
          rotateString = "rotate(" + angle +  " " + xOffset + " " + gameBHeight/2 + ")"    
          img.attr("transform", rotateString)
        }
      }
    })
    .on("mouseout", function(){
      gameMouse = false;
      d3.select(this).select("image")
        .attr("xlink:href", function(d) {return "imgs/bw/" + d + ".png";});  
    })

  gameButtonsBox.append("svg:image")
    .attr("x", function(d,i) {return x0 + (gameBWidth + gameBSpace)*i;})
    .attr("y", gameY0)
    .attr('width', 1.0 * gameBWidth)
    .attr('height', 1.0 * gameBHeight)
    .attr("xlink:href", function(i) {return "imgs/bw/" + i + ".png";})
}


function nodeBehaviorButtons(node) {
  //to-do make the nodebox scale with chartSvg rootElement better
  var charBWidth = 35;
  var charBHeight = 35;
  var charX0 = 15;
  var charBSpace = 55;
  var toolTipHeight = 105;
  var toolTipWidth = 250;
  var hoverBoxExtra = 80;
  var toolTipButtons = ["dog", "snake", "cat", "fox", "owl", "chimpanzee"];
  var toolTipText = ["cooperator", "cheater", "copycat", "clever", "wise", "random"];

  d3.select(".tooltip").remove();

  var nodeBox = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("width",  (hoverBoxExtra + toolTipWidth) + "px")
  .style("height", (hoverBoxExtra + toolTipHeight) + "px")
  .style("left", (d3.event.pageX - hoverBoxExtra / 2) + "px")
  .style("top", (d3.event.pageY + 10 - hoverBoxExtra / 2) + "px")

  $(".tooltip").mouseleave(function(){
    d3.select(".tooltip").remove();
  });

  var nodeBoxSvg = nodeBox
    .append("svg")
    .style("display", "block")
    .style("margin", "auto")
    .style("margin-top", (hoverBoxExtra / 2) + "px")
    .style("background-color", "#E9E9E9")
    .style("border", "3px solid #ccc")
    .attr("width", toolTipWidth)
    .attr("height", toolTipHeight)
    .attr("overflow", "visible")
    .attr('viewBox', '0, 0, ' + toolTipWidth + ', ' + toolTipHeight)
    //.append("div").attr("class", "behaviorInfo")

   // nodeBoxSvg.append("div").attr("class", "behaviorInfo")

  nodeBoxSvg.append("text")
    .attr("y", toolTipHeight + 20)
    .attr("class", "behaviorInfo")

  var nodeButtons = nodeBoxSvg.append("g")
    .selectAll("g.toolTipButtons")
    .data(toolTipButtons)
    .enter()
    .append("g")
    .attr("class", "toolTipButtons")
    .style("cursor", "pointer")
    .on("click", function(d, i) {

      d3.select(this)
        .style("opacity", .5)
        .transition().duration(blinkTime)
        .style("opacity", 1.0)

      d3.select("#i" + node.id)
        .attr("xlink:href", "imgs/animalsFlat/" + d + ".png");

      node.behavior = toolTipText[i];

      d3.select(".tooltip").remove();
      
    })
    .on("mouseover", function(d,i) {
      d3.select("#nodeText" + i).style("opacity", 1.0)
      d3.select("#nodeButtonImage" + i).attr("xlink:href", function(d) {return "imgs/animalsLine/" + d + ".png";});

      if ( i == 0 ) {
        d3.select(".behaviorInfo").text("The simple dog always cooperates.");
      }    
      if ( i == 2 ) {
        d3.select(".behaviorInfo").text("The copycat starts by cooperating, and each round thereafter does what opponent " +
        "did in the previous round.");
      }
      if ( i == 1 ) {
        d3.select(".behaviorInfo").text("The cheater snake always cheats.")
      }
      if ( i == 3 ) {
        d3.select(".behaviorInfo").text("The clever fox tries to trick copycats. On the 2 rounds it cheats then ...")
      }
      if ( i == 4 ) {
        d3.select(".behaviorInfo").text("The owl learns about each opponent and plays wisely.")
      }
      if ( i == 5 ) {
        d3.select(".behaviorInfo").text("The monkey plays randomly.")
      }
    })
    .on("mouseout", function(d, i){
      d3.select(".behaviorInfo").text("");
      d3.select("#nodeButtonImage" + i).attr("xlink:href", function(d) {return "imgs/animalsFlat/" + d + ".png";});
      d3.select("#nodeText" + i).style("opacity", 0)
    })

  nodeButtons.append("svg:image")
    .attr("x", function(d,i) {
        if (i < 3) {
          return charX0 + (charBWidth + charBSpace)*i;
        }
        else {
          return charX0 + (charBWidth + charBSpace)*(i-3); 
        }
    })
    .attr("y", function(d,i) { 
      if (i < 3) {
          return y0 + 5;
      }
      else {
          return y0 + charBHeight + 20;
      }
    })
    .attr('width', charBWidth)
    .attr('height', charBHeight)
    .attr("xlink:href", function(d) {return "imgs/animalsFlat/" + d + ".png";})
    .attr("id", function(d,i) {return "nodeButtonImage" + i;})

  nodeButtons.append("text")
    .attr("class","nodeButtonText")
    .attr("id", function(d,i) {return "nodeText" + i;})
    .attr("x",function(d,i) {
      if (i < 3) {
        return charX0 + 20 + (charBWidth + charBSpace)*i - toolTipText[i].length * 3;
      }
        else {
          return charX0 + 20 + (charBWidth + charBSpace)*(i - 3) - toolTipText[i].length * 3;
      }
    })
    .attr("y", function(d,i) { 
      if (i < 3) {
        return charBHeight + 10;
      }
      else {
        return y0 + 2 * charBHeight + 25;
      }
    })
    .attr("dominant-baseline", "central")
    .attr("fill", fontColor)
    .style("opacity", 0)
    .text(function(d, i ) {return toolTipText[i];})
}

function payoffButtons(element, quadrant, cfg, indx1, indx2, payButtonsData, direction) {

  var payBoxWidth = 90;
  var payBoxHeight = 90;

  var payoffButtonsSvg = d3.select(element + quadrant + " .center")
    .append("svg")
    .attr("width", "100%")
    .attr('viewBox', 0 + ', ' + payBoxHeight/2 +  ', ' + 2.25 * payBoxWidth + ', ' + payBoxHeight)
    //.style("border", "1px dashed orange")
    .attr("overflow", "visible")
    .style("margin", "0")
    .style("padding", "0")

  var payButtons = payoffButtonsSvg.append("g")
    .selectAll("g.payoffButtons")
    .data(payButtonsData)
    .enter()
    .append("g")
    .attr("class", "payoffButtons")
    .style("cursor", "pointer")
    .on("click", function(d, i, q) {
      d3.select(this).select("image")
        .transition()
        .duration(70)
        .attr("transform", "translate(-9 -9) scale(1.1)")//" translate(0.0 0.75)")
        .transition()
        .duration(70)
        .attr("transform", "translate(0 0) scale(1.0)")//" translate(0.0 0.75)")
        
      if (direction === "up") {
        if (q.length == 1) {
          cfg.payoffNormalForm[indx1][indx2][0] += 1;
          cfg.payoffNormalForm[indx1][indx2][1] += 1;
          d3.select(element + quadrant + " .player2").text(cfg.payoffNormalForm[indx1][indx2][0])
          d3.select(element + quadrant + " .player1").text(cfg.payoffNormalForm[indx1][indx2][1]) 
        }
        else {
          if (i === 0 ) {
            cfg.payoffNormalForm[indx1][indx2][0] += 1;
            cfg.payoffNormalForm[indx2][indx1][1] += 1;
          } 
          if (i === 1 ) {
            cfg.payoffNormalForm[indx1][indx2][1] += 1;
            cfg.payoffNormalForm[indx2][indx1][0] += 1;
          }
        }
      }

      if (direction === "down") {
        if (q.length == 1) {           
          cfg.payoffNormalForm[indx1][indx2][0] -= 1;
          cfg.payoffNormalForm[indx1][indx2][1] -= 1;
          d3.select(element + quadrant + " .player2").text(cfg.payoffNormalForm[indx1][indx2][0])
          d3.select(element + quadrant + " .player1").text(cfg.payoffNormalForm[indx1][indx2][1]) 
        }
        else {
          if (i === 0 ) {
            cfg.payoffNormalForm[indx1][indx2][0] -= 1;
            cfg.payoffNormalForm[indx2][indx1][1] -= 1;
          }
          if (i === 1 ) {
            cfg.payoffNormalForm[indx1][indx2][1] -= 1;
            cfg.payoffNormalForm[indx2][indx1][0] -= 1;
          }
        }
      }
      d3.select(element + " #tableTF .player1").text(cfg.payoffNormalForm[0][1][1])
      d3.select(element + " #tableTF .player2").text(cfg.payoffNormalForm[0][1][0])
      d3.select(element + " #tableFT .player1").text(cfg.payoffNormalForm[1][0][1])
      d3.select(element + " #tableFT .player2").text(cfg.payoffNormalForm[1][0][0])
    })
    .on("mouseover", function(d) {
      d3.select(this).select("image")
        .attr("xlink:href", function(d) {return "imgs/interactionColor/png/" + d + ".png";});
       })
    .on("mouseout", function(d){
      d3.select(this).select("image")
          .attr("xlink:href", function(i) {return "imgs/interactionBW/png/" + d + ".png";});
    });

  var payBWidth = 1.0 * payBoxWidth;
  var payBHeight = 1.0 * payBoxHeight;
    
  payButtons.append("svg:image")
    .attr("x", function(d, i, q) {
      if (q.length == 1) {
        return .65 * payBWidth;
      }
      else {
            return 2 + (.85 * payBWidth + 0.5 * bSpace) * i;
      }
    })
    .attr("y", payBoxHeight - payBoxWidth / 2)
    .attr('width', payBWidth)
    .attr('height', payBHeight)
    .attr("xlink:href", function(d) {return "imgs/interactionBW/png/" + d + ".png";});
}

function tabulate(element, data, columns) {
  if (columns.length === 0) {
    return;
  }
  var table = d3.select(element)
    .append('table').attr("class", "tabulateTable")

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

  sform = d3.format("")
  //sform = d3.format(".4n")
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

  //return table;
}

function payoffTable(element, cfg) {
  // TT |  FT
  // ---    ---
  // TF   |  FF

  payTable = d3.select(element).append("table").style("width", "95%")

  tr0 = payTable.append("tr")
  tr0.append("td").attr("colspan", 2).attr("width", "10%")

  tr0.append("td").attr("colspan", 2).attr("width", "90%").attr("class", "tableLabel player1")
  .text("Player 1")
  
  tr1 = payTable.append("tr")


  tr1.append("td").attr("colspan", 2)
  tr1.append("td").attr("class", "tableLabel player1").text("cooperate")
  tr1.append("td").attr("class", "tableLabel player1").text("betray")

  tr2 = payTable.append("tr")
  tr2.append("td").attr("rowspan", 2).text("Player 2").attr("class", "tableLabel rotateText player2")
  tr2.append("td").text("cooperate").attr("class","tableLabel rotateText player2").text("cooperate")
  tr2.append("td").attr("class", "tableDat").attr("id", "tableTT").append("div").attr("class", "center")
  payoffButtons(element, " #tableTT", cfg, 0, 0, ['up-arrow-3'], "up");
  elementTT = d3.select(element + " #tableTT .center")
  elementTT.append("div").html("<br>").style("line-height", "0px")
  elementTT.append("div").text(cfg.payoffNormalForm[0][0][0]).attr("class", "player2")
  elementTT.append("div").style("display", "inline-block").html(",&nbsp;")
  elementTT.append("div").text(cfg.payoffNormalForm[0][0][1]).attr("class", "player1")
  elementTT.append("div").html("<br>").style("line-height", "0px")
  payoffButtons(element, " #tableTT", cfg, 0, 0, ['down-arrow-4'], "down");
  tr2.append("td").attr("class", "tableDat").attr("id", "tableTF").append("div").attr("class", "center");
  payoffButtons(element, " #tableTF", cfg, 0, 1, ['up-arrow-3', 'up-arrow-3'], "up");
  elementTF = d3.select(element + " #tableTF .center")
  elementTF.append("div").html("<br>").style("line-height", "0px")//.style("margin-top", "-90px")
  elementTF.append("div").text(cfg.payoffNormalForm[0][1][0]).attr("class", "player2")
  elementTF.append("div").style("display", "inline-block").html(",&nbsp;")
  elementTF.append("div").text(cfg.payoffNormalForm[0][1][1]).attr("class", "player1")
  elementTF.append("div").html("<br>").style("line-height", "0px")
  payoffButtons(element, " #tableTF", cfg, 0, 1, ['down-arrow-4', 'down-arrow-4'], "down");


  tr3 = payTable.append("tr")
  tr3.append("td").attr("class", "tableLabel rotateText player2").text("betray").style("padding", "0px")
  tr3.append("td").attr("class", "tableDat").attr("id", "tableFT").append("div").attr("class", "center");

  payoffButtons(element, " #tableFT", cfg, 1, 0, ['up-arrow-3', 'up-arrow-3'], "up");
  elementFT = d3.select(element + " #tableFT .center")
  elementFT.append("div").html("<br>").style("line-height", "0px")
  elementFT.append("div").text(cfg.payoffNormalForm[1][0][0]).attr("class", "player2")
  elementFT.append("div").style("display", "inline-block").html(",&nbsp;")
  elementFT.append("div").text(cfg.payoffNormalForm[1][0][1]).attr("class", "player1")
  elementFT.append("div").html("<br>").style("line-height", "0px")
  payoffButtons(element, " #tableFT", cfg, 1, 0, ['down-arrow-4', 'down-arrow-4'], "down");

  tr3.append("td").attr("class", "tableDat").attr("id", "tableFF").append("div").attr("class", "center")
  payoffButtons(element, " #tableFF", cfg, 1, 1, ['up-arrow-3'], "up");
  elementFF = d3.select(element + " #tableFF .center")
  elementFF.append("div").html("<br>").style("line-height", "0px")
  elementFF.append("div").text(cfg.payoffNormalForm[1][1][0]).attr("class", "player2")
  elementFF.append("div").style("display", "inline-block").html(",&nbsp;")
  elementFF.append("div").text(cfg.payoffNormalForm[1][1][1]).attr("class", "player1")
  elementFF.append("div").html("<br>").style("line-height", "0px")
  payoffButtons(element, " #tableFF", cfg, 1, 1, ['down-arrow-4'], "down");
}

function openTab(evt, tabName, element) {
    //element = "#page6"
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent")
    tabcontent  = document.querySelectorAll(element + " .tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.querySelectorAll(element + " .tabLinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.querySelector(element + " #" + tabName).style.display = "block";
    evt.currentTarget.className += " active";
} 

function normalFormTable(element, cfg) {
  payTable = d3.select(element).append("table")//.style("width", "85%")

  tr0 = payTable.append("tr")
  tr0.append("td").attr("colspan", 2).attr("class", "sp")//.attr("max-width", "5px !important").style("border", "2px solid red")//.attr("width", "10%")
  //tr0.append("td").attr("colspan", 1)//.attr("width", "5px !important").style("border", "2px solid red")//.attr("width", "10%")
  //tr0.append("td").attr("colspan", 1)//.attr("width", "5px !important").style("border", "2px solid yellow")//.attr("width", "10%")
  tr0.append("td").attr("colspan", 2).attr("class", "tableLabel player1")//.attr("width", "90%").attr("class", "tableLabel player1")
  .text("Player 1")
  
  tr1 = payTable.append("tr")
  tr1.append("td").attr("colspan", 2).attr("class", "sp")//.attr("min-width", "20px !important").style("border", "2px solid blue")
  tr1.append("td").attr("class", "tableLabel player1").text("cooperate")//.attr("width", "10px !important")
  tr1.append("td").attr("class", "tableLabel player1").text("betray")

  tr2 = payTable.append("tr")
  tr2.append("td").attr("rowspan", 2).text("Player 2").attr("class", "tableLabel rotateText player2");
  tr2.append("td").text("cooperate").attr("class","tableLabel rotateText player2").text("cooperate");
  
  elementTT = tr2.append("td").attr("colspan", 2).attr("rowspan", 2)
  elementTT.append("table").attr("class", "subTable")
  //elementTT = tr2.append("td").attr("class", "tableDat crossed")
  //elementTT.append("div").text(cfg.payoffNormalForm[0][0][1]).attr("class", "prisonerP1")
  //elementTT.append("div").text(cfg.payoffNormalForm[0][0][0]).attr("class", "prisonerP2")
  //elementTT.style("background-image", "url('imgs/landscapes/forest.png')") 

  //elementTF = tr2.append("td").attr("class", "tableDat crossed");
  //elementTF.append("div").text(cfg.payoffNormalForm[0][1][1]).attr("class", "prisonerP1")
  //elementTF.append("div").text(cfg.payoffNormalForm[0][1][0]).attr("class", "prisonerP2")

  tr3 = payTable.append("tr")
  tr3.append("td").attr("class", "tableLabel rotateText player2").text("betray").style("padding", "0px")
  
  //elementFT = tr3.append("td").attr("class", "tableDat crossed")
  //elementFT.append("div").text(cfg.payoffNormalForm[1][0][1]).attr("class", "prisonerP1")
  //elementFT.append("div").text(cfg.payoffNormalForm[1][0][0]).attr("class", "prisonerP2")
  
  //elementFF = tr3.append("td").attr("class", "tableDat crossed")
  //elementFF.append("div").text(cfg.payoffNormalForm[1][1][1]).attr("class", "prisonerP1")
  //elementFF.append("div").text(cfg.payoffNormalForm[1][1][0]).attr("class", "prisonerP2")

  trst = d3.select(element).select(".subTable").append("tr")
  elementTT = trst.append("td").attr("class", "tableDat crossed")
  elementTT.append("div").text(cfg.payoffNormalForm[0][0][1]).attr("class", "prisonerP1")
  elementTT.append("div").text(cfg.payoffNormalForm[0][0][0]).attr("class", "prisonerP2")
  
  elementTF = trst.append("td").attr("class", "tableDat crossed");
  elementTF.append("div").text(cfg.payoffNormalForm[0][1][1]).attr("class", "prisonerP1")
  elementTF.append("div").text(cfg.payoffNormalForm[0][1][0]).attr("class", "prisonerP2")


  tr3 =  d3.select(element).select(".subTable").append("tr")
  elementFT = tr3.append("td").attr("class", "tableDat crossed")
  elementFT.append("div").text(cfg.payoffNormalForm[1][0][1]).attr("class", "prisonerP1")
  elementFT.append("div").text(cfg.payoffNormalForm[1][0][0]).attr("class", "prisonerP2")
  
  elementFF = tr3.append("td").attr("class", "tableDat crossed")
  elementFF.append("div").text(cfg.payoffNormalForm[1][1][1]).attr("class", "prisonerP1")
  elementFF.append("div").text(cfg.payoffNormalForm[1][1][0]).attr("class", "prisonerP2")

}

function rivalTable(element) {
  rTable = d3.select(element).append("table")
  tr1 = rTable.append("tr")
  tr1.append("td")//.text("-")
  tr1.append("td").attr("class", "tableLabel").text("Excludable")
  tr1.append("td").attr("class", "tableLabel").text("Non-excludable")
  tr2 = rTable.append("tr")
  tr2.append("td").text("cooperate").attr("class","tableLabel rotateText").text("Rivalrous")
  tr2.append("td").attr("colspan", 2).attr("rowspan", 2).append("table").attr("class", "subTable")
  tr3 = rTable.append("tr")
  tr3.append("td").attr("class", "tableLabel rotateText").text("Non-rivalrous")
  trst = d3.select(".subTable").append("tr")
  elementTT = trst.append("td").attr("class", "tableImg")
  elementTT.style("background-image", "url('imgs/landscapes/buildings.png')") 
  elementTF = trst.append("td").attr("class", "tableImg")
  elementTF.style("background-image", "url('imgs/landscapes/forest.png')") 
  tr3 = d3.select(".subTable").append("tr")
  elementFT = tr3.append("td").attr("class", "tableImg")
  elementFT.style("background-image", "url('imgs/landscapes/bridge.png')") 
  elementFF = tr3.append("td").attr("class", "tableImg")
  elementFF.style("background-image", "url('imgs/landscapes/lighthouse.png')") 
}


function gameTabs(element, cfg) {
  tabs = d3.select(element).append("div").attr("id", "tab").attr("class", "tab")

  d3.select(element)
    .append("div")
    .attr("id", "players")
    .attr("class", "tabcontent")
    .append("p")
    .text("Who is playing?")
    .style("font-style", "italic");


  d3.select(element)
    .append("div")
    .attr("id", "links")
    .attr("class", "tabcontent")
    .append("p")
    .text("What are the connections?")
    .style("font-style", "italic");

  d3.select(element)
    .append("div")
    .attr("id", "payoff")
    .attr("class", "tabcontent")
    .append("p")
    .text("But at what cost?")
    .style("font-style", "italic");

  tabs
    .append("button")
    .attr("id", 'playerTab')
    .attr("class", "tabLinks")
    .text("Players");

  document.querySelector(element + " #playerTab").onclick = function(evt) {openTab(evt, 'players', element)};

  tabs
    .append("button")
    .attr("id", 'linkTab')
    .attr("class", "tabLinks")
    .text("Links");

  document.querySelector(element + " #linkTab").onclick = function(evt) {openTab(evt, 'links', element)};

  tabs
    .append("button")
    .attr("id", 'payoffTab')
    .attr("class", "tabLinks")
    .text("Payoffs");

  document.querySelector(element + " #payoffTab").onclick = function(evt) {openTab(evt, 'payoff', element)};
}
