const mongoose =  require("mongoose")
const ErrorHandler  = require("../utils/ErrorHandler")
exports.DBconnect = ()=>{
    
  try {
    mongoose.connect(process.env.MONGOURI).then(()=>{
        console.log("MongoDB connected successfully")
    }).catch((error)=>{
        console.log(error);
    });
  } catch (error) {
    console.log(error);
    
  }
}