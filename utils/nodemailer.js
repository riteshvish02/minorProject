const nodemailer = require("nodemailer")
const ErrorHandler = require("./ErrorHandler")

exports.sendmail = async (email,req,res,manuscript)=>{
 const transport = nodemailer.createTransport({
    service: "gmail",
    host:"smtp.gmail.com",
    post: 555,
    auth: {
        user:process.env.MAIL_EMAIL_ADDRESS,
        pass:process.env.MAIL_EMAIL_PASS
    }
 })
 
 const mailOptions = {
    from:"World Journal of Advance Pharmaceutical Sciences",
    to:email,
    subject: `WJAPS Manuscript Submission - Manuscript ID No. ${manuscript.manuscriptNumber}`,
  html: `
    <p style="font-size: 22px; font-weight: 700;">WORLD JOURNAL OF ADVANCE PHARMACEUTICAL SCIENCES</p>
     <p style="font-size: 20px;">${manuscript.name},</p>
     
     <p style="font-size: 22px;">WORLD JOURNAL OF ADVANCE PHARMACEUTICAL SCIENCES has received your manuscript entitled <strong>"${manuscript.title}"</strong> for publication in WJAPS.</p>
     
     <p style="font-size: 20px;">The reference number for this manuscript is <strong>${manuscript.manuscriptNumber}</strong></p>
     <p style="font-size: 20px;"> Kindly quote this in correspondence related to your manuscript The Editors will send to review the submitted manuscript initially. If found suitable, Editor will send the Acceptance Letter for the article. During this process you are free to check the progress of the manuscript through various phases from our online manuscript processing site on (Track your article)</p>
     <p style="font-size: 20px;"> <a href="https://wjaps.com">Track Your Article</a>.</p>
     <p style="font-size: 20px;">We thank you for submitting your valuable research work to the <strong style="font-size: 22px;">WORLD JOURNAL OF ADVANCE PHARMACEUTICAL SCIENCES</strong>.</p>
    <p style="font-size: 20px;">You are requested to convey/circulate/forward the information about World Journal of Advance Pharmaceutical Sciences to all of your friends/ teacher/ colleagues and students. For further details please visit us at: <a href="https://wjaps.com">https://wjaps.com</a></p>  
     <p>Yours sincerely,<br>The Editorial Team</p>
  `
   
 }

  transport.sendMail(mailOptions, (err, info) => {
    if(err){
        console.log(err);
        
    }
 })
 return true
}
