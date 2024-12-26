const express = require("express");
const router = express.Router();
const {AdminController} =  require("../../controller")
const {AdminMiddleware,FormValidation} =  require("../../middleware")


router.get('/login', AdminController.loginPage)
router.get('/update-page/:id',AdminMiddleware.isAuthenticated,AdminController.updatePage)
router.post('/updateuser/:id',AdminMiddleware.isAuthenticated,FormValidation.validatupdateprofileForm,AdminController.updateuser)
router.get('/update-passwordpage/:id',AdminMiddleware.isAuthenticated,AdminController.updatePasswordPage)
router.post('/updatepass/:id',AdminMiddleware.isAuthenticated,FormValidation.validateupdatepasswordForm,AdminController.updatePassword)
router.get('/visit',AdminMiddleware.isAuthenticated,AdminController.visit)
router.post('/login',AdminMiddleware.Validation,AdminController.login)
router.get('/admin-dashboard',AdminMiddleware.isAuthenticated,AdminController.dashboardPage)


//indexing
router.get('/manage-indexing',AdminMiddleware.isAuthenticated,AdminController.indexingManagePage)
router.post('/createindex',AdminMiddleware.isAuthenticated,FormValidation.validateIndexForm,AdminController.createIndex)
router.get('/edit-indexing/:id',AdminController.editIndexPage)
router.post('/edit-indexing/:id',AdminMiddleware.isAuthenticated,FormValidation.validateEditIndexForm,AdminController.editIndex)
router.get('/get-indexing',AdminMiddleware.isAuthenticated,AdminController.getIndexing)
router.delete('/indexing-delete/:id',AdminMiddleware.isAuthenticated,AdminController.deleteIndex)

//news
router.get('/manage-news',AdminMiddleware.isAuthenticated,AdminController.newsManagePage)
router.get('/news-createpage',AdminMiddleware.isAuthenticated,AdminController.newsCreatePage)
router.post('/news-create',AdminMiddleware.isAuthenticated,FormValidation.validateNewsForm,AdminController.newsCreate)
router.post('/edit-news/:id',AdminMiddleware.isAuthenticated,FormValidation.validateNewsForm,AdminController.editNews)
router.get('/edit-news/:id',AdminMiddleware.isAuthenticated,AdminController.editNewsPage)
router.get('/get-news',AdminMiddleware.isAuthenticated,AdminController.getNews)
router.delete('/news-delete/:id',AdminMiddleware.isAuthenticated,AdminController.deleteNews)

//contact
router.get('/manage-contactus',AdminMiddleware.isAuthenticated,AdminController.contactManagePage)
router.get('/contact-createpage',AdminMiddleware.isAuthenticated,AdminController.contactCreatePage)
router.post('/contact-create',AdminMiddleware.isAuthenticated,FormValidation.validateNewsForm,AdminController.contactCreate)
router.post('/edit-contactus/:id',AdminMiddleware.isAuthenticated,FormValidation.validateNewsForm,AdminController.editContact)
router.get('/edit-contactus/:id',AdminMiddleware.isAuthenticated,AdminController.editContactPage)
router.get('/get-contact',AdminMiddleware.isAuthenticated,AdminController.getContact)
router.delete('/contact-delete/:id',AdminMiddleware.isAuthenticated,AdminController.deletecontact)

//year
router.get('/manage-year',AdminMiddleware.isAuthenticated,AdminController.yearManagePage)
router.post('/createyear',AdminMiddleware.isAuthenticated,FormValidation.validateYearForm,AdminController.createYear)
router.get('/edit-year/:id',AdminMiddleware.isAuthenticated,AdminController.editYearPage)
router.post('/edit-year/:id',AdminMiddleware.isAuthenticated,FormValidation.validateYearForm,AdminController.editYear)
router.get('/get-year',AdminMiddleware.isAuthenticated,AdminController.getYear)
router.delete('/year-delete/:id',AdminMiddleware.isAuthenticated,AdminController.deleteYear)


//issues
router.get('/manage-issues',AdminMiddleware.isAuthenticated,AdminController.issueManagePage)
router.post('/createissue',AdminMiddleware.isAuthenticated,FormValidation.validateIssueForm,AdminController.issueCreate)
router.get('/get-issues',AdminMiddleware.isAuthenticated,AdminController.getIssues)
router.delete('/issues-delete/:id',AdminMiddleware.isAuthenticated,AdminController.deleteIssues)
router.post('/issues-publish/:id',AdminMiddleware.isAuthenticated,AdminController.publishIssues)
router.post('/issues-unpublish/:id',AdminMiddleware.isAuthenticated,AdminController.unpublishIssues)
router.get('/edit-issue/:id',AdminMiddleware.isAuthenticated,AdminController.issueEditPage)
router.post('/edit-issue/:id',AdminMiddleware.isAuthenticated,FormValidation.validateIssueForm,AdminController.editIssue)


//editorial
router.post('/editorialCreate',AdminMiddleware.isAuthenticated,FormValidation.validateEditorialForm,AdminController.editorialCreate)
router.get('/editorial-createpage',AdminMiddleware.isAuthenticated,AdminController.editorialCreatePage)
router.get('/manage-editorial',AdminMiddleware.isAuthenticated,AdminController.manageEditorialPage)
router.get('/get-editorial',AdminMiddleware.isAuthenticated,AdminController.getEditorial)
router.get('/edit-editorial/:id',AdminMiddleware.isAuthenticated,AdminController.editEditorialPage)
router.delete('/editorial-delete/:id',AdminMiddleware.isAuthenticated,AdminController.deleteEditorial)
router.post('/edit-editorial/:id',AdminMiddleware.isAuthenticated,FormValidation.validateEditorialForm,AdminController.editEditorial)

//subscript
router.get('/manage-subscript',AdminMiddleware.isAuthenticated,AdminController.manageSubscriptPage)
router.delete('/manuscript-delete/:id',AdminMiddleware.isAuthenticated,AdminController.deleteManuscript)
router.post('/manuscript-status/:id',AdminMiddleware.isAuthenticated,AdminController.manuscriptStatus)
router.get('/manuscript-download/:id',AdminMiddleware.isAuthenticated,AdminController.downloadManuscript)
router.get('/get-manuscript',AdminMiddleware.isAuthenticated,AdminController.getManuscript)

//articles
router.get('/manage-articles',AdminMiddleware.isAuthenticated,AdminController.manageArticlePage)
router.get('/issues-by-year/:year',AdminMiddleware.isAuthenticated,AdminController.getIssueforArticle)
router.get('/article-createpage',AdminMiddleware.isAuthenticated,AdminController.articleCreatePage)
router.post('/articleCreate',AdminMiddleware.isAuthenticated,FormValidation.validateArticleForm,AdminController.articleCreate)
router.get('/get-article',AdminMiddleware.isAuthenticated,AdminController.getArticle)
router.get('/edit-article/:id',AdminMiddleware.isAuthenticated,AdminController.editArticlePage)
router.delete('/article-delete/:id',AdminMiddleware.isAuthenticated,AdminController.deleteArticle)
router.post('/edit-article/:id',AdminMiddleware.isAuthenticated,FormValidation.validateEditArticleForm,AdminController.editArticle)

//viewissue

router.get('/view-issue/:id',AdminMiddleware.isAuthenticated,AdminController.viewIssue)
router.get('/view-issue-page/:id',AdminMiddleware.isAuthenticated,AdminController.viewIssuePage)
router.get('/logout',AdminController.logout)
module.exports = router;