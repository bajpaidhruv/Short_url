const express = require('express');
const router = express.Router();
const { checForAuthentication } = require('../middlewares/auth');
const { handleGenerateNewShortUrl, handleGetAnalytics } = require("../controllers/url");

// Apply authentication middleware to all routes in this router
router.use(checForAuthentication);

router.post('/', handleGenerateNewShortUrl);
router.get('/analytics/:shortId', handleGetAnalytics);

module.exports = router;