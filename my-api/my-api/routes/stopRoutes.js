const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stopController.js');
const auth = require('../middleware/auth');
const role = require('../middleware/role');


router.get('/stops', ctrl.getAllStops);
router.get('/stops/:id', ctrl.getStopById);
router.post('/stops', auth, role('operator'), ctrl.createStop);
router.patch('/stops/:id', auth, role('operator'), ctrl.updateStop);
router.delete('/stops/:id', auth, role('operator'), ctrl.deleteStop);

module.exports = router;
