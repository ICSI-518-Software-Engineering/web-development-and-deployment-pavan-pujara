import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventory.css'; // Make sure to create appropriate CSS

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]);
  // Expanded editingItem state to include model and os
  const [editingItem, setEditingItem] = useState({ name: '', model: '', os: '', image: '' });

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get(`/api/inventory?search=${searchTerm}`);
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const handleItemSubmit = async (event) => {
    event.preventDefault();
    const itemToSubmit = {
      ...editingItem,
      // Ensure that we're sending the os as lowercase to the backend
      os: editingItem.os.toLowerCase()
    };
    if (editingItem._id) {
      await axios.put(`/api/inventory/${editingItem._id}`, itemToSubmit);
    } else {
      await axios.post('/api/inventory', itemToSubmit);
    }
    setEditingItem({ name: '', model: '', os: '', image: '' }); // Reset editingItem state
    fetchInventoryItems();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleDeleteItem = async (id) => {
    await axios.delete(`/api/inventory/${id}`);
    fetchInventoryItems();
  };

  return (
    <div className="container">
      <h1>Inventory</h1>
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by device name..."
          className="form-control"
        />
        <button className="btn_search" onClick={fetchInventoryItems}>Search</button>
      </div>
      <form onSubmit={handleItemSubmit}>
        <input className='os'
          type="text"
          name="name"
          placeholder="Device name"
          value={editingItem.name}
          onChange={handleInputChange}
          required
        />
        <input className='os'
          type="text"
          name="model"
          placeholder="Model"
          value={editingItem.model}
          onChange={handleInputChange}
          required
        />
        {/* Dropdown menu for OS selection */}
        <select className='os'
          name="os"
          value={editingItem.os}
          onChange={handleInputChange}
          required
        >
          <option value="">Select OS</option>
          <option value="none">None</option>
          <option value="android">Android</option>
          <option value="ios">iOS</option>
        </select>
        {/* Image upload input will go here if needed */}
        <button type="submit" className="btn_add">
          {editingItem._id ? 'Save Changes' : 'Add Device'}
        </button>
      </form>
      <div className="inventory-list">
        {inventoryItems.length === 0 ? (
          <p>Inventory is empty</p>
        ) : (
          inventoryItems.map((item) => (
            <div key={item._id} className="card">
              <img src={item.image || '/placeholder-image.png'} alt={item.name} />
              <div className="card-body">
                <h3 className="card-title">{item.name}</h3>
                <p>Model: {item.model}</p>
                <p>OS: {item.os.toUpperCase()}</p>
                <div className="button-container">
                  <button className="btn btn-orange" onClick={() => handleEditItem(item)}>Edit</button>
                  <button className="btn btn-red" onClick={() => handleDeleteItem(item._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inventory;
