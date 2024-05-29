// src/components/RegistrarProducto.js
import React, { useState } from 'react';
import { db, collection, addDoc } from '../firebase';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const RegistrarProducto = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'productos'), {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock)
      });
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
      alert('Producto registrado con éxito');
    } catch (error) {
      console.error("Error registrando producto:", error);
      alert('Error registrando producto: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Registrar Producto
        </Typography>
        <form onSubmit={handleRegistrar}>
          <TextField
            label="Nombre"
            variant="outlined"
            margin="normal"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            label="Descripción"
            variant="outlined"
            margin="normal"
            fullWidth
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <TextField
            label="Precio"
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          <TextField
            label="Stock"
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Registrar Producto
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegistrarProducto;
