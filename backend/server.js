require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()
app.use(cors())
app.use(express.json())

// ✅ CONNECT DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

// ✅ SCHEMA
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  interest: String,
  strength: String,
  budget: String,
  recommendation: String
})

// ✅ SIGNUP (HASH PASSWORD)
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    res.json({ message: "User created" })
  } catch (err) {
    res.status(500).json({ error: "Signup failed" })
  }
})

// ✅ LOGIN (COMPARE + JWT)
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

// ✅ AUTH MIDDLEWARE
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

// ✅ START SERVER
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
)