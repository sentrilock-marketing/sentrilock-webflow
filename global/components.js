document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     NAVBAR COMPONENT LOGIC
     ========================================================= */
  const dropdowns = document.querySelectorAll('.w-dropdown');
  
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.w-dropdown-toggle');
    const list = dropdown.querySelector('.w-dropdown-list');
    
    if (!toggle || !list) return;

    dropdown.addEventListener('mouseenter', () => {
      if (window.innerWidth > 991) {
        toggle.classList.add('w--open');
        list.classList.add('w--open');
      }
    });
    
    dropdown.addEventListener('mouseleave', () => {
      if (window.innerWidth > 991) {
        toggle.classList.remove('w--open');
        list.classList.remove('w--open');
      }
    });

    const quarantineEvents = ['touchstart', 'touchend', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'click'];
    
    quarantineEvents.forEach(eventType => {
      toggle.addEventListener(eventType, (e) => {
        if (window.innerWidth <= 991) {
          e.stopPropagation();
        }
      }, { capture: true });
    });

    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 991) {
        e.preventDefault(); 
        const isOpen = dropdown.classList.contains('w--open');
        if (isOpen) {
          dropdown.classList.remove('w--open');
          toggle.classList.remove('w--open');
          list.classList.remove('w--open');
        } else {
          dropdown.classList.add('w--open');
          toggle.classList.add('w--open');
          list.classList.add('w--open');
        }
      }
    }, { capture: true });
  });

  const closeAllMobileDropdowns = (e) => {
    if (window.innerWidth <= 991) {
      const tappedInsideDropdown = e.target.closest('.w-dropdown');
      if (!tappedInsideDropdown) {
        dropdowns.forEach(dropdown => {
          const toggle = dropdown.querySelector('.w-dropdown-toggle');
          const list = dropdown.querySelector('.w-dropdown-list');
          if (toggle && list) {
            dropdown.classList.remove('w--open');
            toggle.classList.remove('w--open');
            list.classList.remove('w--open');
          }
        });
      }
    }
  };

  document.addEventListener('touchstart', closeAllMobileDropdowns, { passive: true });
  document.addEventListener('click', closeAllMobileDropdowns);

  /* =========================================================
     STATS COUNTER COMPONENT LOGIC
     ========================================================= */
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1 
  };

  const animateValue = (el) => {
    const text = el.innerText.trim();
    const numMatch = text.match(/[\d.]+/);
    if (!numMatch) return;
    
    const target = parseFloat(numMatch[0]);
    const prefix = text.substring(0, text.indexOf(numMatch[0]));
    const suffix = text.substring(text.indexOf(numMatch[0]) + numMatch[0].length);
    const decimals = (numMatch[0].split('.')[1] || []).length;
    
    const duration = 2500; 
    let startTime = null;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      const currentValue = easedProgress * target;
      
      el.innerText = prefix + currentValue.toFixed(decimals) + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.innerText = text;
      }
    };

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  document.querySelectorAll('.stats2_number').forEach(el => {
    observer.observe(el);
  });

  /* =========================================================
     GLOBAL TRADEMARK SUPERSCRIPT LOGIC
     ========================================================= */
  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const nodesToReplace = [];
  
  while (textWalker.nextNode()) {
    const node = textWalker.currentNode;
    const parentTag = node.parentNode.tagName;
    
    if (node.nodeValue.includes('®') && parentTag !== 'SCRIPT' && parentTag !== 'STYLE' && parentTag !== 'SUP') {
      nodesToReplace.push(node);
    }
  }

  nodesToReplace.forEach(node => {
    const span = document.createElement('span');
    span.innerHTML = node.nodeValue.replace(/®/g, '<sup>®</sup>');
    node.parentNode.replaceChild(span, node);
  });

  /* =========================================================
     FORM CHARACTER COUNTER LOGIC
     ========================================================= */
  const textAreas = document.querySelectorAll('.is-text-area');

  textAreas.forEach(function(textArea) {
    const wrapper = textArea.closest('.form_field-wrapper');
    
    if (wrapper) {
      const counterDisplay = wrapper.querySelector('.is-char-counter');
      const maxLength = 500;

      if (counterDisplay) {
        textArea.addEventListener('input', function() {
          counterDisplay.textContent = this.value.length + ' / ' + maxLength;
        });
      }
    }
  });

  /* =========================================================
     CONDITIONAL FORM ROUTING LOGIC
     ========================================================= */
  const roleSelect = document.getElementById("sales-role");
  const b2bWrapper = document.getElementById("b2b-wrapper");
  const agentWrapper = document.getElementById("agent-wrapper");
  const agentIntent = document.getElementById("agent-intent");

  const cards = {
    "technical-issue": document.getElementById("technical-issue"),
    "account-question": document.getElementById("account-question"),
    "purchase-lockbox": document.getElementById("purchase-lockbox"),
    "temp-access": document.getElementById("temp-access"),
    "sentrilock-board": document.getElementById("sentrilock-board")
  };

  function hideAllCards() {
    Object.values(cards).forEach(card => {
      if (card) card.style.display = "none";
    });
  }

  // Set initial hidden state on load
  if (b2bWrapper) b2bWrapper.style.display = "none";
  if (agentWrapper) agentWrapper.style.display = "none";
  hideAllCards();

  // Listen for main Role selection
  if (roleSelect) {
    roleSelect.addEventListener("change", function () {
      const selectedRole = this.value;

      if (b2bWrapper) b2bWrapper.style.display = "none";
      if (agentWrapper) agentWrapper.style.display = "none";
      hideAllCards();
      if (agentIntent) agentIntent.value = "";

      if (selectedRole.toLowerCase().includes("agent")) {
        if (agentWrapper) agentWrapper.style.display = "block";
      } else if (selectedRole !== "") {
        if (b2bWrapper) b2bWrapper.style.display = "block";
      }
    });
  }

// Listen for Agent Intent selection
if (agentIntent) {
  agentIntent.addEventListener("change", function () {
    hideAllCards();
    
    // Normalize value to match IDs (e.g., "Technical Issue..." -> "technical-issue")
    let val = this.value.toLowerCase().trim();
    if (val.includes("technical")) val = "technical-issue";
    else if (val.includes("account") || val.includes("billing")) val = "account-question";
    else if (val.includes("purchase") || val.includes("buy")) val = "purchase-lockbox";
    else if (val.includes("temp") || val.includes("showing")) val = "temp-access";
    else if (val.includes("board") || val.includes("bring")) val = "sentrilock-board";

    const selectedCard = cards[val] || document.getElementById(val);
    if (selectedCard) {
      selectedCard.style.display = "block";
    }
  });
}
});
