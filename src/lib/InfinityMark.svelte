<script>
  const d = "M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z";
</script>

<!--
  Theme and outline switches, kept for later.
  Outline stays visible until the outline switch is turned on.

  <input id="theme-toggle" class="checkbox theme-toggle__checkbox visually-hidden" type="checkbox" />
  <label for="theme-toggle" class="label theme-toggle__label">Toggle theme</label>
  <input id="outline-toggle" class="checkbox outline-toggle__checkbox visually-hidden" type="checkbox" />
  <label for="outline-toggle" class="label outline-toggle__label">Toggle outline</label>
-->

<div class="infinity-stage">
  <svg class="infinity" version="1.1" x="0px" y="0px" viewBox="0 0 187.3 93.7" preserveAspectRatio="xMidYMid" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Infinity">
    <path class="infinity__outline" {d} />
    <path class="infinity__tracer infinity__tracer--1" {d} />
    <path class="infinity__tracer infinity__tracer--2" {d} />
    <path class="infinity__tracer infinity__tracer--3" {d} />
    <path class="infinity__tracer infinity__tracer--4" {d} />
    <path class="infinity__tracer infinity__tracer--5" {d} />
    <path class="infinity__tracer infinity__tracer--6" {d} />
  </svg>
</div>

<style>
  /*
    Switch styles, kept for later. They expect the inputs above
    to sit in front of a .page-content wrapper around the svg.

  .visually-hidden {
    position: absolute;
    clip: rect(0 0 0 0);
    margin: -1px;
    padding: 0;
    width: 1px;
    height: 1px;
    border: 0;
    overflow: hidden;
  }
  .checkbox.theme-toggle__checkbox:checked + label:after,
  .checkbox.outline-toggle__checkbox:checked + label:after {
    transform: translateX(22px);
  }
  .theme-toggle__checkbox:checked ~ label { color: #4c4f59; }
  .theme-toggle__checkbox:checked ~ label:before { background-color: #292a30; }
  .theme-toggle__checkbox:checked ~ label:before,
  .theme-toggle__checkbox:checked ~ label:after { border-color: #4c4f59; }
  .theme-toggle__checkbox:checked ~ .page-content { background-color: #1d1e22; }
  .theme-toggle__checkbox:checked ~ .page-content .infinity__outline { stroke: #111214; }
  .outline-toggle__checkbox:checked ~ .page-content .infinity__outline { opacity: 0; }
  .label {
    position: absolute;
    left: 0;
    z-index: 1;
    padding: 8px 0 0 60px;
    font-family: "Helvetica", sans-serif;
    font-size: 0.85rem;
    color: #636775;
    cursor: pointer;
    user-select: none;
  }
  .theme-toggle__label { top: 0; }
  .outline-toggle__label { top: 2.5rem; }
  .label:before,
  .label:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 28px;
    background-color: #fafafa;
    border: 1px solid #d9d9d9;
    border-radius: 360px;
  }
  .label:after {
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    background-color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 4px;
  }
  */

  .infinity-stage {
    margin: 8px 0 4px;
  }
  .infinity {
    width: 100%;
    max-width: 800px;
    height: auto;
    display: block;
    background: none;
  }
  .infinity path {
    fill: none;
    stroke-width: 10;
    transform-origin: 50% 50%;
  }
  .infinity__outline {
    stroke: var(--infinity-outline);
    animation: hover 12000ms linear infinite;
    transition: opacity 600ms;
  }
  .infinity__tracer {
    stroke-linecap: round;
    opacity: 0.8;
    animation: tracer 3000ms linear reverse infinite;
  }
  .infinity__tracer--1 { stroke: var(--infinity-coral); animation-duration: 18000ms; animation-delay: -11880ms; }
  .infinity__tracer--2 { stroke: var(--infinity-gold); animation-duration: 9000ms; animation-delay: -5940ms; }
  .infinity__tracer--3 { stroke: var(--infinity-crimson); animation-duration: 6000ms; animation-delay: -3960ms; }
  .infinity__tracer--4 { stroke: var(--infinity-mint); animation-duration: 4500ms; animation-delay: -2970ms; }
  .infinity__tracer--5 { stroke: var(--infinity-pink); animation-duration: 3600ms; animation-delay: -2376ms; }
  .infinity__tracer--6 { stroke: var(--infinity-cyan); animation-duration: 3000ms; animation-delay: -1980ms; }

  @keyframes tracer {
    0% {
      stroke-dasharray: 0, 260;
      stroke-dashoffset: -234;
    }
    25% {
      transform: translate(-2px, 2px);
    }
    50% {
      stroke-dasharray: 43.333, 260;
      stroke-dashoffset: -78;
    }
    65% {
      transform: translate(2px, -2px);
    }
    100% {
      stroke-dasharray: 4, 260;
      stroke-dashoffset: 0;
    }
  }

  @keyframes hover {
    50% { transform: translateY(2px) scale(1.02); }
  }
</style>
