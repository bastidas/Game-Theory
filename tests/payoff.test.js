import assert from "node:assert/strict";
import test from "node:test";
import { applyControl, defaultSettings } from "../src/sim/settings.js";
import {
  aesopMatrix,
  cooperationMatrix,
  describe,
  lookup,
  mirror,
  prisonersDilemma,
} from "../src/sim/payoff.js";

test("prisoner's dilemma cells", () => {
  const matrix = prisonersDilemma();
  assert.deepEqual(lookup(matrix, "cooperate", "cooperate"), [1, 1]);
  assert.deepEqual(lookup(matrix, "cooperate", "cheat"), [-1, 2]);
  assert.deepEqual(lookup(matrix, "cheat", "cooperate"), [2, -1]);
  assert.deepEqual(lookup(matrix, "cheat", "cheat"), [0, 0]);
  assert.equal(describe(matrix), "prisonersDilemma");
});

test("aesop cells", () => {
  const matrix = aesopMatrix();
  assert.deepEqual(lookup(matrix, "cooperate", "cooperate"), [3, 3]);
  assert.deepEqual(lookup(matrix, "cheat", "cheat"), [-2, -2]);
  assert.deepEqual(lookup(matrix, "cooperate", "cheat"), [-1, 3]);
  assert.equal(describe(matrix), "cooperationDominates");
});

test("cooperation matrix matches the closing page", () => {
  const matrix = cooperationMatrix();
  assert.deepEqual(lookup(matrix, "cheat", "cooperate"), [0, -1]);
  assert.deepEqual(lookup(matrix, "cheat", "cheat"), [-2, -2]);
  assert.equal(describe(matrix), "cooperationDominates");
});

test("lookup rejects an unknown move", () => {
  assert.throws(() => lookup(prisonersDilemma(), "maybe", "cooperate"));
});

test("a payoff button writes the cell the panel displays", () => {
  const settings = defaultSettings({ symmetry: true });
  const raised = applyControl(settings, {
    matrixCell: { cell: "reward", player: 0, value: 2 },
  });
  assert.deepEqual(lookup(raised.matrix, "cooperate", "cooperate"), [2, 2]);
  const temptation = applyControl(raised, {
    matrixCell: { cell: "suckerTemptation", player: 1, value: 3 },
  });
  assert.deepEqual(lookup(temptation.matrix, "cooperate", "cheat"), [-1, 3]);
  assert.deepEqual(lookup(temptation.matrix, "cheat", "cooperate"), [3, -1]);
});
test("mirror keeps a symmetric dilemma symmetric", () => {
  const matrix = prisonersDilemma();
  matrix.suckerTemptation = [-3, 4];
  const mirrored = mirror(matrix);
  assert.deepEqual(mirrored.temptationSucker, [4, -3]);
  assert.deepEqual(mirrored.reward, [1, 1]);
});
