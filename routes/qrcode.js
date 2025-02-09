const express = require('express');
const QRCode = require('qrcode');
const URL = require('../models/url'); // Import your URL model
const router = express.Router();
const { checForAuthentication } = require('../middlewares/auth'); // Correct path
// Route to generate QR code for a specific short URL
router.get('/:shortId', checForAuthentication,async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const urlEntry = await URL.findOne({ shortId });

        if (!urlEntry) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        const qrCodeUrl = await QRCode.toDataURL(urlEntry.redirectURL); // Generate QR code

        // Render a view or return the QR code image
        return res.render('qrcode', { qrCodeUrl, shortId }); // You can create a qrcode.ejs view
    } catch (error) {
        console.error('Error generating QR code:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;