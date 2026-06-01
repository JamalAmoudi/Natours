/* eslint-disable*/
import '@babel/polyfill';
import { login, signup, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import {
  createTour,
  deleteTour,
  deleteUser,
  deleteReview,
  deleteBooking,
} from './leaves';
// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const bookBtn = document.getElementById('book-tour');

//DELEGATION;

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    signup(name, email, password, passwordConfirm);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

const createTourForm = document.querySelector('.form--create-tour');
if (createTourForm) {
  createTourForm.addEventListener('submit', (e) => {
    e.preventDefault();
    createTour({
      name: document.getElementById('name').value,
      duration: Number(document.getElementById('duration').value),
      maxGroupSize: Number(document.getElementById('maxGroupSize').value),
      difficulty: document.getElementById('difficulty').value,
      price: Number(document.getElementById('price').value),
      summary: document.getElementById('summary').value,
      description: document.getElementById('description').value,
      imageCover: document.getElementById('imageCover').value,
      images: ['tour-1-1.jpg', 'tour-1-2.jpg', 'tour-1-3.jpg'],
      startDates: [document.getElementById('startDate').value],
      startLocation: {
        description: 'New York, USA',
        type: 'Point',
        coordinates: [-74.005974, 40.712776],
        address: 'New York, NY, USA',
      },
    });
  });
}

const userViewContent = document.querySelector('.user-view__content');
if (userViewContent) {
  userViewContent.addEventListener('click', (e) => {
    const { id } = e.target.dataset;
    if (!id) return;

    if (e.target.classList.contains('btn--delete-tour')) deleteTour(id);
    if (e.target.classList.contains('btn--delete-user')) deleteUser(id);
    if (e.target.classList.contains('btn--delete-review')) deleteReview(id);
    if (e.target.classList.contains('btn--delete-booking')) deleteBooking(id);
  });
}
