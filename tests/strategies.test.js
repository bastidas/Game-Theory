import assert from "node:assert/strict";
import test from "node:test";
import { aesopMatrix, prisonersDilemma } from "../src/sim/payoff.js";
import { mulberry32 } from "../src/sim/rng.js";
import { round, run } from "../src/sim/round.js";
import { defaultSettings, pairState, presets } from "../src/sim/settings.js";
import { getStrategy, listStrategies } from "../src/sim/strategies.js";

test("constants match the animals", () => {
  for (const id of ["cooperator", "aesopLion", "aesopMouse", "aesopCat", "crane"]) {
    assert.equal(decide(id, [], []), "cooperate");
  }
  for (const id of ["cheater", "aesopGoat", "aesopMonkey", "wolf"]) {
    assert.equal(decide(id, [], []), "cheat");
  }
});

test("copycat versus cheater", () => {
  const state = duel("copycat", "cheater", 4, prisonersDilemma());
  const link = state.links[0];
  assert.deepEqual(link.sourceHistory, ["cooperate", "cheat", "cheat", "cheat"]);
  assert.deepEqual(link.targetHistory, ["cheat", "cheat", "cheat", "cheat"]);
  const copycat = state.nodes.find((node) => node.strategyId === "copycat");
  const cheater = state.nodes.find((node) => node.strategyId === "cheater");
  assert.equal(copycat.value, -1);
  assert.equal(cheater.value, 2);
});

test("fox versus copycat cycles every four rounds", () => {
  const state = duel("clever", "copycat", 8, prisonersDilemma());
  const link = state.links[0];
  assert.deepEqual(link.sourceHistory, [
    "cheat", "cheat", "cooperate", "cooperate",
    "cheat", "cheat", "cooperate", "cooperate",
  ]);
  assert.deepEqual(link.targetHistory, [
    "cooperate", "cheat", "cheat", "cooperate",
    "cooperate", "cheat", "cheat", "cooperate",
  ]);
});

test("owl probes, then treats copycat, cooperator, and cheater differently", () => {
  const versusCopycat = duel("wise", "copycat", 6, prisonersDilemma());
  assert.deepEqual(versusCopycat.links[0].sourceHistory, [
    "cooperate", "cheat", "cooperate", "cooperate", "cooperate", "cooperate",
  ]);

  const versusCooperator = duel("wise", "cooperator", 6, prisonersDilemma());
  assert.deepEqual(versusCooperator.links[0].sourceHistory.slice(4), ["cheat", "cheat"]);

  const versusCheater = duel("wise", "cheater", 6, prisonersDilemma());
  assert.deepEqual(versusCheater.links[0].sourceHistory, [
    "cooperate", "cheat", "cooperate", "cooperate", "cheat", "cheat",
  ]);
});

test("owl decide receives no strategy id", () => {
  const view = { selfHistory: [], opponentHistory: [], parameters: {}, rng: () => 0 };
  assert.equal(Object.hasOwn(view, "strategyId"), false);
  assert.equal(getStrategy("wise").decide(view), "cooperate");
});

test("wolf cheats on the first round against a cooperating crane", () => {
  const preset = presets().craneAndWolf;
  const state = round(preset.state, preset.settings);
  const link = state.links[0];
  assert.equal(link.sourceHistory[0], "cooperate");
  assert.equal(link.targetHistory[0], "cheat");
  const crane = state.nodes.find((node) => node.strategyId === "crane");
  const wolf = state.nodes.find((node) => node.strategyId === "wolf");
  assert.equal(crane.value, -1);
  assert.equal(wolf.value, 3);
});

test("crane override lasts one round", () => {
  const preset = presets().craneAndWolf;
  const crane = preset.state.nodes.find((node) => node.strategyId === "crane");
  const settings = {
    ...preset.settings,
    moveOverrides: { [crane.id]: "cheat" },
  };
  const state = run(preset.state, settings, 2);
  assert.deepEqual(state.links[0].sourceHistory, ["cheat", "cooperate"]);
  assert.deepEqual(state.links[0].targetHistory, ["cheat", "cheat"]);
});

test("aesop lion, mouse, goats, and cat versus monkey", () => {
  const lion = round(presets().lionAndMouse.state, presets().lionAndMouse.settings);
  assert.equal(lion.nodes.every((node) => node.value === 3), true);

  const goats = round(presets().twoGoats.state, presets().twoGoats.settings);
  assert.equal(goats.nodes.every((node) => node.value === -2), true);

  const trick = round(presets().monkeyAndCat.state, presets().monkeyAndCat.settings);
  const cat = trick.nodes.find((node) => node.strategyId === "aesopCat");
  const monkey = trick.nodes.find((node) => node.strategyId === "aesopMonkey");
  assert.equal(cat.value, -1);
  assert.equal(monkey.value, 3);
});

test("seeded random is an exact sequence", () => {
  const rng = mulberry32(1);
  const moves = Array.from({ length: 8 }, () => getStrategy("random").decide({
    selfHistory: [],
    opponentHistory: [],
    parameters: { p: 0.5 },
    rng,
  }));
  assert.deepEqual(moves, [
    "cheat",
    "cooperate",
    "cheat",
    "cheat",
    "cheat",
    "cooperate",
    "cheat",
    "cheat",
  ]);
});

test("two runs with the same seed match", () => {
  const settings = defaultSettings();
  const start = pairState("random", "random", 0.5);
  assert.deepEqual(run(start, settings, 5), run(structuredClone(start), settings, 5));
});

test("every strategy documents itself", () => {
  for (const strategy of listStrategies()) {
    assert.equal(typeof strategy.description, "string");
    assert.ok(strategy.description.length > 10);
    assert.ok(strategy.animal);
    assert.equal(typeof strategy.decide, "function");
  }
});

function decide(id, selfHistory, opponentHistory) {
  return getStrategy(id).decide({
    selfHistory,
    opponentHistory,
    parameters: {},
    rng: () => 0,
  });
}

function duel(sourceStrategy, targetStrategy, rounds, matrix) {
  let state = pairState(sourceStrategy, targetStrategy, 0.5);
  const settings = defaultSettings({ matrix, linkPolicy: "strengthDefault" });
  for (let i = 0; i < rounds; i += 1) state = round(state, settings);
  return state;
}
