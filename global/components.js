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
   CONDITIONAL FORM ROUTING & VALIDATION
   ========================================================= */
const roleSelect = document.getElementById("sales-role");
const b2bWrapper = document.getElementById("b2b-wrapper");
const orgSizeWrap = document.getElementById("org-size-wrap");
const orgSizeLabel = document.getElementById("org-size-label");
const orgSizeSelect = document.getElementById("org-size");

// Character Count Elements
const messageField = document.getElementById("sales-message");
const charCounter = document.getElementById("char-count");

// Agent Elements
const agentWrapper = document.getElementById("agent-wrapper");
const agentIntent = document.getElementById("agent-intent");
const cards = {
  "technical-issue": document.getElementById("technical-issue"),
  "account-question": document.getElementById("account-question"),
  "purchase-lockbox": document.getElementById("purchase-lockbox"),
  "temp-access": document.getElementById("temp-access"),
  "sentrilock-board": document.getElementById("sentrilock-board")
};

// Dynamic B2B Dropdown Options (Values updated for clean email output)
const leadershipOptions = [
  { text: "Select one...", value: "" },
  { text: "Under 1,000 members", value: "Under 1,000 members" },
  { text: "1,000 – 5,000 members", value: "1,000 - 5,000 members" },
  { text: "5,000 – 15,000 members", value: "5,000 - 15,000 members" },
  { text: "15,000+ members", value: "15,000+ members" }
];

const brokerOptions = [
  { text: "Select one...", value: "" },
  { text: "1 – 10 agents", value: "1 - 10 agents" },
  { text: "11 – 50 agents", value: "11 - 50 agents" },
  { text: "51 – 200 agents", value: "51 - 200 agents" },
  { text: "200+ agents", value: "200+ agents" }
];

const otherOptions = [
  { text: "Select one...", value: "" },
  { text: "1 – 50 employees", value: "1 - 50 employees" },
  { text: "51 – 200 employees", value: "51 - 200 employees" },
  { text: "201 – 500 employees", value: "201 - 500 employees" },
  { text: "500+ employees", value: "500+ employees" }
];

function populateDropdown(optionsArray) {
  if (!orgSizeSelect) return;
  orgSizeSelect.innerHTML = ""; 
  optionsArray.forEach(opt => {
    const optionEl = document.createElement("option");
    optionEl.value = opt.value;
    optionEl.textContent = opt.text;
    orgSizeSelect.appendChild(optionEl);
  });
}

function setDisplay(el, state) {
  if (el) el.style.display = state;
  if (state === "block" && el) el.style.animation = "fadeInSlide 0.35s ease-out forwards";
}

// Initial State
setDisplay(b2bWrapper, "none");
setDisplay(agentWrapper, "none");
setDisplay(orgSizeWrap, "none");
Object.values(cards).forEach(card => setDisplay(card, "none"));

// Live Character Counter
if (messageField && charCounter) {
  messageField.addEventListener("input", function () {
    charCounter.innerText = `${this.value.length}/500`;
  });
}

// Role Selection Logic
if (roleSelect) {
  roleSelect.addEventListener("change", function () {
    const role = this.value.toLowerCase();
    const reqAsterisk = `<span class="form_asterisk-red">*</span>`;
    
    setDisplay(b2bWrapper, "none");
    setDisplay(agentWrapper, "none");
    setDisplay(orgSizeWrap, "none");
    Object.values(cards).forEach(card => setDisplay(card, "none"));
    if (orgSizeSelect) orgSizeSelect.required = false;

    // We now use .includes() so you can make the Webflow values as descriptive as you want
    if (role.includes("agent")) {
      setDisplay(agentWrapper, "block");
      if (agentIntent) agentIntent.value = "";
    } 
    else if (role.includes("leadership")) {
      setDisplay(b2bWrapper, "block");
      setDisplay(orgSizeWrap, "block");
      if (orgSizeLabel) orgSizeLabel.innerHTML = `How many members do you have? ${reqAsterisk}`;
      populateDropdown(leadershipOptions);
      if (orgSizeSelect) orgSizeSelect.required = true;
    } 
    else if (role.includes("broker")) {
      setDisplay(b2bWrapper, "block");
      setDisplay(orgSizeWrap, "block");
      if (orgSizeLabel) orgSizeLabel.innerHTML = `How many agents are in your brokerage? ${reqAsterisk}`;
      populateDropdown(brokerOptions);
      if (orgSizeSelect) orgSizeSelect.required = true;
    } 
    else if (role.includes("other")) {
      setDisplay(b2bWrapper, "block");
      setDisplay(orgSizeWrap, "block");
      if (orgSizeLabel) orgSizeLabel.innerHTML = `Company size ${reqAsterisk}`;
      populateDropdown(otherOptions);
      if (orgSizeSelect) orgSizeSelect.required = true;
    }
  });
}

// Agent Intent Routing Logic
if (agentIntent) {
  agentIntent.addEventListener("change", function () {
    Object.values(cards).forEach(card => setDisplay(card, "none"));
    const val = this.value.toLowerCase().trim();
    const targetCard = cards[val] || document.getElementById(val);
    if (targetCard) setDisplay(targetCard, "block");
  });
}
});
