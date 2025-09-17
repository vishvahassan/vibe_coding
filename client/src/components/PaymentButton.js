import React, { useState } from 'react';
import PaymentPlans from './PaymentPlans';
import './PaymentButton.css';

const PaymentButton = ({ 
  children = "Upgrade to Premium", 
  variant = "primary", 
  size = "medium",
  className = "",
  onPaymentSuccess 
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePaymentSuccess = (plan) => {
    onPaymentSuccess && onPaymentSuccess(plan);
    // You can add additional logic here like updating user state
    console.log('Payment successful for plan:', plan);
  };

  return (
    <>
      <button
        className={`payment-button ${variant} ${size} ${className}`}
        onClick={() => setShowPaymentModal(true)}
      >
        {children}
      </button>

      {showPaymentModal && (
        <PaymentPlans
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default PaymentButton; 