import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventory.css'; // Make sure to create appropriate CSS

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // holds the item currently being edited

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
    event.preventDefault(); // Prevents the default form submission behavior
    if (editingItem) {
      // If editingItem exists, update the item
      await axios.put(`/api/inventory/${editingItem._id}`, editingItem);
    } else {
      // If editingItem doesn't exist, create a new item
      await axios.post('/api/inventory', editingItem);
    }
    setEditingItem(null); // Reset editingItem state
    fetchInventoryItems(); // Refresh the list
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
    fetchInventoryItems(); // Refresh the list
  };

  return (
    <div className="container">
      <h1>Inventory</h1>
      {/* Search bar to filter items */}
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name..."
          className="form-control"
        />
        <button className="btn_search" onClick={fetchInventoryItems}>Search</button>
      </div>
      {/* Form to add/edit items */}
      <form onSubmit={handleItemSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item name"
          value={editingItem?.name || ''}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={editingItem?.quantity || ''}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="btn_add">
          {editingItem ? 'Save Changes' : 'Add Item'}
        </button>
      </form>
      {/* Inventory items list */}
      <div className="inventory-list">
        {inventoryItems.length === 0 && <p>Inventory is empty</p>}
        {inventoryItems.map((item) => (
          <div key={item._id} className="card">
            <img src={item.image} alt={item.name} />
            <div className="card-body">
              <h3 className="card-title">{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <div className="button-container">
                <button className="btn btn-orange" onClick={() => handleEditItem(item)}>Edit</button>
                <button className="btn btn-red" onClick={() => handleDeleteItem(item._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
