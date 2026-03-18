import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material';
import { ShoppingCart, LocalShipping, ArrowBack } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            color="inherit"
            size="small"
            onClick={() => navigate(-1)}
            sx={{ 
              '&:hover': { opacity: 0.8 },
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
            title="Go back to previous page"
          >
            <ArrowBack sx={{ fontSize: '1.2rem' }} />
          </Button>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }}
          >
            AgriEcommerce
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ '&:hover': { opacity: 0.8 } }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/eco/products"
            sx={{ '&:hover': { opacity: 0.8 } }}
          >
            Products
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/eco/orders"
            startIcon={<LocalShipping />}
            sx={{ '&:hover': { opacity: 0.8 } }}
          >
            Orders
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/eco/cart"
            sx={{ '&:hover': { opacity: 0.8 } }}
          >
            <Badge badgeContent={cartItemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
