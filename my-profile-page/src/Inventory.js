import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inventory.css';

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [editingItem, setEditingItem] = useState({ _id: '', name: '', quantity: '' });

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditingItem(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`/api/inventory/${id}`);
      fetchInventoryItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get('/api/inventory');
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const handleItemSubmit = async (event) => {
    event.preventDefault();
    const method = editingItem._id ? 'put' : 'post';
    const url = `/api/inventory${editingItem._id ? `/${editingItem._id}` : ''}`;

    try {
      await axios({
        method,
        url,
        data: editingItem,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      fetchInventoryItems();
      setEditingItem({ _id: '', name: '', quantity: '' }); // Clear form
    } catch (error) {
      console.error('Error submitting item:', error.response || error);
    }
  };

  return (
    <div className="inventory-container">
      <h1>Inventory Management</h1>
      <form onSubmit={handleItemSubmit} className="inventory-form">
        <input type="text" name="name" placeholder="Item Name" value={editingItem.name} onChange={handleInputChange} required />
        <input type="number" name="quantity" placeholder="Quantity" value={editingItem.quantity} onChange={handleInputChange} required />
        <button type="submit" className="btn-submit">{editingItem._id ? 'Update Item' : 'Add Item'}</button>
      </form>
      <div className="inventory-grid">
        {inventoryItems.length > 0 ? inventoryItems.map(item => (
          <div key={item._id} className="grid-item">
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => handleEditItem(item)}>Edit</button>
            <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
          </div>
        )) : <p>No items in inventory.</p>}
      </div>
    </div>
  );
};

export default Inventory;
