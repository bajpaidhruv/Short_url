const express = require('express');
const URL = require('../models/url');
const router = express.Router();
const { checForAuthentication } = require('../middlewares/auth'); // Correct path

// Home Route
router.get("/", checForAuthentication, async (req, res) => {
    try {
        const allurls = await URL.find({ createdBy: req.user._id }); // Fetch URLs created by the authenticated user
        return res.render("home", {
            urls: allurls
        });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Signup Route
router.get("/signup", (req, res) => {
    return res.render('signup', { port: process.env.PORT });
});

// Login Route
router.get("/login", (req, res) => {
    return res.render('login', { port: process.env.PORT });
});


module.exports = router;