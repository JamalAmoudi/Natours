/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

const API = `${window.location.protocol}//${window.location.host}/api/v1`;

const request = async (method, url) => {
  const res = await axios({ method, url, withCredentials: true });
  return res;
};

export const deleteTour = async (id) => {
  if (!window.confirm('Are you sure you want to delete this tour?')) return;

  try {
    await request('DELETE', `${API}/tours/${id}`);
    showAlert('success', 'Tour deleted successfully!');
    window.setTimeout(() => location.reload(), 1000);
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Could not delete tour');
  }
};

export const deleteUser = async (id) => {
  if (!window.confirm('Are you sure you want to delete this user?')) return;

  try {
    await request('DELETE', `${API}/users/${id}`);
    showAlert('success', 'User deleted successfully!');
    window.setTimeout(() => location.reload(), 1000);
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Could not delete user');
  }
};

export const deleteReview = async (id) => {
  if (!window.confirm('Are you sure you want to delete this review?')) return;

  try {
    await request('DELETE', `${API}/reviews/${id}`);
    showAlert('success', 'Review deleted successfully!');
    window.setTimeout(() => location.reload(), 1000);
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Could not delete review',
    );
  }
};

export const deleteBooking = async (id) => {
  if (!window.confirm('Are you sure you want to delete this booking?')) return;

  try {
    await request('DELETE', `${API}/bookings/${id}`);
    showAlert('success', 'Booking deleted successfully!');
    window.setTimeout(() => location.reload(), 1000);
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Could not delete booking',
    );
  }
};

export const createTour = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${API}/tours`,
      data,
      withCredentials: true,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Tour created successfully!');
      window.setTimeout(() => location.reload(), 1500);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Could not create tour');
  }
};
