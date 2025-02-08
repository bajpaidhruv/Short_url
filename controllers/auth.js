const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userModel=require('../models/user');
const {generateToken}=require('../service/generateJWT');


const signup=  async (req, res) => {
    try {
        let { name, email, password } = req.body;

        // Validate fields
        if (!name || !email || !password) {
            return res.status(400).send("All fields are required.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        let createdUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            createdBy: req.user._id // Ensure this is set
        });

        // const token = jwt.sign({ email }, process.env.JWT_SECRET);
        generateToken(createdUser._id,res);
        
        res.status(201).redirect('/');
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await userModel.findOne({ email });

        if (!user) {
            return res.redirect('/login?error=Invalid email or password');

            
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.redirect('/login?error=Invalid email or password');
        }

        // const token = jwt.sign({ email }, process.env.JWT_SECRET);
        generateToken(user._id,res);
  
        return res.redirect('/'); // Send JSON response
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Error logging in", error });
    }
};



const logout = (req, res) => {
    console.log("Logging out user...");
    res.clearCookie("token");
    res.redirect('/login');
};

module.exports = {
    signup,
    login,
    logout
}




// const signup=async(req,res)=>{
//     const {name,email,password}=req.body;
//     try{
//         if(!name || !email || !password){
//             return res.status(400).send('Please enter all fields');
//         }
//         const newuser=await User.findOne({email});
//         if(newuser){
//             return res.status(400).send('User already exists');
//         }
//         const hashedPassword=await bcrypt.hash(password,10);
//         console.log("password",password);
//         const user=await User.create({
//             name,
//             email,
//             password 
//         });

//         generateToken(user._id,res);
        
//         await user.save();
//         // res.status(200).send('User created successfully');
//         console.log("user created",user);
//         return res.redirect('/');
        
//     }catch(error){
//         console.log(error);
//     }
// }
// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Find user
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: "Email not found" });
//         }

//         // Compare password
//         const isPasswordCorrect = password === user.password;
//         // const isPasswordCorrect = await bcrypt.compare(password, user.password);
//         if (!isPasswordCorrect) {
//             return res.status(400).json({ message: "Incorrect password" });
//         }

//         // Generate JWT and set cookie
//         generateToken(user._id, res);
//         console.log("User logged in:", user);
//         return res.redirect("/");

//     } catch (error) {
//         console.log("Error in login controller:", error.message);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const { generateToken } = require('../service/generateJWT');
