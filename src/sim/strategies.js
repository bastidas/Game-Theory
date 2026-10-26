import { COOPERATE, CHEAT } from "./payoff.js";

const always = (move) => () => move;

const copyLast = ({ opponentHistory }) => {
  if (opponentHistory.length === 0) return COOPERATE;
  return opponentHistory[opponentHistory.length - 1];
};

const oppositeLast = ({ opponentHistory }) => {
  if (opponentHistory.length === 0) return CHEAT;
  return opponentHistory[opponentHistory.length - 1] === COOPERATE ? CHEAT : COOPERATE;
};

const opening = [COOPERATE, CHEAT, COOPERATE, COOPERATE];

function detective({ selfHistory, opponentHistory }) {
  if (selfHistory.length < opening.length) return opening[selfHistory.length];
  const retaliated = opponentHistory[2] === CHEAT;
  if (retaliated) return copyLast({ opponentHistory });
  return CHEAT;
}

function randomMove({ parameters, rng }) {
  const p = parameters.p ?? 0.5;
  if (typeof rng !== "function") throw new Error("random strategy requires an rng");
  return rng() < p ? COOPERATE : CHEAT;
}

const strategies = [
  {
    id: "cooperator",
    label: "dog",
    animal: "dog",
    description: "The dog always cooperates.",
    parameters: {},
    decide: always(COOPERATE),
  },
  {
    id: "cheater",
    label: "snake",
    animal: "snake",
    description: "The snake always cheats.",
    parameters: {},
    decide: always(CHEAT),
  },
  {
    id: "copycat",
    label: "cat",
    animal: "cat",
    description: "The cat starts by cooperating, then plays this opponent's previous move.",
    parameters: {},
    decide: copyLast,
  },
  {
    id: "clever",
    label: "fox",
    animal: "fox",
    description: "The fox starts by cheating, then plays the opposite of this opponent's previous move.",
    parameters: {},
    decide: oppositeLast,
  },
  {
    id: "wise",
    label: "owl",
    animal: "owl",
    description: "The owl learns from this opponent's moves only. It probes, then copies animals that retaliate and cheats against animals that do not.",
    parameters: {},
    decide: detective,
  },
  {
    id: "random",
    label: "monkey",
    animal: "chimpanzee",
    description: "The monkey cooperates or cheats with even probability, at random.",
    parameters: { p: 0.5 },
    decide: randomMove,
  },
  {
    id: "aesopLion",
    label: "lion",
    animal: "lion",
    description: "The lion cooperates. In the fable, he lets the mouse go.",
    parameters: {},
    decide: always(COOPERATE),
  },
  {
    id: "aesopMouse",
    label: "mouse",
    animal: "mouse",
    description: "The mouse cooperates. In the fable, she frees the lion.",
    parameters: {},
    decide: always(COOPERATE),
  },
  {
    id: "aesopCat",
    label: "cat",
    animal: "cat",
    description: "Aesop's cat cooperates, and the monkey exploits that.",
    parameters: {},
    decide: always(COOPERATE),
  },
  {
    id: "aesopGoat",
    label: "goat",
    animal: "goat",
    description: "The goat cheats. Neither goat yields.",
    parameters: {},
    decide: always(CHEAT),
  },
  {
    id: "aesopMonkey",
    label: "monkey",
    animal: "chimpanzee",
    description: "Aesop's monkey cheats, and eats the chestnuts the cat pulls from the fire.",
    parameters: {},
    decide: always(CHEAT),
  },
  {
    id: "wolf",
    label: "wolf",
    animal: "wolf",
    description: "The wolf always cheats. In the fable, he refuses to pay the crane.",
    parameters: {},
    decide: always(CHEAT),
  },
  {
    id: "crane",
    label: "crane",
    animal: "crane",
    description: "The crane plays the move you choose for this round, and cooperates when you have not chosen.",
    parameters: {},
    decide: always(COOPERATE),
  },
];

const byId = new Map(strategies.map((strategy) => [strategy.id, strategy]));

export function getStrategy(id) {
  const strategy = byId.get(id);
  if (!strategy) throw new Error(`Unknown strategy ${id}`);
  return strategy;
}

export function listStrategies() {
  return strategies.map((strategy) => ({ ...strategy }));
}

export const narrativeStrategyIds = ["cooperator", "cheater", "copycat", "clever", "wise", "random"];
