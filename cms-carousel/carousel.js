document.addEventListener('DOMContentLoaded', () => {
  // Find ALL slider lists on the page
  const allSliders = document.querySelectorAll('.carousel-cms-list');

  allSliders.forEach((list) => {
    // Find the common parent wrapper (like the section or component)
    // This ensures we only grab the arrows/dots belonging to THIS specific slider
    const componentWrapper = list.closest('.blog68_component') || list.closest('section') || document;

    const leftBtn = componentWrapper.querySelector('.press-arrow-left');
    const rightBtn = componentWrapper.querySelector('.press-arrow-right');
    const dotNav = componentWrapper.querySelector('.press-dot-nav');

    const items = list.querySelectorAll('.press-cms-item');
    if (items.length === 0) return;

    // State Management for THIS specific slider
    let activeIndex = 0;
    let isScriptScrolling = false;
    let scrollTimeout;
    let dots = [];

    function updateDots() {
      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function scrollToIndex(index) {
      activeIndex = Math.max(0, Math.min(index, dots.length - 1));
      isScriptScrolling = true;
      updateDots();

      const maxScrollLeft = list.scrollWidth - list.clientWidth;
      
      const targetScroll = dots.length > 1 
        ? (activeIndex / (dots.length - 1)) * maxScrollLeft 
        : 0;

      list.scrollTo({ left: targetScroll, behavior: 'smooth' });

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScriptScrolling = false;
      }, 500); 
    }

    // Generate Round Dots
    if (dotNav) {
      dotNav.innerHTML = '';

      items.forEach((item, index) => {
        const dot = document.createElement('div');
        dot.classList.add('custom-dot');
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
          scrollToIndex(index);
        });

        dotNav.appendChild(dot);
        dots.push(dot);
      });
    }

    // Arrow Button Clicks
    if (leftBtn) {
      leftBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      });
    }
    if (rightBtn) {
      rightBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      });
    }

    // Trackpad/Touch Native Scroll Sync
    list.addEventListener('scroll', () => {
      if (isScriptScrolling) return;

      const maxScrollLeft = list.scrollWidth - list.clientWidth;
      
      if (maxScrollLeft <= 0) return;

      const scrollPercentage = list.scrollLeft / maxScrollLeft;
      activeIndex = Math.round(scrollPercentage * (dots.length - 1));

      updateDots();
    });
  });
});
