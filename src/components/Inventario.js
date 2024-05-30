import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../firebase';
import { 
  Container, Typography, TextField, RadioGroup, FormControlLabel, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box 
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('codigoInterno'); // Estado para manejar la opción de búsqueda
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProductos = async () => {
      const productosSnapshot = await getDocs(collection(db, 'productos'));
      const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Ordenar productos por codigoInterno
      productosList.sort((a, b) => a.codigoInterno.localeCompare(b.codigoInterno));
      setProductos(productosList);
    };
    obtenerProductos();
  }, []);

  // Filtrar productos por término de búsqueda según el campo seleccionado
  const productosFiltrados = productos.filter(producto => {
    const term = searchTerm.toLowerCase();
    switch (searchBy) {
      case 'codigoInterno':
        return producto.codigoInterno.toLowerCase().includes(term);
      case 'codigoProveedor':
        return producto.proveedores.some(proveedor => proveedor.toLowerCase().includes(term));
      case 'categoria':
        return producto.categoria.toLowerCase().includes(term);
      case 'marca':
        return producto.marca.toLowerCase().includes(term);
      case 'descripcion':
        return producto.descripcion.toLowerCase().includes(term);
      case 'ubicacion':
        return producto.ubicacion.toLowerCase().includes(term);
      default:
        return true;
    }
  });

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Inventario
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/home')}
        style={{ marginBottom: '20px' }}
      >
        Menú Principal
      </Button>
      <RadioGroup row value={searchBy} onChange={(e) => setSearchBy(e.target.value)} style={{ marginBottom: '20px' }}>
        <FormControlLabel value="codigoInterno" control={<Radio />} label="Código Interno" />
        <FormControlLabel value="codigoProveedor" control={<Radio />} label="Código Proveedor" />
        <FormControlLabel value="categoria" control={<Radio />} label="Categoría" />
        <FormControlLabel value="marca" control={<Radio />} label="Marca" />
        <FormControlLabel value="descripcion" control={<Radio />} label="Descripción" />
        <FormControlLabel value="ubicacion" control={<Radio />} label="Ubicación" />
      </RadioGroup>
      <TextField
        fullWidth
        label={`Ingrese ${searchBy}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
      />
      <TableContainer component={Paper} style={{ maxHeight: 800 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Código Interno</TableCell>
              <TableCell>Código Proveedor</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell style={{ width: '30%' }}>Descripción</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Último Precio de Venta</TableCell>
              <TableCell>Ubicación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.codigoInterno}</TableCell>
                  <TableCell>{producto.proveedores ? producto.proveedores.join(', ') : ''}</TableCell>
                  <TableCell>{producto.categoria}</TableCell>
                  <TableCell>{producto.marca}</TableCell>
                  <TableCell style={{ width: '30%' }}>{producto.descripcion}</TableCell>
                  <TableCell>{producto.stock}</TableCell>
                  <TableCell>{producto.ultimoPrecioVenta || 'No Registrado'}</TableCell>
                  <TableCell>{producto.ubicacion}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>No se encontraron productos</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Inventario;
