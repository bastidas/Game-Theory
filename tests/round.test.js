import assert from "node:assert/strict";
import test from "node:test";
import { round } from "../src/sim/round.js";
import { defaultSettings, makeLink, makeNode } from "../src/sim/settings.js";

test("a round does not mutate the previous state", () => {
  const state = {
    nodes: [makeNode("cooperator", 0), makeNode("cheater", 0, { group: 1 })],
    links: [makeLink("cooperator0", "cheater0", 0.5)],
    step: 0,
  };
  const snapshot = structuredClone(state);
  round(state, defaultSettings());
  assert.deepEqual(state, snapshot);
});

test("histories live on the link", () => {
  const state = round(community(), defaultSettings({ linkPolicy: "strengthDefault" }));
  assert.equal("playbook" in state.nodes[0], false);
  assert.equal(state.links[0].sourceHistory.length, 1);
  assert.equal(state.links[0].targetHistory.length, 1);
});

test("freewill rewards mutual cooperation and clamps at 1", () => {
  const state = {
    nodes: [makeNode("cooperator", 0), makeNode("cooperator", 1, { group: 1 })],
    links: [makeLink("cooperator0", "cooperator1", 0.9)],
    step: 0,
  };
  const next = round(state, defaultSettings({
    linkPolicy: "strengthByFreewill",
    linkStrengthNormalization: 0.1,
  }));
  assert.equal(next.links[0].strength, 1);
});

test("freewill does not follow a harsher matrix", () => {
  const friendly = round(cheaterPair(0.5), defaultSettings({
    linkPolicy: "strengthByFreewill",
    linkStrengthNormalization: 0.1,
  }));
  const harsh = round(cheaterPair(0.5), defaultSettings({
    linkPolicy: "strengthByFreewill",
    linkStrengthNormalization: 0.1,
    matrix: {
      reward: [1, 1],
      suckerTemptation: [-9, 9],
      temptationSucker: [9, -9],
      punishment: [-9, -9],
    },
  }));
  assert.equal(friendly.links[0].strength, harsh.links[0].strength);
  assert.notEqual(friendly.nodes[0].value, harsh.nodes[0].value);
});

test("severing drops the link and then the isolated animals", () => {
  const next = round(cheaterPair(0.05), defaultSettings({
    linkPolicy: "strengthByFreewill",
    linkStrengthNormalization: 0.1,
    severable: true,
  }));
  assert.equal(next.links.length, 0);
  assert.equal(next.nodes.length, 0);
});

test("degree zero is the removal rule, and an anchor stays", () => {
  const state = cheaterPair(0.05);
  state.nodes.push({ ...makeNode("cooperator", 2), anchor: true });
  const next = round(state, defaultSettings({
    linkPolicy: "strengthByFreewill",
    linkStrengthNormalization: 0.1,
    severable: true,
  }));
  assert.deepEqual(next.nodes.map((node) => node.id), ["cooperator2"]);
});

test("a failing link floors instead of disappearing when it cannot be severed", () => {
  const next = round(cheaterPair(0.05), defaultSettings({
    linkPolicy: "strengthBySource",
    linkStrengthNormalization: 0.1,
    severable: false,
    strengthFloor: 0.01,
    matrix: {
      reward: [3, 3],
      suckerTemptation: [-1, 3],
      temptationSucker: [3, -1],
      punishment: [-2, -2],
    },
  }));
  assert.equal(next.links[0].strength, 0.01);
  assert.equal(next.nodes.length, 2);
});

test("weighted strength compounds and still clamps at 1", () => {
  const state = {
    nodes: [
      { ...makeNode("cooperator", 0), value: 20 },
      { ...makeNode("cooperator", 1, { group: 1 }), value: 20 },
    ],
    links: [makeLink("cooperator0", "cooperator1", 0.5)],
    step: 0,
  };
  const next = round(state, defaultSettings({
    linkPolicy: "strengthByWeightedValue",
    linkStrengthNormalization: 0.1,
  }));
  assert.equal(next.links[0].strength, 1);
});

function cheaterPair(strength) {
  return {
    nodes: [makeNode("cheater", 0), makeNode("cheater", 1, { group: 1 })],
    links: [makeLink("cheater0", "cheater1", strength)],
    step: 0,
  };
}

function community() {
  return {
    nodes: [makeNode("cooperator", 0), makeNode("copycat", 0, { group: 1 })],
    links: [makeLink("cooperator0", "copycat0", 0.4)],
    step: 0,
  };
}
