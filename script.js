(function() {
  "use strict";

  // DOM Elements
  const form = document.getElementById("appForm");
  const ageInput = document.getElementById("age");
  const genderInput = document.getElementById("gender");
  const startAgeInput = document.getElementById("startAge");
  const frequencyInput = document.getElementById("frequency");
  const dayInput = document.getElementById("day");
  const formError = document.getElementById("formError");
  const usageSummaryEl = document.getElementById("usageSummary");
  const phaseTitleEl = document.getElementById("phaseTitle");
  const phaseContentEl = document.getElementById("phaseContent");
  const resetBtn = document.getElementById("resetBtn");

  // Constants
  const FREQUENCY_TO_SESSIONS = {
    daily: 365,
    weekly: 52,
    monthly: 12
  };

  const PHASES = [
    {
      name: "Dopamine Detox",
      encouragement: "You're reclaiming mental space. Every hour you say 'not today' is a win.",
      quote: "Starve your distractions. Feed your focus.",
      challenge: "48-hour reset: uninstall triggers, enable blockers, grayscale phone, no screens after 9pm.",
      reminder: "If you slip, note the trigger, reset gently, and keep going. Progress > perfection."
    },
    {
      name: "Habit Stacking",
      encouragement: "Tiny wins compound. Your new routines are building real momentum.",
      quote: "You do not rise to the level of your goals; you fall to the level of your systems.",
      challenge: "Attach a 2-minute breathing exercise immediately after brushing teeth morning and night.",
      reminder: "Miss once, never twice. Restarting is strength."
    },
    {
      name: "Trigger Awareness",
      encouragement: "Naming the trigger weakens it. You're taking back control.",
      quote: "Awareness is the first step toward change.",
      challenge: "Keep a 3-column trigger log for 7 days: cue → feeling → action you chose.",
      reminder: "A setback is data, not defeat. Learn and adjust."
    },
    {
      name: "Squad Building",
      encouragement: "You don't have to do this alone. Support multiplies your strength.",
      quote: "If you want to go far, go together.",
      challenge: "Ask one trusted person to be your accountability partner and set a weekly 10-minute check-in.",
      reminder: "Vulnerability is courage. If you stumble, share it and keep moving."
    },
    {
      name: "Mindful Living",
      encouragement: "You're learning to ride the urge without acting on it. That's real power.",
      quote: "Feelings are visitors. Let them come and go.",
      challenge: "Urge-surfing: when an urge hits, set a 10-minute timer, breathe 4-7-8, journal 3 sentences.",
      reminder: "Slips happen. Return to the breath and the next right choice."
    },
    {
      name: "Relapse Prevention",
      encouragement: "You're future-proofing your progress. Smart safeguards keep you steady.",
      quote: "Prepare the roof before it rains.",
      challenge: "Write a one-page relapse plan: warning signs, contacts, replacement actions, and chosen consequences.",
      reminder: "A relapse is a chapter, not the story. Turn the page."
    },
    {
      name: "Low Up Phase",
      encouragement: "Low energy days are part of rewiring. You're still moving forward.",
      quote: "Consistency beats intensity when intensity can't be sustained.",
      challenge: "Minimums-only week: 10-minute walk, 2 minutes stretching, fixed lights-out—every day.",
      reminder: "Lower the bar, not your standards. Keep the chain unbroken."
    },
    {
      name: "Boss Mode",
      encouragement: "You're leading yourself. Discipline is becoming identity.",
      quote: "We are what we repeatedly do.",
      challenge: "7-day 'first hour, best hour': no phone on wake, hydrate, move, plan top 1, 10 minutes learning.",
      reminder: "If a day derails, salvage the next hour. Momentum is recoverable."
    },
    {
      name: "Final Boss",
      encouragement: "You've built strength and clarity. Now you lock it in long-term.",
      quote: "Finish strong—make your future self proud.",
      challenge: "Draft your 90-day maintenance blueprint: daily keystone, weekly check-ins, monthly reflection, celebration ritual.",
      reminder: "Growth isn't linear. Setbacks are feedback. You're capable of lifelong change."
    }
  ];

  // Storage Functions
  function loadFromStorage() {
    try {
      const raw = localStorage.getItem("rewire90:data");
      if (!raw) return;
      
      const data = JSON.parse(raw);
      if (typeof data.age === "number") ageInput.value = data.age;
      if (typeof data.gender === "string") genderInput.value = data.gender;
      if (typeof data.startAge === "number") startAgeInput.value = data.startAge;
      if (typeof data.frequency === "string") frequencyInput.value = data.frequency;
      if (typeof data.day === "number") dayInput.value = data.day;
    } catch (error) {
      console.error("Error loading from storage:", error);
    }
  }

  function saveToStorage(data) {
    try { 
      localStorage.setItem("rewire90:data", JSON.stringify(data)); 
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  }

  function clearStorage() {
    try { 
      localStorage.removeItem("rewire90:data"); 
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }

  // Validation
  function validateInputs() {
    const age = Number(ageInput.value);
    const gender = String(genderInput.value || "");
    const startAge = Number(startAgeInput.value);
    const frequency = String(frequencyInput.value || "");
    const day = Number(dayInput.value);

    if (!Number.isFinite(age) || age < 10 || age > 120) {
      return { ok: false, message: "Please enter a valid age (10–120)." };
    }
    
    if (!gender) {
      return { ok: false, message: "Please select your gender." };
    }
    
    if (!Number.isFinite(startAge) || startAge < 5 || startAge > age) {
      return { ok: false, message: "Enter a valid start age (≥5 and ≤ your age)." };
    }
    
    if (!frequency || !(frequency in FREQUENCY_TO_SESSIONS)) {
      return { ok: false, message: "Select your frequency." };
    }
    
    if (!Number.isFinite(day) || day < 1 || day > 90) {
      return { ok: false, message: "Enter your current day on the program (1–90)." };
    }

    return { ok: true, data: { age, gender, startAge, frequency, day } };
  }

  // Calculation Functions
  function computeUsage(age, startAge, frequency) {
    const sessionsPerYear = FREQUENCY_TO_SESSIONS[frequency];
    const normalizedRatio = sessionsPerYear / 365;
    const yearsUsing = Math.max(0, age - startAge);
    
    return { sessionsPerYear, normalizedRatio, yearsUsing };
  }

  function getPhaseByDay(day) {
    const index = Math.min(8, Math.max(0, Math.ceil(day / 10) - 1));
    return { index, ...PHASES[index] };
  }

  // Rendering Functions
  function renderUsageSummary(usage) {
    const ratioPct = (usage.normalizedRatio * 100).toFixed(1) + "%";
    
    usageSummaryEl.innerHTML = `
      <div class="usage-kpis">
        <div class="kpi">
          <div class="label">Sessions / year</div>
          <div class="value">${usage.sessionsPerYear}</div>
        </div>
        <div class="kpi">
          <div class="label">Yearly usage ratio</div>
          <div class="value">${ratioPct}</div>
        </div>
        <div class="kpi">
          <div class="label">Years using</div>
          <div class="value">${usage.yearsUsing}</div>
        </div>
      </div>
    `;
  }

  function renderPhaseContent(phase, day) {
    phaseTitleEl.textContent = `${phase.name} (Day ${day})`;
    phaseContentEl.innerHTML = "";

    const items = [
      { label: "Encouragement", text: phase.encouragement },
      { label: "Quote", text: `"${phase.quote}"` },
      { label: "Challenge", text: phase.challenge },
      { label: "Reminder", text: phase.reminder }
    ];

    items.forEach(item => {
      const block = document.createElement("div");
      block.className = "phase-item";
      block.innerHTML = `<b>${item.label}:</b> ${item.text}`;
      phaseContentEl.appendChild(block);
    });
  }

  // Event Handlers
  function handleSubmit(event) {
    event.preventDefault();
    formError.textContent = "";

    const res = validateInputs();
    if (!res.ok) {
      formError.textContent = res.message;
      return;
    }

    const { age, gender, startAge, frequency, day } = res.data;
    saveToStorage(res.data);
    console.log("Submitted data:", res.data);


    const usage = computeUsage(age, startAge, frequency);
    renderUsageSummary(usage);

    const phase = getPhaseByDay(day);
    renderPhaseContent(phase, day);
  }

  function handleReset() {
    form.reset();
    clearStorage();
    formError.textContent = "";
    usageSummaryEl.innerHTML = "";
    phaseTitleEl.textContent = "Your Current Phase";
    phaseContentEl.innerHTML = "";
  }

  function handleInputChange() {
    const res = validateInputs();
    if (res.ok) {
      saveToStorage(res.data);
    }
  }

  // Initialization
  function attachEvents() {
    form.addEventListener("submit", handleSubmit);
    resetBtn.addEventListener("click", handleReset);

    const inputs = [ageInput, genderInput, startAgeInput, frequencyInput, dayInput];
    inputs.forEach(input => input.addEventListener("change", handleInputChange));
  }

  function init() {
    loadFromStorage();
    attachEvents();

    // If all fields are present, auto-render
    const res = validateInputs();
    if (res.ok) {
      const { age, startAge, frequency, day } = res.data;
      const usage = computeUsage(age, startAge, frequency);
      renderUsageSummary(usage);
      const phase = getPhaseByDay(day);
      renderPhaseContent(phase, day);
    }
  }

  // Start the application when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
localStorage.clear()
