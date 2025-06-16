const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/vehicleController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');


router.get('/vehicles', auth, role('operator', 'driver'), ctrl.getAllVehicles);
router.get('/vehicles/:id', auth, role('operator', 'driver'), ctrl.getVehicleById);
router.post('/vehicles', auth, role('operator'), ctrl.createVehicle);
router.patch('/vehicles/:id', auth, role('operator'), ctrl.updateVehicle);
router.delete('/vehicles/:id', auth, role('operator'), ctrl.deleteVehicle);

module.exports = router;
