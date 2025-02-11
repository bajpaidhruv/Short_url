const express = require('express');
const URL = require('./models/url');
const { connectTomongo } = require('./connect');
const { checForAuthentication } = require("./middlewares/auth");
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const qrcodeRoutes=require('./routes/qrcode');
const app = express();

// Set up view engine
app.set("view engine", "ejs");
app.set('views', path.resolve('./views'));

// Connect to MongoDB
connectTomongo(process.env.MONGO_URI)
    .then(() => console.log(`MongoDB connected: ${process.env.MONGO_URI}`))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Route Definitions
const staticRouter = require('./routes/staticRouter');
const urlRoute = require('./routes/url');
const userRoute = require('./routes/user');
const qrcodeGenerate = require('./routes/qrcode');

app.use('/', staticRouter);
app.use('/user', userRoute);
app.use('/url', urlRoute);
app.use('/qr', checForAuthentication, qrcodeGenerate);
app.use('/qrcode',qrcodeRoutes);
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.post('/logout', (req, res) => {
    res.clearCookie("token"); // Remove JWT cookie if used
    req.session = null; // Destroy session if using express-session
    res.redirect("/login"); // Redirect back to login
});

app.get('/:shortId', async (req, res) => {     
    const shortId = req.params.shortId;
    console.log('Searching for shortId:', shortId);
    
    const entry = await URL.findOneAndUpdate({ shortId }, {
        $push: { visitHistory: { timestamp: Date.now() } }
    });
    
    console.log('Entry found:', entry);
    if (!entry) return res.status(404).json({ error: "Short URL not found" });
    
    // Add https:// if missing
    let redirectURL = entry.redirectURL;
    if (!/^https?:\/\//i.test(redirectURL)) {
        redirectURL = 'https://' + redirectURL;
    }

    console.log('Redirecting to:', redirectURL);
    return res.redirect(redirectURL);
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));