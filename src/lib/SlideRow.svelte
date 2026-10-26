<script>
  let { labels = [], children } = $props();
  let scroller = $state(null);
  let index = $state(0);

  function go(next) {
    if (!scroller) return;
    const count = labels.length;
    index = Math.max(0, Math.min(count - 1, next));
    scroller.scrollTo({ left: index * scroller.clientWidth, behavior: "smooth" });
  }

  function onscroll() {
    if (!scroller) return;
    const next = Math.round(scroller.scrollLeft / Math.max(scroller.clientWidth, 1));
    if (next !== index) index = next;
  }
</script>

<div class="slides-wrapper" bind:this={scroller} onscroll={onscroll} data-slides-container>
  {@render children?.()}
</div>
<div class="custom-slides-nav">
  <button type="button" class="custom-nav-arrow left" class:disabled={index === 0} aria-label="Previous" onclick={() => go(index - 1)}></button>
  <div class="custom-nav-dots">
    {#each labels as label, i}
      <button type="button" class="custom-nav-dot" class:active={i === index} aria-label={label} onclick={() => go(i)}></button>
    {/each}
  </div>
  <button type="button" class="custom-nav-arrow right" class:disabled={index === labels.length - 1} aria-label="Next" onclick={() => go(index + 1)}></button>
</div>
