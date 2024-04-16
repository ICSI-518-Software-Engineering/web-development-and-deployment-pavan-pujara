require('dotenv').config();

const cors     = require('cors');
const path     = require('path');
const multer   = require('multer');
const bcrypt   = require('bcrypt');
const express  = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);




const app   = express();
const PORT  = process.env.PORT || 3001;
const dbUrl = process.env.MY_DataBase_URI;

// Define user schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  avatar: String,
});
const User = mongoose.model('User', userSchema);

// Middleware setup
app.use(cors({
  origin: ['http://localhost:3000'], // Adjust this to match your client-side URL
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}));
app.use(express.static(path.join(__dirname, "build")));
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
// app.use(Session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }));

const store = new MongoDBStore({
  uri: process.env.MY_DataBase_URI,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  },
  store: store,
  resave: false,
  saveUninitialized: false
}));

// MongoDB connection
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  

// Item schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
  image: String, // This will store the image as a base64 encoded string
});
const Item = mongoose.model('Item', itemSchema);

// Route definitions
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/Addition', (req, res) => {
  const num1 = parseInt(req.query.num1);
  const num2 = parseInt(req.query.num2);
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Both num1 and num2 must be valid numbers" });
  }
  const result = num1 + num2;
  res.json({ result });
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/items', upload.single('image'), async (req, res) => {
  const { name, description, quantity } = req.body;
  let newItem = {
    name,
    description,
    quantity,
    image: req.file ? req.file.buffer.toString('base64') : ''
  };

  try {
    const savedItem = new Item(newItem);
    await savedItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/items/:id', upload.single('image'), async (req, res) => {
  const { name, description, quantity } = req.body;
  let updateData = {
    name,
    description,
    quantity
  };

  if (req.file) {
    updateData.image = req.file.buffer.toString('base64');
  }

  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/sign_up', upload.single('avatar'), async (req, res) => {
  const { username, password } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: "Already a member. Please log in or recover your account." });
  }

  const encodedPassword = await bcrypt.hash(password, 10);
  let newUser = {
    username,
    password: encodedPassword,
    avatar: req.file ? req.file.buffer.toString('base64') : ''
  };

  try {
    const savedUser = new User(newUser);
    await savedUser.save();
    // Set user information in session after signing up
    req.session.user = {
      id: savedUser._id,    
      username: savedUser.username,
      avatar: savedUser.avatar
    };

    // Save the session and respond
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Failed to save session' });
      }
      res.status(201).json({ message: "User created and logged in successfully", user: savedUser.username });
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: error.message });
  }
});



app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'No user with that username' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      req.session.user = { id: user._id, username: user.username , avatar: user.avatar};
      req.session.save(err => {  // Explicitly save the session
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Failed to save session' });
        }
        return res.status(200).json({ message: 'Login successful' });
      });
    } else {
      return res.status(401).json({ message: 'Password incorrect' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    res.clearCookie('connect.sid', { path: '/' });  // adjust the cookie name and path as necessary
    res.json({ message: 'Logout successful' });
  });
});


app.get('/getUserData', async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "No user session found." });
    }
    res.json({
      message: "User data fetched successfully",
      username: req.session.user.username,
      avatar: req.session.user.avatar
    });
  } catch (error) {
    console.log("Error fetching user data: ", error); // It's good to log the error for debugging.
    res.status(500).json({ message: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


