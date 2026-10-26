export const linkPolicyNames = [
  "strengthDefault",
  "strengthByFreewill",
  "strengthBySource",
  "strengthByTarget",
  "strengthBySum",
  "strengthByValue",
  "strengthByWeightedValue",
];

export const linkPolicyLabels = {
  strengthDefault: "Leave the link alone",
  strengthByFreewill: "Reward mutual cooperation",
  strengthBySource: "Follow the source payoff",
  strengthByTarget: "Follow the target payoff",
  strengthBySum: "Follow both payoffs",
  strengthByValue: "Follow the current leader",
  strengthByWeightedValue: "Compound by running score",
};

export function applyLinkPolicy(name, ctx) {
  const policy = policies[name];
  if (!policy) throw new Error(`Unknown link policy ${name}`);
  return policy(ctx);
}

const policies = {
  strengthDefault({ strength }) {
    return strength;
  },
  strengthByFreewill({ strength, sourceMove, targetMove, norm }) {
    const bothCooperate = sourceMove === "cooperate" && targetMove === "cooperate";
    return strength + (bothCooperate ? 2 : -1) * norm;
  },
  strengthBySource({ strength, sourcePayoff, norm }) {
    return strength + sourcePayoff * norm;
  },
  strengthByTarget({ strength, targetPayoff, norm }) {
    return strength + targetPayoff * norm;
  },
  strengthBySum({ strength, sourcePayoff, targetPayoff, norm }) {
    return strength + (sourcePayoff + targetPayoff) * norm;
  },
  strengthByValue({ strength, sourceValue, targetValue, sourcePayoff, targetPayoff, norm }) {
    const payoff = sourceValue >= targetValue ? sourcePayoff : targetPayoff;
    return strength + payoff * norm;
  },
  strengthByWeightedValue({ strength, sourceValue, targetValue, sourcePayoff, targetPayoff, norm }) {
    return strength
      + sourceValue * sourcePayoff * norm
      + targetValue * targetPayoff * norm;
  },
};
