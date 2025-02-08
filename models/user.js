// const mongoose=require('mongoose');
// const userSchema=new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     role:{
//         type:String,
//         required:true,
//         default:"NORMAL"
//     },
//     password:{
//         type:String,
//         required:true
//     }
// },{timestamps:true})
// const User=mongoose.model('user',userSchema);
// module.exports=User;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'], // Validation rule
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
});



const User = mongoose.model('User', userSchema);

module.exports = User;
