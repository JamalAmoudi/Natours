const express = require('express');
const fs = require('fs');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
//OR
// const {getAllTours, creatTour, getTour, updateTour, deleteTour} = require('./../controllers/tourController');

// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

// A MIDDELWARE FOR TOUR-ROUTES
// router.param('id', tourController.checkID);

// # CHALENG #
// Creat a checkBody middleware
// Check if body contains the name and price properity
// if not, send back 400 (bad request)
// Add it to the post handler stack

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);

router.route('/distance/:latlng/unit/:unit').get(tourController.getDistances);
// instade of: /tour-within?distance=233&center=-40,45&unit=mi
// use this:  /tour-within/distance/233/center/-40,45/unit/mi
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.creatTour,
  );

// .post(tourController.checkBody, tourController.creatTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

// Nested Routes
// POST /tour/234tksewl/reviews
// GET /tour/234tksewl/reviews
// GET /tour/234tksewl/reviews/984odlafea

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.creatReview,
//   );

module.exports = router;
