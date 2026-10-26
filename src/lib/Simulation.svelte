<script>
  import { run } from "../sim/round.js";
  import { applyControl } from "../sim/settings.js";
  import { getStrategy, listStrategies } from "../sim/strategies.js";
  import Graph from "./Graph.svelte";
  import PayoffMatrix from "./PayoffMatrix.svelte";
  import ScoreTable from "./ScoreTable.svelte";
  import StrategyPicker from "./StrategyPicker.svelte";

  let {
    scenario,
    chooseBehavior = false,
    showMatrix = false,
    showScores = false,
    strategyIds = null,
  } = $props();

  let settings = $state(structuredClone(scenario.settings));
  let board = $state(structuredClone(scenario.state));
  let selectedId = $state(null);
  let adjusting = $state(false);

  let choices = $derived(
    listStrategies().filter((strategy) => !strategyIds || strategyIds.includes(strategy.id))
  );
  let selected = $derived(board.nodes.find((node) => node.id === selectedId) ?? null);

  function play() {
    board = run(board, settings, settings.roundsPerClick);
    settings = { ...settings, moveOverrides: {} };
  }

  function reset() {
    settings = structuredClone(scenario.settings);
    board = structuredClone(scenario.state);
    selectedId = null;
  }

  function chooseStrategy(strategyId) {
    const strategy = getStrategy(strategyId);
    board = {
      ...board,
      nodes: board.nodes.map((node) => (
        node.id === selectedId
          ? { ...node, strategyId, label: strategy.label }
          : node
      )),
    };
  }
</script>

<div class="simulation">
  <Graph
    {board}
    sizeRange={scenario.sizeRange}
    onselect={(id) => { if (chooseBehavior) selectedId = id; }}
  />
  <div class="sim-actions">
    <button type="button" onclick={play}>Run</button>
    <button type="button" onclick={reset}>Reset</button>
    {#if showMatrix}
      <button type="button" onclick={() => adjusting = !adjusting}>
        {adjusting ? "Hide payoffs" : "Payoffs"}
      </button>
    {/if}
  </div>
  {#if chooseBehavior && selected}
    <p>Choose how <strong>{selected.label}</strong> plays.</p>
    <StrategyPicker strategies={choices} selected={selected.strategyId} onchoose={chooseStrategy} />
  {/if}
  {#if showMatrix && adjusting}
    <PayoffMatrix
      matrix={settings.matrix}
      symmetry={settings.symmetry}
      editable={true}
      onedit={(patch) => { settings = applyControl(settings, patch); }}
    />
  {/if}
  {#if showScores}
    <ScoreTable {board} />
  {/if}
</div>

<style>
  .simulation { width: min(860px, 100%); }
  .sim-actions { display: flex; gap: 8px; margin: 8px 0 16px; }
</style>
