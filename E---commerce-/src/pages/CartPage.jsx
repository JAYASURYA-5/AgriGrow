import React, { useContext } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Delete, Add, Remove, ShoppingCartCheckout } from '@mui/icons-material';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = getTotalPrice();

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            🛒 Your cart is empty
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ fontSize: '1.1rem' }}>
            Add some amazing agricultural products to your cart to get started!
          </Typography>
        </Box>
        <Button
          variant="contained"
          component={Link}
          to={`/eco/products${localStorage.getItem('lastCategory') ? `?category=${encodeURIComponent(localStorage.getItem('lastCategory'))}` : ''}`}
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
          }}
        >
          🌾 Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fafafa', py: 4, minHeight: '100vh' }}>

      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 4 }}>
          🛒 Shopping Cart ({cart.length} items)
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cart.map((item) => (
              <Card key={item.id} sx={{ mb: 2, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'all 0.3s', '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.12)' } }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Box
                        component="img"
                        sx={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                        src={item.image}
                      alt={item.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 0.5 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: '600', fontSize: '1.1rem' }}>
                      ₹{item.price.toFixed(2)} each
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f5f5f5', borderRadius: '8px', p: 0.5, width: 'fit-content' }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        sx={{ '&:hover': { bgcolor: '#e8f5e9' } }}
                      >
                        <Remove sx={{ fontSize: '18px', color: '#2e7d32' }} />
                      </IconButton>
                      <Typography sx={{ px: 1, fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        sx={{ '&:hover': { bgcolor: '#e8f5e9' } }}
                      >
                        <Add sx={{ fontSize: '18px', color: '#2e7d32' }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                        sx={{ ml: 1 }}
                      >
                        <Delete sx={{ fontSize: '18px' }} />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: '#1b5e20' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
                💳 Order Summary
              </Typography>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', p: 2, borderRadius: '8px', mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography sx={{ color: '#555' }}>Items:</Typography>
                  <Typography sx={{ fontWeight: '600', color: '#333' }}>{cart.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography sx={{ color: '#555' }}>Subtotal:</Typography>
                  <Typography sx={{ fontWeight: '600', color: '#333' }}>₹{totalPrice.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography sx={{ color: '#555' }}>Shipping:</Typography>
                  <Typography sx={{ fontWeight: '600', color: '#4caf50' }}>FREE</Typography>
                </Box>
                <Box sx={{ borderTop: '2px solid #4caf50', pt: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>Total:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>₹{totalPrice.toFixed(2)}</Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ShoppingCartCheckout />}
                onClick={() => navigate('/eco/checkout')}
                sx={{
                  background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                  mb: 1.5,
                  fontWeight: 'bold',
                  py: 1.5,
                  fontSize: '1rem',
                }}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to={`/eco/products${localStorage.getItem('lastCategory') ? `?category=${encodeURIComponent(localStorage.getItem('lastCategory'))}` : ''}`}
                sx={{
                  borderColor: '#2e7d32',
                  color: '#2e7d32',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#e8f5e9' },
                  py: 1.2,
                }}
              >
                Continue Shopping 🛍️
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
    </Box>
  );
};

export default CartPage;
