const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
    try {
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_HOST,
          host: process.env.EMAIL_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

     const source = fs.readFileSync(path.join(__dirname, template), "utf8");
     const compiledTemplate = handlebars.compile(source);
     const options = () => {
        return {
          from: process.env.EMAIL_USERNAME,
          to: email,
          subject: subject,
          html: compiledTemplate(payload),
        };
     }

      transporter.sendMail(options(), (error, info) => {
        if (error) console.log(`Error at sendEmail.js, transporter.sendMail() :  ${error}`)
        if(!error) console.log(`All good, reset password request sent`)
     })

    } catch (error) {
        return `Error at sendEmail.js : ${error}`
    }
}

module.exports = sendEmail;
