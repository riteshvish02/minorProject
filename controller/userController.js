const StatusCode = require("http-status-codes");
const ErrorHandler = require("../utils/ErrorHandler")
const {catchAsyncError} =  require("../middleware/catchAsyncError")
const {sendmail} =  require("../utils/nodemailer")
const {sendmailadmin} = require("../utils/mailadmin")
const EditorialBoard = require("../models/editorialBoard")
const Indexing = require("../models/indexing")
const News = require("../models/news")
const Year = require("../models/year")
const Manuscript =  require("../models/manuscript")
const Issue = require("../models/issues")
const Contact = require("../models/contact")
const Article = require("../models/article")
const Visit = require("../models/visitor")
const path =  require("path");
const axios = require('axios');
const fs = require('fs');
const { getNames } = require('country-list');
const countryNames = getNames();
const {currentYear,Company} = require("../utils/manuscriptcount")
const moment = require('moment');
exports.home = catchAsyncError(async (req,res,next)=>{
  const indexings = await Indexing.find().sort({_id:-1})
  const view = await Visit.findOne();
  view.view += 1;
  await view.save();
  let visit = view.view.toString().split("")
  const news =  await News.find().sort({_id:-1});
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A');
  res.render("home",{news,indexings,formattedDateTime,visit})
}),

exports.aboutPublication = catchAsyncError(async (req,res,next)=>{
  const indexings = await Indexing.find().sort({_id:-1})
  const news =  await News.find().sort({_id:-1});
   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("about-ethics",{news,formattedDateTime,indexings,visit})
})
exports.aboutus = catchAsyncError(async (req,res,next)=>{
  const indexings = await Indexing.find().sort({_id:-1})
  const news =  await News.find().sort({_id:-1});
   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("aboutus",{news,formattedDateTime,indexings,visit})
})


exports.indexingPage = catchAsyncError(async (req,res,next)=>{
  const indexings = await Indexing.find().sort({_id:-1})
  const news =  await News.find().sort({_id:-1});

   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("indexing",{indexings,news,formattedDateTime,visit})
})

exports.contactPage = catchAsyncError(async (req,res,next)=>{
  const news =  await News.find().sort({_id:-1});
  const contacts = await Contact.find().sort({_id:-1});
  const indexings = await Indexing.find().sort({_id:-1})
   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("contact",{news,contacts,formattedDateTime,indexings,visit})
})

exports.archivePage = catchAsyncError(async (req,res,next)=>{
  const news =  await News.find().sort({_id:-1});
  const years = await Year.find().populate("issues").sort({_id:-1}).limit(10);
  const indexings = await Indexing.find().sort({_id:-1})
   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("archive",{news,years,formattedDateTime,indexings,visit})
})

exports.downloadPage = catchAsyncError(async (req,res,next)=>{
  const news =  await News.find().sort({_id:-1});
  const indexings = await Indexing.find().sort({_id:-1})
   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("download",{news,indexings,formattedDateTime,visit});
})
exports.currentissuePage = catchAsyncError(async (req,res,next)=>{
  const indexings = await Indexing.find().sort({_id:-1})
  let issues= null;
  const news =  await News.find().sort({_id:-1});
  const [years] = await Year.find().populate("issues").sort({_id:-1}).limit(1);
  if(!years){
    req.flash('error','no year found');
     const view = await Visit.findOne();
     let visit = view.view.toString().split("")
     const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A');
    return res.render("currentissue",{news,issues,formattedDateTime,visit,indexings})
  }
   [issues] = await Issue.find({year:years._id,status:"Publish"}).populate("articles").sort({_id:-1}).limit(1);
  
  
    const view = await Visit.findOne();
    let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A');  
  res.render("currentissue",{news,years,formattedDateTime,visit,issues,indexings})
})
exports.archiveShowPage = catchAsyncError(async (req,res,next)=>{
  const news =  await News.find().sort({_id:-1});
  const indexings = await Indexing.find().sort({_id:-1})
  const id = req.params.id;
  const issues = await Issue.findOne({_id: id,status:"Publish"}).populate("articles");
   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("archiveshow",{news,issues,formattedDateTime,visit,indexings})
})

exports.aboutReview = catchAsyncError(async (req,res,next)=>{
  const news =  await News.find().sort({_id:-1});
  const indexings = await Indexing.find().sort({_id:-1})
   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("about-review",{news,formattedDateTime,indexings,visit})
})
exports.joinReviewer = catchAsyncError(async (req,res,next)=>{
  const news =  await News.find().sort({_id:-1});
  const indexings = await Indexing.find().sort({_id:-1})
   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("join-review",{news,formattedDateTime,indexings,visit})
})

exports.aboutInstruction = catchAsyncError(async (req,res,next)=>{
  const news =  await News.find().sort({_id:-1});
  const indexings = await Indexing.find().sort({_id:-1})
   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("about-ins",{news,formattedDateTime,indexings,visit})
})

exports.editorialBoard = catchAsyncError(async (req,res,next)=>{
  const editorials =  await EditorialBoard.find();
  const news =  await News.find().sort({_id:-1});
  const indexings = await Indexing.find().sort({_id:-1})
   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("editorialboard",{editorials,visit,formattedDateTime,news,indexings})
})

exports.manuscriptPage = catchAsyncError(async (req,res,next)=>{
  const indexings = await Indexing.find().sort({_id:-1})
  const news =  await News.find().sort({_id:-1});
   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("submission",{news,countryNames,formattedDateTime,visit,formData:{},errors:[],indexings})
})

exports.manuscriptCreate = catchAsyncError(async (req,res,next)=>{
  
  const count = await Manuscript.find().sort({_id: -1});
  let newcount = null;
  if(count.length > 0){
    const num = count[0].manuscriptNumber
    const result =  num.split("-");
     newcount = parseInt(result[1].substring(0,3)) + 1;
  }else{
     newcount = 100;
  }

  const {
    firstname,
    nametype,
    type,
    designation,
    title,
    number,
    email,
    status,
    gender,
    address,
    country,
   } = req.body;
  
  const fullname = nametype + " " + firstname ;
  const manuscriptNumber = (Company+"-"+newcount+currentYear).trim();
  
 
  const manuscript = await Manuscript.create({
    name: fullname,
    designation,
    title,
    manuscriptNumber,
    mobile:number,
    articletype:type,
    email,  
    status, 
    gender,
    address,
    pdf:{
        fileId:req.files.pdf[0].filename,
        url:req.files.pdf[0].filename
    },
    country
  })
  
if(!manuscript){
  req.flash('error', 'something went wrong');
  return res.redirect('/manuscript-submission');
}
 
 await sendmail(req.body.email,req,res,manuscript)
 sendmailadmin(req,res,manuscript)
  req.flash('success','Manuscript submitted successfully');
  res.redirect('/manuscript-submission');
  
})

exports.publicationFeePage = catchAsyncError(async (req,res,next)=>{
  const news =  await News.find().sort({_id:-1});
  const indexings = await Indexing.find().sort({_id:-1})

   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("publicationfee",{news,indexings,formattedDateTime,visit})
})
exports.trackarticlePage = catchAsyncError(async (req,res,next)=>{
  const news =  await News.find().sort({_id:-1});
  const indexings = await Indexing.find().sort({_id:-1})

  const manuscript = await Manuscript.findOne({manuscriptNumber:req.body.number})
   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("trackarticle",{news,manuscript,formattedDateTime,visit,indexings})
})

exports.getArticle = catchAsyncError(async (req,res,next)=>{
  const news =  await News.find().sort({_id:-1});
  const article = await Article.findOne({_id: req.params.id}).populate("issue")
  const indexings = await Indexing.find().sort({_id:-1})

  
  if(!article){
    req.flash('error', 'Article not found');
    return res.redirect('/currentissue-page');
  }

   const view = await Visit.findOne();
   let visit = view.view.toString().split("")
  const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
  res.render("abstract",{news,article,formattedDateTime,indexings,visit})
})

exports.getView = catchAsyncError(async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findByIdAndUpdate(
        articleId,
        { $inc: { view: 1 } },
        { new: true }
    );
    res.json({ success: true, updatedViewCount: article.view });
} catch (error) {
    res.status(500).json({ success: false, message: 'Error updating view count' });
}

});

