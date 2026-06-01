require('dotenv').config({ path: './config.env' });

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

//__________________________________________________________________

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     [
//       "default-src 'self'",
//       "script-src 'self' https://js.stripe.com",
//       "connect-src 'self' ws://localhost:* http://localhost:* ws://127.0.0.1:* http://127.0.0.1:* https://api.stripe.com",
//       "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
//       "font-src 'self' https://fonts.gstatic.com data:",
//       "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
//       "img-src 'self' data: https:",
//     ].join('; '),
//   );
//   next();
// });
//__________________________________________________________________
//1) GLOBAL MIDDELWARES
// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//______________________________________________________
// Set security HTTP headers

//________________________________________________________
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//_________________________________________________________
// Limit requests from same API
// To privent too many requests e.g. Denial-of-service or prute-force
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

//__________________________________________________________
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//__________________________________________________________
// Data santization against NoSQL query injection
// { , } , / , \
app.use(mongoSanitize());

//__________________________________________________________
// Data santization against XSS
app.use(xss());

//__________________________________________________________
// Data parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//___________________________________________________________
// Test mideleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// app.use((req, res, next) => {
//     console.log('hello from the middleware 👋');
//     next();
// });

//_______________________________________________________________________
//2) ROUTE HANDLERS

//TOURS

//routes/tourRoutes.js

//USERS

//routes/tuserRoutes.js

// app.get('/api/v1/tours', getALlTours);
// app.post('/api/v1/tours', creatTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//_______________________________________________________________________
// 3)ROUTES

// API routes must be registered before the view router (mounted at '/'),
// otherwise unmatched paths fall through viewRouter's protect middleware.
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} in the server!`
  // })

  // const err = new Error(`Can't find ${req.originalUrl} in the server!`);

  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} in the server!`, 404));
});

app.use(globalErrorHandler);

//_______________________________________________________________________
// 4) START SERVER
//on server.js

module.exports = app;
