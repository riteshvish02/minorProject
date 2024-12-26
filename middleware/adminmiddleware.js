const StatusCode = require("http-status-codes");
const ErrorHandler = require("../utils/ErrorHandler")
const {catchAsyncError} =  require("../middleware/catchAsyncError")
const jwt = require("jsonwebtoken")
exports.Validation = catchAsyncError((req,res,next)=>{
    console.log(req.body);
    const {password,email,key} =  req.body;
    let errors = [];

    // Check password length
    if (!password) {
      errors.push({val:"pass", msg: 'Password is required' });
    }
    if (!email) {
        errors.push({val:"email", msg: 'email is required' });
      }
    if (!key) {
       errors.push({val:"key" ,msg: 'key is required' });
    }
  
    // If there are errors, set flash messages and redirect back
    if (errors.length > 0) {
      req.flash('errors', errors);
      res.redirect('/admin/login');  // Or wherever your form is located
    } else {
      // If validation passes, proceed to the next middleware or route handler
      next();
    }
})
exports.isAuthenticated =  catchAsyncError(async function(req,res,next){
  const {token} = req.cookies;
 if(!token) return res.redirect("/admin/login")
 const {id} = jwt.verify(token,process.env.JWT_SECRET )
  if(!id){
    return res.redirect("/admin/login")  // or wherever you want to redirect to after logout
  }
 req.id = id;
  next();
})  
