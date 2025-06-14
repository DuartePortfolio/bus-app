const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');

router.get('/users', ctrl.getAllUsers);
router.get('/users/:id', ctrl.getUserById);
router.post('/users', ctrl.createUser);
router.patch('/users/:id', ctrl.updateUser);
router.delete('/users/:id', ctrl.deleteUser);

module.exports = router;