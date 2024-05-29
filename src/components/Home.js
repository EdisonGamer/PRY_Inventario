// src/components/Home.js
import React from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Bienvenido al Sistema de Inventario
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/Inventario')}>
              Inventario
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/registrar-producto')}>
              Registrar Producto
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/registrar-compra')}>
              Registrar Compra
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/registrar-venta')}>
              Registrar Venta
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/reportes')}>
              Reportes
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/control-stock')}>
              Control de Stock
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
