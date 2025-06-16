const db = require('../models')
const Vehicle = db.Vehicle

// GET /api/vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const { plate_number } = req.query

    let whereClause = {}
    if (plate_number) {
      whereClause.plate_number = plate_number
    }

    const { capacity } = req.query
    if (capacity) {
      whereClause.capacity = capacity
    }

    const vehicles = await Vehicle.findAll({ where: whereClause })
    res.json(vehicles)
  } catch (err) {
    res.status(500).json({ error: 'Error displaying vehicles.' })
  }
}


// GET /api/vehicles/:id
exports.getVehicleById = async (req, res) => {
  try {
    const id = req.params.id
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Vehicle ID is required and must be a valid number.' })
    }
    const vehicle = await Vehicle.findByPk(id)
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found.' })
    res.json(vehicle)
  } catch (err) {
    res.status(500).json({ error: 'Error obtaining vehicle.' })
  }
}

// POST /api/vehicles
exports.createVehicle = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }
    const plate_number = req.body.plate_number
    const capacity = Number(req.body.capacity)

    // Check for missing fields
    const missingFields = []
    if (!plate_number) missingFields.push('plate_number')
    if (req.body.capacity === undefined || req.body.capacity === null || req.body.capacity === '') missingFields.push('capacity')
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required field(s): ${missingFields.join(', ')}` })
    }

    if (typeof plate_number !== 'string') {
      return res.status(400).json({ error: 'plate_number must be a string.' })
    }
    if (isNaN(capacity) || capacity <= 0) {
      return res.status(400).json({ error: 'capacity must be a positive number.' })
    }

    // Verifies if the plate_number already exists
    const existingVehicle = await Vehicle.findOne({ where: { plate_number } })
    if (existingVehicle) {
      return res.status(409).json({ error: 'plate_number already in use.' })
    }

    const newVehicle = await Vehicle.create({ plate_number, capacity })
    res.status(201).json(newVehicle)
  } catch (err) {
    console.error('Error creating vehicle:', err)
    res.status(500).json({
      error: 'Internal error creating vehicle.',
      details: err.message
    })
  }
}

// PATCH /api/vehicles/:id
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params

    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }
    const plate_number = req.body.plate_number
    const capacity = req.body.capacity !== undefined ? Number(req.body.capacity) : undefined

    const vehicle = await Vehicle.findByPk(id)
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' })
    }
    if (plate_number && typeof plate_number !== 'string') {
      return res.status(400).json({ error: 'plate_number must be a string.' })
    }
    if (capacity !== undefined && (isNaN(capacity) || capacity <= 0)) {
      return res.status(400).json({ error: 'capacity must be a positive number.' })
    }

    // Verifies se plate_number exists on another vehicle
    if (plate_number) {
      const existingVehicle = await Vehicle.findOne({ where: { plate_number } })
      if (existingVehicle && existingVehicle.id != id) {
        return res.status(409).json({ error: 'plate_number already in use.' })
      }
    }

    await vehicle.update({ plate_number, capacity })

    res.json(vehicle)
  } catch (err) {
    console.error('Error updating vehicle:', err)
    res.status(500).json({
      error: 'Internal error updating vehicle.',
      details: err.message
    })
  }
}



// DELETE /api/vehicles/:id
exports.deleteVehicle = async (req, res) => {
  try {
    const id = req.params.id
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Reading ID is required and must be a valid number.' })
    }
    const vehicle = await Vehicle.findByPk(req.params.id)
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found.' })

    await vehicle.destroy()
    res.json({ message: 'Vehicle deleted successfuly.' })
  } catch (err) {
    res.status(500).json({ error: 'Error deleting vehicle.' })
  }
}
