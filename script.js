
        // Lock/unlock challenges
        const challengeCards = document.querySelectorAll('.program-card');

challengeCards.forEach((card, index) => {
    const startBtn = card.querySelector('.btn-start');
    const statusText = card.querySelector('.status-text');
    const lockState = document.createElement('div');
    lockState.className = 'lock-overlay';

    if (index !== 0) {
        card.classList.add('locked');
        startBtn.disabled = true;
        lockState.innerHTML = '<i class="fas fa-lock"></i>';
        card.appendChild(lockState);
    } else {
        statusText.textContent = 'Ready to Start';
    }

    startBtn.addEventListener('click', () => {
        // Mark as completed
        startBtn.textContent = 'Completed ✅';
        startBtn.disabled = true;
        card.style.opacity = 0.85;
        statusText.textContent = 'Completed';

        // Unlock next challenge
        const nextCard = challengeCards[index + 1];
        if (nextCard) {
            nextCard.classList.remove('locked');
            nextCard.querySelector('.btn-start').disabled = false;
            nextCard.querySelector('.status-text').textContent = 'Ready to Start';

            const lockIcon = nextCard.querySelector('.lock-overlay');
            if (lockIcon) lockIcon.remove();
        }

        // Show Recovery Calendar after first
        if (index === 0) showRecoveryCalendar();
    });
});
        document.addEventListener('DOMContentLoaded', () => {

            // Function outside loop
            function showRecoveryCalendar() {
                const calendar = document.getElementById('recoveryCalendar');
                const grid = document.getElementById('calendarGrid');
                calendar.style.display = 'block';

                // Only render once
                if (grid.children.length > 0) return;

                for (let day = 1; day <= 90; day++) {
                    const cell = document.createElement('div');
                    cell.textContent = day;
                    cell.style.width = '40px';
                    cell.style.height = '40px';
                    cell.style.display = 'flex';
                    cell.style.alignItems = 'center';
                    cell.style.justifyContent = 'center';
                    cell.style.borderRadius = '6px';
                    cell.style.background = day <= 7 ? '#64ffda' : 'rgba(255, 255, 255, 0.1)';
                    cell.style.color = '#0a192f';
                    cell.style.fontWeight = 'bold';
                    grid.appendChild(cell);
                }
            }



        });

        // DOM Elements
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const startAssessment = document.getElementById('startAssessment');
        const assessmentModal = document.getElementById('assessmentModal');
        const closeAssessment = document.getElementById('closeAssessment');
        const assessmentForm = document.getElementById('assessmentForm');
        const dashboard = document.getElementById('dashboard');

        // Event Listeners
        loginBtn.addEventListener('click', () => {
            alert('Google Login would be implemented here. In a real application, this would connect to Google OAuth.');
            showDashboard();
        });

        signupBtn.addEventListener('click', () => {
            alert('Google Sign Up would be implemented here. In a real application, this would connect to Google OAuth.');
            showDashboard();
        });

        startAssessment.addEventListener('click', () => {
            assessmentModal.style.display = 'flex';
        });

        closeAssessment.addEventListener('click', () => {
            assessmentModal.style.display = 'none';
        });

        assessmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const age = document.getElementById('age').value;
            const gender = document.getElementById('gender').value;
            const startAge = document.getElementById('startAge').value;
            const frequency = document.getElementById('frequency').value;

            // Calculate addiction score (simplified example)
            const yearsAddicted = age - startAge;
            let freqScore = 0;

            switch (frequency) {
                case 'multiple-daily':
                    freqScore = 100;
                    break;
                case 'daily':
                    freqScore = 80;
                    break;
                case 'weekly':
                    freqScore = 60;
                    break;
                case 'weekly-once':
                    freqScore = 40;
                    break;
                case 'monthly':
                    freqScore = 20;
                    break;
            }

            const addictionScore = Math.min(100, Math.round((yearsAddicted * 2) + freqScore));

            // Update dashboard with calculated values
            document.getElementById('addictionScore').textContent = `${addictionScore}%`;
            document.getElementById('daysClean').textContent = '0';
            document.getElementById('brainRewire').textContent = '0%';
            document.getElementById('savedTime').textContent = '0h';

            // Hide modal and show dashboard
            assessmentModal.style.display = 'none';
            showDashboard();
        });

        // Function to show dashboard
        function showDashboard() {
            document.querySelector('.hero').style.display = 'none';
            document.querySelector('.features').style.display = 'none';
            document.querySelector('.program').style.display = 'none';
            document.querySelector('footer').style.display = 'none';
            dashboard.style.display = 'block';
        }

        // Close modal if clicked outside
        window.addEventListener('click', (e) => {
            if (e.target === assessmentModal) {
                assessmentModal.style.display = 'none';
            }
        });
    // Challenge data structure
// const cards = document.querySelectorAll(".program-card");
// --- Define your 90-day challenges ---
const PHASES = [
  {
    name: "Dopamine Detox (Days 1–10)",
    encouragement: "You're reclaiming mental space. Every hour you resist is a win.",
    quote: "Starve your distractions. Feed your focus.",
    challenge: "Complete a 7-day dopamine fast: uninstall triggers, block explicit sites, grayscale your phone, and avoid late-night scrolling. Use the last 3 days to journal urges and note improvements in energy.",
    reminder: "If you slip, note the trigger, reset gently, and keep going. Progress > perfection."
  },
  {
    name: "Habit Stacking (Days 11–20)",
    encouragement: "Tiny wins compound into lasting habits.",
    quote: "You do not rise to the level of your goals; you fall to the level of your systems.",
    challenge: "Build a simple morning + night routine: after brushing teeth, do 2 minutes of breathing. After waking, write one daily goal. Repeat consistently for 10 days.",
    reminder: "Miss once, never twice. Restarting is strength."
  },
  {
    name: "Trigger Awareness (Days 21–30)",
    encouragement: "Naming your triggers weakens them. Awareness = power.",
    quote: "Awareness is the first step toward change.",
    challenge: "Keep a 3-column trigger log for 10 days: Cue → Feeling → Action Taken. Replace old reactions with new, healthier choices.",
    reminder: "A setback is data, not defeat. Learn and adjust."
  },
  {
    name: "Squad Building (Days 31–40)",
    encouragement: "You don’t have to fight alone. Support multiplies strength.",
    quote: "If you want to go far, go together.",
    challenge: "Find an accountability partner or support group. Schedule at least 3 short check-ins (10 minutes each) over these 10 days.",
    reminder: "Vulnerability is courage. Sharing makes recovery stronger."
  },
  {
    name: "Mindful Living (Days 41–50)",
    encouragement: "You’re learning to ride the urge without acting on it.",
    quote: "Feelings are visitors. Let them come and go.",
    challenge: "Practice 10 minutes of meditation or urge-surfing daily. When an urge comes, set a 10-minute timer, breathe deeply (4-7-8), and journal 3 sentences.",
    reminder: "Slips happen. Return to the breath and the next right choice."
  },
  {
    name: "Relapse Prevention (Days 51–60)",
    encouragement: "You’re future-proofing your progress. Safeguards keep you steady.",
    quote: "Prepare the roof before it rains.",
    challenge: "Write a relapse prevention plan: list warning signs, 3 people you can contact, 3 replacement actions (walk, workout, call friend), and consequences you accept.",
    reminder: "A relapse is a chapter, not your story. Turn the page."
  },
  {
    name: "Low Up Phase (Days 61–70)",
    encouragement: "Low energy days are part of healing. Keep moving forward.",
    quote: "Consistency beats intensity when intensity can't be sustained.",
    challenge: "Set 'minimums only': 10-minute walk, 2 minutes stretching, fixed bedtime. Do it daily even on tough days.",
    reminder: "Lower the bar, not your standards. Keep the chain unbroken."
  },
  {
    name: "Boss Mode (Days 71–80)",
    encouragement: "You’re leading yourself. Discipline is becoming identity.",
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    challenge: "Adopt 'First Hour, Best Hour': no phone after waking, drink water, move body, write top goal, 10 minutes of learning. Repeat for 10 days.",
    reminder: "If a day derails, salvage the next hour. Momentum is recoverable."
  },
  {
    name: "Final Boss (Days 81–90)",
    encouragement: "You’ve built strength and clarity. Now you lock it in.",
    quote: "Finish strong—make your future self proud.",
    challenge: "Draft your 90-day maintenance blueprint: 1 daily keystone habit, 1 weekly check-in, 1 monthly reflection ritual. Celebrate your journey.",
    reminder: "Growth isn’t linear. Setbacks are feedback. You are capable of lifelong change."
  }
];


// --- Attach challenge events to cards ---
function attachChallengeEvents() {
  const cards = document.querySelectorAll(".program-card");
  const modal = document.getElementById("challengeModal");
  const closeBtn = document.getElementById("closeChallenge");
  const titleEl = document.getElementById("challengePhaseTitle");
  const contentEl = document.getElementById("challengePhaseContent");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const phaseIndex = parseInt(card.getAttribute("data-phase"), 10);
      const phase = PHASES[phaseIndex];

      // If no phase found (missing in array), do nothing
      if (!phase) return;

      titleEl.textContent = phase.name;

      // Build a simple "to-do list" style challenge
      contentEl.innerHTML = `
        <p><b>Encouragement:</b> ${phase.encouragement}</p>
        <p><b>Quote:</b> “${phase.quote}”</p>
        <h4>Daily Challenge:</h4>
        <ul>
          ${phase.challenge.map(task => `<li><input type="checkbox"> ${task}</li>`).join("")}
        </ul>
        <p><b>Reminder:</b> ${phase.reminder}</p>
      `;

      modal.style.display = "flex";
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// --- Run when page loads ---
document.addEventListener("DOMContentLoaded", () => {
  attachChallengeEvents();
});

//********auth-prod******

// API base URL - change this to your production domain
const API_BASE_URL = 'http://localhost:3000';

// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const userProfile = document.getElementById('userProfile');
const userAvatar = document.getElementById('userAvatar');
const userNameNav = document.getElementById('userNameNav');

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthStatus();
    
    // Set up logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Check if user is authenticated
async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/status`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const userData = await response.json();
            updateUIForAuthenticatedUser(userData);
        } else {
            updateUIForUnauthenticatedUser();
        }
    } catch (error) {
        console.error('Auth status check failed:', error);
        updateUIForUnauthenticatedUser();
    }
}

// Update UI for authenticated user
function updateUIForAuthenticatedUser(userData) {
    userProfile.style.display = 'flex';
    logoutBtn.style.display = 'block';
    
    // Hide Google sign-in button
    const googleSignInButton = document.querySelector('.g_id_signin');
    if (googleSignInButton) {
        googleSignInButton.style.display = 'none';
    }
    
    // Update user info
    if (userData.picture) {
        userAvatar.src = userData.picture;
        userAvatar.alt = userData.name;
    }
    userNameNav.textContent = userData.name;
    
    // Enable protected features
    enableProtectedFeatures();
}

// Update UI for unauthenticated user
function updateUIForUnauthenticatedUser() {
    userProfile.style.display = 'none';
    logoutBtn.style.display = 'none';
    
    // Show Google sign-in button
    const googleSignInButton = document.querySelector('.g_id_signin');
    if (googleSignInButton) {
        googleSignInButton.style.display = 'block';
    }
    
    // Disable protected features
    disableProtectedFeatures();
}

// Handle logout
async function handleLogout() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            updateUIForUnauthenticatedUser();
            
            // Reload the page to reset state
            window.location.reload();
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

// Enable features that require authentication
function enableProtectedFeatures() {
    const startAssessmentBtn = document.getElementById('startAssessment');
    if (startAssessmentBtn) {
        startAssessmentBtn.disabled = false;
        startAssessmentBtn.style.opacity = '1';
    }
    
    // Enable program cards
    const programCards = document.querySelectorAll('.program-card');
    programCards.forEach(card => {
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
    });
}

// Disable features that require authentication
function disableProtectedFeatures() {
    const startAssessmentBtn = document.getElementById('startAssessment');
    if (startAssessmentBtn) {
        startAssessmentBtn.disabled = true;
        startAssessmentBtn.style.opacity = '0.5';
    }
    
    // Disable program cards
    const programCards = document.querySelectorAll('.program-card');
    programCards.forEach(card => {
        card.style.opacity = '0.5';
        card.style.pointerEvents = 'none';
    });
}

// Function to make authenticated API calls
async function makeAuthenticatedRequest(url, options = {}) {
    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        if (response.status === 401) {
            // Unauthorized - redirect to login
            updateUIForUnauthenticatedUser();
            throw new Error('Authentication required');
        }
        
        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Example of using the authenticated request function
async function getUserProgress() {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/user/progress`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Failed to fetch user progress:', error);
    }
}
const calendarGrid = document.getElementById("calendarGrid");
for (let i = 1; i <= 90; i++) {
    const dayBox = document.createElement("div");
    dayBox.textContent = i;
    dayBox.classList.add("day-box");
    calendarGrid.appendChild(dayBox);
}
