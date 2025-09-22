# Backend Setup Guide

This guide will help you set up a separate backend for your React Native app to replace the current mock data implementation.

## 🏗️ **Backend Architecture Options**

### Option 1: Node.js + Express (Recommended for beginners)

```
📁 backend/
├── 📁 src/
│   ├── 📁 controllers/
│   ├── 📁 models/
│   ├── 📁 routes/
│   ├── 📁 middleware/
│   └── 📁 services/
├── 📁 uploads/          # For image storage
├── 📁 config/
├── package.json
└── server.js
```

### Option 2: Python + FastAPI

```
📁 backend/
├── 📁 app/
│   ├── 📁 models/
│   ├── 📁 routes/
│   ├── 📁 services/
│   └── main.py
├── 📁 uploads/
└── requirements.txt
```

### Option 3: Database Options

- **SQLite** (Development, file-based)
- **PostgreSQL** (Production, scalable)
- **MongoDB** (Document-based, flexible)

## 🚀 **Quick Start with Node.js/Express**

### 1. Create Backend Project

```bash
mkdir backend
cd backend
npm init -y
npm install express mongoose cors bcryptjs jsonwebtoken multer dotenv
npm install -D nodemon
```

### 2. Basic Server Setup (`server.js`)

```javascript
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Routes will go here
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Environment Variables (`.env`)

```
MONGODB_URI=mongodb://localhost:27017/civicapp
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
```

### 4. Database Models

#### User Model (`models/User.js`)

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
```

#### Report Model (`models/Report.js`)

```javascript
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ["pothole", "broken-streetlight", "garbage", "overgrown-weed"],
    required: true,
  },
  imageUri: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    area: String,
  },
  status: {
    type: String,
    enum: ["submitted", "in-progress", "resolved"],
    default: "submitted",
  },
  isAnonymous: { type: Boolean, default: false },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  timeline: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      description: String,
      assignedTo: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
```

### 5. API Routes

#### Auth Routes (`routes/auth.js`)

```javascript
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
```

#### Reports Routes (`routes/reports.js`)

```javascript
const express = require("express");
const Report = require("../models/Report");
const auth = require("../middleware/auth");

const router = express.Router();

// Get personal reports
router.get("/personal", auth, async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get community reports
router.get("/community", async (req, res) => {
  try {
    const { type, status, area, limit = 20, offset = 0 } = req.query;

    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (area) query["location.area"] = area;

    const reports = await Report.find(query)
      .populate("reporter", "username")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create report
router.post("/", auth, async (req, res) => {
  try {
    const reportData = { ...req.body, reporter: req.user.userId };
    const report = new Report(reportData);
    await report.save();

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Upvote report
router.post("/:id/upvote", auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const userIndex = report.upvotes.indexOf(req.user.userId);
    if (userIndex > -1) {
      // Remove upvote
      report.upvotes.splice(userIndex, 1);
    } else {
      // Add upvote
      report.upvotes.push(req.user.userId);
    }

    await report.save();

    res.json({
      upvotes: report.upvotes.length,
      hasUserUpvoted: report.upvotes.includes(req.user.userId),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
```

### 6. Authentication Middleware (`middleware/auth.js`)

```javascript
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
```

### 7. File Upload Setup (`routes/upload.js`)

```javascript
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload image
router.post("/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
  });
});

module.exports = router;
```

## 🔄 **Migration Steps**

### Phase 1: Backend Setup

1. ✅ Create backend project structure
2. ✅ Set up database models
3. ✅ Implement authentication
4. ✅ Create basic CRUD operations
5. ✅ Set up file uploads

### Phase 2: Frontend Integration

1. Update `services/config.ts` with your backend URL
2. Set `USE_API = true` in contexts
3. Test authentication flow
4. Test report creation/updating
5. Test image uploads

### Phase 3: Data Migration (Optional)

1. Create scripts to migrate mock data to database
2. Update existing reports with proper IDs
3. Handle user accounts

## 🛠️ **Development Tools**

- **Postman/Insomnia**: Test API endpoints
- **MongoDB Compass**: Database GUI
- **VS Code REST Client**: In-editor API testing

## 🚀 **Deployment Options**

- **Heroku**: Easy Node.js deployment
- **Railway**: Modern app deployment
- **Vercel**: Serverless functions
- **AWS/Google Cloud**: Enterprise solutions

## 📋 **Next Steps**

1. Choose your backend technology stack
2. Set up the basic server and database
3. Implement authentication endpoints
4. Test the connection from your React Native app
5. Gradually migrate features from mock to API

Would you like me to help you set up a specific backend technology or create more detailed implementation for any particular feature?
