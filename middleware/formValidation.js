const StatusCode = require("http-status-codes");
const ErrorHandler = require("../utils/ErrorHandler")
const {catchAsyncError} =  require("../middleware/catchAsyncError")
const { check, validationResult } = require('express-validator');
const {uploadboth,fileErrors} =  require("../utils/multerboth")
const News =  require("../models/news")
const { getNames } = require('country-list');
const Indexing = require("../models/indexing");
const Visit = require("../models/visitor")
const moment = require("moment")
const countryNames = getNames();
const validateEditorialForm = [
  (req, res, next) => {
    fileErrors.length = 0; // Reset fileErrors for every request
    uploadboth(req, res, (err) => {
      if (err) {
        fileErrors.push({ msg: err.message });
      }
      next(); // Move to the next middleware for validation
    });
  },
    check('type', 'Please select a valid type').not().isIn(['']), // Ensures the first option is not selected
    check('name', 'Name is required').notEmpty(),
    check('university', 'University is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),  
    // Middleware to check validation result
    (req, res, next) => {
      const validationErrors = validationResult(req);
      const errors = [...validationErrors.array(), ...fileErrors];
      if (errors.length > 0) {
        req.flash("errors", errors);
        return res.redirect("back");
      }
      
      next(); // Proceed to the next middleware/controller
    },
  ];

  const validateIndexForm = [
    // Validate title: Required
    (req, res, next) => {
      fileErrors.length = 0; // Reset fileErrors for every request
      uploadboth(req, res, (err) => {
        if (err) {
          fileErrors.push({ msg: err.message });
        }
        next(); // Move to the next middleware for validation
      });
    },
    check('title', 'Title is required').notEmpty(),
  
    // Validate link: Required and must be a valid URL
    check('link', 'Link must be a valid URL').isURL().withMessage('Valid URL is required'),
    (req, res, next) => {
      const validationErrors = validationResult(req);
      const errors = [...validationErrors.array(), ...fileErrors];
      if (errors.length > 0) {
        req.flash("errors", errors);
        return res.redirect("back");
      }
      
      next(); // Proceed to the next middleware/controller
    },
  ];
  
const validateEditIndexForm = [
  (req, res, next) => {
    fileErrors.length = 0; // Reset fileErrors for every request
    uploadboth(req, res, (err) => {
      if (err) {
        fileErrors.push({ msg: err.message });
      }
      next(); // Move to the next middleware for validation
    });
  },
    check('title', 'Title is required').notEmpty(),
  
    // Validate link: Required and must be a valid URL
    check('link', 'Link must be a valid URL').isURL().withMessage('Valid URL is required'),
    (req, res, next) => {
      const validationErrors = validationResult(req);
      const errors = [...validationErrors.array(), ...fileErrors];
      if (errors.length > 0) {
        req.flash("errors", errors);
        return res.redirect("back");
      }
      
      next(); // Proceed to the next middleware/controller
    },

  ];

  const validateNewsForm = [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    
    // Middleware to check validation result
    (req, res, next) => {
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let ans = req.flash('errors', errors.array());
        console.log(ans);
        
        return res.redirect('back');
      }
      next();
    }
  ];
  const validateYearForm = [
    check('year', 'Year is required').notEmpty(),
    
    // Middleware to check validation result
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let ans = req.flash('errors', errors.array());
        console.log(ans);
        
        return res.redirect('back');
      }
      next();
    }
  ];
  const validateIssueForm = [
    check('issue', 'Issue is required').notEmpty(),
    // Middleware to check validation result
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let ans = req.flash('errors', errors.array());
        return res.redirect('back');
      }
      next();
    }
  ];
  const validateManuscriptForm = [
    (req, res, next) => {
      fileErrors.length = 0; // Reset fileErrors for every request
      uploadboth(req, res, (err) => {
        if (err) {
          fileErrors.push({ msg: err.message });
        }
        next(); // Move to the next middleware for validation
      });
    },
    check('country', 'Please select a valid country').not().isIn(['']),
    check('email', 'Please enter a valid email address').isEmail(),
    check('nametype', 'Please select a valid title').not().isIn(['']),
    check('firstname', 'Name is required').notEmpty(),
    check('gender', 'Please select a gender').notEmpty(),
    check('type', 'Please select a valid article type').not().isIn(['']),
    check('title', 'Article title is required').notEmpty(),
    // Middleware to check multer errors and validation
    async (req, res, next) => {
      const news = await News.find().sort({ _id: -1 });
      const indexings = await Indexing.find().sort({ _id: -1 });
      const validationErrors = validationResult(req);
      const errors = [...validationErrors.array(), ...fileErrors];  
      const view = await Visit.findOne();
      let visit = view.view.toString().split("")
      const now = moment();

// Format it to display day, month, date, and time
const formattedDateTime = now.format('dddd, MMMM Do YYYY, h:mm:ss A'); 
      if (errors.length > 0) {
        return res.render('submission', {
          news,
          countryNames,
          visit,
          errors: errors,
          formData: req.body,
          indexings,
          formattedDateTime,
        });
      }
  
      next();
    },
  ];
  const validateArticleForm = [
    (req, res, next) => {
      fileErrors.length = 0; // Reset fileErrors for every request
      uploadboth(req, res, (err) => {
        if (err) {
          // Handle Multer-specific errors
          fileErrors.push({ msg: err.message });
        }
        console.log("req.body after uploadboth:", req.files); // Debug: req.body populated
        next(); // Move to the next middleware for validation
      });
    },
  
    // Field validation using express-validator
    check("year", "Please select a valid year").not().isIn([""]),
    check("category", "Please select a valid category").not().isIn([""]),
    check("issue", "Please select a valid issue").not().isIn([""]),
    check("title", "Title is required").notEmpty(),
    check("author", "Author is required").notEmpty(),
    check("abstract", "Abstract is required").notEmpty(),
    check("keyword", "Keyword is required").notEmpty(),
    check("doi", "DOI is required").notEmpty(),
  
    // Middleware to validate fields and files
    (req, res, next) => {
      const validationErrors = validationResult(req);
      const errors = [...validationErrors.array(), ...fileErrors];
      if (errors.length > 0) {
        req.flash("errors", errors);
        return res.redirect("back");
      }
      
      next(); // Proceed to the next middleware/controller
    },
  ];
  
  const validateEditArticleForm = [
    (req, res, next) => {
      fileErrors.length = 0; // Reset fileErrors for every request
      uploadboth(req, res, (err) => {
        if (err) {
          // Handle Multer-specific errors
          fileErrors.push({ msg: err.message });
        }
        console.log("req.body after uploadboth:", req.files); // Debug: req.body populated
        next(); // Move to the next middleware for validation
      });
    },
    check('year', 'Please select a valid year').not().isIn(['']),
    check('category', 'Please select a valid category').not().isIn(['']),
    check('issue', 'Please select a valid issue').not().isIn(['']),
    check('title', 'Title is required').notEmpty(),
    check('author', 'Author is required').notEmpty(),
    check('abstract', 'Abstract is required').notEmpty(),
    check('keyword', 'Keyword is required').notEmpty(),
    check('doi', 'DOI is required').notEmpty(),
  
     // Middleware to validate fields and files
     (req, res, next) => {
      const validationErrors = validationResult(req);
      const errors = [...validationErrors.array(), ...fileErrors];
      if (errors.length > 0) {
        req.flash("errors", errors);
        return res.redirect("back");
      }
      
      next(); // Proceed to the next middleware/controller
    },
  ];
  const validatupdateprofileForm = [
    (req, res, next) => {
      fileErrors.length = 0; // Reset fileErrors for every request
      uploadboth(req, res, (err) => {
        if (err) {
          // Handle Multer-specific errors
          fileErrors.push({ msg: err.message });
        }
        console.log("req.body after uploadboth:", req.files); // Debug: req.body populated
        next(); // Move to the next middleware for validation
      });
    },
    check('key', 'Key is required').notEmpty(),
    check('email', 'email is required').notEmpty(),
    // Middleware to check validation result
    (req, res, next) => {
      const validationErrors = validationResult(req);
      const errors = [...validationErrors.array(), ...fileErrors];
      if (errors.length > 0) {
        req.flash("errors", errors);
        return res.redirect("back");
      }
      
      next(); // Proceed to the next middleware/controller
    },
  ];
  const validateupdatepasswordForm = [
    check('oldpassword', 'Old password is required').notEmpty(),
    check('newpassword', 'New password is required').notEmpty(),
    // Optional image validation
   
    // Middleware to check validation result
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('back');
      }
      next();
    }
  ];


module.exports = {
    validateEditorialForm,
    validateIndexForm,
    validateEditIndexForm,
    validateNewsForm,
    validateYearForm,
    validateIssueForm,
    validateManuscriptForm,
    validateArticleForm,
    validateEditArticleForm,
    validatupdateprofileForm,
    validateupdatepasswordForm,

  
}