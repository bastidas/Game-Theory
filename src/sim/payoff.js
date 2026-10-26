export const COOPERATE = "cooperate";
export const CHEAT = "cheat";

export function prisonersDilemma() {
  return {
    reward: [1, 1],
    suckerTemptation: [-1, 2],
    temptationSucker: [2, -1],
    punishment: [0, 0],
  };
}

export function aesopMatrix() {
  return {
    reward: [3, 3],
    suckerTemptation: [-1, 3],
    temptationSucker: [3, -1],
    punishment: [-2, -2],
  };
}

// Page 9: betrayal pays the betrayer nothing and hurts the partner.
export function cooperationMatrix() {
  return {
    reward: [1, 1],
    suckerTemptation: [-1, 0],
    temptationSucker: [0, -1],
    punishment: [-2, -2],
  };
}

const CELLS = {
  [`${COOPERATE}|${COOPERATE}`]: "reward",
  [`${COOPERATE}|${CHEAT}`]: "suckerTemptation",
  [`${CHEAT}|${COOPERATE}`]: "temptationSucker",
  [`${CHEAT}|${CHEAT}`]: "punishment",
};

export function lookup(matrix, rowMove, columnMove) {
  const cell = CELLS[`${rowMove}|${columnMove}`];
  if (!cell || !matrix[cell]) {
    throw new Error(`No payoff for moves ${rowMove}, ${columnMove}`);
  }
  return matrix[cell];
}

export function describe(matrix) {
  const rowPd = isPrisonersDilemma(matrix, 0);
  const columnPd = isPrisonersDilemma(matrix, 1);
  if (rowPd && columnPd) return "prisonersDilemma";
  if (cooperationDominates(matrix, 0) && cooperationDominates(matrix, 1)) {
    return "cooperationDominates";
  }
  return "other";
}

export const gameLabels = {
  prisonersDilemma: "Prisoner's dilemma",
  cooperationDominates: "Cooperation dominates",
  other: "Other game",
};

function isPrisonersDilemma(matrix, player) {
  const reward = matrix.reward[player];
  const punishment = matrix.punishment[player];
  const temptation = player === 0 ? matrix.temptationSucker[0] : matrix.suckerTemptation[1];
  const sucker = player === 0 ? matrix.suckerTemptation[0] : matrix.temptationSucker[1];
  return temptation > reward
    && reward > punishment
    && punishment > sucker
    && 2 * reward > temptation + sucker;
}

function cooperationDominates(matrix, player) {
  const reward = matrix.reward[player];
  const punishment = matrix.punishment[player];
  const temptation = player === 0 ? matrix.temptationSucker[0] : matrix.suckerTemptation[1];
  const sucker = player === 0 ? matrix.suckerTemptation[0] : matrix.temptationSucker[1];
  return reward >= temptation && sucker >= punishment;
}

// Off-diagonal source of truth is suckerTemptation. Diagonal source of truth is index 0.
export function mirror(matrix) {
  const [sucker, temptation] = matrix.suckerTemptation;
  return {
    reward: [matrix.reward[0], matrix.reward[0]],
    punishment: [matrix.punishment[0], matrix.punishment[0]],
    suckerTemptation: [sucker, temptation],
    temptationSucker: [temptation, sucker],
  };
}
