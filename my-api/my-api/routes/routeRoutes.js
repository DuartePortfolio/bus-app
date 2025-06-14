const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/routeController');

router.get('/routes', ctrl.getAllRoutes);
router.get('/routes/:id', ctrl.getRouteById);
router.get('/routes/:id/stops', ctrl.getStopsOfRoute);
router.post('/routes', ctrl.createRoute);
router.post('/routes/:id/stops', ctrl.addStopToRoute);
router.patch('/routes/:id', ctrl.updateRoute);
router.delete('/routes/:id', ctrl.deleteRoute);
router.delete('/routes/:id/stops/:stop_id', ctrl.deleteStopFromRoute);

module.exports = router;