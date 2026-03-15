import React, { useContext } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, Card, CardContent, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { OrderContext } from '../context/OrderContext';

const OrderDetails = () => {
  const { orderId } = useParams();
  const { orders } = useContext(OrderContext);
  const navigate = useNavigate();

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 3 }}>
          📭 Order not found
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
          sx={{
            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
            px: 4,
            py: 1.2,
            fontWeight: 'bold'
          }}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/orders')}
            sx={{
              color: '#2e7d32',
              fontWeight: 'bold',
              '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.1)' }
            }}
          >
            Back
          </Button>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: '#2e7d32',
              fontSize: { xs: '1.8rem', md: '2.5rem' }
            }}
          >
            Order Details
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Order Summary Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
                  Order Information
                </Typography>

                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Order ID
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {order.id}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Order Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Status
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 'bold',
                      color: order.status === 'Delivered' ? '#4caf50' : order.status === 'In Transit' ? '#2196f3' : '#ff9800'
                    }}
                  >
                    {order.status}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Total Items
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {order.items}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary Card - Price */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '1px solid rgba(76, 175, 80, 0.2)',
                background: 'linear-gradient(135deg, #f0f7f4 0%, #e8f5e9 100%)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 3 }}>
                  Order Summary
                </Typography>

                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid rgba(46, 125, 50, 0.2)' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Subtotal
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: '600' }}>
                    ₹{order.total.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid rgba(46, 125, 50, 0.2)' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Shipping
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: '600', color: '#4caf50' }}>
                    FREE
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Grand Total
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: '#ff9800',
                      fontSize: '1.8rem'
                    }}
                  >
                    ₹{order.total.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Tracking Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 3 }}>
                  Order Tracking
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: '600' }}>
                      Order Placed
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: order.status === 'In Transit' || order.status === 'Delivered' ? '#2196f3' : '#e0e0e0'
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: order.status === 'In Transit' || order.status === 'Delivered' ? '#2196f3' : '#999',
                        fontWeight: '600'
                      }}
                    >
                      In Transit
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: order.status === 'Delivered' ? '#4caf50' : '#e0e0e0'
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: order.status === 'Delivered' ? '#4caf50' : '#999',
                        fontWeight: '600'
                      }}
                    >
                      Delivered
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Products Table */}
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 3 }}>
                  Products Ordered
                </Typography>

                <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: '#1b5e20' }}>Product</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                          Quantity
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                          Price
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.products && order.products.map((product) => (
                        <TableRow key={product.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box
                                component="img"
                                src={product.image}
                                alt={product.name}
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: '8px',
                                  objectFit: 'cover'
                                }}
                              />
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: '600', color: '#2e7d32' }}>
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  SKU: {product.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: '600' }}>
                              {product.quantity}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: '600' }}>
                              ₹{product.price.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                              ₹{(product.price * product.quantity).toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer Buttons */}
        <Box sx={{ mt: 6, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            component={RouterLink}
            to="/products"
            sx={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
              px: 4,
              py: 1.2,
              fontWeight: 'bold'
            }}
          >
            Continue Shopping
          </Button>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/orders"
            sx={{
              color: '#2e7d32',
              borderColor: '#2e7d32',
              px: 4,
              py: 1.2,
              fontWeight: 'bold',
              '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.05)' }
            }}
          >
            Back to Orders
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default OrderDetails;
