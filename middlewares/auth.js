

// function checkForAuthentication(req,res,next){
//     const tokenCookie=req.cookies?.token;
//     req.user=null;
//     if(!tokenCookie) return next();

//     const token=tokenCookie;
//     const user=getUser(token);
//     req.user=user;
//     return next();
// }
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const checForAuthentication = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.redirect('/login'); // Redirect to login page if no token
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.redirect('/login'); // Redirect if token is invalid
    }

    const user = await User.findById(decoded.userId).select("-password"); // Use userId from decoded token

    if (!user) {
      return res.redirect("/login"); // Redirect if user not found
    }

    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in authentication middleware:", error.message);
    res.redirect('/login'); // Redirect on error
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