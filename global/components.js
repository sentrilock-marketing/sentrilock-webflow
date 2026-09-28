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
   CONDITIONAL FORM ROUTING LOGIC (CAPTURE-PHASE PURGE)
   ========================================================= */
const roleSelect = document.getElementById("sales-role");
const b2bWrapper = document.getElementById("b2b-wrapper");
const agentWrapper = document.getElementById("agent-wrapper");
const agentIntent = document.getElementById("agent-intent");

// Sub-wrappers inside B2B
const assocCountWrap = document.getElementById("assoc-count-wrap");
const brokerCountWrap = document.getElementById("broker-count-wrap");
const memberCountInput = document.getElementById("member-count");
const agentCountInput = document.getElementById("agent-count");

const cards = {
  "technical-issue": document.getElementById("technical-issue"),
  "account-question": document.getElementById("account-question"),
  "purchase-lockbox": document.getElementById("purchase-lockbox"),
  "temp-access": document.getElementById("temp-access"),
  "sentrilock-board": document.getElementById("sentrilock-board")
};

function hideElement(el) {
  if (el) el.style.display = "none";
}

function showElement(el) {
  if (!el) return;
  el.style.display = "block";
  el.style.animation = "fadeInSlide 0.35s ease-out forwards";
}

function hideAllCards() {
  Object.values(cards).forEach(card => hideElement(card));
}

function resetConditionalDisplay() {
  hideElement(b2bWrapper);
  hideElement(agentWrapper);
  hideElement(assocCountWrap);
  hideElement(brokerCountWrap);
  hideAllCards();

  if (memberCountInput) memberCountInput.required = false;
  if (agentCountInput) agentCountInput.required = false;
}

// Initial hidden state on load
resetConditionalDisplay();

// Role Selection Listener
if (roleSelect) {
  roleSelect.addEventListener("change", function () {
    const selectedRole = this.value.toLowerCase().trim();
    resetConditionalDisplay();

    if (selectedRole === "agent") {
      showElement(agentWrapper);
    } else if (selectedRole === "leadership") {
      showElement(b2bWrapper);
      showElement(assocCountWrap);
      if (memberCountInput) memberCountInput.required = true;
    } else if (selectedRole === "broker") {
      showElement(b2bWrapper);
      showElement(brokerCountWrap);
      if (agentCountInput) agentCountInput.required = true;
    } else if (selectedRole === "other") {
      showElement(b2bWrapper);
    }
  });
}

// Agent Intent Listener
if (agentIntent) {
  agentIntent.addEventListener("change", function () {
    hideAllCards();
    const selectedValue = this.value;
    if (!selectedValue) return;

    let val = selectedValue.toLowerCase().trim();
    if (val.includes("technical") || val === "technical-issue") val = "technical-issue";
    else if (val.includes("account") || val.includes("billing") || val === "account-question") val = "account-question";
    else if (val.includes("purchase") || val.includes("buy") || val === "purchase-lockbox") val = "purchase-lockbox";
    else if (val.includes("temp") || val.includes("showing") || val === "temp-access") val = "temp-access";
    else if (val.includes("board") || val.includes("bring") || val === "sentrilock-board") val = "sentrilock-board";

    const targetCard = cards[val] || document.getElementById(val) || document.getElementById(selectedValue);
    if (targetCard) showElement(targetCard);
  });
}

// CAPTURE-PHASE SUBMIT PURGE
// Intercepts form submission BEFORE Webflow's jQuery listener serializes the inputs
const salesForm = roleSelect ? roleSelect.closest("form") : null;
if (salesForm) {
  salesForm.addEventListener("submit", function () {
    const selectedRole = roleSelect ? roleSelect.value.toLowerCase().trim() : "";
    const elementsToRemove = [];

    // Collect specific inactive select elements based on active role
    if (selectedRole === "leadership") {
      if (agentCountInput) elementsToRemove.push(agentCountInput);
      if (agentIntent) elementsToRemove.push(agentIntent);
    } else if (selectedRole === "broker") {
      if (memberCountInput) elementsToRemove.push(memberCountInput);
      if (agentIntent) elementsToRemove.push(agentIntent);
    } else if (selectedRole === "other") {
      if (memberCountInput) elementsToRemove.push(memberCountInput);
      if (agentCountInput) elementsToRemove.push(agentCountInput);
      if (agentIntent) elementsToRemove.push(agentIntent);
    }

    // Purge inactive inputs from DOM before Webflow serializes the payload
    elementsToRemove.forEach(el => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }, true); // 'true' forces execution in CAPTURE phase
}
});
