const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/weatherController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');


router.get('/weather', auth, role('operator', 'driver'), ctrl.getAllReadings);
router.get('/weather/:id', auth, role('operator', 'driver'), ctrl.getReadingById);
router.post('/weather', auth, role('operator'), ctrl.createReading);
router.patch('/weather/:id', auth, role('operator'), ctrl.updateReading);
router.delete('/weather/:id', auth, role('operator'), ctrl.deleteReading);


module.exports = router;
