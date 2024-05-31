import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, query, orderBy } from '../firebase';
import { 
  Container, Typography, TextField,Box,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button 
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [compras, setCompras] = useState([]);
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

    const obtenerCompras = async () => {
      const comprasQuery = query(collection(db, 'compras'), orderBy('fecha', 'desc'));
      const comprasSnapshot = await getDocs(comprasQuery);
      const comprasList = comprasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompras(comprasList);
    };

    obtenerProductos();
    obtenerCompras();
  }, []);

  // Obtener el último precio de venta para un producto
  const obtenerUltimoPrecioVenta = (codigoProveedor) => {
    const comprasFiltradas = compras.filter(compra => compra.codigoProveedor === codigoProveedor);
    if (comprasFiltradas.length > 0) {
      return comprasFiltradas[0].precioVenta;
    }
    return 'No Registrado';
  };

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
      <Box display="flex"  justifyContent="" marginBottom="20px">
        <Button 
          variant={searchBy === 'codigoInterno' ? 'contained' : 'outlined'} 
          onClick={() => setSearchBy('codigoInterno')}
        >
          CÓDIGO INTERNO
        </Button>
        <Button 
          variant={searchBy === 'codigoProveedor' ? 'contained' : 'outlined'} 
          onClick={() => setSearchBy('codigoProveedor')}
        >
          CÓDIGO PROVEEDOR
        </Button>
        <Button 
          variant={searchBy === 'categoria' ? 'contained' : 'outlined'} 
          onClick={() => setSearchBy('categoria')}
        >
          CATEGORÍA
        </Button>
        <Button 
          variant={searchBy === 'marca' ? 'contained' : 'outlined'} 
          onClick={() => setSearchBy('marca')}
        >
          MARCA
        </Button>
        <Button 
          variant={searchBy === 'descripcion' ? 'contained' : 'outlined'} 
          onClick={() => setSearchBy('descripcion')}
        >
          DESCRIPCIÓN
        </Button>
        <Button 
          variant={searchBy === 'ubicacion' ? 'contained' : 'outlined'} 
          onClick={() => setSearchBy('ubicacion')}
        >
          UBICACIÓN
        </Button>
      </Box>
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
                  <TableCell>{obtenerUltimoPrecioVenta(producto.proveedores[0])}</TableCell>
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
