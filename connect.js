const mongoose=require('mongoose');
async function connectTomongo(url) {
    return mongoose.connect(url)
}
module.exports={
    connectTomongo
}