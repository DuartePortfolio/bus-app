const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tripController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');


router.get('/trips', auth, role('operator', 'driver'), ctrl.getAllTrips);
router.get('/trips/:id', auth, role('operator', 'driver'), ctrl.getTripById);
router.post('/trips', auth, role('operator'), ctrl.createTrip);
router.post('/trips/:id/alternative_trajectories', auth, role('operator'), ctrl.addAlternativeTrajectoryToTrip);
router.delete('/trips/:id/alternative_trajectories/:trajectory_id', auth, role('operator'), ctrl.removeAlternativeTrajectoryFromTrip);
router.patch('/trips/:id', auth, role('operator'), ctrl.updateTrip);
router.delete('/trips/:id', auth, role('operator'), ctrl.deleteTrip);

module.exports = router;