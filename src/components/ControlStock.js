// src/components/ControlStock.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ControlStock = () => {
  return (
    <Container maxWidth="md">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Control de Stock
        </Typography>
        {/* Aquí agregarás la lógica y la interfaz para el control de stock */}
      </Box>
    </Container>
  );
};

export default ControlStock;
