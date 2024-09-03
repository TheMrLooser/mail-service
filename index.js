const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sendMail = require("./email");
const nodemailer = require("nodemailer")
const hbs = require("nodemailer-express-handlebars")
const path = require("path")



dotenv.config({ path: ".env" });

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    credentials: true,
    maxAge: 600,
    exposedHeaders: ["*", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/sent-mail", async (req, res) => {
  try {
    const { to, email, name, phoneNumber, query } = req.body;
    if (!to || !email || !name || !phoneNumber || !query) {
      return res
        .status(412)
        .json({ error: true, message: "Missign required field " });
    }
    // await sendMail({
    //   to,
    //   from: email,
    //   subject: "New Contact Request",
    //   name,
    //   phoneNumber,
    //   query,
    // });

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
    from:email,
    to,
    subject: "New Contact Request",
    template: "email",
    context: { email, name, phoneNumber, query },
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


    return res.status(200).json({ success: true, message: "Mail sent" });
  } catch (error) {
    return res
      .status(501)
      .json({ error: true, message: "Internal server error" });
  }
});
app.get("/", (req, res) => {
  try {
    return res.status(200).send("Mail server is live");
  } catch (error) {
    return res
      .status(501)
      .json({ error: true, message: "Internal server error" });
  }
});

app.use(() => {
  const error = new HttpError("This route does not exist", 404);
  throw error;
});

app.use(async (err, req, res, next) => {
  return res
    .status(500)
    .json({ error: true, message: err?.message ?? "Some Internal error!" });
});

let PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
