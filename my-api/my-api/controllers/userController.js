const db = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = db.User

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const { name, email, role, contact } = req.query

    let whereClause = {}
    if (name) whereClause.name = name
    if (email) whereClause.email = email
    if (role) whereClause.role = role
    if (contact) whereClause.contact = contact

    const users = await User.findAll({ where: whereClause })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Error displaying users.' })
  }
}

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'User ID is required and must be a valid number.' })
    }
    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Error obtaining user.' })
  }
}

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }
    const { name, email, password, role, contact } = req.body

    // Check for missing fields
    const missingFields = []
    if (!name) missingFields.push('name')
    if (!email) missingFields.push('email')
    if (!password) missingFields.push('password')
    if (!role) missingFields.push('role')
    if (!contact) missingFields.push('contact')
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required field(s): ${missingFields.join(', ')}` })
    }

    if (!['driver', 'operator'].includes(role)) {
      return res.status(400).json({ error: 'Role must be driver or operator.' })
    }
    // Validation to guarantee contact is a number
    if (isNaN(Number(contact)) || !/^\d+$/.test(String(contact))) {
      return res.status(400).json({ error: 'Contact must be a number.' })
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use.' })
    }

    // Encrypt password 
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ name, email, password: hashedPassword, role, contact })
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({
      error: 'Internal error creating user.',
      details: err.message
    })
  }
}

// PATCH /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }
    const { name, email, password, role, contact } = req.body

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    if (role && !['driver', 'operator'].includes(role)) {
      return res.status(400).json({ error: 'Role must be driver or operator.' })
    }

    await user.update({ name, email, password, role, contact })
    res.json(user)
  } catch (err) {
    res.status(500).json({
      error: 'Internal error updating user.',
      details: err.message
    })
  }
}

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found.' })

    await user.destroy()
    res.json({ message: 'User deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user.' })
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' })
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' })
    }
    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    )
    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: 'Error logging in.' })
  }
}