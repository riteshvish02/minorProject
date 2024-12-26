const StatusCode = require("http-status-codes");
const ErrorHandler = require("../utils/ErrorHandler")
const {catchAsyncError} =  require("../middleware/catchAsyncError")
const {sendtoken} =  require("../utils/sendtoken")
const {sendmail} = require("../utils/nodemailer")
const status =  require("../utils/issuestatus")
const axios = require('axios');
const fs = require('fs');
const EditorialBoard =  require("../models/editorialBoard")
const Admin = require("../models/admin")
const Indexing =  require("../models/indexing")
const News =  require("../models/news")
const Contact =  require("../models/contact")
const Year =  require("../models/year")
const Issue =  require("../models/issues")
const Manuscript = require("../models/manuscript")
const Article = require("../models/article")
const path =  require('path')
const moment = require('moment');
const AdminModel =  require("../models/admin")
const flash =  require("connect-flash");
const admin = require("../models/admin");
const { log } = require("console");
// const { response } = require("express");


exports.loginPage = catchAsyncError((req,res,next)=>{
    res.render("admin/login",)
})
exports.updatePage = catchAsyncError(async (req,res,next)=>{
    const user = await Admin.findById(req.params.id)
    if(!user){
        req.flash('error',"User not found")
        return res.redirect("/admin/login")
    }
    res.render("admin/updateprof",{user,adminId:req.id})
})

exports.updateuser = catchAsyncError(async (req,res,next)=>{
    const user = await Admin.findById(req.params.id)
    
    if(!user){
        req.flash('error',"User not found")
        return res.redirect("/admin/login")
    }
    if (req.files.image && req.files.image[0]?.filename) {
        const oldImagePath = path.join(__dirname, '..', 'public', 'images', 'uploads', user.avtar.fileId);

        // Delete the old image file if it exists
        fs.unlink(oldImagePath, (err) => {
            if (err) {
                console.error('Error deleting the old file:', err);
            } else {
                console.log('Old image deleted successfully');
            }
        });

        const image = req.files.image[0].filename;
       user.avtar = {fileId: image,url: image}
       await user.save()
    }
     
   
    user.email = req.body.email,
    user.key = req.body.key
    await user.save()
    req.flash('success','user updated successfully')
    res.redirect("/admin/admin-dashboard")
})
exports.updatePasswordPage = catchAsyncError(async (req,res,next)=>{
    const user = await Admin.findById(req.params.id)
    if(!user){
        req.flash('error',"User not found")
        return res.redirect("/admin/login")
    }
    res.render("admin/updatepass",{user,adminId:req.id})
})
exports.updatePassword = catchAsyncError(async (req,res,next)=>{
    const user = await Admin.findById(req.params.id)
    if(!user){
        req.flash('error',"User not found")
        return res.redirect("/admin/login")
    }
    if(user.password != req.body.oldpassword){
        req.flash('error',"Old password does not match")
        return res.redirect("/admin/update-password/"+req.params.id)
    }else{
        user.password = req.body.newpassword
        await user.save()
        req.flash('success',"Password updated successfully")
        res.redirect("/admin/logout")
    }
})

exports.visit = catchAsyncError((req,res,next)=>{
    res.send("ok")
})

exports.login = catchAsyncError(async (req,res,next)=>{
   const Admin =  await AdminModel.findOne({email:req.body.email}).select("+password")
   if(!Admin){
    req.flash('error',"Admin with this email not found")
    res.redirect("/admin/login")
   }
   if(Admin.key.toString() !== req.body.key){
    req.flash('error',"Invalid key");
    res.redirect("/admin/login")
   }
   const isMatch = await Admin.comparePassword(req.body.password)
   if(!isMatch) {
    req.flash('error',"Invalid password");
    res.redirect("/admin/login")
   }
   sendtoken(Admin,200,res)
})

exports.dashboardPage = catchAsyncError(async (req,res,next)=>{
    res.render("admin/dashboard",{adminId:req.id})
})

exports.editorialCreatePage = catchAsyncError(async (req,res,next)=>{
    
    res.render('admin/editorial/editorialCreate',{adminId:req.id});
})

exports.editEditorialPage = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    editorial = await EditorialBoard.findById(id);
    if(!editorial){
        return res.redirect("api/v1/admin/manage-editorial")
    }


    res.render('admin/editorial/editEditorial', {
        editorial,adminId:req.id
      });
})

exports.editEditorial = catchAsyncError(async (req,res,next)=>{
    
    const id = req.params.id;
    const {name,university,description,type} =  req.body;
    const editorial_member = await EditorialBoard.findById(id);
    if (req.files.image && req.files.image[0]?.filename) {
        const oldImagePath = path.join(__dirname, '..', 'public', 'images', 'uploads', editorial_member.image.fileId);

        // Delete the old image file if it exists
        fs.unlink(oldImagePath, (err) => {
            if (err) {
                console.error('Error deleting the old file:', err);
            } else {
                console.log('Old image deleted successfully');
            }
        });

        const image = req.files.image[0].filename;
       editorial_member.image = {fileId: image,url: image}
       await editorial_member.save()
    }

    editorial_member.name = name;
    editorial_member.university = university;
    editorial_member.description = description;
    editorial_member.type = type;
    await editorial_member.save();
    if(editorial_member){
        req.flash('success',"Editorial updated successfully");
    }else{
        req.flash('error',"Failed to update editorial");
    }
    
    res.redirect('/admin/manage-editorial');
})

exports.manageEditorialPage = catchAsyncError(async (req,res,next)=>{
    const editorials =  await EditorialBoard.find().sort({ _id: -1 }) ;
    res.render("admin/editorial/manage-editorial",{editorials,adminId:req.id});    
})


exports.getEditorial = catchAsyncError(async (req, res, next) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 6; // Number of items per page
    const searchTerm = req.query.search || ''; // Get the search term from query params

    // If there's a search term, add a filter to match relevant fields
    let searchFilter = {};
    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive search
        searchFilter = {
            $or: [
                { name: regex },         // Assuming editorial names are searchable
                { university: regex },   // Assuming universities are searchable
                { description: regex }   // Assuming descriptions are searchable
            ]
        };
    }

    // Count the total number of items matching the search criteria
    const totalItems = await EditorialBoard.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Fetch editorials based on the search term and pagination
    const editorials = await EditorialBoard.find(searchFilter)
        .sort({ _id: -1 }) 
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);

    res.json({
        editorials: editorials,
        totalPages: totalPages,
        currentPage: currentPage
    });
});


exports.deleteEditorial = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const editorial1 = await EditorialBoard.findById(id);
   
    const editorial = await EditorialBoard.findByIdAndDelete(id);
    if(editorial){
        req.flash('success','Editorial deleted successfully');
    }else{
        req.flash('error','Failed to delete editorial');
    }
    // res.redirect("/admin/manage-editorial");    
    res.json({success:"true"})
})

exports.editorialCreate = catchAsyncError(async (req,res,next)=>{
   const Editorial = await EditorialBoard.create({
     name: req.body.name,
     type:req.body.type,
     description: req.body.description,
     university: req.body.university
   })
   if(req.files){
       Editorial.image = {
         fileId: req.files.image[0].filename,
         url: req.files.image[0].filename
       }
       await Editorial.save();
       
   }
   if(Editorial){
    req.flash('success','Editorial created successfully');
   }else{
    req.flash('error','Failed to create editorial');
   }
    
   res.redirect("/admin/manage-editorial")
   
    
})


exports.indexingManagePage = catchAsyncError(async (req,res,next)=>{
    const indexings =  await Indexing.find().sort({ _id: -1 }) ;
    res.render("admin/indexing/manage-indexing",{indexings,adminId:req.id});    
})
exports.createIndex = catchAsyncError(async (req,res,next)=>{
    const Index = await Indexing.create({
        title: req.body.title,
        link:req.body.link,
      })
      if(req.files){
        Index.image = {
          fileId: req.files.image[0].filename,
          url: req.files.image[0].filename
        }
        await Index.save();
        
    }
      if(Index){
        req.flash('success','Index created successfully');
      }else{
        req.flash('error','Failed to create index');
      }
       
      res.redirect("/admin/manage-indexing")
        
})

exports.editIndexPage = catchAsyncError(async (req,res,next)=>{
    const indexings =  await Indexing.find().sort({ _id: -1 }) ;
    const indexing =  await Indexing.findOne({_id:req.params.id});
    if(!indexing){
        res.redirect("/admin/manage-indexing")
    }
    res.render("admin/indexing/editindexing",{indexings,indexing,adminId:req.id});    
})

exports.editIndex = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const {title,link} =  req.body;
    const index = await Indexing.findById(id);
    if (req.files.image && req.files.image[0]?.filename) {
        const oldImagePath = path.join(__dirname, '..', 'public', 'images', 'uploads', index.image.fileId);

        // Delete the old image file if it exists
        fs.unlink(oldImagePath, (err) => {
            if (err) {
                console.error('Error deleting the old file:', err);
            } else {
                console.log('Old image deleted successfully');
            }
        });

        const image = req.files.image[0].filename;
       index.image = {fileId: image,url: image}
       await index.save()
    }
    index.title = title;
    index.link = link;
   
    await index.save();
    if(index){
        req.flash('success','Index updated successfully');
    }else{
        req.flash('error','Failed to update index');
    }
    res.redirect('/admin/manage-indexing');
})

exports.getIndexing = catchAsyncError(async (req, res, next) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 6; // Number of items per page
    const searchTerm = req.query.search || ''; // Get the search term from query params

    // If there's a search term, add a filter to match relevant fields
    let searchFilter = {};
    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive search
        searchFilter = {
            $or: [
                { title: regex },         // Assuming editorial names are searchable
                { link: regex },   // Assuming universities are searchable
            ]
        };
    }

    // Count the total number of items matching the search criteria
    const totalItems = await Indexing.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Fetch editorials based on the search term and pagination
    const Indexings = await Indexing.find(searchFilter)
        .sort({ _id: -1 }) 
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);

    res.json({
        indexings: Indexings,
        totalPages: totalPages,
        currentPage: currentPage
    });
});


exports.deleteIndex = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const editorial1 = await Indexing.findById(id);
  
    const response = await Indexing.findByIdAndDelete(id);
    if(response){
        req.flash('success', 'Indexing deleted successfully');
    }else{
        req.flash('error', 'Indexing Failed to delete');
    }
    // res.redirect("/admin/manage-editorial");    
    res.json({success:"true"})
})

exports.newsManagePage = catchAsyncError(async (req,res,next)=>{
    res.render("admin/news/manage-news",{adminId:req.id});
})
exports.newsCreatePage = catchAsyncError(async (req,res,next)=>{

    res.render("admin/news/create-news",{adminId:req.id});
})

exports.newsCreate = catchAsyncError(async (req,res,next)=>{
    const news = await News.create({
        title: req.body.title,
        description:req.body.description,
      })
      if(news){
          req.flash('success', 'News Created successfully');
      }else{
         req.flash('error', 'News Failed to create');
      }
      res.redirect("/admin/manage-news")
})

exports.editNewsPage = catchAsyncError(async (req,res,next)=>{
    const news =  await News.findOne({_id:req.params.id});
    if(!news){
        req.flash('error', 'something went wrong');
        res.redirect("/admin/manage-news")
    }else{

    }
    res.render("admin/news/edit-news",{news,adminId:req.id})
})

exports.editNews = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const {title,description} =  req.body;
    const news = await News.findOneAndUpdate(
        {_id:id},
        {title,description},
        {new:true}
    );
    if(news){
        req.flash('success', 'News Updated successfully');
    } else{
       req.flash('error', 'News Failed to update');
    }
    res.redirect('/admin/manage-news');
})

exports.deleteNews = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const news = await News.findOneAndDelete(
        {_id:id},
    );
    if(news){
        req.flash('success', 'News deleted successfully');
    }else{
        req.flash('error', 'News Failed to delete');
    }
    res.json({success:"true"})
})


exports.getNews = catchAsyncError(async (req, res, next) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 6; // Number of items per page
    const searchTerm = req.query.search || ''; // Get the search term from query params

    // If there's a search term, add a filter to match relevant fields
    let searchFilter = {};
    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive search
        searchFilter = {
            $or: [
                { title: regex },         // Assuming editorial names are searchable
                { description: regex },   // Assuming universities are searchable
            ]
        };
    }

    // Count the total number of items matching the search criteria
    const totalItems = await News.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Fetch editorials based on the search term and pagination
    const newsItems = await News.find(searchFilter)
        .sort({ _id: -1 }) 
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);


        const formattedNews = newsItems.map(news => {
            const formattedCreatedAt = moment(news.createdAt)
                .utcOffset("+05:30") // Convert to IST
                .format('YYYY-MM-DD HH:mm:ss'); // Desired format: YYYY-MM-DD HH:MM:SS
            return { ...news, formattedCreatedAt };
        });
    res.json({
        news:formattedNews,
        totalPages: totalPages,
        currentPage: currentPage
    });
});


exports.contactManagePage = catchAsyncError(async (req,res,next)=>{
    res.render("admin/contact/manage-contact",{adminId:req.id});
})
exports.contactCreatePage = catchAsyncError(async (req,res,next)=>{
    res.render("admin/contact/create-contact",{adminId:req.id});
})
exports.contactCreate = catchAsyncError(async (req,res,next)=>{
    const contact = await Contact.create({
        title: req.body.title,
        description:req.body.description,
      })
      if(contact){
          req.flash('success', 'Contact Created successfully');
      }else{
         req.flash('error', 'Contact Failed to create');
      }
      res.redirect("/admin/manage-contactus")
})
exports.editContactPage = catchAsyncError(async (req,res,next)=>{
    const contact =  await Contact.findOne({_id:req.params.id});
    if(!contact){
        req.flash('error', 'something went wrong');
        res.redirect("/admin/manage-contactus")
    }else{

    }
    res.render("admin/contact/edit-contact",{contact,adminId:req.id})
})

exports.editContact = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const {title,description} =  req.body;
    const contactus = await Contact.findOneAndUpdate(
        {_id:id},
        {title,description},
        {new:true}
    );
    if(contactus){
        req.flash('success', 'contactus Updated successfully');
    } else{
       req.flash('error', 'contactus Failed to update');
    }
    res.redirect('/admin/manage-contactus');
})

exports.deletecontact = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const contact = await Contact.findOneAndDelete(
        {_id:id},
    );
    if(contact){
        req.flash('success', 'contact deleted successfully');
    }else{
        req.flash('error', 'contact Failed to delete');
    }
    res.json({success:"true"})
})


exports.getContact = catchAsyncError(async (req, res, next) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 6; // Number of items per page
    const searchTerm = req.query.search || ''; // Get the search term from query params

    // If there's a search term, add a filter to match relevant fields
    let searchFilter = {};
    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive search
        searchFilter = {
            $or: [
                { title: regex },         // Assuming editorial names are searchable
                { description: regex },   // Assuming universities are searchable
            ]
        };
    }

    // Count the total number of items matching the search criteria
    const totalItems = await Contact.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Fetch editorials based on the search term and pagination
    const contactItems = await Contact.find(searchFilter)
        .sort({ _id: -1 }) 
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);


        const formattedContact = contactItems.map(news => {
            const formattedCreatedAt = moment(news.createdAt)
                .utcOffset("+05:30") // Convert to IST
                .format('YYYY-MM-DD HH:mm:ss'); // Desired format: YYYY-MM-DD HH:MM:SS
            return { ...news, formattedCreatedAt };
        });
    res.json({
        contact:formattedContact,
        totalPages: totalPages,
        currentPage: currentPage
    });
});


exports.yearManagePage = catchAsyncError(async (req,res,next)=>{
    res.render("admin/year/manage-year",{adminId:req.id});
})
exports.createYear = catchAsyncError(async (req,res,next)=>{
    const getYear = await Year.create({
        year: req.body.year,
        
      })
      if(getYear){
        req.flash('success','Year created successfully');
      }
      else{
        req.flash('error','Failed to create Year');
      }
       
      res.redirect("/admin/manage-year")
        
})

exports.editYearPage = catchAsyncError(async (req,res,next)=>{
    const years =  await Year.find().sort({ _id: -1 }) ;
    const year =  await  Year.findOne({_id:req.params.id});
    if(!year){
        res.redirect("/admin/manage-year")
    }
    res.render("admin/year/edityear",{years,year,adminId:req.id});    
})

exports.editYear = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const {year} =  req.body;
    const singleYear = await Year.findById(id);
    singleYear.year = year;
   
    await singleYear.save();
    if(singleYear){
        req.flash('success','Year updated successfully');
    }else{
        req.flash('error','Failed to update Year');
    }
    res.redirect('/admin/manage-year');
})

exports.getYear = catchAsyncError(async (req, res, next) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 6; // Number of items per page
    const searchTerm = req.query.search || ''; // Get the search term from query params

    // If there's a search term, add a filter to match relevant fields
    let searchFilter = {};
    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive search
        searchFilter = {
            $expr: {
                $regexMatch: {
                    input: { $toString: "$year" },
                    regex: searchTerm,
                    options: "i"
                }
            }
        };
    }

    // Count the total number of items matching the search criteria
    const totalItems = await Year.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Fetch editorials based on the search term and pagination
    const Years = await Year.find(searchFilter)
        .sort({ _id: -1 }) 
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);

    res.json({
        Years: Years,
        totalPages: totalPages,
        currentPage: currentPage
    });
});


exports.deleteYear = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const response = await Year.findByIdAndDelete(id);
    if(response){
        req.flash('success', 'Year deleted successfully');
    }else{
        req.flash('error', 'Year Failed to delete');
    }
    // res.redirect("/admin/manage-editorial");    
    res.json({success:"true"})
})

exports.issueManagePage = catchAsyncError(async (req,res,next)=>{
    const years = await Year.find().sort({_id:-1}) ;
    if(years.length < 0){
        req.flash('error', 'No Years available');
        return res.redirect("/admin/manage-year");
    }
    res.render("admin/issues/manage-issues",{years,adminId:req.id});
})

exports.issueCreate = catchAsyncError(async (req,res,next)=>{
    const year = await Year.findOne({year:req.body.year});
    if(!year){
        req.flash('error', 'No Year found');
        return res.redirect("/admin/manage-issues");
    }
    const issue = await Issue.create({
      issueName:req.body.issue,
    })
    if(!issue){
        req.flash('error', 'Failed to create Issue');
        return res.redirect("/admin/manage-issues");
    }
    issue.year = year._id;
    year.issues.push(issue._id);
    await year.save();
    await issue.save();

    if(issue){
     req.flash('success','Issue created successfully');
    }else{
     req.flash('error','Failed to create Issue');
    }
     
    res.redirect("/admin/manage-issues")
     
 })

 
exports.getIssues = catchAsyncError(async (req, res, next) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 6; // Number of items per page
    const searchTerm = req.query.search || ''; // Get the search term from query params

    // If there's a search term, add a filter to match relevant fields
    let searchFilter = {};
    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive search
        searchFilter = {
            $or: [
                { issueName: regex },   // Assuming universities are searchable
            ]
        };
    }

    // Count the total number of items matching the search criteria
    const totalItems = await Issue.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Fetch editorials based on the search term and pagination
    const issues = await Issue.find(searchFilter)
        .populate("year")
        .sort({ _id: -1 }) 
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);
    console.log(issues);
    
    res.json({
       issues:issues,
        totalPages: totalPages,
        currentPage: currentPage
    });
});

exports.deleteIssues = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const editorial = await Issue.findByIdAndDelete(id);
    if(editorial){
        req.flash('success','Issue deleted successfully');
    }else{
        req.flash('error','Failed to delete Issue');
    }
    // res.redirect("/admin/manage-editorial");    
    res.json({success:"true"})
})
exports.publishIssues = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const issue = await Issue.findById(id);
    if(!issue){
        req.flash('error', 'No Issue found');
        return res.redirect("/admin/manage-issues");
    }
    issue.status = status.publish;
    await issue.save();
    if(issue){
        req.flash('success','Issue published successfully');
    }else{
        req.flash('error','Failed to published Issue');
    }
    // res.redirect("/admin/manage-editorial");    
    res.json({success:"true"})
})

exports.unpublishIssues = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const issue = await Issue.findById(id);
    if(!issue){
        req.flash('error', 'No Issue found');
        return res.redirect("/admin/manage-issues");
    }
    issue.status = status.unpublish;
    await issue.save();
    if(issue){
        req.flash('success','Issue unpublished successfully');
    }else{
        req.flash('error','Failed to unpublished Issue');
    }
    // res.redirect("/admin/manage-editorial");    
    res.json({success:"true"})
})
exports.issueEditPage = catchAsyncError(async (req,res,next)=>{
    let years = await Year.find().sort({_id:-1});
    if(!years){
        req.flash('error', 'No Years available');
        return res.redirect("/admin/manage-issues",{adminId:req.id});
    }
    const issue =  await  Issue.findOne({_id:req.params.id}).populate("year");
    if(!issue){
        req.flash('error', 'No Issue found');
        return res.redirect("/admin/manage-issues");
    }
    if(years.length < 0){
        req.flash('error', 'No Years available');
        return res.redirect("/admin/manage-year");
    }
    
     years = years.filter((year)=>{
        return year.year !== issue.year.year
    })
    res.render("admin/issues/edit-issues",{years,issue,adminId:req.id});
})

exports.editIssue = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const newYear = await Year.findOne({ year: req.body.year });
    const issue = await Issue.findById(id);

    if (!issue) {
        req.flash('error', 'Issue not found');
        return res.redirect('/admin/manage-issues');
    }

    // Remove the issue from the previous year's issues array
    const oldYear = await Year.findById(issue.year);
    if (oldYear) {
        oldYear.issues.pull(issue._id); // Remove the issue from the old year
        await oldYear.save(); // Save changes to the old year
    }

    // Update issue's year reference and add it to the new year's issues array
    issue.issueName = req.body.issue;
    issue.year = newYear._id;
    newYear.issues.push(issue._id);

    await issue.save(); // Save the updated issue
    await newYear.save(); // Save changes to the new year

    req.flash('success', 'Issue updated successfully');
    res.redirect('/admin/manage-issues');
})

exports.manageSubscriptPage = catchAsyncError(async (req,res,next)=>{
    res.render("admin/manuscript/manage-manuscript",{adminId:req.id})
})


exports.getManuscript = catchAsyncError(async (req, res, next) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 6; // Number of items per page
    const searchTerm = req.query.search || ''; // Get the search term from query params

    // If there's a search term, add a filter to match relevant fields
    let searchFilter = {};
    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive search
        searchFilter = {
            $or: [
                {name : regex },
                {manuscriptNumber : regex },
                { mobile: parseInt(searchTerm) || 0 },
                {designation: regex },
                {title: regex },
                {country:regex},
                {articletype:regex},
                {email: regex},
                {status:regex},
                {gender:regex},
                {address:regex},   
            ]
        };
    }

    // Count the total number of items matching the search criteria
    const totalItems = await Manuscript.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Fetch editorials based on the search term and pagination
    subscripts = await Manuscript.find(searchFilter)
        .sort({ _id: -1 }) 
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);
    // console.log(issues);
    
    res.json({
        subscripts,
        totalPages: totalPages,
        currentPage: currentPage
    });
});

exports.manuscriptStatus = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const issue = await Manuscript.findById(id);
    if(!issue){
        req.flash('error', 'No Manuscript found');
        return res.redirect("/admin/manage-subscript");
    }
    issue.status = req.body.status;
    await issue.save();
    if(issue){
       req.flash('success','Manuscript status changed successfully');
        res.json({success:"true"})
    }else{
        req.flash('error','Failed to change status of Manuscript');
        return res.redirect('back');
    }
    // res.redirect("/admin/manage-editorial");    
})
exports.deleteManuscript = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const manuscript = await Manuscript.findOne({_id:id});
   
    const editorial = await Manuscript.findByIdAndDelete(id);
   
    if(editorial){
        req.flash('success','Manuscript deleted successfully');
    }else{
        req.flash('error','Failed to delete Manuscript');
    }
    // res.redirect("/admin/manage-editorial");    
    res.json({success:"true"})
})

exports.downloadManuscript = catchAsyncError(async (req, res) => {
    const id = req.params.id;
    const manuscript = await Manuscript.findById(id);
    if (!manuscript) {
      req.flash('error', 'Manuscript not found');
      return res.redirect('/admin/manage-subscript');
    }
    const pdfFilePath = path.join(__dirname, '..', 'public', 'images', 'pdfs', manuscript.pdf.fileId);
    // Check if the file exists
    if (!fs.existsSync(pdfFilePath)) {
      req.flash('error', 'PDF file not found');
      return res.redirect('/admin/manage-subscript');
    }
  
    try {
        // Get the file extension
        const fileExtension = path.extname(manuscript.pdf.fileId).toLowerCase();
        if (fileExtension === '.pdf') {
          res.setHeader('Content-Disposition', `attachment; filename="${manuscript.name}"`);
          res.setHeader('Content-Type', 'application/pdf');
        } else if (fileExtension === '.doc' || fileExtension === '.docx') {
          res.setHeader('Content-Disposition', `attachment; filename="${manuscript.name}"`);
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        } else {
            req.flash('error','Unsupported file type for download')
            return res.redirect("/admin/manage-subscript")
        }
        const fileStream = fs.createReadStream(pdfFilePath);
        fileStream.pipe(res);
      } catch (error) {
        console.log(error);
        
        console.error('Error while downloading file:', error);
        req.flash('error', 'Download failed');
        res.redirect('/admin/manage-subscript');
      }
  });
exports.manageArticlePage = catchAsyncError(async (req,res,next)=>{
    res.render("admin/article/manage-article",{adminId:req.id})
})
exports.getIssueforArticle = catchAsyncError(async (req,res,next)=>{
    const {issues} = await Year.findOne({ year: req.params.year }).populate("issues");
    
    if(!issues){
        req.flash('error', 'No Issues available');
        return res.redirect("/admin/manage-articles");
    }
    res.json(issues);

})
exports.articleCreatePage = catchAsyncError(async (req,res,next)=>{
    const years = await Year.find().sort({_id:-1})
    // const  issues = await Issue.find().sort({_id:-1})
    res.render('admin/article/articleCreate',{years,adminId:req.id});
})

exports.articleCreate = catchAsyncError(async (req,res,next)=>{
    const issue = await Issue.findOne({issueName:req.body.issue})
    
    const year = await Year.findOne({year:req.body.year})

    if(req.files){
        const article = await Article.create({
            title:req.body.title,
            author:req.body.author,
            keyword:req.body.keyword,
            doi:req.body.doi,
            category:req.body.category,
            abstract:req.body.abstract,
            pdf:{
                fileId:req.files.pdf[0].filename,
                url:req.files.pdf[0].filename
            },
            image:{
                fileId:req.files.image[0].filename,
                url:req.files.image[0].filename,
            },
            year:year._id,
            issue:issue._id
        })
        year.articles.push(article._id);
        issue.articles.push(article._id);
        await article.save();
        await year.save();
        await issue.save();
        req.flash('success','Article created successfully');
        if(!article){
         req.flash('error','Failed to create Article');
        }
    }
 
    
   
    
   
     
    res.redirect("/admin/manage-articles")
    
     
 })
 exports.getArticle = catchAsyncError(async (req, res, next) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 6; // Number of items per page
    const searchTerm = req.query.search || ''; // Get the search term from query params

    // If there's a search term, add a filter to match relevant fields
    let searchFilter = {};
    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive search
        searchFilter = {
            $or: [
                { category: regex },         // Assuming editorial names are searchable
                { title: regex },   // Assuming universities are searchable
                   // Assuming descriptions are searchable
            ]
        };
    }

    // Count the total number of items matching the search criteria
    const totalItems = await Article.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Fetch editorials based on the search term and pagination
    const articles = await Article.find(searchFilter)
        .populate("issue")
        .populate("year")
        .sort({ _id: -1 }) 
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);

    res.json({
        articles: articles,
        totalPages: totalPages,
        currentPage: currentPage
    });
});

exports.deleteArticle = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id;
    const editorial = await Article.findByIdAndDelete(id);
    if(editorial){
        req.flash('success','Article deleted successfully');
    }else{
        req.flash('error','Failed to delete Article');
    }
    // res.redirect("/admin/manage-editorial");    
    res.json({success:"true"})
})

exports.editArticlePage = catchAsyncError(async (req,res,next)=>{
    let years = await Year.find().sort({_id:-1});
   
    if(!years){
        req.flash('error', 'No Years available');
        return res.redirect("/admin/manage-issues");
    }
    if(years.length < 0){
        req.flash('error', 'No Years available');
        return res.redirect("/admin/manage-year");
    }
   
    
  

    const id = req.params.id
    const getarticle = await Article.findById(id).populate("year").populate("issue");
    
    let issue = await Issue.find({year:getarticle.year._id})
   
    
    if(!getarticle){
        return res.redirect("api/v1/admin/manage-articles")
    }
    years = years.filter((year)=>{
        return year.year !== getarticle.year.year
    })
    issue = issue.filter((issue)=>{
        return issue.issueName!== getarticle.issue.issueName
    })
    
    res.render('admin/article/edit-article', {
        article:getarticle,years,adminId:req.id,issue
      });
})

// exports.editArticle = catchAsyncError(async (req,res,next)=>{
//     console.log(req.files);
    
//     const id = req.params.id;
//     const {title,year,issue,category,keyword,doi,author,abstract} =  req.body;
//     const newyear = await Year.findOne({year: year})

//     const newissue = await Issue.findOne({issueName:issue})
//     const article = await Article.findById(id);
//     const oldYear = await Year.findById(article.year);
//     const oldIssue = await Issue.findById(article.issue);
//     if (oldYear) {
//         oldYear.articles.pull(article._id); // Remove the issue from the old year
//         await oldYear.save(); // Save changes to the old year
//      }
//      if (oldIssue) {
//         oldIssue.articles.pull(article._id); // Remove the issue from the old Issue
//         await oldIssue.save(); // Save changes to the old year
//      }

//      if (req.files) {
//         // Update image if present in the request
//         if (req.files.image && req.files.image[0]?.filename) {
//              if (req.files) {
//       // Update image if present in the request
//        if (req.files.image && req.files.image[0]?.filename) {
//         const oldImagePath = path.join(__dirname, '..', 'public', 'images', 'uploads', article.image.fileId);
 
//         // Delete the old image file if it exists
//         fs.unlink(oldImagePath, (err) => {
//           if (err) {
//             console.error('Error deleting the old file:', err);
//           } else {
//             console.log('Old image deleted successfully');
//           }
//         }); 
//         console.log('Image file found:', req.files.image[0].filename);
//         const image = req.files.image[0].filename;
//         article.image.fileId = image;
//         article.image.url = image;

//         // If you want to delete old image files, you can add fs.unlink here
//         // Example: fs.unlinkSync(oldImagePath); // oldImagePath should be the old file path
//       }

//       // Update pdf if present in the request
//       if (req.files.pdf && req.files.pdf[0]?.filename) {
//         const oldImagePath = path.join(__dirname, '..', 'public', 'images', 'pdfs', article.pdf.fileId);
 
//         // Delete the old image file if it exists
//         fs.unlink(oldImagePath, (err) => {
//           if (err) {
//             console.error('Error deleting the old file:', err);
//           } else {
//             console.log('Old image deleted successfully');
//           }
//         }); 
//         console.log('PDF file found:', req.files.pdf[0].filename);
//         const pdf = req.files.pdf[0].filename;
//         article.pdf.fileId = pdf;
//         article.pdf.url = pdf;

//         // Similarly, delete the old PDF file if required
//       }
//     }
//           console.log('Image file found:', req.files.image[0].filename);
//           const image = req.files.image[0].filename;
//           article.image.fileId = image;
//           article.image.url = image;
  
//           // If you want to delete old image files, you can add fs.unlink here
//           // Example: fs.unlinkSync(oldImagePath); // oldImagePath should be the old file path
//         }
  
//         // Update pdf if present in the request
//         if (req.files.pdf && req.files.pdf[0]?.filename) {
//           console.log('PDF file found:', req.files.pdf[0].filename);
//           const pdf = req.files.pdf[0].filename;
//           article.pdf.fileId = pdf;
//           article.pdf.url = pdf;
  
//           // Similarly, delete the old PDF file if required
//         }
//       }
//     article.title = title;
//     article.author = author;
//     article.category = category;
//     article.keyword = keyword;
//     article.doi  = doi;
//     article.abstract = abstract;
//     article.year = newyear._id;
//     article.issue = newissue._id;
//     await article.save();
//     newyear.articles.push(article._id);
//     newissue.articles.push(article._id);
//     await newyear.save();
//     await newissue.save();
//     console.log(article,"getarticle");
    
//     if(!article){
//         req.flash('error',"Failed to update Article");
//     }
//     req.flash('success',"Article updated successfully");
  
    
//     res.redirect('/admin/manage-articles');
// })
exports.editArticle = catchAsyncError(async (req, res, next) => {
    console.log(req.files);

    const id = req.params.id;
    const { title, year, issue, category, keyword, doi, author, abstract } = req.body;
    const newYear = await Year.findOne({ year });
    const newIssue = await Issue.findOne({ issueName: issue });
    const article = await Article.findById(id);
    
    // If the article is not found
    if (!article) {
        req.flash('error',"Failed to update Article");
        return res.redirect('/admin/manage-articles');
    }

    // Handle removing the article from old Year and Issue
    const oldYear = await Year.findById(article.year);
    const oldIssue = await Issue.findById(article.issue);

    if (oldYear) {
        oldYear.articles.pull(article._id);
        await oldYear.save();
    }

    if (oldIssue) {
        oldIssue.articles.pull(article._id);
        await oldIssue.save();
    }

    // Update article fields
    article.title = title;
    article.author = author;
    article.category = category;
    article.keyword = keyword;
    article.doi = doi;
    article.abstract = abstract;
    article.year = newYear._id;
    article.issue = newIssue._id;

    // Handle image file update if present
    if (req.files.image && req.files.image[0]?.filename) {
        const oldImagePath = path.join(__dirname, '..', 'public', 'images', 'uploads', article.image.fileId);

        // Delete the old image file if it exists
        fs.unlink(oldImagePath, (err) => {
            if (err) {
                console.error('Error deleting the old file:', err);
            } else {
                console.log('Old image deleted successfully');
            }
        });

        const image = req.files.image[0].filename;
       article.image = {fileId: image,url: image}
       await article.save()

    }

    // Handle PDF file update if present
    if (req.files.pdf && req.files.pdf[0]?.filename) {
        const oldPdfPath = path.join(__dirname, '..', 'public', 'images', 'pdfs', article.pdf.fileId);

        // Delete the old PDF file if it exists
        fs.unlink(oldPdfPath, (err) => {
            if (err) {
                console.error('Error deleting the old PDF file:', err);
            } else {
                console.log('Old PDF deleted successfully');
            }
        });

        const pdf = req.files.pdf[0].filename;
        article.pdf = {fileId: pdf, url: pdf}
    }

    // Save the updated article
    await article.save();

    // Add the article to the new Year and Issue
    newYear.articles.push(article._id);
    newIssue.articles.push(article._id);

    await newYear.save();
    await newIssue.save();

    // Handle success message
    req.flash('success', 'Article updated successfully');
   

    res.redirect('/admin/manage-articles');
});

exports.viewIssue = catchAsyncError(async (req, res, next) => {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 6; // Number of items per page
    const searchTerm = req.query.search || ''; // Get the search term from query params

    const IssueId =  req.params.id;
    // If there's a search term, add a filter to match relevant fields
    let searchFilter = {issue:IssueId};
    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive search
        searchFilter = {
            ...searchFilter,
            $or: [
                { category: regex },         // Assuming editorial names are searchable
                { title: regex },   // Assuming universities are searchable
                   // Assuming descriptions are searchable
            ]
        };
    }

    // Count the total number of items matching the search criteria
    const totalItems = await Article.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Fetch editorials based on the search term and pagination
    const articles = await Article.find(searchFilter)
        .populate("issue")
        .populate("year")
        .sort({ _id: -1 }) 
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);
    
    res.json({
        articles: articles,
        totalPages: totalPages,
        currentPage: currentPage
    });
});
exports.viewIssuePage = catchAsyncError(async (req,res,next)=>{
    const issue = await Issue.findById(req.params.id);
    if(!issue){
        return res.redirect("/admin/manage-issues")
    }
    res.render("admin/issues/view-issue",{issue,adminId:req.id});
})
exports.logout = catchAsyncError(async (req,res,next)=>{
        res.clearCookie("token")
        res.redirect("/admin/login")
 })