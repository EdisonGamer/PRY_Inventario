// src/components/Reportes.js
import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../firebase';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const Reportes = () => {
  const [compras, setCompras] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const comprasSnapshot = await getDocs(collection(db, 'compras'));
        const ventasSnapshot = await getDocs(collection(db, 'ventas'));
        const productosSnapshot = await getDocs(collection(db, 'productos'));

        setCompras(comprasSnapshot.docs.map(doc => doc.data()));
        setVentas(ventasSnapshot.docs.map(doc => doc.data()));
        setProductos(productosSnapshot.docs.map(doc => doc.data()));
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReportes();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Reportes
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Compras
        </Typography>
        <List>
          {compras.map((compra, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Producto: ${compra.productoId}, Cantidad: ${compra.cantidad}, Fecha: ${compra.fecha}`} />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6" component="h2" gutterBottom>
          Ventas
        </Typography>
        <List>
          {ventas.map((venta, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Producto: ${venta.productoId}, Cantidad: ${venta.cantidad}, Fecha: ${venta.fecha}`} />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6" component="h2" gutterBottom>
          Productos
        </Typography>
        <List>
          {productos.map((producto, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Nombre: ${producto.nombre}, Descripción: ${producto.descripcion}, Precio: ${producto.precio}, Stock: ${producto.stock}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Reportes;
