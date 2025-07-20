export const routes = {
  getProducts: () => "stripe/products",
  checkoutSession: () => "stripe/create-checkout-session",
  retrieveCheckoutSession: (sessionId: string) => `stripe/retrieve-checkout-session/${sessionId}`,
  paymentStatus: (sessionId: string) => `stripe/payment-status/${sessionId}`,
};
