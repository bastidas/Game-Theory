<script>
  let { strategies, selected, onchoose } = $props();
</script>

<div class="picker" role="listbox" aria-label="Choose a strategy">
  {#each strategies as strategy (strategy.id)}
    <button
      type="button"
      class:selected={strategy.id === selected}
      onclick={() => onchoose(strategy.id)}
    >
      <img src={`imgs/animals_flat/${strategy.animal}.png`} alt="" width="36" height="36" />
      <span>
        <strong>{strategy.label}</strong>
        <small>{strategy.description}</small>
      </span>
    </button>
  {/each}
</div>

<style>
  .picker { display: grid; gap: 8px; }
  button {
    display: flex;
    gap: 8px;
    align-items: center;
    text-align: left;
    padding: 6px;
    background: #fff;
    border: 1px solid #ccc;
    cursor: pointer;
  }
  button.selected { border-color: #06799f; }
  small { display: block; color: #333; }
</style>
