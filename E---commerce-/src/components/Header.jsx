import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material';
import { ShoppingCart, LocalShipping } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { cart } = useContext(CartContext);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
            to="/products"
            sx={{ '&:hover': { opacity: 0.8 } }}
          >
            Products
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/orders"
            startIcon={<LocalShipping />}
            sx={{ '&:hover': { opacity: 0.8 } }}
          >
            Orders
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/cart"
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
