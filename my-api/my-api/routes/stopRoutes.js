const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stopController.js');

router.get('/stops', ctrl.getAllStops);
router.get('/stops/:id', ctrl.getStopById);
router.post('/stops', ctrl.createStop);
router.patch('/stops/:id', ctrl.updateStop);
router.delete('/stops/:id', ctrl.deleteStop);

module.exports = router;
