import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, query, where } from '../firebase';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, AppBar, Toolbar, Typography, Container, TextField 
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import * as XLSX from 'xlsx';

const Reportes = () => {
  const navigate = useNavigate(); // Para navegación
  const [reportType, setReportType] = useState('compras');
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let q;

      // Logica para obtener datos de ventas
      if (reportType === 'ventas') {
        q = query(collection(db, 'ventas'));
        if (startDate && endDate) {
          q = query(
            collection(db, 'ventas'), 
            where('fecha', '>=', startDate.toISOString().split('T')[0]), 
            where('fecha', '<=', endDate.toISOString().split('T')[0])
          );
        }
        const ventasSnapshot = await getDocs(q);
        const ventasList = ventasSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        const productosSnapshot = await getDocs(collection(db, 'productos'));
        const productosList = productosSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        const combinedData = ventasList.map(venta => {
          const producto = productosList.find(p => p.proveedores && p.proveedores.includes(venta.codigoProveedor));
          return {
            codigoInterno: producto?.codigoInterno || '',
            codigoProveedor: venta.codigoProveedor,
            categoria: producto?.categoria || '',
            descripcion: producto?.descripcion || '',
            cantidad: venta.cantidad,
            fecha: venta.fecha,
            precioVenta: venta.precioVentaFinal
          };
        });

        setData(combinedData);

      // Logica para obtener datos de compras
      } else if (reportType === 'compras') {
        q = query(collection(db, 'compras'));
        if (startDate && endDate) {
          q = query(
            collection(db, 'compras'), 
            where('fecha', '>=', startDate.toISOString().split('T')[0]), 
            where('fecha', '<=', endDate.toISOString().split('T')[0])
          );
        }
        const comprasSnapshot = await getDocs(q);
        const comprasList = comprasSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        const productosSnapshot = await getDocs(collection(db, 'productos'));
        const productosList = productosSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        const combinedData = comprasList.map(compra => {
          const producto = productosList.find(p => p.proveedores && p.proveedores.includes(compra.codigoProveedor));
          return {
            codigoInterno: producto?.codigoInterno || '',
            codigoProveedor: compra.codigoProveedor,
            categoria: producto?.categoria || '',
            descripcion: producto?.descripcion || '',
            cantidad: compra.cantidad,
            precioCompra: compra.precioCompra,
            precioVenta: compra.precioVenta,
            fecha: compra.fecha
          };
        });

        setData(combinedData);

      // Logica para obtener datos de productos
      } else if (reportType === 'productos') {
        q = query(collection(db, 'productos'));
        const querySnapshot = await getDocs(q);
        const dataList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setData(dataList);
      }
    };

    fetchData();
  }, [reportType, startDate, endDate]);

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleExportExcel = () => {
    const worksheetData = data.map(item => {
      if (reportType === 'ventas') {
        return {
          'Código Interno': item.codigoInterno,
          'Código Proveedor': item.codigoProveedor,
          'Categoría': item.categoria,
          'Descripción': item.descripcion,
          'Cantidad': item.cantidad,
          'Fecha': item.fecha,
          'Precio Venta': item.precioVenta,
        };
      } else if (reportType === 'compras') {
        return {
          'Código Interno': item.codigoInterno,
          'Código Proveedor': item.codigoProveedor,
          'Categoría': item.categoria,
          'Descripción': item.descripcion,
          'Cantidad': item.cantidad,
          'Precio Compra': item.precioCompra,
          'Precio Venta': item.precioVenta,
          'Fecha': item.fecha,
        };
      } else if (reportType === 'productos') {
        return {
          'Código Interno': item.codigoInterno,
          'Código Proveedor': item.proveedores ? item.proveedores.join(', ') : '',
          'Categoría': item.categoria,
          'Marca': item.marca,
          'Descripción': item.descripcion,
          'Stock': item.stock,
          'Ubicación': item.ubicacion,
        };
      }
      return {};
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reportes');
    const fileName = `reporte_${reportType}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Sistema de Inventario</Typography>
          </Toolbar>
        </AppBar>
        <Typography variant="h4" component="h1" gutterBottom>
          Reportes
        </Typography>
        <div>
        <Button 
          variant="contained" 
          startIcon={<HomeIcon />}
          onClick={() => navigate('/home')} 
          style={{ marginLeft: '0px' }}
        >
          Menú Principal
        </Button>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}></div>
        <Button 
          variant={reportType === 'compras' ? 'contained' : 'outlined'} 
          onClick={() => setReportType('compras')}
          style={{ marginRight: '10px' }}
        >
          Compras
        </Button>
        <Button 
          variant={reportType === 'ventas' ? 'contained' : 'outlined'} 
          onClick={() => setReportType('ventas')}
          style={{ marginRight: '10px' }}
        >
          Ventas
        </Button>
        <Button 
          variant={reportType === 'productos' ? 'contained' : 'outlined'} 
          onClick={() => setReportType('productos')}
        >
          Productos
        </Button>
        
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <DatePicker
            label="Fecha Inicio"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} style={{ marginRight: '10px' }} />}
          />
          <DatePicker
            label="Fecha Fin"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <Button 
            variant="contained" 
            onClick={handleClearFilters} 
            style={{ marginLeft: '10px' }}
          >
            Limpiar Filtros
          </Button>
        </div>
        <Button 
          variant="contained" 
          onClick={handleExportExcel} 
          style={{ marginTop: '20px' }}
        >
          Exportar a Excel
        </Button>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                {reportType === 'ventas' && (
                  <>
                    <TableCell>Código Interno</TableCell>
                    <TableCell>Código Proveedor</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Precio Venta</TableCell>
                  </>
                )}
                {reportType === 'compras' && (
                  <>
                    <TableCell>Código Interno</TableCell>
                    <TableCell>Código Proveedor</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio Compra</TableCell>
                    <TableCell>Precio Venta</TableCell>
                    <TableCell>Fecha</TableCell>
                  </>
                )}
                {reportType === 'productos' && (
                  <>
                    <TableCell>Código Interno</TableCell>
                    <TableCell>Código Proveedor</TableCell>
                    <TableCell>Categoría</TableCell>  
                    <TableCell>Marca</TableCell>                  
                    <TableCell>Descripción</TableCell>                                       
                    <TableCell>Stock</TableCell>
                    <TableCell>Ubicación</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {reportType === 'ventas' && (
                    <>
                      <TableCell>{item.codigoInterno}</TableCell>
                      <TableCell>{item.codigoProveedor}</TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell>{item.descripcion}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell>{item.fecha}</TableCell>
                      <TableCell>{item.precioVenta}</TableCell>
                    </>
                  )}
                  {reportType === 'compras' && (
                    <>
                      <TableCell>{item.codigoInterno}</TableCell>
                      <TableCell>{item.codigoProveedor}</TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell>{item.descripcion}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell>{item.precioCompra}</TableCell>
                      <TableCell>{item.precioVenta}</TableCell>
                      <TableCell>{item.fecha}</TableCell>
                    </>
                  )}
                  {reportType === 'productos' && (
                    <>
                      <TableCell>{item.codigoInterno}</TableCell>
                      <TableCell>{item.proveedores ? item.proveedores.join(', ') : ''}</TableCell>
                      <TableCell>{item.categoria}</TableCell>  
                      <TableCell>{item.marca}</TableCell>                    
                      <TableCell>{item.descripcion}</TableCell>           
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>{item.ubicacion}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </LocalizationProvider>
  );
};

export default Reportes;
