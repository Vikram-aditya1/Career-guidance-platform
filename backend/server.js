const nodemailer = require('nodemailer')
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

const signupOtpStore = new Map()
const loginOtpStore = new Map()

const disposableDomains = [
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'tempmail.com',
  'throwawaymail.com',
  'maildrop.cc',
]

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase()
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function isDisposableEmail(email = '') {
  const domain = normalizeEmail(email).split('@')[1] || ''
  return disposableDomains.includes(domain)
}

function sanitizeUser(user) {
  if (!user) return null
  return {
    id: user._id?.toString?.() || user.id,
    name: user.name,
    email: user.email,
    interest: user.interest || '',
    strength: user.strength || '',
    budget: user.budget || '',
    recommendation: user.recommendation || '',
    favoriteColleges: user.favoriteColleges || [],
    createdAt: user.createdAt || null,
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

async function sendMail({ to, subject, text }) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  })
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB connection error:', err.message))

const FavoriteCollegeSchema = new mongoose.Schema(
  {
    collegeId: { type: String, required: true },
    name: String,
    state: String,
    district: String,
    website: String,
    courses: [String],
  },
  { _id: false }
)

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    interest: String,
    strength: String,
    budget: String,
    recommendation: String,
    favoriteColleges: { type: [FavoriteCollegeSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

const User = mongoose.model('User', UserSchema)

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/auth/signup/start', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const safeEmail = normalizeEmail(email)

    if (!name || !safeEmail || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    if (isDisposableEmail(safeEmail)) {
      return res.status(400).json({ message: 'Disposable email addresses are not allowed.' })
    }

    const existingUser = await User.findOne({ email: safeEmail })
    if (existingUser) {
      return res.status(400).json({ message: 'An account already exists with this email.' })
    }

    const otp = generateOtp()
    signupOtpStore.set(safeEmail, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      payload: {
        name: String(name).trim(),
        email: safeEmail,
        password,
      },
    })

    await sendMail({
      to: safeEmail,
      subject: 'Verify your account',
      text: `Your verification OTP is ${otp}. It expires in 5 minutes.`,
    })

    return res.json({ message: 'OTP sent to your email.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to start signup.' })
  }
})

app.post('/auth/signup/verify', async (req, res) => {
  try {
    const { email, otp } = req.body
    const safeEmail = normalizeEmail(email)

    const record = signupOtpStore.get(safeEmail)
    if (!record) {
      return res.status(400).json({ message: 'OTP not found or expired. Please request a new one.' })
    }

    if (Date.now() > record.expiresAt) {
      signupOtpStore.delete(safeEmail)
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' })
    }

    if (String(record.otp) !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid OTP.' })
    }

    const alreadyExists = await User.findOne({ email: safeEmail })
    if (alreadyExists) {
      signupOtpStore.delete(safeEmail)
      return res.status(400).json({ message: 'An account already exists with this email.' })
    }

    const hashedPassword = await bcrypt.hash(record.payload.password, 10)

    const user = await User.create({
      name: record.payload.name,
      email: record.payload.email,
      password: hashedPassword,
    })

    signupOtpStore.delete(safeEmail)

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      message: 'Account created successfully.',
      token,
      user: sanitizeUser(user),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to verify signup OTP.' })
  }
})

app.post('/auth/login/start', async (req, res) => {
  try {
    const { email, password } = req.body
    const safeEmail = normalizeEmail(email)

    if (!safeEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: safeEmail })
    if (!user) {
      return res.status(401).json({ message: 'User not found.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password.' })
    }

    const otp = generateOtp()
    loginOtpStore.set(safeEmail, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    })

    await sendMail({
      to: safeEmail,
      subject: 'Your login OTP',
      text: `Your login OTP is ${otp}. It expires in 5 minutes.`,
    })

    return res.json({ message: 'OTP sent to your email.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to start login.' })
  }
})

app.post('/auth/login/verify', async (req, res) => {
  try {
    const { email, otp } = req.body
    const safeEmail = normalizeEmail(email)

    const record = loginOtpStore.get(safeEmail)
    if (!record) {
      return res.status(400).json({ message: 'OTP not found or expired. Please request a new one.' })
    }

    if (Date.now() > record.expiresAt) {
      loginOtpStore.delete(safeEmail)
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' })
    }

    if (String(record.otp) !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid OTP.' })
    }

    const user = await User.findOne({ email: safeEmail })
    if (!user) {
      loginOtpStore.delete(safeEmail)
      return res.status(404).json({ message: 'User not found.' })
    }

    loginOtpStore.delete(safeEmail)

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      message: 'Login successful.',
      token,
      user: sanitizeUser(user),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to verify login OTP.' })
  }
})

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token.' })
  }
}

app.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ message: 'User not found.' })
  res.json({ user: sanitizeUser(user) })
})

app.get('/favorites', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ message: 'User not found.' })
  return res.json({ favorites: user.favoriteColleges || [] })
})

app.post('/favorites/toggle', authMiddleware, async (req, res) => {
  try {
    const { college } = req.body

    if (!college?.id) {
      return res.status(400).json({ message: 'College data is required.' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const exists = (user.favoriteColleges || []).some(
      (item) => item.collegeId === college.id
    )

    if (exists) {
      user.favoriteColleges = (user.favoriteColleges || []).filter(
        (item) => item.collegeId !== college.id
      )
    } else {
      user.favoriteColleges.push({
        collegeId: college.id,
        name: college.name,
        state: college.state,
        district: college.district,
        website: college.website || '',
        courses: college.courses || [],
      })
    }

    await user.save()

    return res.json({
      favorites: user.favoriteColleges,
      user: sanitizeUser(user),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to update favorites.' })
  }
})

app.post('/submit-test', authMiddleware, async (req, res) => {
  try {
    const { interest, strength, budget } = req.body

    let recommendation = ''
    if (interest === 'govt') recommendation = 'SSC / Banking'
    else if (interest === 'tech') recommendation = 'Web Development'
    else recommendation = 'Business'

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { interest, strength, budget, recommendation },
      { new: true }
    )

    return res.json({
      recommendation,
      user: sanitizeUser(updated),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to submit test.' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})