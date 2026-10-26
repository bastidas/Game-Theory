<script>
  import Credits from "./lib/Credits.svelte";
  import Graph from "./lib/Graph.svelte";
  import PayoffMatrix from "./lib/PayoffMatrix.svelte";
  import ScoreTable from "./lib/ScoreTable.svelte";
  import StrategyPicker from "./lib/StrategyPicker.svelte";
  import { linkPolicyLabels, linkPolicyNames } from "./sim/linkPolicies.js";
  import { run } from "./sim/round.js";
  import { addAnimal, applyControl, fullyConnected, presets } from "./sim/settings.js";
  import { getStrategy, listStrategies } from "./sim/strategies.js";

  const catalog = presets();
  const strategies = listStrategies();
  const presetIds = Object.keys(catalog);

  let presetId = $state("sixAnimals");
  let settings = $state(structuredClone(catalog.sixAnimals.settings));
  let board = $state(structuredClone(catalog.sixAnimals.state));
  let sizeRange = $state(catalog.sixAnimals.sizeRange);
  let selectedId = $state(null);
  let population = $state(Object.fromEntries(strategies.map((strategy) => [
    strategy.id,
    catalog.sixAnimals.state.nodes.filter((node) => node.strategyId === strategy.id).length,
  ])));
  let addId = $state(strategies[0].id);
  let overrideMove = $state("cooperate");

  let selected = $derived(board.nodes.find((node) => node.id === selectedId) ?? null);

  function loadPreset(id) {
    const scenario = catalog[id];
    presetId = id;
    settings = structuredClone(scenario.settings);
    board = structuredClone(scenario.state);
    sizeRange = scenario.sizeRange;
    selectedId = null;
    population = Object.fromEntries(strategies.map((strategy) => [
      strategy.id,
      scenario.state.nodes.filter((node) => node.strategyId === strategy.id).length,
    ]));
  }

  function play(rounds) {
    board = run(board, settings, rounds);
    settings = { ...settings, moveOverrides: {} };
  }

  function reset() {
    const scenario = catalog[presetId];
    settings = structuredClone(scenario.settings);
    board = structuredClone(scenario.state);
    selectedId = null;
  }

  function edit(patch) {
    settings = applyControl(settings, patch);
  }

  function applyPopulation() {
    const counts = Object.fromEntries(strategies.map((strategy) => [strategy.id, Number(population[strategy.id]) || 0]));
    board = fullyConnected(counts);
    selectedId = null;
  }

  function chooseStrategy(strategyId) {
    const strategy = getStrategy(strategyId);
    board = {
      ...board,
      nodes: board.nodes.map((node) => (
        node.id === selectedId ? { ...node, strategyId, label: strategy.label } : node
      )),
    };
  }

  function armOverride() {
    if (!selected) return;
    settings = applyControl(settings, {
      moveOverrides: { [selected.id]: overrideMove },
    });
  }
</script>

<main class="sandbox">
  <header>
    <p class="back"><a href="/">Back to the essay</a></p>
    <h1>Workshop</h1>
    <p class="intro">Choose a cast, set what each outcome pays, and run the same rules as the essay.</p>
  </header>
  <div class="layout">
    <section class="stage">
      <Graph {board} {sizeRange} onselect={(id) => selectedId = id} />
      <div class="row">
        <button type="button" class="icon-button" onclick={() => play(settings.roundsPerClick)} aria-label="Run">
          <img
            src="imgs/icons/gear.png"
            alt=""
            onmouseenter={(event) => { event.currentTarget.src = "imgs/icons/gear_filled.png"; }}
            onmouseleave={(event) => { event.currentTarget.src = "imgs/icons/gear.png"; }}
          />
        </button>
        <button type="button" class="icon-button" onclick={reset} aria-label="Reset">
          <img
            src="imgs/icons/reset.png"
            alt=""
            onmouseenter={(event) => { event.currentTarget.src = "imgs/icons/reset_filled.png"; }}
            onmouseleave={(event) => { event.currentTarget.src = "imgs/icons/reset.png"; }}
          />
        </button>
        <button type="button" class="step-button" onclick={() => play(1)}>Step</button>
      </div>
      <ScoreTable {board} />
    </section>
    <form onsubmit={(event) => event.preventDefault()}>
      <fieldset>
        <legend>Scenario</legend>
        <label>
          Preset
          <select value={presetId} onchange={(event) => loadPreset(event.currentTarget.value)}>
            {#each presetIds as id}
              <option value={id}>{catalog[id].label}</option>
            {/each}
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend>Payoffs</legend>
        <PayoffMatrix
          matrix={settings.matrix}
          symmetry={settings.symmetry}
          editable={true}
          onedit={edit}
        />
        <label class="check">
          <input
            type="checkbox"
            checked={settings.symmetry}
            onchange={(event) => edit({ symmetry: event.currentTarget.checked })}
          />
          Keep the matrix symmetric
        </label>
      </fieldset>

      <fieldset>
        <legend>Animals</legend>
        <div class="population">
          {#each strategies as strategy (strategy.id)}
            <label>
              {strategy.label}
              <input type="number" min="0" max="12" bind:value={population[strategy.id]} />
            </label>
          {/each}
        </div>
        <button type="button" class="text-button" onclick={applyPopulation}>Apply population</button>
        <label>
          Add one animal
          <select bind:value={addId}>
            {#each strategies as strategy}
              <option value={strategy.id}>{strategy.label} — {strategy.description}</option>
            {/each}
          </select>
        </label>
        <button type="button" class="text-button" onclick={() => { board = addAnimal(board, addId); }}>Add animal</button>
        {#if selected}
          <div class="chosen">
            <h2>{selected.label}</h2>
            <StrategyPicker strategies={strategies} selected={selected.strategyId} onchoose={chooseStrategy} />
            <label>
              Next-round override
              <select bind:value={overrideMove}>
                <option value="cooperate">cooperate</option>
                <option value="cheat">cheat</option>
              </select>
            </label>
            <button type="button" class="text-button" onclick={armOverride}>Use this move on the next step</button>
            {#if settings.moveOverrides[selected.id]}
              <p class="hint">Armed: {settings.moveOverrides[selected.id]}</p>
            {/if}
          </div>
        {:else}
          <p class="hint">Click an animal to change its strategy or arm a one-round move.</p>
        {/if}
      </fieldset>

      <fieldset>
        <legend>Ties</legend>
        <label>
          Link rule
          <select value={settings.linkPolicy} onchange={(event) => edit({ linkPolicy: event.currentTarget.value })}>
            {#each linkPolicyNames as name}
              <option value={name}>{linkPolicyLabels[name]}</option>
            {/each}
          </select>
        </label>
        <p class="hint">
          {#if settings.linkPolicy === "strengthByFreewill"}
            Mutual cooperation strengthens the link. Every other outcome weakens it, whatever the matrix says.
          {:else if settings.linkPolicy === "strengthByWeightedValue"}
            A lead compounds: strength changes by payoff times the running score, then clamps at 1.
          {:else}
            {linkPolicyLabels[settings.linkPolicy]}.
          {/if}
        </p>
        <div class="pair">
          <label>
            Normalizer
            <input
              type="number"
              step="0.05"
              value={settings.linkStrengthNormalization}
              onchange={(event) => edit({ linkStrengthNormalization: Number(event.currentTarget.value) })}
            />
          </label>
          <label>
            Strength floor
            <input
              type="number"
              step="0.01"
              value={settings.strengthFloor}
              onchange={(event) => edit({ strengthFloor: Number(event.currentTarget.value) })}
            />
          </label>
        </div>
        <label class="check">
          <input
            type="checkbox"
            checked={settings.severable}
            onchange={(event) => edit({ severable: event.currentTarget.checked })}
          />
          Sever links at or below zero
        </label>
      </fieldset>

      <fieldset>
        <legend>Each run</legend>
        <div class="pair">
          <label>
            Rounds per run
            <input
              type="number"
              min="1"
              max="50"
              value={settings.roundsPerClick}
              onchange={(event) => edit({ roundsPerClick: Number(event.currentTarget.value) })}
            />
          </label>
          <label>
            Seed
            <input
              type="number"
              value={settings.seed}
              onchange={(event) => edit({ seed: Number(event.currentTarget.value) })}
            />
          </label>
        </div>
        <label>
          Monkey cooperate probability
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            value={settings.strategyParameters.random.p}
            onchange={(event) => edit({ randomP: Number(event.currentTarget.value) })}
          />
        </label>
      </fieldset>
    </form>
  </div>
  <Credits />
</main>

<style>
  .sandbox {
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 28px clamp(20px, 5vw, 80px) 64px;
    background: var(--background-color);
    color: var(--main-text-color);
  }
  header { max-width: 1440px; margin: 0 auto 28px; }
  h1 {
    margin: 0;
    text-align: center;
    font-size: 2.6rem;
    font-weight: normal;
  }
  .back { margin: 0 0 8px; }
  .back a { color: var(--primary-color); }
  .intro {
    max-width: 40rem;
    margin: 8px auto 0;
    text-align: center;
  }
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 860px) minmax(280px, 1fr);
    gap: 40px;
    align-items: start;
    max-width: 1440px;
    margin: 0 auto;
  }
  .stage { width: min(860px, 100%); }
  form { display: grid; gap: 22px; }
  fieldset {
    margin: 0;
    padding: 16px 18px 18px;
    border: 2px solid #131313;
    display: grid;
    gap: 14px;
  }
  legend { padding: 0 8px; font-weight: bold; }
  label { display: grid; gap: 4px; }
  input, select {
    width: 100%;
    padding: 6px 8px;
    border: 2px solid #131313;
    background: #fff;
    color: #131313;
  }
  .check { grid-template-columns: auto 1fr; align-items: center; gap: 8px; }
  .check input { width: auto; }
  .population, .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; }
  .population label { grid-template-columns: 1fr 4.5rem; align-items: center; }
  .chosen { display: grid; gap: 12px; }
  h2 { margin: 0; font-size: 1.35rem; font-weight: normal; color: var(--primary-color); }
  .text-button {
    justify-self: start;
    padding: 8px 14px;
    border: 2px solid #131313;
    background: #fff;
    color: #131313;
    cursor: pointer;
  }
  .row { display: flex; gap: 28px; align-items: center; margin: 12px 0 20px; }
  .icon-button {
    width: 55px;
    height: 55px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }
  .icon-button img {
    width: 55px;
    height: 55px;
    max-width: none;
  }
  .step-button {
    min-width: 55px;
    height: 55px;
    padding: 0 18px;
    border: 2px solid #131313;
    background: #fff;
    font-size: 1.05rem;
    cursor: pointer;
  }
  .hint { margin: 0; }
  @media (max-width: 1100px) {
    .layout { grid-template-columns: 1fr; }
    .population { grid-template-columns: 1fr; }
  }
</style>
