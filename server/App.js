const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); // Add this line to import the path module

const app = express();
const PORT = 3001;
const dbUrl = 'mongodb+srv://pavan:pavan14@assign.plzdlbv.mongodb.net/PavaData?retryWrites=true&w=majority&appName=assign'; // It's a good practice to use environment variables for sensitive information

app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

// Define a route for the addition API
app.get('/Addition', (req, res) => {
  // Get query parameters from URL (assuming num1 and num2 are passed)
  const num1 = parseInt(req.query.num1);
  const num2 = parseInt(req.query.num2);

  // Check if num1 and num2 are not NaN
  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: "Both num1 and num2 must be valid numbers" });
  }

  // Perform addition
  const result = num1 + num2;

  // Send response with result
  res.json({ result });
});

// Set up multer for storing uploaded files
const storage = multer.memoryStorage(); // Stores files in memory
const upload = multer({ storage: storage });

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
  image: String, // This will store the image as a base64 encoded string
});

const Item = mongoose.model('Item', itemSchema);

app.get('/', function (req, res) {
  res.render('index', {});
});

// Fetch all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new item with an image
app.post('/items', upload.single('image'), async (req, res) => {
  const { name, description, quantity } = req.body;
  let newItem = {
    name,
    description,
    quantity,
    image: ''
  };

  if (req.file) {
    // Assuming the image is uploaded as 'image'
    newItem.image = req.file.buffer.toString('base64');
  }

  try {
    const savedItem = new Item(newItem);
    await savedItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an item
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

// Delete an item
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
