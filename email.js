const nodemailer = require("nodemailer")
const hbs = require("nodemailer-express-handlebars")
const path = require("path")
 

// Function to send an email
const sendMail = ({
  to,
  from,
  subject,
  name,
  phoneNumber,
  query,
}) => {
try {
  
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use Gmail service
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

const handlebarOptions = {
viewEngine: {
  extname: ".hbs",
  layoutsDir: path.resolve("./views"),
  defaultLayout: "email",
},
viewPath: path.resolve("./views"),
extName: ".hbs",
};

// Attach the handlebars plugin to the transporter
transporter.use("compile", hbs(handlebarOptions));

const mailOptions = {
from,
to,
subject: subject,
template: "email",
context: { email: from, name, phoneNumber, query },
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
if (error) {
  console.log({ message: error });
}
});
} catch (error) {
  console.log(error)
}
};

module.exports = sendMail