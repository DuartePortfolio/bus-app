const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/vehicleController');

router.get('/vehicles', ctrl.getAllVehicles);
router.get('/vehicles/:id', ctrl.getVehicleById);
router.post('/vehicles', ctrl.createVehicle);
router.patch('/vehicles/:id', ctrl.updateVehicle);
router.delete('/vehicles/:id', ctrl.deleteVehicle);

module.exports = router;
