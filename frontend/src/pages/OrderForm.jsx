import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import api from '../api/api';
import { getOrderById, createOrder, updateOrder } from '../api/orders';
import { getProducts as fetchAvailableProducts } from '../api/products';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SaveIcon from '@mui/icons-material/Save';

function OrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState({
    products: [],
    totalAmount: 0,
    status: 'pending',
  });
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchAvailableProducts();
        setAvailableProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch available products:', err);
        setError('Failed to load products for order selection');
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          setFormLoading(true);
          const response = await getOrderById(id);
          const fetchedOrder = response.data;

          const mappedProducts = fetchedOrder.products.map(item => ({
            product: item.product, 
            quantity: item.quantity,
            price: item.unitPrice,
          }));

          setOrderData({
            products: mappedProducts,
            totalAmount: fetchedOrder.totalAmount,
            status: fetchedOrder.status,
          });
          setFormLoading(false);
        } catch (err) {
          console.error('Failed to fetch order for editing:', err);
          setError(err.response?.data?.message || 'Failed to load order');
          setFormLoading(false);
          navigate('/orders');
        }
      };
      fetchOrder();
    } else {
      setOrderData({
        products: [],
        totalAmount: 0,
        status: 'pending',
      });
      setFormLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    const newTotal = orderData.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setOrderData(prevData => ({ ...prevData, totalAmount: newTotal }));
  }, [orderData.products]);

  const handleProductSelect = (e) => {
    setSelectedProductId(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setSelectedQuantity(parseInt(e.target.value, 10));
  };

  const addProductToOrder = () => {
    const productToAdd = availableProducts.find(p => p._id === selectedProductId);
    if (productToAdd && selectedQuantity > 0) {
      const existingProductIndex = orderData.products.findIndex(item => item.product._id === productToAdd._id);

      if (existingProductIndex > -1) {
        const updatedProducts = [...orderData.products];
        updatedProducts[existingProductIndex].quantity += selectedQuantity;
        setOrderData(prevData => ({ ...prevData, products: updatedProducts }));
      } else {
        setOrderData((prevData) => ({
          ...prevData,
          products: [
            ...prevData.products,
            { product: productToAdd, quantity: selectedQuantity, price: productToAdd.price },
          ],
        }));
      }
      setSelectedQuantity(1);
      setSelectedProductId(''); // Clear selected product after adding
    }
  };

  const removeProductFromOrder = (productId) => {
    setOrderData((prevData) => ({
      ...prevData,
      products: prevData.products.filter(item => item.product._id !== productId),
    }));
  };

  const handleStatusChange = (e) => {
    setOrderData((prevData) => ({ ...prevData, status: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const productsForApi = orderData.products.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      unitPrice: item.price,
    }));

    try {
      const orderToSend = { ...orderData, products: productsForApi };

      if (id) {
        await updateOrder(id, orderToSend);
        setSuccess('Order updated successfully!');
      } else {
        await createOrder(orderToSend);
        setSuccess('Order added successfully!');
        setOrderData({
          products: [],
          totalAmount: 0,
          status: 'pending',
        });
      }

      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } catch (err) {
      console.error(`${id ? 'Update' : 'Add'} order failed:`, err);
      setError(err.response?.data?.message || `Failed to ${id ? 'update' : 'add'} order`);
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px - 64px)',
        p: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: '12px',
          width: '100%',
          maxWidth: '700px',
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Typography variant="h4" component="h2" align="center" color="primary" fontWeight="bold" mb={4}>
          {id ? 'Edit Order' : 'Add New Order'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h6" component="h3" gutterBottom>Add Products to Order</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <FormControl fullWidth sx={{ flexGrow: 1, minWidth: '200px' }} disabled={formLoading}>
              <InputLabel id="product-select-label">Product</InputLabel>
              <Select
                labelId="product-select-label"
                id="productSelect"
                value={selectedProductId}
                label="Product"
                onChange={handleProductSelect}
                sx={{ borderRadius: '8px' }}
              >
                {availableProducts.length === 0 ? (
                  <MenuItem value="">No products available</MenuItem>
                ) : (
                  availableProducts.map(p => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.name} (Stock: {p.stock})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            <TextField
              label="Quantity"
              type="number"
              value={selectedQuantity}
              onChange={handleQuantityChange}
              inputProps={{ min: "1" }}
              sx={{ width: '100px' }}
              disabled={formLoading}
            />
            <Button 
              variant="contained" 
              onClick={addProductToOrder} 
              disabled={!selectedProductId || selectedQuantity <= 0 || formLoading}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ textTransform: 'none', borderRadius: '12px', py: 1.25, flexShrink: 0 }}
            >
              Add
            </Button>
          </Box>

          <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>Products in Order:</Typography>
          {orderData.products.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No products added yet.</Typography>
          ) : (
            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: '8px' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unit Price</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderData.products.map((item) => (
                    <TableRow key={item.product._id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="error" 
                          onClick={() => removeProductFromOrder(item.product._id)} 
                          size="small"
                          disabled={formLoading}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <FormControl fullWidth margin="normal" disabled={formLoading}>
            <InputLabel id="status-select-label">Order Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status"
              name="status"
              value={orderData.status}
              label="Order Status"
              onChange={handleStatusChange}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h6" align="right" sx={{ mt: 2, fontWeight: 'bold' }}>
            Total Amount: ${orderData.totalAmount.toFixed(2)}
          </Typography>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || orderData.products.length === 0 || formLoading}
            startIcon={<SaveIcon />}
            sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '12px' }}
          >
            {loading ? (id ? 'Updating Order...' : 'Creating Order...') : (id ? 'Update Order' : 'Create Order')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default OrderForm;
