const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/auth/google/callback"
);

// Google authentication callback
router.get('/google/callback', async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ error: 'Authorization code required' });
        }

        // Exchange code for tokens
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Verify ID token
        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        req.session.user = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            loggedInAt: new Date()
        };

        // Redirect to dashboard (instead of just JSON)
        res.redirect('/dashboard');  
    } catch (error) {
        console.error('Google authentication error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
});

// Check authentication status
router.get('/status', (req, res) => {
    if (req.session.user) {
        res.json({ 
            authenticated: true, 
            user: req.session.user 
        });
    } else {
        res.status(401).json({ 
            authenticated: false 
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

module.exports = router;


