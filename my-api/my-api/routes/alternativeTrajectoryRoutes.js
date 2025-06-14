const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/altTrajectoryController');

router.get('/alternative_trajectories', ctrl.getAllAlternativeTrajectories);
router.get('/alternative_trajectories/:id', ctrl.getAlternativeTrajectoryById);
router.post('/alternative_trajectories', ctrl.createAlternativeTrajectory);
router.patch('/alternative_trajectories/:id', ctrl.updateAlternativeTrajectory);
router.delete('/alternative_trajectories/:id', ctrl.deleteAlternativeTrajectory);

module.exports = router;