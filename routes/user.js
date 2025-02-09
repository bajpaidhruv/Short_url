// // const express=require('express');
// // const {handleUsersignup,handleUserLogin}=require('../controllers/user')
// // const router=express.Router();

// // router.post('/',handleUsersignup)
// // router.post('/login',handleUserLogin)

// // module.exports=router

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/user");
// const router = express.Router();

// router.post("/signup", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, email, password: hashedPassword });
//     await user.save();
//     res.redirect("/user/login");
//   } catch (error) {
//     res.status(500).send("Error during signup");
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).send("User not found");

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).send("Invalid credentials");

//     const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
//     res.cookie("token", token, { httpOnly: true }).redirect("/url"); // Redirect to dashboard
//   } catch (error) {
//     res.status(500).send("Error during login");
//   }
// });

// router.post("/logout", (req, res) => {
//   res.cookie("token", "", { httpOnly: true, expires: new Date(0) }).redirect("/user/login");
// });

// module.exports = router;

const express = require("express");
const { signup, login, logout } = require("../controllers/auth");
const router = express.Router();

router.get("/signup", (req, res) => res.render("signup")); // Render signup page
router.post("/signup", signup); // Signup logic

router.get("/login", (req, res) => res.render("login")); // Render login page
router.post("/login", login); // Login logic




router.post("/logout", (req, res) => {
    res.clearCookie("jwt", { path: "/", httpOnly: true, secure: false }); // Ensure it matches the cookie name in middleware
    req.session = null; // Destroy session if using express-session
    res.redirect("/login"); // Redirect back to login
});




module.exports = router;
