const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/weatherController');

router.get('/weather', ctrl.getAllReadings);
router.get('/weather/:id', ctrl.getReadingById);
router.post('/weather', ctrl.createReading);
router.patch('/weather/:id', ctrl.updateReading);
router.delete('/weather/:id', ctrl.deleteReading);


module.exports = router;
