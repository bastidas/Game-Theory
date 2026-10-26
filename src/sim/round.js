import { applyLinkPolicy } from "./linkPolicies.js";
import { lookup } from "./payoff.js";
import { mulberry32 } from "./rng.js";
import { getStrategy } from "./strategies.js";

export function round(state, settings) {
  const nodes = new Map(state.nodes.map((node) => [node.id, { ...node }]));
  const rng = mulberry32((settings.seed ?? 1) + state.step);
  const nextLinks = [];

  for (const link of state.links) {
    const source = nodes.get(link.source);
    const target = nodes.get(link.target);
    if (!source || !target) continue;

    const sourceMove = moveFor(source, link.sourceHistory, link.targetHistory, settings, rng);
    const targetMove = moveFor(target, link.targetHistory, link.sourceHistory, settings, rng);
    const pair = lookup(settings.matrix, sourceMove, targetMove);
    source.value += pair[0];
    target.value += pair[1];

    let strength = applyLinkPolicy(settings.linkPolicy, {
      strength: link.strength,
      sourceMove,
      targetMove,
      sourcePayoff: pair[0],
      targetPayoff: pair[1],
      sourceValue: source.value,
      targetValue: target.value,
      norm: settings.linkStrengthNormalization,
    });
    if (strength > 1) strength = 1;
    if (strength <= 0) {
      if (settings.severable) continue;
      strength = settings.strengthFloor;
    }

    nextLinks.push({
      ...link,
      strength,
      sourceHistory: [...link.sourceHistory, sourceMove],
      targetHistory: [...link.targetHistory, targetMove],
    });
  }

  const degree = new Map([...nodes.keys()].map((id) => [id, 0]));
  for (const link of nextLinks) {
    degree.set(link.source, degree.get(link.source) + 1);
    degree.set(link.target, degree.get(link.target) + 1);
  }

  const nextNodes = [...nodes.values()].filter((node) => node.anchor || degree.get(node.id) > 0);
  return {
    nodes: nextNodes,
    links: nextLinks,
    step: state.step + 1,
  };
}

export function run(state, settings, n = 1) {
  let current = state;
  let active = settings;
  const rounds = Math.max(0, n | 0);
  for (let i = 0; i < rounds; i += 1) {
    current = round(current, active);
    if (i === 0) active = { ...active, moveOverrides: {} };
  }
  return current;
}

function moveFor(node, selfHistory, opponentHistory, settings, rng) {
  const override = settings.moveOverrides?.[node.id];
  if (override) return override;
  const strategy = getStrategy(node.strategyId);
  const parameters = {
    ...strategy.parameters,
    ...(settings.strategyParameters?.[node.strategyId] ?? {}),
  };
  return strategy.decide({ selfHistory, opponentHistory, parameters, rng });
}
