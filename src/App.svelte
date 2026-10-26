<script>
  import { onMount } from "svelte";
  import { cooperationMatrix } from "./sim/payoff.js";
  import { narrativeStrategyIds, listStrategies } from "./sim/strategies.js";
  import { presets } from "./sim/settings.js";
  import CraneStory from "./lib/CraneStory.svelte";
  import Credits from "./lib/Credits.svelte";
  import PayoffMatrix from "./lib/PayoffMatrix.svelte";
  import Simulation from "./lib/Simulation.svelte";
  import SlideRow from "./lib/SlideRow.svelte";

  const catalog = presets();
  const cast = listStrategies().filter((strategy) => narrativeStrategyIds.includes(strategy.id));
  let fullpage = $state(null);

  const sections = [
    "Title",
    "Introduction",
    "Fables",
    "Fable games",
    "Crane and wolf",
    "Prisoner's dilemma",
    "Strategies",
    "Walking away",
    "The bridge",
    "Cooperation",
    "Credits",
  ];

  onMount(() => {
    function onKey(event) {
      if (!fullpage) return;
      const pages = [...fullpage.querySelectorAll(".section")];
      const current = Math.round(fullpage.scrollTop / window.innerHeight);
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        fullpage.scrollTo({ top: Math.min(current + 1, pages.length - 1) * window.innerHeight, behavior: "smooth" });
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        fullpage.scrollTo({ top: Math.max(current - 1, 0) * window.innerHeight, behavior: "smooth" });
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function jump(index) {
    fullpage?.scrollTo({ top: index * window.innerHeight, behavior: "smooth" });
  }
</script>

<div id="fullpage" bind:this={fullpage}>
  <section class="section title-page" id="page0">
    <img id="crowImage" class="animate-in" src="imgs/fables/crow_crouching.png" alt="" />
    <img class="title-fox" src="imgs/fables/fox.png" alt="" />
    <div class="title-copy">
      <p class="aesopTitle animate-in animate-delay-1">Game</p>
      <p class="aesopTitle animate-in animate-delay-2">Theory</p>
    </div>
  </section>

  <section class="section" id="page1">
    <p>
      Game theory is the science of logical decision making in the face of uncertainty.
      Let's consider two individuals facing off with a decision to cooperate or oppose each other.
      The payoff for a given individual's behavior depends upon the other individual's behavior.
      How should one play?
    </p>
    <p>Consider the various strategies taken by the animals of Aesop's Fables...</p>
    <img src="imgs/dice.png" alt="" width="225" height="160" />
  </section>

  <section class="section has-slides" id="page2">
    <SlideRow labels={["Lion and mouse", "Monkey and cat", "Two goats"]}>
      <article class="slide" id="aesopSlide1">
        <div class="fable-text">
          <h2>The Lion and the Mouse</h2>
          <p>A lion lay asleep in the forest, his great head resting on his paws. A timid little mouse came upon him unexpectedly, and in her fright ran across the lion's nose. Roused from his nap, the lion laid his paw on the tiny creature to kill her.</p>
          <p>"Spare me!" begged the mouse. "Please let me go and some day I will surely repay you."</p>
          <p>The lion was much amused to think that a mouse could ever help him. But he was generous and finally let the mouse go.</p>
          <p>Some days later the lion was caught in a hunter's net. The mouse knew his voice, found him, and gnawed a rope until he was free.</p>
          <p><em>"You laughed when I said I would repay you," said the mouse. "Now you see that even a mouse can help a lion."</em></p>
          <p><em>A kindness is never wasted, or two cooperators succeed together.</em></p>
        </div>
      </article>
      <article class="slide" id="aesopSlide2">
        <div class="fable-text">
          <h2>The Monkey and the Cat</h2>
          <p>A cat and a monkey lived as pets in the same house. One day they watched chestnuts roasting on the hearth. "I would gladly get them," said the cunning monkey, "but you are much more skillful. Pull them out and I'll divide them between us."</p>
          <p>The cat singed her paw pulling the chestnuts out. As fast as she pulled them out, the monkey ate them up. The housekeeper came in, and away they scampered: the cat with a burnt paw and no chestnuts.</p>
          <p><em>The flatterer seeks some benefit at your expense, or a deceiver exploits a cooperator.</em></p>
        </div>
      </article>
      <article class="slide" id="aesopSlide3">
        <div class="goat-backdrop" aria-hidden="true"></div>
        <div class="fable-text">
          <h2>The Two Goats</h2>
          <p>Two goats met on a fallen tree that crossed a mountain torrent. The path was too narrow for both. Their pride would not permit either to stand aside. They met horn to horn, and both fell into the torrent.</p>
          <p><em>It is better to yield than to come to misfortune through stubbornness, or two cheaters fail together.</em></p>
        </div>
      </article>
    </SlideRow>
  </section>

  <section class="section has-slides sim-section" id="page3">
    <SlideRow labels={["Lion and mouse", "Two goats", "Monkey and cat"]}>
      <article class="slide">
        <p>The lion cooperated with the mouse, and the mouse cooperated in return. Run a round to see both of them better off, and the link between them strengthen.</p>
        <Simulation scenario={catalog.lionAndMouse} />
      </article>
      <article class="slide">
        <p>The goats both cheat. They lose together, and the link between them weakens.</p>
        <Simulation scenario={catalog.twoGoats} />
      </article>
      <article class="slide">
        <p>The monkey cheats and the cat cooperates. The winner grows and the loser shrinks.</p>
        <Simulation scenario={catalog.monkeyAndCat} />
      </article>
    </SlideRow>
  </section>

  <section class="section sim-section" id="page4">
    <CraneStory />
  </section>

  <section class="section" id="page5">
    <div class="split">
      <p>
        Working together is often a great solution. What happens when the individual payoff for betrayal is greater than the individual payoff for cooperation?
      </p>
      <PayoffMatrix matrix={catalog.prisonersPair.settings.matrix} editable={false} />
    </div>
  </section>

  <section class="section sim-section" id="page6">
    <div class="prose">
      <p>Each animal is an archetype. Click one to change how it plays. The description comes from the strategy itself.</p>
      <ul>
        {#each cast as strategy (strategy.id)}
          <li>{strategy.description}</li>
        {/each}
      </ul>
    </div>
    <Simulation
      scenario={catalog.sixAnimals}
      chooseBehavior={true}
      showMatrix={true}
      showScores={true}
      strategyIds={narrativeStrategyIds}
    />
  </section>

  <section class="section sim-section" id="page7">
    <p class="prose">
      Strategies of betrayal are effective when nobody can leave. In almost every society, if you don't like a situation you can walk away. Here either animal can sever a relationship that has failed.
    </p>
    <Simulation
      scenario={catalog.walkAway}
      chooseBehavior={true}
      showMatrix={true}
      showScores={true}
      strategyIds={narrativeStrategyIds}
    />
  </section>

  <section class="section sim-section" id="page8">
    <p class="prose">
      A community beyond a river needs a new bridge, and asks everyone to pay a share. Cheating means paying nothing and still crossing. Cooperators and cheaters can also walk away when a relationship fails.
    </p>
    <Simulation
      scenario={catalog.bridge}
      chooseBehavior={true}
      showMatrix={true}
      showScores={true}
      strategyIds={["cooperator", "cheater"]}
    />
  </section>

  <section class="section" id="page9">
    <div class="split">
      <PayoffMatrix matrix={cooperationMatrix()} editable={false} />
      <div>
        <p>There are situations where pursuit of self-interest by each individual leads to outcomes that no one would desire if everyone could cooperate. Nothing is innately wrong with self-interest. In the matrix on the left, betrayal pays the betrayer nothing and hurts the partner, so rational players cooperate.</p>
        <ul>
          <li>If both cheat, each receives the worst outcome.</li>
          <li>If one cheats while the other cooperates, the cheater gets nothing and the cooperator is hurt.</li>
          <li>If both cooperate, both get the best result.</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section" id="page00">
    <Credits />
  </section>
</div>

<nav id="section-nav" aria-label="Section navigation">
  {#each sections as label, index}
    <button type="button" class="nav-dot" aria-label={label} onclick={() => jump(index)}></button>
  {/each}
</nav>

<style>
  .prose { max-width: 760px; }
  .split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center; width: min(960px, 100%); }
  .title-page { overflow: hidden; }
  .title-copy {
    position: absolute;
    left: 10%;
    top: 22%;
    z-index: 1;
    text-align: left;
  }
  .title-copy :global(.aesopTitle) { text-align: left; margin: 0; }
  #crowImage {
    position: absolute;
    left: 10%;
    top: 0;
    width: 20vw;
    height: 20vh;
    object-fit: contain;
  }
  .title-fox {
    position: absolute;
    left: 46%;
    top: 40%;
    width: 60vw;
    height: 60vh;
    object-fit: contain;
    pointer-events: none;
  }
  .fable-text {
    position: relative;
    z-index: 1;
    max-width: 680px;
    margin: 0 auto;
    overflow: auto;
    max-height: 100%;
  }
  .goat-backdrop {
    position: absolute;
    inset: 0;
    background-image: url("/imgs/fables/goat.png");
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: 50%;
    opacity: 0.2;
    pointer-events: none;
  }
  #page1 img { margin: 0 auto; display: block; }
  @media (max-width: 800px) {
    .split { grid-template-columns: 1fr; }
  }
</style>
