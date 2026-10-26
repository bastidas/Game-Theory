import { aesopMatrix, cooperationMatrix, mirror, prisonersDilemma } from "./payoff.js";
import { getStrategy, listStrategies } from "./strategies.js";

export function defaultSettings(overrides = {}) {
  return {
    matrix: prisonersDilemma(),
    linkPolicy: "strengthByFreewill",
    linkStrengthNormalization: 0.1,
    severable: false,
    strengthFloor: 0.01,
    seed: 1,
    roundsPerClick: 1,
    symmetry: true,
    strategyParameters: { random: { p: 0.5 } },
    moveOverrides: {},
    ...overrides,
  };
}

export function applyControl(settings, patch) {
  const next = cloneSettings(settings);

  if (patch.matrix) next.matrix = cloneSettings(patch.matrix);

  if (patch.matrixCell) {
    const { cell, player, value } = patch.matrixCell;
    writeCell(next, cell, player, value);
  }

  for (const key of [
    "linkPolicy",
    "linkStrengthNormalization",
    "severable",
    "strengthFloor",
    "seed",
    "roundsPerClick",
    "moveOverrides",
    "strategyParameters",
  ]) {
    if (key in patch) next[key] = cloneSettings(patch[key]);
  }

  if ("randomP" in patch) {
    next.strategyParameters = {
      ...next.strategyParameters,
      random: { ...next.strategyParameters.random, p: patch.randomP },
    };
  }

  if ("symmetry" in patch) next.symmetry = patch.symmetry;
  if (next.symmetry && (patch.matrixCell || patch.symmetry === true || patch.matrix)) {
    next.matrix = mirror(next.matrix);
  }

  return next;
}

function cloneSettings(value) {
  return JSON.parse(JSON.stringify(value));
}

function writeCell(settings, cell, player, value) {
  if (!settings.symmetry) {
    settings.matrix[cell][player] = value;
    return;
  }
  if (cell === "reward" || cell === "punishment") {
    settings.matrix[cell] = [value, value];
    return;
  }
  if (cell === "suckerTemptation") {
    settings.matrix.suckerTemptation[player] = value;
    return;
  }
  if (cell === "temptationSucker") {
    settings.matrix.suckerTemptation[player === 0 ? 1 : 0] = value;
  }
}

export function makeLink(source, target, strength) {
  return {
    id: `${source}--${target}`,
    source,
    target,
    strength,
    sourceHistory: [],
    targetHistory: [],
  };
}

export function makeNode(strategyId, n = 0, extras = {}) {
  const strategy = getStrategy(strategyId);
  const id = extras.id ?? `${strategyId}${n}`;
  return {
    id,
    label: extras.label ?? `${strategy.label} ${n + 1}`,
    strategyId,
    value: extras.value ?? 0,
    group: extras.group ?? 0,
  };
}

export function pairState(leftStrategy, rightStrategy, strength = 0.2) {
  const left = makeNode(leftStrategy, 0, { group: 0, label: getStrategy(leftStrategy).label });
  const rightIndex = leftStrategy === rightStrategy ? 1 : 0;
  const rightLabel = leftStrategy === rightStrategy
    ? `${getStrategy(rightStrategy).label} 2`
    : getStrategy(rightStrategy).label;
  const right = makeNode(rightStrategy, rightIndex, { group: 1, label: rightLabel });
  return {
    nodes: [left, right],
    links: [makeLink(left.id, right.id, strength)],
    step: 0,
  };
}

export function fullyConnected(counts, strength = 0.5) {
  const nodes = [];
  for (const strategy of listStrategies()) {
    const count = counts[strategy.id] ?? 0;
    for (let n = 0; n < count; n += 1) {
      nodes.push(makeNode(strategy.id, n, { group: nodes.length % 3 }));
    }
  }
  const links = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      links.push(makeLink(nodes[i].id, nodes[j].id, strength));
    }
  }
  return { nodes, links, step: 0 };
}

export function emptyState() {
  return { nodes: [], links: [], step: 0 };
}

export function addAnimal(state, strategyId) {
  const count = state.nodes.filter((node) => node.strategyId === strategyId).length;
  const node = makeNode(strategyId, count, { group: state.nodes.length % 3 });
  const links = state.nodes.map((other) => makeLink(node.id, other.id, 0.5));
  return {
    nodes: [...state.nodes, node],
    links: [...state.links, ...links],
    step: state.step,
  };
}

const six = {
  cooperator: 1,
  copycat: 1,
  cheater: 1,
  clever: 1,
  random: 1,
  wise: 1,
};

export function presets() {
  return {
    lionAndMouse: scenario("Lion and mouse", pairState("aesopLion", "aesopMouse"), {
      matrix: aesopMatrix(),
      linkPolicy: "strengthBySource",
    }, "absolute"),
    twoGoats: scenario("Two goats", pairState("aesopGoat", "aesopGoat"), {
      matrix: aesopMatrix(),
      linkPolicy: "strengthBySource",
    }, "absolute"),
    monkeyAndCat: scenario("Monkey and cat", pairState("aesopCat", "aesopMonkey"), {
      matrix: aesopMatrix(),
      linkPolicy: "strengthBySource",
    }, "absolute"),
    craneAndWolf: scenario("Crane and wolf", pairState("crane", "wolf", 0.2), {
      matrix: aesopMatrix(),
      linkPolicy: "strengthBySource",
    }, "absolute"),
    prisonersPair: scenario("Prisoner's dilemma pair", pairState("cooperator", "cheater", 0.5), {
      matrix: prisonersDilemma(),
      linkPolicy: "strengthByFreewill",
    }, [20, 45]),
    sixAnimals: scenario("Six animals", fullyConnected(six), {
      matrix: prisonersDilemma(),
      linkPolicy: "strengthByFreewill",
      linkStrengthNormalization: 0.1,
      severable: false,
    }, [20, 45]),
    walkAway: scenario("Walk away", fullyConnected(six, 0.5), {
      matrix: prisonersDilemma(),
      linkPolicy: "strengthByFreewill",
      severable: true,
    }, [20, 45]),
    bridge: scenario("Bridge community", fullyConnected({ cooperator: 5, cheater: 5 }), {
      matrix: prisonersDilemma(),
      linkPolicy: "strengthByFreewill",
      linkStrengthNormalization: 0.25,
      severable: true,
    }, [15, 35]),
    cooperation: scenario("Cooperation payoffs", pairState("cooperator", "cooperator", 0.5), {
      matrix: cooperationMatrix(),
      linkPolicy: "strengthDefault",
    }, "absolute"),
    empty: scenario("Empty graph", emptyState(), {
      matrix: prisonersDilemma(),
      linkPolicy: "strengthByFreewill",
    }, [20, 45]),
  };
}

function scenario(label, state, settingOverrides, sizeRange) {
  return {
    label,
    state,
    settings: defaultSettings(settingOverrides),
    sizeRange,
  };
}
