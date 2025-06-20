const db = require('../models')
const { Op } = require('sequelize');
const Trip = db.Trip
const Route = db.Route
const Vehicle = db.Vehicle
const User = db.User

// GET /api/trips
exports.getAllTrips = async (req, res) => {
  try {
    const { driver_id, route_id, vehicle_id, alt_trajectory_id, driver_name, vehicle_plate, route_name, alt_trajectory_text} = req.query;

    const where = {};
    if (driver_id) where.driver_id = driver_id;
    if (route_id) where.route_id = route_id;
    if (vehicle_id) where.vehicle_id = vehicle_id;

    const include = [
      { model: Route, as: 'route' },
      { model: Vehicle, as: 'vehicle' },
      { model: User, as: 'driver' },
      { 
        model: db.AlternativeTrajectory, 
        as: 'alternative_trajectories',
        include: [
          { model: db.Stop, as: 'stop1' },
          { model: db.Stop, as: 'stop2' }
        ]
      }
    ];

    // Filter by driver name
    if (driver_name) {
      include[2].where = { name: { [Op.like]: `%${driver_name}%` } };
      include[2].required = true;
    }

    // Filter by vehicle plate
    if (vehicle_plate) {
      include[1].where = { plate_number: { [Op.like]: `%${vehicle_plate}%` } };
      include[1].required = true;
    }

    // Filter by alt trajectory text
    if (alt_trajectory_text) {
      include[3].where = { alt_trajectory: { [Op.like]: `%${alt_trajectory_text}%` } };
      include[3].required = true;
    }

    // Filter by alt trajectory id
    if (alt_trajectory_id) {
      include[3].where = {
        ...(include[3].where || {}),
        trajectory_id: alt_trajectory_id
      };
      include[3].required = true;
    }

    // Filter by route name
    if (req.query.route_name) {
      include[0].where = { route_name: { [Op.like]: `%${req.query.route_name}%` } };
      include[0].required = true;
    }    

    const trips = await Trip.findAll({
      where,
      include
    });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Error displaying trips.' });
  }
}

// GET /api/trips/:id
exports.getTripById = async (req, res) => {
  try {
    const id = req.params.id
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Trip ID is required and must be a valid number.' })
    }
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        { model: Route, as: 'route' },
        { model: Vehicle, as: 'vehicle' },
        { model: User, as: 'driver' },
        { 
          model: db.AlternativeTrajectory, 
          as: 'alternative_trajectories',
          include: [
            { model: db.Stop, as: 'stop1' },
            { model: db.Stop, as: 'stop2' }
          ]
        }
      ]
    })
    if (!trip) return res.status(404).json({ error: 'Trip not found.' })
    res.json(trip)
  } catch (err) {
    res.status(500).json({ error: 'Error obtaining trip.' })
  }
}

// POST /api/trips
exports.createTrip = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required.' })
    }

    // Convert to numbers cause postman sends them as strings
    const route_id = Number(req.body.route_id)
    const vehicle_id = Number(req.body.vehicle_id)
    const driver_id = Number(req.body.driver_id)
    const start_time = req.body.start_time
    const alt_trajectory_id = req.body.trajectory_id || req.body.alt_trajectory_id


    // Check for missing fields
    const missingFields = []
    if (!req.body.route_id && req.body.route_id !== 0) missingFields.push('route_id')
    if (!req.body.vehicle_id && req.body.vehicle_id !== 0) missingFields.push('vehicle_id')
    if (!req.body.driver_id && req.body.driver_id !== 0) missingFields.push('driver_id')
    if (start_time === undefined || start_time === null || start_time === '') missingFields.push('start_time')
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required field(s): ${missingFields.join(', ')}` })
    }

    if (!Number.isInteger(route_id)) {
      return res.status(400).json({ error: 'route_id must be a number.' })
    }
    if (!Number.isInteger(vehicle_id)) {
      return res.status(400).json({ error: 'vehicle_id must be a number.' })
    }
    if (!Number.isInteger(driver_id)) {
      return res.status(400).json({ error: 'driver_id must be a number.' })
    }
    // Validate start_time as a valid date string
    if (isNaN(Date.parse(start_time))) {
      return res.status(400).json({ error: 'start_time must be a valid date/time string.' })
    }

    // verifies if the route, vehicle, and driver exist
    const [route, vehicle, driver] = await Promise.all([
      Route.findByPk(route_id),
      Vehicle.findByPk(vehicle_id),
      User.findByPk(driver_id)
    ])
    if (!route) {
      return res.status(404).json({ error: 'Route not found.' })
    }
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' })
    }
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found.' })
    }
    // Verefies if the user is a driver
    if (!driver.role || driver.role.toLowerCase() !== 'driver') {
      return res.status(400).json({ error: 'Selected user is not a driver.' })
    }

    const newTrip = await Trip.create({ route_id, vehicle_id, driver_id, start_time })

    if (alt_trajectory_id) {
      const altTraj = await db.AlternativeTrajectory.findByPk(alt_trajectory_id)
      if (!altTraj) {
        return res.status(404).json({ error: 'Alternative trajectory not found.' })
      }
      await newTrip.addAlternative_trajectory(altTraj)
    }    

    res.status(201).json(newTrip)
  } catch (err) {
    res.status(500).json({ error: 'Error creating trip.' })
  }
}

// POST /api/trips/:id/alternative-trajectories
exports.addAlternativeTrajectoryToTrip = async (req, res) => {
  try {
    const { trajectory_id } = req.body
    const { id } = req.params
    if (!trajectory_id) {
      return res.status(400).json({ error: 'trajectory_id is required.' })
    }
    const trip = await Trip.findByPk(id)
    if (!trip) return res.status(404).json({ error: 'Trip not found.' })

    const altTraj = await db.AlternativeTrajectory.findByPk(trajectory_id)
    if (!altTraj) return res.status(404).json({ error: 'Alternative trajectory not found.' })

    await trip.addAlternative_trajectory(altTraj)
    res.status(201).json({ message: 'Alternative trajectory added to trip.' })
  } catch (err) {
    res.status(500).json({ error: 'Error adding alternative trajectory to trip.' })
  }
}

// PATCH /api/trips/:id
// É preciso arranjar só dá erro 500
exports.updateTrip = async (req, res) => {
  try {
    const id = req.params.id
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Trip ID is required and must be a valid number.' })
    }
    
    const { route_id, vehicle_id, driver_id, start_time } = req.body
    const trip = await Trip.findByPk(req.params.id)
    if (!trip) return res.status(404).json({ error: 'Trip not found.' })
    await trip.update({ route_id, vehicle_id, driver_id, start_time })
    res.json(trip)
  } catch (err) {
    res.status(500).json({ error: 'Error updating trip.' })
  }
}

// DELETE /api/trips/:id
exports.deleteTrip = async (req, res) => {
  try {
    const id = req.params.id
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Trip ID is required and must be a valid number.' })
    }
    const trip = await Trip.findByPk(req.params.id)
    if (!trip) return res.status(404).json({ error: 'Trip not found.' })
    await trip.destroy()
    res.json({ message: 'Trip deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Error deleting trip.' })
  }
}

// DELETE /api/trips/:id/alternative-trajectories/:trajectory_id
exports.removeAlternativeTrajectoryFromTrip = async (req, res) => {
  try {
    const { id, trajectory_id } = req.params
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'IDs are required and must be a valid number.' })
    }
    const trip = await Trip.findByPk(id)
    if (!trip) return res.status(404).json({ error: 'Trip not found.' })

    const altTraj = await db.AlternativeTrajectory.findByPk(trajectory_id)
    if (!altTraj) return res.status(404).json({ error: 'Alternative trajectory not found.' })

    await trip.removeAlternative_trajectory(altTraj)
    res.json({ message: 'Alternative trajectory removed from trip.' })
  } catch (err) {
    res.status(500).json({ error: 'Error removing alternative trajectory from trip.' })
  }
}