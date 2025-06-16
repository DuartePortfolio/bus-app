const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/altTrajectoryController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/alternative_trajectories', auth, role('operator', 'driver'), ctrl.getAllAlternativeTrajectories);
router.get('/alternative_trajectories/:id', auth, role('operator', 'driver'), ctrl.getAlternativeTrajectoryById);
router.post('/alternative_trajectories', auth, role('operator'), ctrl.createAlternativeTrajectory);
router.patch('/alternative_trajectories/:id', auth, role('operator'), ctrl.updateAlternativeTrajectory);
router.delete('/alternative_trajectories/:id', auth, role('operator'), ctrl.deleteAlternativeTrajectory);

module.exports = router;