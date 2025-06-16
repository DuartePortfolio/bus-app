const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/routeController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');


router.get('/routes', ctrl.getAllRoutes);
router.get('/routes/:id', ctrl.getRouteById);
router.get('/routes/:id/stops', ctrl.getStopsOfRoute);
router.post('/routes', auth, role('operator'), ctrl.createRoute);
router.post('/routes/:id/stops', auth, role('operator'), ctrl.addStopToRoute);
router.patch('/routes/:id', auth, role('operator'), ctrl.updateRoute);
router.delete('/routes/:id', auth, role('operator'), ctrl.deleteRoute);
router.delete('/routes/:id/stops/:stop_id', auth, role('operator'), ctrl.deleteStopFromRoute);

module.exports = router;