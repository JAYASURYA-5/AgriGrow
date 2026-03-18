import React, { useContext, useState } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Grid, TextField, FormControlLabel, Checkbox, Radio, RadioGroup } from '@mui/material';
import { CartContext } from '../context/CartContext';
import { OrderContext } from '../context/OrderContext';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { addOrder } = useContext(OrderContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    agreeTerms: false,
    paymentMethod: 'qr', // 'qr' or 'cod'
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const totalPrice = getTotalPrice();

  if (cart.length === 0 && !orderPlaced) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            🛒 Your cart is empty
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ fontSize: '1.1rem' }}>
            Add some products to your cart before checking out.
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

  if (orderPlaced) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, bgcolor: '#e8f5e9', p: 4, borderRadius: '12px', border: '2px solid #4caf50' }}>
            <Typography variant="h2" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 2 }}>
              ✅ Order Placed Successfully!
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ fontSize: '1.1rem', mb: 2 }}>
              Thank you for your purchase! Your order has been confirmed.
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Payment Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
                    💳 Payment Details & Amount
                  </Typography>
                  
                  {/* Amount Box */}
                  <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: '8px', textAlign: 'center', mb: 3, border: '2px solid #ff9800' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Amount to Pay
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                      ₹{(placedOrder?.total || 0).toFixed(2)}
                    </Typography>
                  </Box>

                  {/* Card Details Info */}
                  <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: '8px', mb: 2, border: '1px solid #4caf50' }}>
                    <Typography variant="body2" sx={{ color: '#1b5e20', fontWeight: 'bold', mb: 1.5 }}>
                      Payment Account Details
                    </Typography>
                    <Box sx={{ mb: 1, pb: 1, borderBottom: '1px solid rgba(46,125,50,0.2)' }}>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        <strong>Payment Method:</strong> UPI / Bank Transfer
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1, pb: 1, borderBottom: '1px solid rgba(46,125,50,0.2)' }}>
                      <Typography variant="caption" sx={{ color: '#2e7d32', wordBreak: 'break-all' }}>
                        <strong>UPI ID:</strong> kumarmnnaveen384@okhdfcbank
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1, pb: 1, borderBottom: '1px solid rgba(46,125,50,0.2)' }}>
                      <Typography variant="caption" sx={{ color: '#2e7d32' }}>
                        <strong>Account:</strong> OKHDFCBank
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                        <strong>Amount:</strong> ₹{(placedOrder?.total || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    <strong>Order ID:</strong> {placedOrder?.id}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    <strong>Payment Method:</strong> {formData.paymentMethod === 'qr' ? 'UPI/QR Code' : 'Cash on Delivery'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    <strong>Email:</strong> {formData.email}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* QR Code Card */}
            {formData.paymentMethod === 'qr' && (
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 3 }}>
                      📱 Scan to Pay via UPI
                    </Typography>
                    
                    {/* QR Code Image */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: '8px', minHeight: '250px', alignItems: 'center' }}>
                      <img 
                        src="/qr-payment.svg" 
                        alt="UPI Payment QR Code"
                        style={{ 
                          maxWidth: '220px', 
                          height: 'auto',
                          border: '2px solid #2e7d32',
                          borderRadius: '8px',
                          padding: '10px',
                          backgroundColor: 'white'
                        }}
                      />
                    </Box>

                    {/* Payment Details */}
                    <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: '8px', mb: 2, border: '1px solid #4caf50' }}>
                      <Typography variant="body2" sx={{ color: '#1b5e20', fontWeight: 'bold', mb: 1 }}>
                        UPI Payment Details
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#2e7d32', mb: 1, wordBreak: 'break-all' }}>
                        <strong>UPI ID:</strong> kumarmnnaveen384@okhdfcbank
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#2e7d32' }}>
                        <strong>Amount to Pay:</strong> ₹{(placedOrder?.total || 0).toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: '#666', mb: 2, fontWeight: '500' }}>
                      Scan this QR code with any UPI app (Google Pay, PhonePe, Paytm, BHIM, etc.) to complete payment
                    </Typography>
                    
                    <Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 1 }}>
                      Order ID: {placedOrder?.id}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      Reference Amount: ₹{(placedOrder?.total || 0).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Cash on Delivery Info */}
            {formData.paymentMethod === 'cod' && (
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid rgba(76, 175, 50, 0.2)', bgcolor: '#fafafa' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
                      🚚 Cash on Delivery
                    </Typography>
                    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px', mb: 2, border: '1px solid #ddd' }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        ✓ Pay when your order arrives
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        ✓ No prepayment required
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        ✓ Our delivery agent will collect payment at your door
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#1b5e20', fontWeight: 'bold' }}>
                      Amount to pay on delivery:
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                      ₹{(placedOrder?.total || 0).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              component={Link}
              to="/eco/orders"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                fontWeight: 'bold',
              }}
            >
              📦 View Orders
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderColor: '#2e7d32',
                color: '#2e7d32',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#e8f5e9' },
              }}
            >
              🏠 Back to Home
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to={`/eco/products${localStorage.getItem('lastCategory') ? `?category=${encodeURIComponent(localStorage.getItem('lastCategory'))}` : ''}`}
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderColor: '#2e7d32',
                color: '#2e7d32',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#e8f5e9' },
              }}
            >
              🛍️ Continue Shopping
            </Button>
          </Box>
        </Container>
      );
    }

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      alert('Please fill in all required fields');
      return;
    }

    if (!formData.agreeTerms) {
      alert('Please agree to terms and conditions');
      return;
    }

    // Calculate total before clearing cart
    const currentTotal = getTotalPrice();

    // Add order to OrderContext
    const order = addOrder({
      items: cart.length,
      total: currentTotal,
      products: cart,
      paymentMethod: formData.paymentMethod
    });

    // Store placed order with total for display
    setPlacedOrder({ ...order, total: currentTotal });

    // Simulate order processing
    setOrderPlaced(true);
    clearCart();
  };

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 4 }}>
          🛒 Checkout
        </Typography>

        <Grid container spacing={3}>
          {/* Left Column - Shipping Form */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 3, fontSize: '1.3rem' }}>
                  📦 Shipping Information
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name *"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#2e7d32' },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name *"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#2e7d32' },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email *"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#2e7d32' },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#2e7d32' },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address *"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#2e7d32' },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City *"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#2e7d32' },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="State *"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#2e7d32' },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="ZIP Code *"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#2e7d32' },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                          sx={{
                            color: '#2e7d32',
                            '&.Mui-checked': { color: '#2e7d32' },
                          }}
                        />
                      }
                      label="I agree to the terms and conditions"
                      sx={{ color: '#333', fontWeight: '500' }}
                    />
                  </Box>

                  {/* Payment Method Selection */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
                      💳 Select Payment Method
                    </Typography>
                    <RadioGroup
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                    >
                      <Card sx={{ mb: 2, border: formData.paymentMethod === 'qr' ? '2px solid #2e7d32' : '1px solid #ddd' }}>
                        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Radio value="qr" sx={{ color: '#2e7d32', '&.Mui-checked': { color: '#2e7d32' } }} />
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                              📱 UPI / QR Code Payment
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Scan QR code with any UPI app to complete payment
                            </Typography>
                          </Box>
                        </Box>
                      </Card>

                      <Card sx={{ border: formData.paymentMethod === 'cod' ? '2px solid #2e7d32' : '1px solid #ddd' }}>
                        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Radio value="cod" sx={{ color: '#2e7d32', '&.Mui-checked': { color: '#2e7d32' } }} />
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                              🚚 Cash on Delivery
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pay when your order arrives at your doorstep
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </RadioGroup>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      type="submit"
                      sx={{
                        flex: 1,
                        background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                        fontWeight: 'bold',
                        py: 1.5,
                        fontSize: '1rem',
                      }}
                    >
                      💳 Place Order
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={Link}
                      to="/eco/cart"
                      sx={{
                        flex: 1,
                        borderColor: '#2e7d32',
                        color: '#2e7d32',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#e8f5e9' },
                        py: 1.5,
                      }}
                    >
                      Back to Cart
                    </Button>
                  </Box>
                </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Order Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: 20, background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
                💳 Order Summary
              </Typography>

              <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: '600', mb: 1.5 }}>
                  📦 Items ({cart.length})
                </Typography>
                {cart.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                      {item.name} <span style={{ color: '#999' }}>x{item.quantity}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: '2px solid #4caf50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>Subtotal:</Typography>
                  <Typography variant="body2" sx={{ color: '#333' }}>₹{totalPrice.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>Shipping:</Typography>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>FREE</Typography>
                </Box>
                <Box sx={{ borderTop: '2px solid #4caf50', pt: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>Total:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>₹{totalPrice.toFixed(2)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Checkout;
