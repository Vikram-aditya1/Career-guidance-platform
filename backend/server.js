const nodemailer = require("nodemailer")
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express()
app.use(cors())
app.use(express.json())
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Vikramaditya854@gmail.com", 
    pass: "pjsxmxwyoearuyxs" 
  }
})
async function sendWelcomeEmail(email, name) {
  await transporter.sendMail({
    from: "Vikramaditya854@gmail.com",
    to: email,
    subject: "Account Created Successfully 🎉",
    text: `Hi ${name}, your account has been successfully created! Welcome to Career Guidance Platform.`
  })
}
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  interest: String,
  strength: String,
  budget: String,
  recommendation: String
})

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    await sendWelcomeEmail(email, name)

    res.json({ message: "User created successfully" })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Signup failed" })
  }
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.json({ token, user })

  } catch (err) {
    res.status(500).json({ error: "Login failed" })
  }
})

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: "No token" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: "Invalid token" })
  }
}

// ✅ PROTECTED ROUTE
app.post("/submit-test", authMiddleware, async (req, res) => {
  const { email, interest, strength, budget } = req.body

  let recommendation = ""

  if (interest === "govt") {
    recommendation = "SSC / Banking"
  } else if (interest === "tech") {
    recommendation = "Web Development"
  } else {
    recommendation = "Business"
  }

  await User.updateOne(
    { email },
    { interest, strength, budget, recommendation }
  )

  res.json({ recommendation })
})

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
)