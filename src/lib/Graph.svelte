<script>
  import * as d3 from "d3";
  import { onDestroy } from "svelte";
  import { getStrategy } from "../sim/strategies.js";

  let {
    board,
    sizeRange = "absolute",
    width = 560,
    height = 420,
    onselect = () => {},
  } = $props();

  let host = $state(null);
  let tip = $state(null);
  let hoverId = null;
  let hoverLinkId = null;
  const glowId = `link-glow-${Math.random().toString(36).slice(2, 8)}`;
  const positions = new Map();
  const departing = new Map();
  let simulation;
  let linkForce;
  let layoutNodes = [];
  let floater = null;
  let floatStamp = 0;
  let lastStep = null;
  const circleColor = "#06799F";
  const floatSpeed = 14;
  const floatFadeMs = 6000;
  const struck = new Set();

  // Two players keep the current gap. Each added player lengthens links and
  // strengthens repulsion so a larger cast uses more of the stage.
  function spreadScale(count) {
    return Math.max(count, 1) / 2;
  }

  function radiusOf(value) {
    if (sizeRange === "absolute" || !Array.isArray(sizeRange)) {
      return 35 + 25 * Math.tanh(value / 10);
    }
    const values = board.nodes.map((node) => node.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const [low, high] = sizeRange;
    if (!Number.isFinite(min) || min === max) return (low + high) / 2;
    return low + ((value - min) / (max - min)) * (high - low);
  }

  function tick() {
    for (const node of layoutNodes) {
      positions.set(node.id, {
        x: node.x,
        y: node.y,
        vx: node.vx,
        vy: node.vy,
        fx: node.fx,
        fy: node.fy,
      });
    }
    if (!host) return;
    const svg = d3.select(host);
    const ties = svg.select("g.links").selectAll("g.tie");
    ties.each(function (d) {
      const source = endpoint(d.source);
      const target = endpoint(d.target);
      d3.select(this).selectAll("line")
        .attr("x1", source.x)
        .attr("y1", source.y)
        .attr("x2", target.x)
        .attr("y2", target.y);
    });
    ties.select(".link").call(paintLinks);
    svg.select("g.nodes").selectAll("g.animal")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);
    if (tip && !tip.hidden && hoverId) {
      const hovered = layoutNodes.find((node) => node.id === hoverId);
      if (hovered) moveTip(hovered);
    }
    if (tip && !tip.hidden && hoverLinkId) {
      const hovered = ties.data().find((link) => link.id === hoverLinkId);
      if (hovered) moveLinkTip(hovered);
    }
  }

  function paintLinks(selection) {
    selection
      .attr("stroke", (d) => d.id === hoverLinkId ? "#06799F" : "#cccccc")
      .attr("stroke-width", (d) => Math.max(1.5, d.strength * 8))
      .style("filter", (d) => d.id === hoverLinkId ? `url(#${glowId})` : null);
  }

  function ensureGlow() {
    const svg = d3.select(host);
    if (!svg.select(`#${glowId}`).empty()) return;
    const filter = svg.append("defs").append("filter")
      .attr("id", glowId)
      .attr("x", "-80%")
      .attr("y", "-80%")
      .attr("width", "260%")
      .attr("height", "260%");
    filter.append("feDropShadow")
      .attr("dx", "0")
      .attr("dy", "0")
      .attr("stdDeviation", "6")
      .attr("flood-color", "#3AAACF")
      .attr("flood-opacity", "1");
  }

  function endpoint(node) {
    if (node && typeof node === "object") return node;
    return { x: width / 2, y: height / 2 };
  }

  function animalHref(node, outline) {
    const kind = outline ? "line" : "flat";
    return `imgs/animals_${kind}/${getStrategy(node.strategyId).animal}.png`;
  }

  function outlined(node) {
    return Boolean(node.departing || struck.has(node.id) || node.id === hoverId);
  }

  function moveTipAt(x, y, pad) {
    if (!tip || !host || tip.hidden) return;
    const scaleX = host.clientWidth / width;
    const scaleY = host.clientHeight / height;
    const above = y * scaleY - pad - 12;
    tip.style.left = `${x * scaleX}px`;
    if (above < 56) {
      tip.style.top = `${y * scaleY + pad + 22}px`;
      tip.style.transform = "translate(-50%, 0)";
    } else {
      tip.style.top = `${above}px`;
      tip.style.transform = "translate(-50%, -100%)";
    }
  }

  function moveTip(node) {
    moveTipAt(node.x, node.y, radiusOf(node.value) * (host.clientHeight / height));
  }

  function moveLinkTip(link) {
    const source = endpoint(link.source);
    const target = endpoint(link.target);
    moveTipAt((source.x + target.x) / 2, (source.y + target.y) / 2, 10);
  }

  function labelFor(id) {
    return board.nodes.find((node) => node.id === id)?.label ?? String(id ?? "");
  }

  function played(move) {
    if (move === "cooperate") return "cooperated";
    if (move === "cheat") return "cheated";
    return "has not moved";
  }

  function linkSummary(link) {
    const sourceId = link.sourceId ?? link.source?.id ?? link.source;
    const targetId = link.targetId ?? link.target?.id ?? link.target;
    const sourceMove = link.sourceHistory?.at(-1);
    const targetMove = link.targetHistory?.at(-1);
    const moves = sourceMove
      ? `${labelFor(sourceId)} ${played(sourceMove)}. ${labelFor(targetId)} ${played(targetMove)}.`
      : "No moves yet.";
    return `Strength ${Number(link.strength).toFixed(2)}. ${moves}`;
  }

  function writeTip(score, body) {
    if (!tip) return;
    const scoreEl = tip.querySelector(".tip-score");
    const bodyEl = tip.querySelector(".tip-body");
    if (scoreEl) {
      scoreEl.hidden = score == null;
      scoreEl.textContent = score ?? "";
    }
    if (bodyEl) bodyEl.textContent = body;
    tip.hidden = false;
  }

  function focusedDatum() {
    const active = document.activeElement;
    if (!host || !active || !host.contains(active)) return null;
    return d3.select(active).datum() ?? null;
  }

  function showStrategy(node) {
    hoverLinkId = null;
    if (host) d3.select(host).selectAll("g.tie").select(".link").call(paintLinks);
    hoverId = node.id;
    if (!host) return;
    const group = d3.select(host).selectAll("g.animal").filter((datum) => datum.id === node.id);
    group.select("image").attr("href", animalHref(node, true));
    group.select("circle").attr("stroke", circleColor).attr("stroke-width", 5);
    writeTip(`Score ${Number(node.value).toFixed(2)}`, getStrategy(node.strategyId).description);
    moveTip(node);
  }

  function hideStrategy(node) {
    if (focusedDatum()?.id === node.id) return;
    if (hoverId === node.id) hoverId = null;
    if (!host) return;
    const group = d3.select(host).selectAll("g.animal").filter((datum) => datum.id === node.id);
    const datum = group.datum();
    if (datum) {
      group.select("image").attr("href", animalHref(datum, outlined(datum)));
      group.select("circle").attr("stroke", "#131313").attr("stroke-width", 3);
    }
    if (!hoverLinkId && tip) tip.hidden = true;
  }

  function showLink(link) {
    hoverId = null;
    hoverLinkId = link.id;
    if (host) d3.select(host).selectAll("g.tie").select(".link").call(paintLinks);
    writeTip(null, linkSummary(link));
    moveLinkTip(link);
  }

  function hideLink(link) {
    if (focusedDatum()?.id === link.id) return;
    if (hoverLinkId === link.id) hoverLinkId = null;
    if (host) d3.select(host).selectAll("g.tie").select(".link").call(paintLinks);
    if (!hoverId && tip) tip.hidden = true;
  }

  function release(node) {
    if (departing.has(node.id)) return;
    const centerX = width / 2;
    const centerY = height / 2;
    let dirX = node.x - centerX;
    let dirY = node.y - centerY;
    const length = Math.hypot(dirX, dirY);
    if (length < 1) {
      const angle = ([...node.id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 12) * (Math.PI / 6);
      dirX = Math.cos(angle);
      dirY = Math.sin(angle);
    } else {
      dirX /= length;
      dirY /= length;
    }
    departing.set(node.id, {
      id: node.id,
      strategyId: node.strategyId,
      label: node.label,
      value: node.value,
      group: node.group,
      x: node.x,
      y: node.y,
      departing: true,
      opacity: 1,
      dirX,
      dirY,
    });
  }

  function breakPicture(nodeId) {
    if (!host) return;
    const group = d3.select(host).select("g.nodes").selectAll("g.animal").filter((node) => node.id === nodeId);
    const datum = group.datum();
    if (!datum) return;
    const radius = radiusOf(datum.value);
    struck.add(nodeId);
    group.select("image")
      .attr("href", animalHref(datum, true))
      .transition().duration(140)
      .attr("x", -radius * 1.35)
      .attr("y", -radius * 1.35)
      .attr("width", radius * 2.7)
      .attr("height", radius * 2.7)
      .transition().duration(260)
      .attr("x", -radius)
      .attr("y", -radius)
      .attr("width", radius * 2)
      .attr("height", radius * 2);
    group.select("circle")
      .transition().duration(140)
      .attr("stroke", "#FF2800")
      .attr("stroke-width", 7)
      .transition().duration(320)
      .attr("stroke", "#131313")
      .attr("stroke-width", 3);
    if (departing.has(nodeId)) return;
    setTimeout(() => {
      struck.delete(nodeId);
      if (!host || departing.has(nodeId)) return;
      const still = d3.select(host).select("g.nodes").selectAll("g.animal").filter((node) => node.id === nodeId);
      const current = still.datum();
      if (!current || current.departing) return;
      still.select("image").attr("href", animalHref(current, current.id === hoverId));
    }, 900);
  }

  function ensureFloat() {
    if (floater || departing.size === 0) return;
    floatStamp = 0;
    floater = d3.timer((elapsed) => {
      const dt = floatStamp === 0 ? 16 : Math.min(elapsed - floatStamp, 50);
      floatStamp = elapsed;
      for (const [id, ghost] of departing) {
        const step = (floatSpeed * dt) / 1000;
        ghost.x += ghost.dirX * step;
        ghost.y += ghost.dirY * step;
        ghost.opacity -= dt / floatFadeMs;
        if (ghost.opacity <= 0) {
          departing.delete(id);
          positions.delete(id);
        }
      }
      if (host) {
        const animals = d3.select(host).select("g.nodes").selectAll("g.animal");
        animals.filter((node) => node.departing)
          .attr("transform", (node) => `translate(${node.x},${node.y})`)
          .style("opacity", (node) => Math.max(node.opacity, 0));
        animals.filter((node) => node.departing && node.opacity <= 0).remove();
      }
      if (departing.size === 0 && floater) {
        floater.stop();
        floater = null;
        floatStamp = 0;
      }
    });
  }

  function sync() {
    if (!host) return;
    const svg = d3.select(host);
    if (svg.select("g.links").empty()) {
      svg.append("defs");
      svg.append("g").attr("class", "links");
      svg.append("g").attr("class", "nodes");
    }
    ensureGlow();
    if (!simulation) {
      linkForce = d3.forceLink().id((d) => d.id).strength((d) => Math.max(d.strength, 0.05));
      simulation = d3.forceSimulation()
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", linkForce)
        .force("charge", d3.forceManyBody().strength(-900).distanceMin(40).distanceMax(220))
        .on("tick", tick);
    }
    const scale = spreadScale(board.nodes.length);
    linkForce.distance(30 * scale);
    simulation.force("charge")
      .strength(-900 * scale)
      .distanceMin(40)
      .distanceMax(220 * scale);

    const present = new Set(board.nodes.map((node) => node.id));
    const roundPlayed = lastStep !== null && board.step > lastStep;
    lastStep = board.step;
    if (roundPlayed) {
      for (const node of layoutNodes) {
        if (!present.has(node.id)) release(node);
      }
    } else {
      departing.clear();
      struck.clear();
    }
    for (const id of [...departing.keys()]) {
      if (present.has(id)) departing.delete(id);
    }
    if (hoverId && !present.has(hoverId)) {
      hoverId = null;
      if (tip) tip.hidden = true;
    }
    if (hoverLinkId && !board.links.some((link) => link.id === hoverLinkId)) {
      hoverLinkId = null;
      if (!hoverId && tip) tip.hidden = true;
    }

    const ring = 100 * Math.sqrt(scale);
    layoutNodes = board.nodes.map((node, index) => {
      const previous = positions.get(node.id);
      const angle = (index / Math.max(board.nodes.length, 1)) * Math.PI * 2;
      return {
        id: node.id,
        strategyId: node.strategyId,
        label: node.label,
        value: node.value,
        group: node.group,
        x: previous?.x ?? width / 2 + Math.cos(angle) * ring,
        y: previous?.y ?? height / 2 + Math.sin(angle) * ring * 0.8,
        vx: previous?.vx ?? 0,
        vy: previous?.vy ?? 0,
        fx: previous?.fx ?? null,
        fy: previous?.fy ?? null,
      };
    });
    for (const id of [...positions.keys()]) {
      if (!present.has(id) && !departing.has(id)) positions.delete(id);
    }

    const previousLines = svg.select("g.links").selectAll("g.tie").data();
    const layoutLinks = board.links.map((link) => ({
      id: link.id,
      source: link.source,
      target: link.target,
      sourceId: link.source,
      targetId: link.target,
      strength: link.strength,
      sourceHistory: link.sourceHistory,
      targetHistory: link.targetHistory,
    }));
    const nextLinkIds = new Set(layoutLinks.map((link) => link.id));
    const brokenNodeIds = new Set();
    if (roundPlayed) {
      for (const link of previousLines) {
        if (nextLinkIds.has(link.id)) continue;
        brokenNodeIds.add(link.sourceId ?? link.source?.id ?? link.source);
        brokenNodeIds.add(link.targetId ?? link.target?.id ?? link.target);
      }
    }

    const drag = d3.drag()
      .on("start", (event, node) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        node.fx = node.x;
        node.fy = node.y;
      })
      .on("drag", (event, node) => {
        node.fx = event.x;
        node.fy = event.y;
      })
      .on("end", (event, node) => {
        if (!event.active) simulation.alphaTarget(0);
        node.fx = null;
        node.fy = null;
      });

    svg.select("g.links").selectChildren("line").remove();
    let ties = svg.select("g.links").selectAll("g.tie").data(layoutLinks, (d) => d.id);
    const exitingLinks = ties.exit();
    if (roundPlayed) exitingLinks.transition().duration(350).style("opacity", 0).remove();
    else exitingLinks.remove();
    const enteredTies = ties.enter().append("g").attr("class", "tie");
    enteredTies.append("line").attr("class", "link");
    enteredTies.append("line").attr("class", "link-hit");
    ties = enteredTies.merge(ties);
    ties
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (link) => linkSummary(link))
      .style("cursor", "pointer")
      .on("pointerenter", (event, link) => { if (event.pointerType !== "touch") showLink(link); })
      .on("pointerleave", (event, link) => { if (event.pointerType !== "touch") hideLink(link); })
      .on("focus", (_event, link) => showLink(link))
      .on("blur", (_event, link) => hideLink(link))
      .on("click", (event, link) => {
        event.stopPropagation();
        showLink(link);
      });
    ties.select(".link").style("opacity", 1);
    ties.select(".link-hit")
      .attr("stroke", "transparent")
      .attr("stroke-width", 18)
      .attr("stroke-linecap", "round");

    const shown = [...layoutNodes, ...departing.values()];
    let nodes = svg.select("g.nodes").selectAll("g.animal").data(shown, (d) => d.id);
    nodes.exit().remove();
    const entered = nodes.enter().append("g").attr("class", "animal").style("cursor", "pointer");
    entered.append("circle").attr("class", "node");
    entered.append("image");
    entered.append("text");
    nodes = entered.merge(nodes);

    const live = nodes.filter((node) => !node.departing);
    const gone = nodes.filter((node) => node.departing);
    live.attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (node) => `${node.label}. Score ${Number(node.value).toFixed(2)}. ${getStrategy(node.strategyId).description}`)
      .style("cursor", "pointer")
      .style("pointer-events", "all")
      .style("opacity", 1);
    live.on("click", (event, node) => {
      event.stopPropagation();
      onselect(node.id);
      showStrategy(node);
    });
    live.on("pointerenter", (event, node) => { if (event.pointerType !== "touch") showStrategy(node); });
    live.on("pointerleave", (event, node) => { if (event.pointerType !== "touch") hideStrategy(node); });
    live.on("focus", (_event, node) => showStrategy(node));
    live.on("blur", (_event, node) => hideStrategy(node));
    live.call(drag);
    gone.style("cursor", "default").style("pointer-events", "none").on("click", null);

    nodes.select("circle")
      .attr("r", (node) => radiusOf(node.value))
      .attr("fill", circleColor)
      .attr("stroke", (node) => node.id === hoverId ? circleColor : "#131313")
      .attr("stroke-width", (node) => node.id === hoverId ? 5 : 3);
    nodes.select("image")
      .attr("href", (node) => animalHref(node, outlined(node)))
      .attr("x", (node) => -radiusOf(node.value))
      .attr("y", (node) => -radiusOf(node.value))
      .attr("width", (node) => radiusOf(node.value) * 2)
      .attr("height", (node) => radiusOf(node.value) * 2)
      .attr("pointer-events", "none");
    nodes.select("text")
      .text((node) => node.label)
      .attr("y", (node) => radiusOf(node.value) + 16)
      .attr("text-anchor", "middle")
      .attr("fill", "#131313")
      .attr("font-size", "13px")
      .attr("pointer-events", "none");

    for (const id of brokenNodeIds) breakPicture(id);

    simulation.nodes(layoutNodes);
    linkForce.links(layoutLinks);
    simulation.force("center", d3.forceCenter(width / 2, height / 2));
    simulation.alpha(0.7).restart();
    ensureFloat();
    tick();
  }

  $effect(() => {
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      hoverId = null;
      hoverLinkId = null;
      if (tip) tip.hidden = true;
      if (host?.contains(document.activeElement)) document.activeElement.blur();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  $effect(() => {
    board.nodes;
    board.links;
    board.step;
    sizeRange;
    width;
    height;
    host;
    sync();
  });

  onDestroy(() => {
    simulation?.stop();
    floater?.stop();
  });
</script>

<figure class="graph">
  <svg bind:this={host} viewBox="0 0 {width} {height}" role="group" aria-label="Strategy graph"></svg>
  <p class="strategy-tip" bind:this={tip} hidden>
    <strong class="tip-score"></strong>
    <span class="tip-body"></span>
  </p>
  <figcaption>
    {#if Array.isArray(sizeRange)}
      The picture shows who is ahead: the lowest score is drawn smallest. A weaker tie lets them drift apart.
    {:else}
      The picture grows with the score. A stronger tie holds the animals closer.
    {/if}
  </figcaption>
</figure>

<style>
  .graph {
    position: relative;
    margin: 0;
    width: 100%;
    max-width: 640px;
  }
  .strategy-tip {
    position: absolute;
    z-index: 2;
    max-width: 260px;
    margin: 0;
    padding: 8px 10px;
    background: var(--background-color);
    border: 2px solid #131313;
    color: #131313;
    font-size: 0.95rem;
    line-height: 1.3;
    text-align: center;
    pointer-events: none;
  }
  .tip-score { display: block; }
  svg {
    width: 100%;
    height: auto;
    max-height: 48vh;
    overflow: visible;
  }
  figcaption {
    margin: 6px 0 0;
    text-align: center;
    font-size: 0.95rem;
    line-height: 1.35;
  }
</style>
