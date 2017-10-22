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
    "strength": 0.1,
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
    "strength": 0.1,
    "invStrength": .1
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
    "strength": 0.1,
    "invStrength": .1
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
    "source": "monkey",
    "target": "cat",
    "strength": 0.1,
    "invStrength": .1
  }]
}
