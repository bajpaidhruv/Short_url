const express = require('express');
const URL = require('../models/url');
const router = express.Router();
const { checForAuthentication } = require('../middlewares/auth'); // Correct path
const { logout } = require('../controllers/auth');
// Home Route
router.get("/", checForAuthentication, async (req, res) => {
    try {
        console.log('User object:', req.user); // Debug log
        if (!req.user) {
            return res.status(401).send('User not authenticated');
        }
        const allurls = await URL.find({ createdBy: req.user._id }); // Fetch URLs created by the authenticated user
        return res.render("home", {
            urls: allurls,
            user: req.user || {} // Provide a fallback empty object
        });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Signup Route
router.get("/signup", (req, res) => {
    const baseUrl = req.protocol + "://" + req.get("host"); 
    res.render("signup", { baseUrl });
});

// Login Route
router.get("/login", (req, res) => {
    const baseUrl = req.protocol + "://" + req.get("host"); 
    res.render('login', { baseUrl });
});

// Logout Route
router.post("/logout", logout);

module.exports = router;