# 💳 Payment Integration Setup Guide

## 🎮 V Magic Cube - Payment Gateway Integration

Your V Magic Cube app now supports payments through **GPay**, **Paytm**, **PhonePe**, and all major Indian payment methods** using Razorpay!

## 🚀 Quick Setup

### 1. **Get Razorpay API Keys**

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up/Login to your account
3. Go to **Settings** → **API Keys**
4. Generate a new key pair
5. Copy your **Key ID** and **Key Secret**

### 2. **Configure Environment Variables**

Create a `.env` file in your project root:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE

# Server Configuration
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. **Install Dependencies**

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install
```

### 4. **Start the Application**

```bash
# Start both server and client
npm run dev
```

## 💰 Payment Plans Available

### **Basic Plan** - ₹99
- Access to 5 games
- Basic leaderboard
- Ad-free experience for 30 days

### **Premium Plan** - ₹299 ⭐ (Most Popular)
- Access to all 12 games
- Advanced leaderboard
- Ad-free experience for 90 days
- Exclusive game themes
- Priority customer support

### **Pro Plan** - ₹599
- Access to all games + future releases
- Global leaderboard
- Lifetime ad-free experience
- Exclusive game themes
- Priority customer support
- Early access to new features

## 🔧 How to Use Payment Components

### **Payment Button Component**

```jsx
import PaymentButton from './components/PaymentButton';

// Basic usage
<PaymentButton />

// Custom styling
<PaymentButton 
  variant="secondary" 
  size="large"
  onPaymentSuccess={(plan) => console.log('Payment successful:', plan)}
>
  Upgrade Now!
</PaymentButton>
```

### **Payment Plans Modal**

```jsx
import PaymentPlans from './components/PaymentPlans';

<PaymentPlans 
  onClose={() => setShowModal(false)}
  onPaymentSuccess={(plan) => handlePaymentSuccess(plan)}
/>
```

## 🎯 Supported Payment Methods

- **UPI Apps**: GPay, Paytm, PhonePe, BHIM
- **Cards**: Credit/Debit cards (Visa, MasterCard, RuPay)
- **Net Banking**: All major Indian banks
- **Wallets**: Paytm, PhonePe, Amazon Pay
- **EMI**: Available on credit cards

## 🔒 Security Features

- ✅ **PCI DSS Compliant** - Razorpay is certified
- ✅ **256-bit SSL Encryption** - All data encrypted
- ✅ **Two-Factor Authentication** - Secure payments
- ✅ **Fraud Detection** - Advanced security measures
- ✅ **Payment Verification** - Server-side verification

## 📱 Testing

### **Test Cards for Development**

```javascript
// Test Card Details
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
Name: Any name
```

### **Test UPI IDs**

```
gpay@razorpay
paytm@razorpay
phonepe@razorpay
```

## 🚀 Production Deployment

### **1. Update Environment Variables**

```env
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
NODE_ENV=production
```

### **2. Deploy Backend**

```bash
# Deploy to Railway/Render/Heroku
npm run build
npm start
```

### **3. Deploy Frontend**

```bash
# Deploy to Vercel/Netlify
cd client
npm run build
```

## 📊 Payment Analytics

Monitor your payments in the Razorpay Dashboard:

- **Transaction History**
- **Payment Analytics**
- **Refund Management**
- **Settlement Reports**

## 🆘 Support

### **Common Issues**

1. **Payment Failed**
   - Check API keys are correct
   - Verify amount is in paise (multiply by 100)
   - Check network connectivity

2. **Modal Not Opening**
   - Ensure Razorpay script is loaded
   - Check browser console for errors

3. **Verification Failed**
   - Verify webhook signature
   - Check server logs for errors

### **Contact Support**

- **Razorpay Support**: [support.razorpay.com](https://support.razorpay.com)
- **Email**: support@razorpay.com
- **Phone**: 1800-123-4567

## 🎉 Congratulations!

Your V Magic Cube app now has a complete payment system! Users can:

- ✅ Choose from 3 premium plans
- ✅ Pay with GPay, Paytm, PhonePe, and more
- ✅ Enjoy secure, verified payments
- ✅ Get instant access to premium features

**Start monetizing your gaming app today! 🎮💰** 