import axios from 'axios';
import { showAlert } from './alerts';
import { Stripe } from 'stripe';
/* eslint-disable*/
const stripe = Stripe(
  'pk_test_51RJuXQQrLpesdZyWtSWOklat1ZsGvyUNLLg1v5pn51MeyN4pdZBcJC3fD3Lnon6JxFF9SU2mnwJunGX8H3Jtp8Cy00a00a9gIM',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`,
      { withCredentials: true },
    );
    console.log(session);
    // 2) Creat checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert(
      'error',
      err.response?.data?.message ||
        'Booking failed. Please log in and try again.',
    );
  }
};
