<script>
  import { run } from "../sim/round.js";
  import { presets } from "../sim/settings.js";
  import Graph from "./Graph.svelte";

  const scenario = presets().craneAndWolf;
  let settings = $state(structuredClone(scenario.settings));
  let board = $state(structuredClone(scenario.state));
  let consequence = $state("");

  const outcomes = {
    cooperate: "The crane pulled the bone free. The wolf walked away, and called the crane's own life reward enough.",
    cheat: "The crane refused to put her head in the wolf's mouth. The wolf still offered nothing.",
  };

  function choose(move) {
    const crane = board.nodes.find((node) => node.strategyId === "crane");
    settings = { ...settings, moveOverrides: { [crane.id]: move } };
    board = run(board, settings, 1);
    settings = { ...settings, moveOverrides: {} };
    consequence = outcomes[move];
  }
</script>

<div class="crane">
  <div class="story">
    <p>
      A wolf had been feasting too greedily, and a bone had stuck in his throat.
      He asked the crane, with her long neck and bill, to pull it out, and promised a handsome reward.
    </p>
    <div class="sim-actions">
      <button type="button" onclick={() => choose("cooperate")}>Cooperate</button>
      <button type="button" onclick={() => choose("cheat")}>Cheat</button>
    </div>
    {#if consequence}
      <p>{consequence}</p>
    {/if}
  </div>
  <Graph {board} sizeRange={scenario.sizeRange} />
</div>

<style>
  .crane { width: min(920px, 100%); display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: center; }
  .sim-actions { display: flex; gap: 8px; }
  @media (max-width: 800px) {
    .crane { grid-template-columns: 1fr; }
  }
</style>
