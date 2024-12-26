exports.sendtoken = function(Admin,statusCode,res) {
   const token = Admin.getjwttoken()
   const options = {
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
       httpOnly: true,
   }    
   res.cookie("token",token,options).redirect("/admin/admin-dashboard")
}

