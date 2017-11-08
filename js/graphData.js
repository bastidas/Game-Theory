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
    "strength": 0.,
    "invStrength": .1
  }]
}

var lionAndMouse = {
  "nodes": [{
    "id": "lion",
    "label": "lion",
    "group": 0,
    "level": 0,
    "behavior": "aesopLion",
    "value": 0, 
    "playbook": []
    }, {
    "id": "mouse",
    "label": "mouse",
    "group": 1,
    "level": 0,
    "behavior": "aesopMouse",
    "value": 0, 
    "playbook": []
  }],
  "links": [{
    "source": "lion",
    "target": "mouse",
    "strength": 0.2,
    "invStrength": .5
  }]
}


var goatAndGoat = {
  "nodes": [{
    "id": "goatI",
    "label": "goat I",
    "group": 0,
    "level": 0,
    "behavior": "aesopGoat",
    "value": 0, 
    "playbook": []
    }, {
    "id": "goatII",
    "label": "goat II",
    "group": 1,
    "level": 0,
    "behavior": "aesopGoat",
    "value": 0, 
    "playbook": []
  }],
  "links": [{
    "source": "goatI",
    "target": "goatII",
    "strength": 0.2,
    "invStrength": .5
  }]
}


var monkeyAndCat = {
  "nodes": [{
    "id": "monkey",
    "label": "monkey",
    "group": 0,
    "level": 0,
    "behavior": "aesopMonkey",
    "value": 0, 
    "playbook": []
    }, {
    "id": "cat",
    "label": "cat",
    "group": 1,
    "level": 0,
    "behavior": "aesopCat",
    "value": 0, 
    "playbook": []
  }],
  "links": [{
    "source": "cat",
    "target": "monkey",
    "strength": 0.2,
    "invStrength": .1
  }]
}


var monkeyAndCat2 = {
  "nodes": [{
    "id": "monkey2",
    "label": "monkey",
    "group": 0,
    "level": 0,
    "behavior": "aesopMonkey",
    "value": 0, 
    "playbook": []
    }, {
    "id": "cat2",
    "label": "cat",
    "group": 1,
    "level": 0,
    "behavior": "aesopCat",
    "value": 0, 
    "playbook": []
  }],
  "links": [{
    "source": "monkey2",
    "target": "cat2",
    "strength": 0.1,
    "invStrength": .1
  }]
}

var baseData5 = {
    "nodes": [{
        "id": "cat5",
        "label": "copycat",
        "group": 0,
        "level": 0,
        "behavior": "copycat",
        "value": 0, 
        "playbook": []
    }, {
        "id": "dog5",
        "label": "cooperator",
        "group": 0,
        "level": 0,
        "behavior": "cooperator",
        "value": 0, 
        "playbook": []
    }, {
        "id": "snake5",
        "label": "cheater",
        "group": 0,
        "level": 0,
        "behavior": "cheater",
        "value": 0, 
        "playbook": []
    }],
    "links": [{
        "source": "dog5",
        "target": "cat5",
        "strength": .5,
        "invStrength": .5
    },{
        "source": "dog5",
        "target": "snake5",
        "strength": .5,
        "invStrength": .5
    },{
        "source": "cat5",
        "target": "snake5",
        "strength": .5,
        "invStrength": .5
    }]
};




var baseData7 = {
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

function fullyConnected(arr) {
    var dat= {};
    var nodes = [];
    var links = [];
    for (var i=0; i < arr.behaviors.length ; i++) {
      for (var n=0; n < arr.n[i]; n++) {
      nodes.push({"id": arr.behaviors[i] + n,  "label": arr.behaviors[i] + n, "group": 0, "behavior": arr.behaviors[i],  "group": 0, "level": 0, "playbook": [], "value": 0});
      }    
    }

    for (var i=0 ; i < nodes.length ; i++) {
      for (var n = i; n < nodes.length; n++) {
      links.push({"source": nodes[i].id, "target": nodes[n].id, "strength": .01, "invStrength": .5});
      }    
    }

    dat = {nodes, links}
    return dat;
}