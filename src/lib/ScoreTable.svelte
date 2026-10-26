<script>
  import { getStrategy } from "../sim/strategies.js";

  let { board } = $props();

  function name(node) {
    return `${node.label} (${getStrategy(node.strategyId).label})`;
  }
</script>

<div class="scores">
  <h3>Scores</h3>
  <table>
    <thead>
      <tr><th>Animal</th><th>Strategy</th><th>Score</th></tr>
    </thead>
    <tbody>
      {#each board.nodes as node (node.id)}
        <tr>
          <td>{name(node)}</td>
          <td>{node.strategyId}</td>
          <td>{node.value.toFixed(2)}</td>
        </tr>
      {:else}
        <tr><td colspan="3">No animals in play.</td></tr>
      {/each}
    </tbody>
  </table>

  <h3>Last moves</h3>
  <table>
    <thead>
      <tr><th>Link</th><th>Strength</th><th>Latest moves</th></tr>
    </thead>
    <tbody>
      {#each board.links as link (link.id)}
        <tr>
          <td>{link.source} → {link.target}</td>
          <td>{link.strength.toFixed(2)}</td>
          <td>
            {link.sourceHistory.at(-1) ?? "—"} / {link.targetHistory.at(-1) ?? "—"}
          </td>
        </tr>
      {:else}
        <tr><td colspan="3">No links.</td></tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th, td { text-align: left; padding: 4px 8px; border-bottom: 1px solid #ccc; }
</style>
