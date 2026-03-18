import React, { useContext } from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, Chip, Button } from '@mui/material';
import { LocalShipping, CheckCircle, AccessTime } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';

const Orders = () => {
  const { orders } = useContext(OrderContext);

  const getStatusIcon = (status) => {
    if (status === 'Delivered') return <CheckCircle sx={{ color: '#4caf50', fontSize: '2rem' }} />;
    if (status === 'In Transit') return <LocalShipping sx={{ color: '#2196f3', fontSize: '2rem' }} />;
    return <AccessTime sx={{ color: '#ff9800', fontSize: '2rem' }} />;
  };

  const getStatusColor = (status) => {
    if (status === 'Delivered') return 'success';
    if (status === 'In Transit') return 'info';
    return 'warning';
  };

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: 'bold',
            color: '#2e7d32',
            mb: 1,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          📦 My Orders
        </Typography>
        <Box sx={{ height: '4px', width: '100px', bgcolor: '#66bb6a', mx: 'auto', mb: 6, borderRadius: '2px' }} />

        {orders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 2 }}>
              📭 No orders yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start shopping to place your first order!
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                px: 4,
                py: 1.2,
                fontWeight: 'bold'
              }}
              href={`/eco/products${localStorage.getItem('lastCategory') ? `?category=${encodeURIComponent(localStorage.getItem('lastCategory'))}` : ''}`}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} md={6} lg={4} key={order.id}>
                <Card
                  sx={{
                    height: '100%',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 32px rgba(46, 125, 50, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                          {order.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {getStatusIcon(order.status)}
                      </Box>
                    </Box>

                    <Box sx={{ my: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Items: <strong>{order.items}</strong>
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                        ₹{order.total.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        variant="outlined"
                        sx={{
                          fontWeight: 'bold',
                          textTransform: 'capitalize'
                        }}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        component={RouterLink}
                        to={`/eco/orders/${order.id}`}
                        sx={{
                          color: '#2e7d32',
                          borderColor: '#2e7d32',
                          '&:hover': {
                            borderColor: '#1b5e20',
                            bgcolor: 'rgba(46, 125, 50, 0.05)'
                          }
                        }}
                      >
                        Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Orders;
