// API base URL - change this to your production domain
const API_BASE_URL = 'https://beatporn.vercel.app'; // UPDATE WITH YOUR ACTUAL DOMAIN

// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const userProfile = document.getElementById('userProfile');
const userAvatar = document.getElementById('userAvatar');
const userNameNav = document.getElementById('userNameNav');

// Function to initialize Google Sign-In
async function initializeGoogleSignIn() {
    try {
        // Fetch Google config from server
        const response = await fetch(`${API_BASE_URL}/api/config/google`);
        const config = await response.json();
        
        // Initialize Google Sign-In with the server-provided config
        window.google.accounts.id.initialize({
            client_id: config.clientId,
            callback: handleGoogleSignIn,
            login_uri: config.redirectUri,
            context: 'signin',
            ux_mode: 'popup',
            auto_prompt: false
        });
        
        // Render the button
        window.google.accounts.id.renderButton(
            document.querySelector('.g_id_signin'),
            {
                type: 'standard',
                shape: 'pill',
                theme: 'filled_blue',
                text: 'signin_with',
                size: 'medium',
                logo_alignment: 'left'
            }
        );
        
    } catch (error) {
        console.error('Failed to initialize Google Sign-In:', error);
    }
}

// Handle Google Sign-In response
function handleGoogleSignIn(response) {
    // Send the credential to your server for verification
    verifyGoogleToken(response.credential);
}

// Verify the Google token on your server
async function verifyGoogleToken(credential) {
    try {
        const verifyResponse = await fetch(`${API_BASE_URL}/auth/google/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credential }),
            credentials: 'include'
        });
        
        if (verifyResponse.ok) {
            const userData = await verifyResponse.json();
            updateUIForAuthenticatedUser(userData);
        } else {
            console.error('Google token verification failed');
        }
    } catch (error) {
        console.error('Token verification error:', error);
    }
}

// Check authentication status on page load
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

// Update your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthStatus();
    
    // Initialize Google Sign-In when the library is loaded
    if (typeof window.google !== 'undefined') {
        initializeGoogleSignIn();
    } else {
        // Wait for the Google library to load
        window.onGoogleLibraryLoad = initializeGoogleSignIn;
    }
    
    // Set up logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

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
