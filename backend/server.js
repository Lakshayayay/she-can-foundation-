const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all for convenience in test, but specify in config
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate Limiting (Prevent Abuse)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 submissions per windowMs
  message: { error: 'Too many submissions from this IP, please try again after 15 minutes.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // limit each IP to 10 login attempts per windowMs
  message: { error: 'Too many login attempts. Please try again later.' }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/she_can_foundation')
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model
const SubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Submission = mongoose.model('Submission', SubmissionSchema);

// Admin JWT Middleware Verification
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'shecanfoundationsecretjwtkey', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.admin = decoded;
    next();
  });
};

// API Routes

// 1. Post contact submission
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Server-side validation check
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields (Name, Email, Message) are required.' });
    }

    const newSubmission = new Submission({ name, email, message });
    await newSubmission.save();

    return res.status(201).json({ message: 'Form Submitted Successfully' });
  } catch (error) {
    console.error('Submission error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Admin Login
app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  // Sign Token
  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET || 'shecanfoundationsecretjwtkey', {
    expiresIn: '2h'
  });

  return res.json({ token });
});

// 3. Get all submissions (Protected)
app.get('/api/submissions', authenticateAdmin, async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ timestamp: -1 });
    return res.json(submissions);
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
