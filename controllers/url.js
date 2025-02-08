// const shortid=require('shortid');

// const URL =require('../models/url')

// async function handleGenerateNewShortUrl(req,res) {
//     const body=req.body;
//     if(!body.url) return res.status(400).json({error:"url is required"})
//     const shortID=shortid();
//     await URL.create({
//         shortId:shortID,
//         redirectURL:body.url,
//         visitHistory:[]
//     });
//     return res.render('home',{id:shortID});
   

// }

// async function handleGetAnalytics(req, res) {
//     try {
//         const shortId = req.params.shortId;
//         const result = await URL.findOne({ shortId });

//         if (!result) {
//             return res.status(404).json({ error: 'Short URL not found' });
//         }

//         return res.json({
//             totalClicks: result.visitHistory.length,
//             analytics: result.visitHistory
//         });
//     } catch (error) {
//         console.error('Error fetching analytics:', error);
//         return res.status(500).json({ error: 'An error occurred' });
//     }
// }

// module.exports={
//     handleGenerateNewShortUrl,
//     handleGetAnalytics
    
// };
const shortid = require('shortid');
const URL = require('../models/url');

async function handleGenerateNewShortUrl(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "URL is required" });

    const shortID = shortid();
    try {
        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
            createdBy: req.user._id // Associate with the authenticated user
        });
        return res.redirect('/'); // Redirect to homepage after creation
    } catch (error) {
        console.error("Error creating new short URL:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
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
    handleGetAnalytics
};