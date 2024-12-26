const express = require("express");
const dotenv = require("dotenv").config();
const logger = require('morgan')
const path = require('path')

const cookieparser = require("cookie-parser");
const session = require('express-session');
const flash = require("connect-flash");
const fileupload =  require("express-fileupload");
const mongoose = require('mongoose');
const Visit = require("./models/visitor")
const admin = require('./models/admin');
const {DatabaseConnect} = require("./config")
DatabaseConnect.DBconnect()
//Routes
const Routes = require("./routes")

const {generatedError} =  require("./middleware/error")
const ErrorHandler = require("./utils/ErrorHandler")

const app = express();

// app.use(fileupload())
// app.use(
//   fileupload({
//     useTempFiles: true,
//     tempFileDir: '/tmp/', // You can specify your desired temporary directory
//   })
// );
app.use(flash());

app.use(session(
  {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }
))


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.errors = req.flash('errors');
  next();
});


app.use("/",Routes)


app.get('/favicon.ico', (req, res) => res.status(204));
app.use("*",(req,res,next)=>{
  res.render('notfound');
})




app.use(generatedError)
app.listen(process.env.PORT,async ()=>{
    console.log("Server listening on " + process.env.PORT);
    // const visit = await Visit.create({number:100000});
    // console.log(visit);
    
    // await Year.insertMany(sampleYears)

    
})
