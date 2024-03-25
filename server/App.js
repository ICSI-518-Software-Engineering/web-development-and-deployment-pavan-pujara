// Require necessary NPM modules:
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port or default to 3000

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://pavan:pavan14@assign.plzdlbv.mongodb.net/PavaData?retryWrites=true&w=majority&appName=assign", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});

// Define InventoryItem schema and model
const inventorySchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  image: String, // Assuming image is a URL to the image
});

const InventoryItem = mongoose.model('InventoryItem', inventorySchema);

// CRUD operations for InventoryItems'

// GET all inventory items
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await InventoryItem.find({});
    res.json(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST add a new inventory item
app.post('/api/inventory', async (req, res) => {
  try {
    const newItem = new InventoryItem(req.body);
    const savedItem = await newItem.save();
    console.log('New item added:', savedItem); // Log the saved item
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error adding new item:', error); // More detailed error logging
    res.status(400).json({ error: error.message });
  }
});


// DELETE an inventory item by ID
app.delete('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await InventoryItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    console.log('Item deleted:', deletedItem); // Log the deleted item
    res.sendStatus(204); // Successfully deleted
  } catch (error) {
    console.error('Error deleting item:', error); // More detailed error logging
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
