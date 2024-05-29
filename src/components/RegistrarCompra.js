// src/components/RegistrarCompra.js
import React, { useState } from 'react';
import { db, collection, addDoc, doc, updateDoc, increment } from '../firebase';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const RegistrarCompra = () => {
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');

  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'compras'), {
        productoId,
        cantidad: parseInt(cantidad),
        fecha
      });

      const productoRef = doc(db, 'productos', productoId);
      await updateDoc(productoRef, {
        stock: increment(parseInt(cantidad))
      });

      setProductoId('');
      setCantidad('');
      setFecha('');
      alert('Compra registrada con éxito');
    } catch (error) {
      console.error("Error registrando compra:", error);
      alert('Error registrando compra: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Registrar Compra
        </Typography>
        <form onSubmit={handleRegistrar}>
          <TextField
            label="ID del Producto"
            variant="outlined"
            margin="normal"
            fullWidth
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
          />
          <TextField
            label="Cantidad"
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
          <TextField
            label="Fecha"
            type="date"
            variant="outlined"
            margin="normal"
            fullWidth
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Registrar Compra
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegistrarCompra;
