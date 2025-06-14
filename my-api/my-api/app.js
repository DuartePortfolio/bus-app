require('dotenv').config();

const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // So postman lets you send data thats not raw json
app.use(cors());

const vehicleRoutes = require('./routes/vehicleRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const stopRoutes = require('./routes/stopRoutes');
const userRoutes = require('./routes/userRoutes');
const routeRoutes = require('./routes/routeRoutes');
const alternativeTrajectoryRoutes = require('./routes/alternativeTrajectoryRoutes');
const tripRoutes = require('./routes/tripRoutes');


app.use('/api', vehicleRoutes);
app.use('/api', weatherRoutes);
app.use('/api', stopRoutes);
app.use('/api', userRoutes);
app.use('/api', routeRoutes);
app.use('/api', alternativeTrajectoryRoutes);
app.use('/api', tripRoutes);






app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;