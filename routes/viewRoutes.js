const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

// router.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'The Forest Hiker',
//     user: 'Jamal',
//   });
// });

router.get(
  '/',
  bookingController.creatBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview,
);

router.get('/tour/:slug', authController.protect, viewsController.getTour);

// /login
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
// /signup
router.get('/signup', viewsController.getSignupForm);

// Account page
router.get('/me', authController.protect, viewsController.getAccount);

// My Tours page
router.get('/my-tours', authController.protect, viewsController.getMyTours);

// Admin pages
router.use(authController.protect, authController.restrictTo('admin'));

router.get('/manage-tour', viewsController.getManageTour);
router.get('/manage-user', viewsController.getManageUsers);
router.get('/manage-review', viewsController.getManageReviews);
router.get('/manage-booking', viewsController.getManageBookings);

// Without using API
// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData,
// );

module.exports = router;
