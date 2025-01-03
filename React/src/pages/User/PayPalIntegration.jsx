import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID =
  "ASr3VDLf54GJNJEycXj7upC2dnAFaKxwhqg76d8AY5PYpJl98MZVNMOv1WHqOlSp6RAmN4-3Sw3cV2vG";

const PayPalIntegration = ({ totalAmount, handlePaymentSuccess }) => {
  // Kiểm tra xem hàm handlePaymentSuccess có tồn tại không.
  if (typeof handlePaymentSuccess !== "function") {
    console.error("handlePaymentSuccess is not a function");
    return null;
  }

  return (
    <div className="paypal-container">
      <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalAmount.toFixed(2),
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            return actions.order.capture().then((details) => {
              handlePaymentSuccess(details); // Gọi handlePaymentSuccess khi thanh toán thành công
            });
          }}
          onError={(err) => {
            console.error("PayPal Checkout error:", err);
            alert(
              "An error occurred during the payment process. Please try again."
            );
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalIntegration;
