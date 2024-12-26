const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
             'Please fill a valid email address'
            ]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    key:{
        type:Number,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        select:false,
        required: [true, "password is required"],
        minLength:[6,"password must be at least 6 characters"],
        maxLength:[16,"password must be at most 6 characters"]
    },
    avtar:{
        type:Object,
        default:{
            fileId:"",
            url:"https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww"
        }
    },
    resetPasswordToken:{
         type: String,
         default:"0"
    },

},{timestamps:true})

Admin.pre("save",function(){
    if(!this.isModified("password")){
        return;
    }
    let salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password,salt)
})

Admin.methods.comparePassword = function(password){
    console.log(this.password);
    console.log(password);
    return bcrypt.compareSync(password,this.password)
}

Admin.methods.getjwttoken = function(){
    return jwt.sign({id:this._id,email:this.email,key:this.key},process.env.JWT_SECRET)
}
module.exports = mongoose.model('Admin',Admin)