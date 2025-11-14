import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';

function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px - 64px)',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Typography variant="h3" component="h1" color="primary" fontWeight="bold" gutterBottom>
        Welcome to Smart Inventory
      </Typography>
      <Typography variant="h6" component="p" color="text.secondary" align="center" maxWidth="600px" mb={4}>
        Manage your products and orders efficiently with our modern and intuitive dashboard.
      </Typography>

      <Grid container spacing={4} justifyContent="center" maxWidth="800px">
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)' },
            }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, px: 2 }}>
              <Inventory2Icon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" align="center" gutterBottom>
                Manage Products
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                View, add, edit, and delete products in your inventory.
              </Typography>
            </CardContent>
            <Button 
              component={RouterLink} 
              to="/products" 
              variant="contained" 
              color="primary" 
              fullWidth
              sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
            >
              Go to Products
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)' },
            }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, px: 2 }}>
              <ShoppingCartIcon color="secondary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" align="center" gutterBottom>
                Manage Orders
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Track, create, and update customer orders.
              </Typography>
            </CardContent>
            <Button 
              component={RouterLink} 
              to="/orders" 
              variant="contained" 
              color="secondary" 
              fullWidth
              sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
            >
              Go to Orders
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
