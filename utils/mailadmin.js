const nodemailer = require("nodemailer")
const ErrorHandler = require("./ErrorHandler")

exports.sendmailadmin = async (req,res,manuscript)=>{
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
    to:"wjapsjournal@gmail.com",
    subject: `New Article Received`,
  html: `
     <div style="background-color: white; color: black; padding: 20px; text-align: center; border-radius: 8px;">
  
        <div class="responsive-container" style="margin: 0 auto; width: fit-content; padding: 0 15px;">
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr>
                    <td style="width: 30%; font-weight: bold; border: 1px solid #000; padding: 8px; text-align: left;">Name:</td>
                    <td style="border: 1px solid #000; padding: 8px;">${manuscript.name}</td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; border: 1px solid #000; padding: 8px; text-align: left;">Manuscript Number:</td>
                    <td style="border: 1px solid #000; padding: 8px;">${manuscript.manuscriptNumber}</td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; border: 1px solid #000; padding: 8px; text-align: left;">Article Title:</td>
                    <td style="border: 1px solid #000; padding: 8px;">${manuscript.articletype}</td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; border: 1px solid #000; padding: 8px; text-align: left;">Email:</td>
                    <td style="border: 1px solid #000; padding: 8px;">${manuscript.email}</td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; border: 1px solid #000; padding: 8px; text-align: left;">Designation:</td>
                    <td style="border: 1px solid #000; padding: 8px;">${manuscript.designation}</td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; border: 1px solid #000; padding: 8px; text-align: left;">Address:</td>
                    <td style="border: 1px solid #000; padding: 8px;">${manuscript.address}</td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; border: 1px solid #000; padding: 8px; text-align: left;">Country:</td>
                    <td style="border: 1px solid #000; padding: 8px;">${manuscript.country}</td>
                </tr>
            </table>
        </div>
    </div>
  `
   
 }

 await transport.sendMail(mailOptions, (err, info) => {
    if(err){
        console.log(err);
        
        // req.flash('error',"something went wrong")
        // return res.redirect("back")
    }
 })
 return true
}
