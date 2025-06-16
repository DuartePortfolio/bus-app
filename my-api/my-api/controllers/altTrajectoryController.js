const db = require('../models')
const AlternativeTrajectory = db.AlternativeTrajectory

// GET /api/alternative-trajectories
exports.getAllAlternativeTrajectories = async (req, res) => {
  try {
    const { stop_id_1, stop_id_2, driver_id } = req.query

    let whereClause = {}
    if (stop_id_1) { whereClause.stop_id_1 = stop_id_1 }
    if (stop_id_2) { whereClause.stop_id_2 = stop_id_2 }
    if (driver_id) { whereClause.driver_id = driver_id }

    const altTrajs = await AlternativeTrajectory.findAll({ where: whereClause })
    res.json(altTrajs)
  } catch (err) {
    res.status(500).json({ error: 'Error displaying alternative trajectories.' })
  }
}

// GET /api/alternative-trajectories/:id
exports.getAlternativeTrajectoryById = async (req, res) => {
  try {
    const id = req.params.id
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Reading ID is required and must be a valid number.' })
    }
    const altTraj = await AlternativeTrajectory.findByPk(req.params.id)
    if (!altTraj) return res.status(404).json({ error: 'Alternative trajectory not found.' })
    res.json(altTraj)
  } catch (err) {
    res.status(500).json({ error: 'Error obtaining alternative trajectory.' })
  }
}

// POST /api/alternative-trajectories
exports.createAlternativeTrajectory = async (req, res) => {
  try {
    
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }
    const { stop_id_1, stop_id_2, alt_trajectory } = req.body

    // Checks for required fields
    const missingFields = []
    if (!stop_id_1) missingFields.push('stop_id_1')
    if (!stop_id_2) missingFields.push('stop_id_2')
    if (!alt_trajectory) missingFields.push('alt_trajectory')
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required field(s): ${missingFields.join(', ')}` })
    }

    // Verifies if the stops exist
    const Stop = require('../models').Stop
    const [stop1, stop2] = await Promise.all([
      Stop.findByPk(stop_id_1),
      Stop.findByPk(stop_id_2)
    ])
    if (!stop1) {
      return res.status(404).json({ error: 'stop_id_1 not found.' })
    }
    if (!stop2) {
      return res.status(404).json({ error: 'stop_id_2 not found.' })
    }
    if (stop_id_1 && stop_id_2 && stop_id_1 === stop_id_2) {
      return res.status(400).json({ error: 'stop_id_1 and stop_id_2 cannot be the same.' })
    }

    const newAltTraj = await AlternativeTrajectory.create({ stop_id_1, stop_id_2, alt_trajectory })

    res.status(201).json(newAltTraj)
  } catch (err) {
    console.error('Error creating alternative trajectory:', err)
    res.status(500).json({
      error: 'Internal error creating alternative trajectory.',
      details: err.message
    })
  }
}

// PATCH /api/alternative-trajectories/:id
exports.updateAlternativeTrajectory = async (req, res) => {
  try {
    const { id } = req.params
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Reading ID is required and must be a valid number.' })
    }

    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }
    const { stop_id_1, stop_id_2, alt_trajectory } = req.body
    const altTraj = await AlternativeTrajectory.findByPk(id)
    if (!altTraj) {
      return res.status(404).json({ error: 'Alternative trajectory not found.' })
    }

    // Verifies if the stops exist
    const Stop = require('../models').Stop
    if (stop_id_1) {
      const stop1 = await Stop.findByPk(stop_id_1)
      if (!stop1) {
        return res.status(404).json({ error: 'stop_id_1 not found.' })
      }
    }
    if (stop_id_2) {
      const stop2 = await Stop.findByPk(stop_id_2)
      if (!stop2) {
        return res.status(404).json({ error: 'stop_id_2 not found.' })
      }
    }
    if (stop_id_1 && stop_id_2 && stop_id_1 === stop_id_2) {
      return res.status(400).json({ error: 'stop_id_1 and stop_id_2 cannot be the same.' })
    }

    await altTraj.update({ stop_id_1, stop_id_2, alt_trajectory })

    res.json(altTraj)
  } catch (err) {
    console.error('Error updating alternative trajectory:', err)
    res.status(500).json({
      error: 'Internal error updating alternative trajectory.',
      details: err.message
    })
  }
}

// DELETE /api/alternative-trajectories/:id
exports.deleteAlternativeTrajectory = async (req, res) => {
  try {
    const id = req.params.id
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Reading ID is required and must be a valid number.' })
    }
    const altTraj = await AlternativeTrajectory.findByPk(req.params.id)
    if (!altTraj) return res.status(404).json({ error: 'Alternative trajectory not found.' })
    await altTraj.destroy()
    res.json({ message: 'Alternative trajectory deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Error deleting alternative trajectory.' })
  }
}