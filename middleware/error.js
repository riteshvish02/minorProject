exports.generatedError = (err,req,res,next)=>{
    const statusCode = res.statusCode || 500;
    console.log(err)
    if(
        err.name == "MongoServerError" && err.message.includes("E11000 duplicate key")
    ){
        req.flash('error','item you want to create must be unique');
        return res.redirect('back');
    }
    res.render('errorpage',{message:err.message,errname:err.name})
    
}   