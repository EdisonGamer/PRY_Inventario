// src/components/Inventory.js
import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs } from '../firebase';
import { Container, TextField, Button, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'inventory'));
        setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (!itemName || quantity <= 0) {
      alert('Please enter a valid item name and quantity.');
      return;
    }
    try {
      await addDoc(collection(db, 'inventory'), {
        name: itemName,
        quantity: parseInt(quantity)
      });
      setItemName('');
      setQuantity('');
      alert('Item added successfully');
      const querySnapshot = await getDocs(collection(db, 'inventory'));
      setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error adding item:", error);
      alert('Error adding item: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Inventory
        </Typography>
        <form onSubmit={addItem}>
          <TextField
            label="Item Name"
            variant="outlined"
            margin="normal"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Item
          </Button>
        </form>
        <List>
          {items.map(item => (
            <ListItem key={item.id}>
              <ListItemText primary={`${item.name} - ${item.quantity}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Inventory;
