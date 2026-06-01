// const fs = require('fs');
const Tour = require('../models/tourModel');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// When it's a mix of one and multiple files
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

// When it's one field  ===> req.file
// upload.sigle('image')

// If we have just one field that accept multiple files ===> req.files
// upload.array('image', 5)

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover Image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`starter/public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${1 + i}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`starter/public/img/tours/${filename}`);

      req.body.images.push(filename);
    }),
  );
  next();
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: "fail",
//             message: "Messing name or price!"
//         });
//     }
//     next();
// }

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   res.status(200).json({
//     status: 'success',
//     reults: tours.length,
//     data: {
//       tours,
//     },
//   });
//   // try {
//   //     // BUILD QUERY
//   //     // // 1A) Filtering
//   //     // const queryObj = {...req.query};
//   //     // const excludeFields = ['page' , 'sort' , 'limit' , 'fields' ];
//   //     // excludeFields.forEach(el=> delete queryObj[el]);

//   //     // // console.log(req.query, queryObj);

//   //     // //1B) Advanced filtering
//   //     // let queryStr = JSON.stringify(queryObj);
//   //     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//   //     // // g - mean that the queryStr may have more than one of (gte|gt|lte|lt)

//   //     // console.log(JSON.parse(queryStr));

//   //     // let query = Tour.find(JSON.parse(queryStr));

//   //     // 2) Sorting
//   //     // if(req.query.sort) {
//   //     //     const sortBy = req.query.sort.split(',').join(' ');
//   //     //     console.log(sortBy);
//   //     //     query = query.sort(sortBy);
//   //     // } else{
//   //     //     // query = query.sort('-createdAt');
//   //     //     console.log('hi there');
//   //     // }

//   //     // 3) Field Limitting
//   //     // if(req.query.fields){
//   //     //     const fields = req.query.fields.split(',').join(' ');

//   //     //     query = query.select(fields);
//   //     // } else {
//   //     //     query = query.select('-__v');
//   //     // }

//   //     // 4) Pagination
//   //     // const page = req.query.page * 1 || 1;
//   //     // const limit = req.query.limit * 1 || 100;
//   //     // const skip = (page - 1) * limit;

//   //     // // page=3&limit=10, 1-10 => page1 , 11-20 => page2 ...etc;
//   //     // query = query.skip(skip).limit(limit);

//   //     // if(req.query.page){
//   //     //     const numTours = await Tour.countDocuments();
//   //     //     if(skip >= numTours) throw new Error('This page does not exist');
//   //     // }

//   //     // EXECUTE QUERY
//   //     const features = new APIFeatures(Tour.find(), req.query)
//   //         .filter()
//   //         .sort()
//   //         .limitFields()
//   //         .paginate();
//   //     const tours = await features.query;

//   //     // const query = Tour.find()
//   //     // .where('duration')
//   //     // .equals(5)
//   //     // .where('difficulty')
//   //     // .equals('easy');

//   //     // SEND RESPONSE

//   //     res.status(200).json({
//   //         status: 'success',
//   //         reults: tours.length,
//   //         data: {
//   //             tours,
//   //         },
//   //     });
//   // } catch (err) {
//   //     res.status(404).json({
//   //         status: 'fail',
//   //         message: err,
//   //     });
//   // }
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // tour.findOne({ _id : req.params.id });
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });

//   // try {
//   //     const tour = await Tour.findById(req.params.id);
//   //     // tour.findOne({ _id : req.params.id });

//   //     res.status(200).json({
//   //         status: 'success',
//   //         data: {
//   //             tour,
//   //         },
//   //     });
//   // } catch (err) {
//   //     res.status(400).json({
//   //         status: 'fail',
//   //         message: err
//   //     });
//   // }
// });

// exports.creatTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   //201 mean that the obj. was created successfuly
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });

//   // try {
//   // const newTour = new Tour({})
//   // newTour.save()
//   // const newTour = await Tour.create(req.body);

//   // //201 mean that the obj. was created successfuly
//   // res.status(201).json({
//   //     status: 'success',
//   //     data: {
//   //         tour: newTour,
//   //     },
//   // });
//   // } catch (err) {
//   //     res.status(400).json({
//   //         status: 'fail',
//   //         message: 'Invalid data sent!',
//   //     });
//   // }
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });

//   // try {
//   //     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//   //         new: true,
//   //         runValidators: true,
//   //     });
//   //     res.status(200).json({
//   //         status: 'success',
//   //         data: {
//   //             tour,
//   //         },
//   //     });
//   // } catch (err) {
//   //     res.status(400).json({
//   //         status: 'fail',
//   //         message: err,
//   //     });
//   // }
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });

//   // try {
//   //     await Tour.findByIdAndDelete(req.params.id);

//   //     res.status(204).json({
//   //         status: 'success',
//   //         data: null,
//   //     });
//   // } catch (err) {
//   //     res.status(404).json({
//   //         status: 'fail',
//   //         message: err,
//   //     });
//   // }
// });
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.creatTour = factory.crateOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      // 1 mean asc. // -1 mean des.
      $sort: { avgPrice: 1 },
    },
    // , {
    //     // delete 'EASY' from stats
    //     $match: { _id: { $ne: 'EASY' } }
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });

  // try {
  //     const stats = await Tour.aggregate([
  //         {
  //             $match: { ratingsAverage: { $gte: 4.5 } }
  //         }, {
  //             $group: {
  //                 _id: { $toUpper: '$difficulty' },
  //                 numTours: { $sum: 1 },
  //                 numRatings: { $sum: '$ratingsQuantity' },
  //                 avgRating: { $avg: '$ratingsAverage' },
  //                 avgPrice: { $avg: "$price" },
  //                 minPrice: { $min: '$price' },
  //                 maxPrice: { $max: '$price' }
  //             }
  //         },
  //         {
  //             // 1 mean asc. // -1 mean des.
  //             $sort: { avgPrice: 1 }
  //         }
  //         // , {
  //         //     // delete 'EASY' from stats
  //         //     $match: { _id: { $ne: 'EASY' } }
  //         // }
  //     ]);
  //     res.status(200).json({
  //         status: 'success',
  //         data: {
  //             stats
  //         }
  //     });

  // } catch (err) {
  //     res.status(404).json({
  //         status: 'fail',
  //         message: err,
  //     });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      // devide object in many parts as '$startDates'
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numToursStarts: -1 },
    },
    {
      // it's not helpfule here
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });

  // try {
  //     const year = req.params.year * 1;
  //     const plan = await Tour.aggregate([
  //         {
  //             // devide object in many parts as '$startDates'
  //             $unwind: '$startDates'
  //         },
  //         {
  //             $match: {
  //                 startDates: {
  //                     $gte: new Date(`${year}-01-01`),
  //                     $lte: new Date(`${year}-12-31`)
  //                 }
  //             }
  //         },
  //         {
  //             $group: {
  //                 _id: { $month: '$startDates' },
  //                 numToursStarts: { $sum: 1 },
  //                 tours: { $push: '$name' }
  //             }
  //         },
  //         {
  //             $addFields: { month: '$_id' }
  //         },
  //         {
  //             $project: {
  //                 _id: 0
  //             }
  //         },
  //         {

  //             $sort: { numToursStarts: -1 }

  //         },
  //         {
  //             // it's not helpfule here
  //             $limit: 12
  //         }
  //     ]);

  //     res.status(200).json({
  //         status: 'success',
  //         data: {
  //             plan
  //         }
  //     });

  // } catch (err) {
  //     res.status(404).json({
  //         status: 'fail',
  //         message: err,
  //     });
  // }
});

// exports.checkID = (req, res, next, val) => {
//     // if (req.params.id * 1 > tours.length) {
//     //     return res.status(404).json({
//     //         status: "fail",
//     //         message: "Invalid Id"
//     //     });
//     // }
//     next();
// };

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: "fail",
//             message: "Messing name or price!"
//         });
//     }
//     next();
// }

// exports.getAllTours = (req, res) => {
//     console.log(req.requestTime);
//     res.status(200).json({
//         status: 'success',
//         requestedAt: req.requestTime,
//         reults: tours.length,
//         data: {
//             tours
//         }
//     });
// };

// exports.getTour = (req, res) => {
//     console.log(req.params);

//     const id = req.params.id * 1;
//     const tour = tours.find(el => el.id === id);

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }

//     });
// };

// exports.creatTour = (req, res) => {

//     // console.log(req.body);
//     const newId = tours[tours.length - 1].id + 1;
//     const newTour = Object.assign({ id: newId }, req.body);

//     tours.push(newTour);
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(201).json({
//             status: "success",
//             data: {
//                 tour: newTour
//             }
//         })
//     })

// }

// exports.updateTour = (req, res) => {
//     res.status(200).json({
//         status: "success",
//         data: {
//             tour: '<Updated tour here...>'
//         }
//     })
// }

// exports.deleteTour = (req, res) => {
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: "fail",
//             message: "Invalid Id"
//         });
//     }

//     res.status(204).json({
//         status: "success",
//         data: null
//     })
// };

// /tours-within/:distance/center/:latlng/unit/:unit
exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitur and longitude in the format lat,lng.',
        400,
      ),
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  console.log(distance, lat, lng, unit);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

// Get Distance to Tours from point
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitur and longitude in the format lat,lng.',
        400,
      ),
    );
  }

  const distance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        neme: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distance,
    },
  });
});
