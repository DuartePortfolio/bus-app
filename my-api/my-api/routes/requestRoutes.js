const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/requestController.js');
const auth = require('../middleware/auth.js');
const role = require('../middleware/role.js');

router.post('/requests', auth, role('driver'), ctrl.createRequest);
router.get('/requests', auth, role('operator', 'driver'), ctrl.getAllRequests);
router.get('/requests/:id', auth, role('operator', 'driver'), ctrl.getRequestById);
router.patch('/requests/:id', auth, role('operator'), ctrl.updateRequest);
router.delete('/requests/:id', auth, role('driver'), ctrl.deleteRequest);

module.exports = router;