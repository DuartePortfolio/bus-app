const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tripController');

router.get('/trips', ctrl.getAllTrips);
router.get('/trips/:id', ctrl.getTripById);
router.post('/trips', ctrl.createTrip);
router.post('/trips/:id/alternative_trajectories', ctrl.addAlternativeTrajectoryToTrip);
router.delete('/trips/:id/alternative_trajectories/:trajectory_id', ctrl.removeAlternativeTrajectoryFromTrip);
router.patch('/trips/:id', ctrl.updateTrip);
router.delete('/trips/:id', ctrl.deleteTrip);

module.exports = router;