const shortid = require('shortid');

const URL = require('../models/url')

async function handleGenerateNewShortUrl(req, res) {
    // Ensure user is authenticated
    if (!req.user) {
        console.log('Unauthorized URL generation attempt');
        return res.status(401).redirect('/login');
    }

    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const shortID = shortid();

    try {
        const newUrl = await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
            createdBy: req.user._id
        });

        // Fetch all URLs for the current user
        const allurls = await URL.find({ createdBy: req.user._id });

        // Render home page with new URL and all user URLs
        return res.render('home', {
            id: shortID,
            urls: allurls,
            user: req.user
        });
    } catch (error) {
        console.error('Error generating short URL:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function handleGetShortUrlToRedirectUrl(req, res) {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            }
        }

    })
    if (!entry) return res.status(404).json({ error: "Short URL not found" })
    return res.redirect(entry.redirectURL);
}

async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });

        if (!result) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics,
    handleGetShortUrlToRedirectUrl
};