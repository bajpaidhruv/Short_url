

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
    const token = req.cookies.jwt; // Ensure 'jwt' matches the actual cookie name

    if (!token) {
      return res.redirect('/login'); // Redirect if no token
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.clearCookie("jwt"); // Clear expired token
        return res.redirect("/login");
      }
      return decoded;
    });

    if (!decoded) return;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.clearCookie("jwt"); // Clear token if user is not found
      return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.clearCookie("jwt"); // Ensure cookie is removed on error
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