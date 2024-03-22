const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Dropdown } = require('bootstrap');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
  name: String,
  model: String,
  type: Dropdown,
});

const Item = mongoose.model('Item', itemSchema);

app.get('/api/inventory', async (req, res) => {
  const items = await Item.find({});
  if(items.length === 0) {
    return res.status(404).send('Inventory is empty');
  }
  res.send(items);
});

app.post('/api/inventory', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.send(newItem);
});

app.put('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  await Item.findByIdAndUpdate(id, req.body);
  res.send('Item updated');
});

app.delete('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  await Item.findByIdAndDelete(id);
  res.send('Item deleted');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
