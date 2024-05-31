import React from 'react';
import { Container, Typography, Button, Grid, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import StoreIcon from '@mui/icons-material/Store';
import HomeIcon from '@mui/icons-material/Home';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" style={{ marginTop: '50px' }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Bienvenido al Sistema de Inventario
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<InventoryIcon />}
              onClick={() => navigate('/inventario')}
              style={{ padding: '20px' }}
            >
              INVENTARIO
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<AddShoppingCartIcon />}
              onClick={() => navigate('/registrar-compra')}
              style={{ padding: '20px' }}
            >
              REGISTRAR COMPRA
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<ReceiptIcon />}
              onClick={() => navigate('/registrar-venta')}
              style={{ padding: '20px' }}
            >
              REGISTRAR VENTA
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<AssessmentIcon />}
              onClick={() => navigate('/reportes')}
              style={{ padding: '20px' }}
            >
              REPORTES
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<StoreIcon />}
              onClick={() => navigate('/control-de-stock')}
              style={{ padding: '20px' }}
            >
              CONTROL DE STOCK
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<HomeIcon />}
              onClick={() => navigate('/registrar-producto')}
              style={{ padding: '20px' }}
            >
              REGISTRAR PRODUCTO
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
