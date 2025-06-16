const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Public routes
router.post('/users', auth, role('operator'), ctrl.createUser);
router.post('/users/login', ctrl.loginUser);

// Protected routes
router.get('/users', auth, role('operator'), ctrl.getAllUsers);
router.get('/users/:id', auth, role('operator'), ctrl.getUserById);
router.patch('/users/:id', auth, role('operator'), ctrl.updateUser);
router.delete('/users/:id', auth, role('operator'), ctrl.deleteUser);

module.exports = router;