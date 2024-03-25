const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3001;
const dbUrl = 'mongodb+srv://pavan:pavan14@assign.plzdlbv.mongodb.net/PavaData?retryWrites=true&w=majority&appName=assign'; // Adjust the database name as necessary

app.use(cors());
app.use(express.json());

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
});

const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/items', async (req, res) => {
  const newItem = new Item(req.body);
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, quantity } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(id, { name, description, quantity }, { new: true });
    if (!updatedItem) {
      return res.status(404).send('Item not found.');
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).send('Error updating the item.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
