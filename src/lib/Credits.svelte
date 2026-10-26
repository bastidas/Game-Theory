<script>
  const pages = [
    { href: "/", label: "The essay" },
    { href: "/sandbox.html", label: "The workshop" },
    { href: "/deeper.html", label: "Finite and infinite" },
  ];

  const path = typeof window === "undefined" ? "/" : window.location.pathname;

  function isCurrent(href) {
    if (href === "/") return path === "/" || path.endsWith("/index.html");
    return path === href || path.endsWith(href);
  }
</script>

<footer class="credits">
  <p class="by"><i>created by</i></p>
  <h3>Alexander Bastidas Fry</h3>
  <div class="social">
    <a href="https://www.alexanderbastidasfry.com"><img src="imgs/social/world.png" alt="Alexander Bastidas Fry" width="36" height="36" /></a>
    <a href="https://github.com/bastidas/Game-Theory"><img src="imgs/social/github.png" alt="Source on GitHub" width="36" height="36" /></a>
  </div>
  <nav class="pages" aria-label="Pages">
    {#each pages as page, index}
      {#if index > 0}<span class="sep" aria-hidden="true">·</span>{/if}
      {#if isCurrent(page.href)}
        <span aria-current="page">{page.label}</span>
      {:else}
        <a href={page.href}>{page.label}</a>
      {/if}
    {/each}
  </nav>
  <p class="license">Licensed under the <a href="https://opensource.org/licenses/MIT">MIT License</a>.</p>
</footer>

<style>
  .credits {
    text-align: center;
    margin: 48px auto 0;
    max-width: 40rem;
  }
  .by { margin: 0; }
  h3 {
    margin: 4px 0 8px;
    font-weight: normal;
  }
  .social {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 28px;
    margin: 0 0 12px;
  }
  .social a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
  }
  .social img {
    width: 36px;
    height: 36px;
    border: none;
    display: block;
  }
  .social a:hover img {
    transform: scale(1.08);
  }
  .pages {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 6px 10px;
    margin: 0 0 12px;
  }
  .pages a,
  .pages [aria-current="page"] {
    padding: 6px 2px;
  }
  .pages [aria-current="page"] {
    color: var(--main-text-color);
  }
  .sep { color: var(--main-text-color); }
  .license { margin: 0; }
</style>
