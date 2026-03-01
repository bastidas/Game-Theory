# Mobile Responsive Refactor Plan

**Date**: February 28, 2026  
**Project**: Game Theory Interactive Visualization

## Overview

Keep fullPage.js (npm installation is correct, GPL license is valid for open-source projects). Simplify page0 crow animation from scroll-driven to CSS-based. Add responsive breakpoints with mobile-first CSS: stack two-column layouts, scale D3 charts fluidly, ensure 44px+ touch targets, remove 800px minimum width. Target 360px baseline with 320px minimum support.

## Decisions Made

- **Keep fullPage.js**: GPL license is valid, npm install is correct, library helps with snap scrolling
- **Simplify page0**: Remove scroll-driven animation complexity in favor of CSS transitions
- **Mobile-first breakpoints**: 320px minimum, 360px baseline, 500px extra-small cutoff, 768px tablet+
- **Speed over perfection**: Get working mobile layout first, can refine animations later

## Implementation Steps

### Step 1: Fix fullPage.js setup

**Files**: [package.json](package.json), [src/main.js](src/main.js)

- Verify npm packages are current (fullpage.js v4.0.26 is already installed)
- Keep `licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE'` — this is valid for GPL projects
- Update fullPage config: disable `autoScrolling` and `scrollBar` on mobile viewports using `responsiveWidth: 768`

### Step 2: Simplify page0 animation

**Files**: [src/main.js](src/main.js)

- Remove custom wheel event handler and scroll tracking (lines 41-73)
- Remove `afterLoad` callback that manages wheel listener (lines 141-171)
- Replace with CSS-based fade-in animation: apply `.animate-in` class to crow and text on page load
- Set crow to final state image instead of 4-stage progression

### Step 3: Remove fixed-width constraints

**Files**: [css/style.css](css/style.css)

- Change line 43: `min-width: 800px` → `min-width: 320px`
- Change line 44: `max-width: 1680px` → `max-width: 100%` 
- Update line 93: `#fullpage` padding from 55px to fluid: `padding: clamp(16px, 3vw, 55px)`

### Step 4: Add responsive breakpoints

**Files**: [css/style.css](css/style.css)

Create mobile-first media queries:
- `@media (max-width: 500px)` — extra small (stack all layouts)
- `@media (min-width: 501px) and (max-width: 768px)` — small tablets
- `@media (min-width: 769px)` — desktop (existing styles)

Uncomment and adapt the existing commented mobile CSS at lines 178-195.

### Step 5: Make two-column layout stack on mobile

**Files**: [css/style.css](css/style.css)

- Add mobile breakpoint for `.leftDiv` and `.rightDiv` (currently at lines 201-216):
  - Mobile: `width: 100%; float: none; display: block;`
  - Desktop: Keep current `width: 50%; float: left;`
- Ensure proper spacing with `margin-bottom` on mobile

### Step 6: Make D3 charts responsive

**Files**: [src/config.js](src/config.js), [src/main.js](src/main.js)

- Update [src/config.js](src/config.js) lines 10-11: Change fixed 500px to fluid calculation:
  - `chartWidth: Math.min(500, window.innerWidth - 80)`
  - `chartHeight: Math.min(500, window.innerWidth - 80)`
- Add resize listener in [src/main.js](src/main.js) to redraw charts on orientation change
- Ensure SVG parent containers use `width: 100%; height: auto;` in CSS

### Step 7: Ensure touch targets meet 44px minimum

**Files**: [css/style.css](css/style.css)

- Audit all buttons (currently 55x55px gear/reset icons are fine)
- Check navigation dots — may need larger hit areas on mobile
- Add CSS to increase padding on interactive text elements to meet 44px minimum

### Step 8: Add viewport-specific optimizations

**Files**: [css/style.css](css/style.css), [index.html](index.html)

- Add CSS to hide non-critical elements on screens < 360px (use `.mobile-hide` class)
- Ensure tables scale or scroll horizontally with `overflow-x: auto` wrapper
- Test text remains readable at 16px minimum on mobile

### Step 9: Update fullPage.js navigation for mobile

**Files**: [src/main.js](src/main.js)

- Keep navigation enabled but consider auto-hiding on narrow screens
- Adjust navigation positioning for mobile with CSS media query
- Slide navigation (horizontal fables) may need touch-friendly arrow controls

## Mobile Design Specifications

- **Baseline**: 360px width × 660px height
- **Minimum**: 320px width (absolute safe minimum)
- **Breakpoints**: Extra-small (≤500px), small (501-768px), desktop (>768px)
- **Touch targets**: Minimum 44×44px for all interactive elements
- **Layout**: Vertical scrolling, stack columns on mobile
- **Units**: Use relative units (%, vw, vh, clamp) — avoid fixed widths

## Verification Checklist

- [ ] Test on Chrome DevTools with 360×660 viewport
- [ ] Test on 320×568 viewport (iPhone SE)
- [ ] Run dev server: `npm run dev`
- [ ] Verify all D3 charts render within viewport
- [ ] Check snap scrolling works on both mobile and desktop
- [ ] Confirm touch targets are >= 44px using browser inspector
- [ ] Test page0 loads with simplified animation (no console errors)
- [ ] Verify two-column layouts stack properly on mobile
- [ ] Check horizontal scrolling is disabled
- [ ] Test orientation changes (portrait/landscape)

## Notes

**fullPage.js License**: The GPL v3 open-source license key is valid and free for GPL-licensed projects. No additional license purchase needed. The npm installation is correct and complete.

**Animation Trade-off**: Removing the scroll-driven crow animation simplifies implementation significantly. Can be enhanced later if needed.

**Future Enhancements** (post-MVP):
- Progressive Web App capabilities
- Service worker for offline use
- Enhanced animations with Intersection Observer
- Tablet-specific optimizations (600-768px breakpoint)