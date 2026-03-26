import transporter from "../config/nodemailer.config.js";

const sendEmail = async (useremail,subject,html)=>{
    try {
        await transporter.sendMail({
            from:`this email is send from {email}`,
            to:useremail,
            subject:subject,
            html:html,

        })
        console.log(`email send successfully`)
        return true
    } catch (err) {
        throw err
    }
}


export default sendEmail