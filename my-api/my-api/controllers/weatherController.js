const db = require('../models')
const Weather = db.Weather

// GET /api/weather
exports.getAllReadings = async (req, res) => {
  try {
    const { reading_id } = req.query

    let whereClause = {}
    if (reading_id) {
      whereClause.reading_id = reading_id
    }

    const { temperature } = req.query
    if (temperature) {
      whereClause.temperature = temperature
    }

    const { rain } = req.query
    if (rain) {
      whereClause.rain = rain
    }

    const { wind } = req.query
    if (wind) {
      whereClause.wind = wind
    }

    const { location } = req.query
    if (location) {
      whereClause.location = location
    }

    const { datetime } = req.query
    if (datetime) {
      whereClause.datetime = datetime
    }

    const { notes } = req.query
    if (notes) {
      whereClause.notes = notes
    }

    const readings = await Weather.findAll({ where: whereClause })
    res.json(readings)
  } catch (err) {
    res.status(500).json({ error: 'Error displaying weather readings' })
  }
}


// GET /api/weather/:id
exports.getReadingById = async (req, res) => {
  try {
    const reading = await Weather.findByPk(req.params.id)
    if (!reading) return res.status(404).json({ error: 'Weather reading not found.' })
    res.json(reading)
  } catch (err) {
    res.status(500).json({ error: 'Error obtaining reading.' })
  }
}

// POST /api/weather
exports.createReading = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }

    // Convert to numbers if possible
    const temperature = Number(req.body.temperature)
    const rain = Number(req.body.rain)
    const wind = Number(req.body.wind)
    const location = req.body.location
    const datetime = req.body.datetime
    const notes = req.body.notes

    // Check for missing fields
    const missingFields = []
    if (req.body.temperature === undefined || req.body.temperature === null || req.body.temperature === '') missingFields.push('temperature')
    if (req.body.rain === undefined || req.body.rain === null || req.body.rain === '') missingFields.push('rain')
    if (req.body.wind === undefined || req.body.wind === null || req.body.wind === '') missingFields.push('wind')
    if (!location) missingFields.push('location')
    if (!datetime) missingFields.push('datetime')
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required field(s): ${missingFields.join(', ')}` })
    }

    if (isNaN(temperature)) {
      return res.status(400).json({ error: 'temperature must be a number.' })
    }
    if (isNaN(rain)) {
      return res.status(400).json({ error: 'rain must be a number.' })
    }
    if (isNaN(wind)) {
      return res.status(400).json({ error: 'wind must be a number.' })
    }
    if (typeof location !== 'string') {
      return res.status(400).json({ error: 'location must be a string.' })
    }

    const newReading = await Weather.create({
      temperature,
      rain,
      wind,
      location,
      datetime,
      notes
    })

    res.status(201).json(newReading)
  } catch (err) {
    console.error('Error creating weather reading:', err)
    res.status(500).json({
      error: 'Internal error creating weather reading.',
      details: err.message
    })
  }
}

// PATCH /api/weather/:id
exports.updateReading = async (req, res) => {
  try {
    const { id } = req.params

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Reading ID is required and must be a valid number.' })
    }

    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }

    // Convert to numbers if present
    const temperature = req.body.temperature !== undefined ? Number(req.body.temperature) : undefined
    const rain = req.body.rain !== undefined ? Number(req.body.rain) : undefined
    const wind = req.body.wind !== undefined ? Number(req.body.wind) : undefined
    const location = req.body.location
    const datetime = req.body.datetime
    const notes = req.body.notes

    const reading = await Weather.findByPk(id)
    if (!reading) {
      return res.status(404).json({ error: 'Weather reading not found.' })
    }

    if (temperature !== undefined && isNaN(temperature)) {
      return res.status(400).json({ error: 'temperature must be a number.' })
    }
    if (rain !== undefined && isNaN(rain)) {
      return res.status(400).json({ error: 'rain must be a number.' })
    }
    if (wind !== undefined && isNaN(wind)) {
      return res.status(400).json({ error: 'wind must be a number.' })
    }
    if (location !== undefined && typeof location !== 'string') {
      return res.status(400).json({ error: 'location must be a string.' })
    }

    await reading.update({ temperature, rain, wind, location, datetime, notes })

    res.json(reading)
  } catch (err) {
    console.error('Error updating weather reading:', err)
    res.status(500).json({
      error: 'Internal error updating weather reading.',
      details: err.message
    })
  }
}
// DELETE /api/weather/:id
exports.deleteReading = async (req, res) => {
  try {
    const id = req.params.id
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Reading ID is required and must be a valid number.' })
    }

    const reading = await Weather.findByPk(id)
    if (!reading) return res.status(404).json({ error: 'Weather reading not found.' })

    await reading.destroy()
    res.json({ message: 'Weather reading deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Error deleting weather reading.' })
  }
}

