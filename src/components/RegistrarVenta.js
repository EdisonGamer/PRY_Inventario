// src/components/RegistrarVenta.js
import React, { useState } from 'react';
import { db, collection, addDoc, doc, updateDoc, increment } from '../firebase';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const RegistrarVenta = () => {
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');

  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'ventas'), {
        productoId,
        cantidad: parseInt(cantidad),
        fecha
      });

      const productoRef = doc(db, 'productos', productoId);
      await updateDoc(productoRef, {
        stock: increment(-parseInt(cantidad))
      });

      setProductoId('');
      setCantidad('');
      setFecha('');
      alert('Venta registrada con éxito');
    } catch (error) {
      console.error("Error registrando venta:", error);
      alert('Error registrando venta: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Registrar Venta
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
            Registrar Venta
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegistrarVenta;
