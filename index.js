const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sendMail = require("./email");

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
    await sendMail({
      to,
      from: email,
      subject: "New Contact Request",
      name,
      phoneNumber,
      query,
    });
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
