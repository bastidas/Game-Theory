# fullPage.js Replacement Refactor Plan

**Date**: February 28, 2026  
**Project**: Game Theory Interactive Visualization

## Plan: Replace fullPage.js with License-Free Alternative

Eliminate fullPage.js dependency by implementing CSS Scroll Snap for vertical sections and manual slide navigation for horizontal content. This removes licensing concerns, reduces bundle size by ~50KB, improves mobile performance, and maintains all existing functionality using modern browser APIs (CSS scroll-snap, IntersectionObserver). The refactor preserves the 11-section structure, 3 fable slides, custom navigation UI, and all callbacks while gaining better touch support and eliminating the GPL license requirement.

## Current fullPage.js Usage Analysis

**Structure:**
- 11 vertical sections (page0 through page00)
- 2 horizontal slide groups: page2 (3 fable slides), page3 (3 game slides)
- Custom slide navigation UI for fables section
- Right-side vertical navigation dots
- Bottom horizontal slide navigation

**API Methods Used:**
- `fullpage_api.reBuild()` - Layout recalculation
- `fullpage_api.moveSlideLeft()` - Previous slide
- `fullpage_api.moveSlideRight()` - Next slide  
- `fullpage_api.moveTo(section, slide)` - Direct navigation

**Callbacks Used:**
- `afterRender` - Initialization complete
- `onLeave` - Section exit
- `afterLoad` - Section enter
- `afterSlideLoad` - Slide navigation complete

**Configuration:**
- `responsiveWidth: 768` - Mobile fallback
- `scrollBar: false` - Hide scrollbar
- `autoScrolling: true` - Snap scrolling
- `controlArrows: false` - Custom nav only
- License key required (GPL v3)

## Recommended Solution: CSS Scroll Snap + Vanilla JS

**Why this approach:**
- ✅ Zero license requirements - pure web standards
- ✅ Excellent mobile/desktop support (95%+ browsers)
- ✅ Better performance - no external library (~50KB saved)
- ✅ Native touch gesture support
- ✅ Simpler codebase - easier to debug and maintain
- ✅ Modern, future-proof solution
- ✅ Works seamlessly with existing D3.js visualizations

### : Pure CSS + IntersectionObserver (RECOMMENDED)
- **License**: None needed ✅
- **Size**: 0KB (native APIs)
- **Pros**: Modern standards, zero dependencies, best performance, great mobile
- **Cons**: Need to implement navigation logic manually (minimal code)
- **Verdict**: Best choice for this project

## Implementation Steps

### Step 1: Remove fullPage.js dependencies

**Files**: [package.json](package.json), [src/main.js](src/main.js), [index.html](index.html)

- Remove `fullpage.js` from package.json dependencies
- Remove `import fullpage from 'fullpage.js'` from [src/main.js](src/main.js#L3)
- Remove `import 'fullpage.js/dist/fullpage.css'` from [src/main.js](src/main.js#L4)
- Delete or archive [css/jquery.fullPage.css](css/jquery.fullPage.css) (no longer needed)
- Run `npm uninstall fullpage.js`

### Step 2: Implement CSS Scroll Snap for vertical sections

**Files**: [css/style.css](css/style.css), [index.html](index.html)

Add to [css/style.css](css/style.css):
```css
/* Scroll snap container for vertical sections */
#fullpage {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  overscroll-behavior: none;
}

/* Each section snaps to viewport */
.section {
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px clamp(20px, 5vw, 80px);
  box-sizing: border-box;
}

/* Disable scroll snap on mobile if needed for better scrolling */
@media (max-width: 768px) {
  #fullpage {
    scroll-snap-type: y proximity; /* Less aggressive snapping */
  }
}
```

No HTML changes needed - existing structure already compatible!

### Step 3: Implement horizontal slide navigation

**Files**: [css/style.css](css/style.css), [src/main.js](src/main.js)

Add CSS for horizontal slides to [css/style.css](css/style.css):
```css
/* Horizontal slide container */
.section.has-slides {
  overflow: hidden; /* Prevent vertical scroll inside slide sections */
}

.slides-wrapper {
  display: flex;
  height: 100%;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.slides-wrapper::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.slide {
  flex: 0 0 100%;
  height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px clamp(20px, 5vw, 80px);
  box-sizing: border-box;
}
```

Update [index.html](index.html) to wrap slides (page2 and page3):
```html
<!-- Before: -->
<div class="section" id="page2">
  <div class="slide" id="aesopSlide1">...</div>
  <div class="slide" id="aesopSlide2">...</div>
  <div class="slide" id="aesopSlide3">...</div>
</div>

<!-- After: -->
<div class="section has-slides" id="page2">
  <div class="slides-wrapper" data-slides-container>
    <div class="slide" id="aesopSlide1">...</div>
    <div class="slide" id="aesopSlide2">...</div>
    <div class="slide" id="aesopSlide3">...</div>
  </div>
</div>
```

Create new slide navigation controller in [src/main.js](src/main.js):
```javascript
// Replace fullpage_api calls with native scroll
function createSlideNavigation() {
  // Find all slide containers
  const slideContainers = document.querySelectorAll('[data-slides-container]');
  
  slideContainers.forEach(container => {
    const slides = container.querySelectorAll('.slide');
    
    // Navigation methods
    function moveSlideLeft() {
      const currentScroll = container.scrollLeft;
      const slideWidth = container.clientWidth;
      container.scrollTo({
        left: currentScroll - slideWidth,
        behavior: 'smooth'
      });
    }
    
    function moveSlideRight() {
      const currentScroll = container.scrollLeft;
      const slideWidth = container.clientWidth;
      container.scrollTo({
        left: currentScroll + slideWidth,
        behavior: 'smooth'
      });
    }
    
    function moveTo(index) {
      const slideWidth = container.clientWidth;
      container.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
    }
    
    // Store methods on container for external access
    container.slideNavigation = {
      moveLeft: moveSlideLeft,
      moveRight: moveSlideRight,
      moveTo: moveTo
    };
  });
}
```

### Step 4: Rebuild vertical navigation dots

**Files**: [src/main.js](src/main.js), [css/style.css](css/style.css)

Remove fullPage.js navigation config and create custom navigation in [src/main.js](src/main.js):
```javascript
function createVerticalNavigation() {
  const sections = document.querySelectorAll('.section');
  const nav = document.createElement('nav');
  nav.id = 'section-nav';
  nav.setAttribute('aria-label', 'Section navigation');
  
  sections.forEach((section, index) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.setAttribute('aria-label', `Go to section ${index + 1}`);
    dot.dataset.section = index;
    
    // Click handler
    dot.addEventListener('click', () => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    
    nav.appendChild(dot);
  });
  
  document.body.appendChild(nav);
  
  // Update active dot on scroll using IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(sections).indexOf(entry.target);
          document.querySelectorAll('.nav-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
          });
        }
      });
    },
    { threshold: 0.5 }
  );
  
  sections.forEach(section => observer.observe(section));
}
```

Add styles to [css/style.css](css/style.css):
```css
#section-nav {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--primary-color);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.nav-dot:hover {
  background: var(--primary-color3);
  transform: scale(1.2);
}

.nav-dot.active {
  background: var(--primary-color);
  width: 14px;
  height: 14px;
}

@media (max-width: 768px) {
  #section-nav {
    right: 10px;
    gap: 10px;
  }
}
```

### Step 5: Update custom fables navigation

**Files**: [src/main.js](src/main.js)

Replace fullPage API calls in `setupFablesNavigation()` function (around lines 220-248):

```javascript
// OLD:
leftArrow.addEventListener('click', () => {
  if (currentSlide > 0) {
    window.fullpage_api.moveSlideLeft();
  }
});

// NEW:
const page2Container = document.querySelector('#page2 [data-slides-container]');
leftArrow.addEventListener('click', () => {
  if (currentSlide > 0) {
    page2Container.slideNavigation.moveLeft();
  }
});

// OLD:
rightArrow.addEventListener('click', () => {
  if (currentSlide < totalSlides - 1) {
    window.fullpage_api.moveSlideRight();
  }
});

// NEW:
rightArrow.addEventListener('click', () => {
  if (currentSlide < totalSlides - 1) {
    page2Container.slideNavigation.moveRight();
  }
});

// OLD:
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    window.fullpage_api.moveTo(3, index);
  });
});

// NEW:
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    page2Container.slideNavigation.moveTo(index);
  });
});
```

Add scroll listener to update navigation state:
```javascript
// Update navigation on scroll
page2Container.addEventListener('scroll', () => {
  const slideWidth = page2Container.clientWidth;
  const scrollLeft = page2Container.scrollLeft;
  const newSlide = Math.round(scrollLeft / slideWidth);
  
  if (newSlide !== currentSlide) {
    updateNavigation(newSlide);
  }
});
```

### Step 6: Implement callback equivalents

**Files**: [src/main.js](src/main.js)

Replace fullPage callbacks with IntersectionObserver:

```javascript
function setupSectionCallbacks() {
  const sections = document.querySelectorAll('.section');
  let currentSection = 0;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const sectionIndex = Array.from(sections).indexOf(entry.target);
        
        if (entry.isIntersecting) {
          // Equivalent to afterLoad callback
          console.log(`Loaded section ${sectionIndex + 1}`);
          
          // Trigger any section-specific initialization
          if (window.sectionLoadHandlers?.[sectionIndex]) {
            window.sectionLoadHandlers[sectionIndex]();
          }
          
          currentSection = sectionIndex;
        } else if (entry.boundingClientRect.top < 0) {
          // Equivalent to onLeave callback (scrolling down)
          console.log(`Leaving section ${sectionIndex + 1}, going down`);
        }
      });
    },
    { threshold: 0.5 }
  );
  
  sections.forEach(section => observer.observe(section));
  
  // Equivalent to afterRender
  console.log('Scroll snap initialized');
}
```

Similar IntersectionObserver setup for slide navigation in slide containers.

### Step 7: Remove fullPage-specific CSS

**Files**: [css/style.css](css/style.css)

Remove or update fullPage-specific classes:
- Remove `.fp-section`, `.fp-tableCell`, `.fp-table` styles (lines ~100-120)
- Remove `.fp-scrollable`, `.fp-slidesNav` styles
- Remove `#fp-nav` styles (will be replaced by custom `#section-nav`)
- Keep the `#fullpage` container but update styles per Step 2

### Step 8: Update reBuild() call

**Files**: [src/main.js](src/main.js)

Remove the `reBuild()` timeout (lines ~144-150):
```javascript
// OLD (DELETE):
setTimeout(() => {
  if (window.fullpage_api) {
    console.log('Rebuilding fullPage.js...');
    window.fullpage_api.reBuild();
  }
}, 100);

// NEW (if needed for resize):
window.addEventListener('resize', debounce(() => {
  // Recalculate any dynamic dimensions
  config.updateDimensions();
}, 250));
```

### Step 9: Test and refine mobile behavior

**Files**: [css/style.css](css/style.css)

Add mobile-specific improvements:
```css
/* Better mobile touch scrolling */
@media (max-width: 768px) {
  #fullpage {
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: y proximity; /* Less aggressive snapping */
  }
  
  .slides-wrapper {
    -webkit-overflow-scrolling: touch;
    scroll-padding: 0 20px; /* Better edge visibility */
  }
  
  /* Prevent text selection during swipe */
  .slide {
    -webkit-user-select: none;
    user-select: none;
  }
  
  /* Enable text selection for paragraphs */
  .slide p {
    -webkit-user-select: text;
    user-select: text;
  }
}

/* Add swipe indicator for slides on mobile */
@media (max-width: 768px) {
  .has-slides::after {
    content: '← swipe →';
    position: absolute;
    bottom: 70px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(19, 19, 19, 0.5);
    font-size: 0.85em;
    pointer-events: none;
    animation: fadeOut 3s forwards;
  }
  
  @keyframes fadeOut {
    0%, 50% { opacity: 1; }
    100% { opacity: 0; }
  }
}
```

### Step 10: Add keyboard navigation

**Files**: [src/main.js](src/main.js)

Enhance accessibility:
```javascript
function setupKeyboardNavigation() {
  const sections = document.querySelectorAll('.section');
  const fullpage = document.getElementById('fullpage');
  
  document.addEventListener('keydown', (e) => {
    const currentSection = Math.round(fullpage.scrollTop / window.innerHeight);
    
    // Up/Down arrows for sections
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const nextSection = sections[Math.min(currentSection + 1, sections.length - 1)];
      nextSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const prevSection = sections[Math.max(currentSection - 1, 0)];
      prevSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Left/Right arrows for slides (if in a slide section)
    const activeSlideContainer = document.querySelector('.has-slides:not([style*="display: none"]) [data-slides-container]');
    if (activeSlideContainer) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        activeSlideContainer.slideNavigation.moveLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        activeSlideContainer.slideNavigation.moveRight();
      }
    }
  });
}
```

## Implementation Order & Timeline

**Phase 1: Preparation**
- Step 1: Remove fullPage.js dependencies

**Phase 2: Vertical Sections**
- Step 2: Implement CSS Scroll Snap
- Step 4: Build custom vertical navigation
- Step 6: Implement IntersectionObserver callbacks
- Step 8: Remove reBuild() call
- Test vertical scrolling on desktop and mobile

**Phase 3: Horizontal Slides** 
- Step 3: Implement slide navigation
- Step 5: Update fables custom navigation
- Test horizontal swiping on mobile

**Phase 4: Cleanup & Polish**
- Step 7: Remove old fullPage CSS
- Step 9: Mobile refinements
- Step 10: Keyboard navigation
- Cross-browser testing

**Total Estimated Time**: 4-6 hours

## Verification Steps

### Desktop Testing
1. Scroll through all 11 sections - should snap to each
2. Navigate using keyboard arrows, Page Up/Down
3. Click vertical navigation dots - should jump to sections
4. In page2 (fables), click left/right arrows - slides should transition
5. Click fable navigation dots - should jump to specific fables
6. Repeat for page3 (game slides)
7. Verify D3.js visualizations still render correctly
8. Test in Chrome, Firefox, Safari, Edge

### Mobile Testing (< 768px)
1. Swipe up/down through sections - should snap
2. Swipe left/right on fables section - slides should scroll
3. Tap navigation dots - should navigate
4. Verify touch targets are 44px minimum
5. Test on iOS Safari and Chrome Android
6. Check orientation changes work correctly
7. Verify no horizontal scroll on sections without slides

### Performance Testing
1. Check bundle size reduction (~50KB lighter)
2. Measure FPS during scrolling (should be 60fps)
3. Test on lower-end mobile devices
4. Verify smooth animations

### Accessibility Testing  
1. Keyboard navigation works throughout
2. Screen reader announces section changes
3. Focusable elements have visible focus indicators
4. Color contrast meets WCAG AA standards

## Benefits Summary

**License & Legal**
- ✅ No GPL license requirement
- ✅ No license key needed
- ✅ MIT-compatible (matches project license)

**Performance**
- ✅ ~50KB reduction in bundle size
- ✅ Faster initial load
- ✅ Native browser performance (no JS scroll hijacking)
- ✅ Better mobile performance

**Mobile Experience**
- ✅ Native touch gesture support
- ✅ Better momentum scrolling
- ✅ Works with browser's overscroll/bounce
- ✅ More intuitive for users

**Maintainability**
- ✅ Less dependency risk
- ✅ Simpler debugging (no library abstractions)
- ✅ Future-proof (web standards)
- ✅ Easier customization

**Browser Support**
- CSS scroll-snap: 96.7% global support
- IntersectionObserver: 97.7% global support
- scroll-behavior: 95.5% global support
- Polyfills available if needed for older browsers

## Fallback Strategy

If CSS Scroll Snap is insufficient for any reason:

**Plan B**: Swiper.js for all scrolling
- Install: `npm install swiper`
- Use Swiper in `vertical` mode for sections
- Use Swiper in `horizontal` mode for slides
- License: MIT ✅
- Size: ~35KB
- More features than needed but battle-tested

**Plan C**: Pageable.js
- Install: `npm install pageable`
- License: MIT ✅
- Similar API to fullPage.js
- Less maintained but functional

## Risks & Mitigations

**Risk**: CSS Scroll Snap not smooth enough
- **Mitigation**: Use `scroll-snap-type: y proximity` for more natural feel
- **Fallback**: Implement Swiper.js (Plan B)

**Risk**: Callbacks don't fire at right times
- **Mitigation**: Adjust IntersectionObserver threshold values
- **Alternative**: Use scroll event with throttling

**Risk**: Mobile performance issues
- **Mitigation**: Native APIs are typically faster than libraries
- **Testing**: Test on low-end devices early

**Risk**: Breaking D3.js visualizations
- **Mitigation**: HTML structure remains largely the same
- **Testing**: Test each visualization page individually

## Notes

- Consider keeping fullPage.js CSS file temporarily during development for reference
- Test thoroughly on iOS devices (Safari has some scroll-snap quirks)
- Consider adding `touch-action` CSS for better gesture control
- May need to adjust scroll snap alignment for sections with different heights
- Consider progressive enhancement: basic scrolling works, snap scrolling enhances

## References

- [CSS Scroll Snap Spec](https://www.w3.org/TR/css-scroll-snap-1/)
- [MDN: CSS Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap)
- [MDN: IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Can I Use: scroll-snap](https://caniuse.com/css-snappoints)
- [Swiper.js Documentation](https://swiperjs.com/) (Plan B)
- [Pageable.js Repository](https://github.com/Mobius1/Pageable) (Plan C)

---

**Decision**: Proceed with CSS Scroll Snap + vanilla JavaScript implementation as primary approach. This provides the best balance of performance, mobile experience, maintainability, and freedom from licensing concerns while maintaining all existing functionality.
