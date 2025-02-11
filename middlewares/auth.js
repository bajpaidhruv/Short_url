const jwt = require("jsonwebtoken");
const User = require("../models/user");

const checForAuthentication = async (req, res, next) => {
  try {
    console.log('Cookies:', req.cookies); // Log all cookies
    const token = req.cookies.jwt;
    console.log('Token:', token); // Log the token

    if (!token) {
      console.log('No token found, redirecting to login');
      return res.redirect('/login');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (verifyError) {
      console.error('Token verification error:', verifyError.message);
      res.clearCookie("jwt");
      return res.redirect("/login");
    }

    if (!decoded || !decoded.userId) {
      console.log('Invalid decoded token');
      res.clearCookie("jwt");
      return res.redirect("/login");
    }

    const user = await User.findById(decoded.userId).select("-password");
    console.log('Found user:', user);

    if (!user) {
      console.log('No user found for the given token');
      res.clearCookie("jwt");
      return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.clearCookie("jwt");
    res.redirect('/login');
  }
};

module.exports = { checForAuthentication };

// async function restrictTologin(req,res,next){
//     const userUid=req.headers["authoriazation"];
//     if(!userUid) return res.redirect("/login?error= not_logged_in")
//     const token=userUid.split('Bearer')[1]
//     const user=getUser(token);
//     if(!user) return res.redirect('/login?error=not_signed_up')
//     req.user=user;
//     next()
// }

// async function getUser(token) {
    
//     const userUid=req.headers["authoriazation"];
//     const token=userUid.split('Bearer')[1]
//     const user=getUser(token);
//     req.user=user;
//     next();
// }

// function restrictTo(roles){
//     return function(req,res,next){
//         if(!req.user ) return res.redirect("/login");
//         if(!roles.includes(req.user.role)) return res.end("UnAuthorized");
//         return next();
//     }
// }

// module.exports={
//     // restrictTo,
//     checkForAuthentication
// }