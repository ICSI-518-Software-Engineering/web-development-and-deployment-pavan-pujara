import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get('http://localhost:3001/items');
    setItems(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/items', newItem);
    setNewItem({ name: '', description: '', quantity: '' }); // Reset form
    fetchItems(); // Refresh items
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/items/${id}`);
    fetchItems(); // Refresh items
  };

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Item Name"
                value={newItem.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="description"
                placeholder="Description"
                value={newItem.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                className="form-control"
                name="quantity"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Item</button>
          </form>
        </div>
      </div>
      <div className="row mt-5">
        {items.map((item) => (
          <div key={item._id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Quantity: {item.quantity}</h6>
                <p className="card-text">{item.description}</p>
                <button onClick={() => handleDelete(item._id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
