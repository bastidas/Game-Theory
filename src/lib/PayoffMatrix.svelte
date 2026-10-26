<script>
  import { describe, gameLabels, lookup } from "../sim/payoff.js";

  let {
    matrix,
    symmetry = true,
    editable = false,
    onedit = () => {},
  } = $props();

  const rows = ["cooperate", "cheat"];

  const cellName = {
    "cooperate|cooperate": "reward",
    "cooperate|cheat": "suckerTemptation",
    "cheat|cooperate": "temptationSucker",
    "cheat|cheat": "punishment",
  };

  function bump(rowMove, columnMove, player, delta) {
    const name = cellName[`${rowMove}|${columnMove}`];
    const current = lookup(matrix, rowMove, columnMove)[player];
    onedit({ matrixCell: { cell: name, player, value: current + delta } });
  }
</script>

<div class="matrix-wrap">
  <h3>Payoff matrix</h3>
  <p class="game-name">{gameLabels[describe(matrix)]}</p>
  <table class="payoff-table">
    <tbody>
    <tr>
      <th colspan="2"></th>
      <th colspan="2" class="player1">Player 1</th>
    </tr>
    <tr>
      <th colspan="2"></th>
      <th class="player1">cooperate</th>
      <th class="player1">cheat</th>
    </tr>
    {#each rows as rowMove, rowIndex}
      <tr>
        {#if rowIndex === 0}
          <th rowspan="2" class="player2">Player 2</th>
        {/if}
        <th class="player2">{rowMove}</th>
        {#each [0, 1] as columnIndex}
          {@const columnMove = columnIndex === 0 ? "cooperate" : "cheat"}
          <td class="tableDat">
            {#if editable}
              <span class="cell-controls">
                <button type="button" aria-label="Increase player 2 payoff" onclick={() => bump(rowMove, columnMove, 0, 1)}>+</button>
                <button type="button" aria-label="Increase player 1 payoff" onclick={() => bump(rowMove, columnMove, 1, 1)}>+</button>
              </span>
            {/if}
            <span class="player2">{lookup(matrix, rowMove, columnMove)[0]}</span>,
            <span class="player1">{lookup(matrix, rowMove, columnMove)[1]}</span>
            {#if editable}
              <span class="cell-controls">
                <button type="button" aria-label="Decrease player 2 payoff" onclick={() => bump(rowMove, columnMove, 0, -1)}>-</button>
                <button type="button" aria-label="Decrease player 1 payoff" onclick={() => bump(rowMove, columnMove, 1, -1)}>-</button>
              </span>
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
    </tbody>
  </table>
  {#if editable && symmetry}
    <p class="matrix-note">Symmetry is on. An edit updates the mirrored cell too.</p>
  {/if}
</div>

<style>
  .matrix-wrap { max-width: 520px; }
  .game-name { margin-top: 0; }
  .cell-controls { display: flex; gap: 4px; justify-content: center; }
  .cell-controls button { min-width: 28px; }
  td { text-align: center; }
</style>
