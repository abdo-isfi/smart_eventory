import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../api/api';
import { deleteOrder } from '../api/orders';
import {
  Box,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  // Removed TablePagination
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Removed page and rowsPerPage states
  const theme = useTheme();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/orders'); // Removed page and limit params
      setOrders(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Removed page and rowsPerPage from dependency array

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await deleteOrder(id);
        setOrders(prevOrders => prevOrders.filter(order => order._id !== id));
        setError(null);
      } catch (err) {
        console.error('Failed to cancel order:', err);
        setError(err.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  // Removed handleChangePage and handleChangeRowsPerPage functions

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '800px', mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" component="h2" color="primary" fontWeight="bold">
          Orders
        </Typography>
        <Button 
          component={RouterLink} 
          to="/orders/add" 
          variant="contained" 
          startIcon={<AddIcon />} 
          color="secondary"
          sx={{ textTransform: 'none', px: 3, py: 1, fontSize: '1rem', minWidth: { xs: '100%', sm: 'auto' } }}
        >
          Add Order
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: '800px' }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden', width: '100%', maxWidth: '800px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>No orders found.</TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <TableRow 
                  key={order._id} 
                  hover
                  sx={{
                    bgcolor: index % 2 === 0 ? 'background.paper' : theme.palette.grey[50],
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell>{order._id}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      component={RouterLink} 
                      to={`/orders/edit/${order._id}`} 
                      variant="outlined" 
                      startIcon={<EditIcon />} 
                      size="small" 
                      sx={{ mr: 1, textTransform: 'none', borderRadius: '8px' }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<DeleteIcon />} 
                      size="small" 
                      color="error" 
                      onClick={() => handleDeleteOrder(order._id)}
                      sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Removed TablePagination */}
      </TableContainer>
    </Box>
  );
}

export default Orders;

