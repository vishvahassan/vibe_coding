import React, { useState, useEffect } from 'react';
import './PaymentPlans.css';

const PaymentPlans = ({ onClose, onPaymentSuccess }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/payments/plans');
      const data = await response.json();
      setPlans(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false);
    }
  };

  const handlePayment = async (plan) => {
    setSelectedPlan(plan);
    setProcessingPayment(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: plan.price,
          currency: plan.currency,
          receipt: `v-magic-cube-${plan.id}-${Date.now()}`
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error('Failed to create order');
      }

      // Initialize Razorpay
      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'V Magic Cube',
        description: `${plan.name} - Premium Gaming Experience`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              alert('Payment successful! Welcome to V Magic Cube Premium! 🎮');
              onPaymentSuccess && onPaymentSuccess(plan);
              onClose();
            } else {
              alert('Payment verification failed. Please try again.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Gamer',
          email: 'gamer@vmagiccube.com',
          contact: '+91 9999999999'
        },
        notes: {
          address: 'V Magic Cube Gaming Studio'
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: function() {
            setProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-overlay">
        <div className="payment-modal">
          <div className="loading">Loading plans...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h2>🎮 Upgrade to Premium</h2>
          <p>Unlock all games and features with our premium plans</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="plans-container">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`plan-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="currency">₹</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/plan</span>
                </div>
              </div>

              <div className="plan-features">
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="payment-methods">
                <p>Pay with:</p>
                <div className="payment-icons">
                  <span className="payment-icon">💳</span>
                  <span className="payment-icon">🏦</span>
                  <span className="payment-icon">📱</span>
                  <span className="payment-icon">💸</span>
                </div>
                <small>GPay • Paytm • PhonePe • Cards • UPI</small>
              </div>

              <button 
                className={`upgrade-btn ${plan.popular ? 'popular-btn' : ''}`}
                onClick={() => handlePayment(plan)}
                disabled={processingPayment}
              >
                {processingPayment && selectedPlan?.id === plan.id 
                  ? 'Processing...' 
                  : `Upgrade to ${plan.name}`
                }
              </button>
            </div>
          ))}
        </div>

        <div className="payment-footer">
          <p>🔒 Secure payments powered by Razorpay</p>
          <p>💳 All major payment methods accepted</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlans; 