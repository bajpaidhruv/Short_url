const jwt=require("jsonwebtoken")

function setUser(user){
    const payload={
        
    }
    
        
        
    
    return jwt.sign({email:user.email},'shhhess')
}

function getUser(token) {
    return jwt.verify(token,'shhhess')    
}
module.exports={
    setUser,
    getUser
    
}