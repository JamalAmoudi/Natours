const mongoose = require('mongoose');
const dotenv = require('dotenv');

// process.on('uncaughtException', err => {
//     console.log('UNCAUGHT EXCEPTION! Shuting down...');
//     console.log(err.name, err.message);
//     process.exit(1);
// });

const app = require('./app');

dotenv.config({ path: 'config.env' });
// console.log(process.env.PORT);
// console.log(process.env);
// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const DB =
  'mongodb+srv://jamaldamoudi:ja123mal@natuorscluster.pwx0yhv.mongodb.net/natours?appName=NatuorsCluster';
mongoose.connect(DB).then(() => {
  // console.log(con.connections);
  console.log('DB connection successful!');
});

// const testTour = new Tour({
//     name: 'The Park Camper',
//     rating: 4.7,
//     price: 497
// });

// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log('ERROR:', err);
// });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) =>
  res.status(204).end(),
);

process.on('unhandledRejection', (err) => {
  console.log('UNHANDELER REJECTION! Sutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
