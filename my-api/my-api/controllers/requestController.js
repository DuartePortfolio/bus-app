const db = require('../models');
const Request = db.Request;
const User = db.User;
const { Op } = require('sequelize'); 

const allowedCategories = ['time_off', 'meeting', 'feature', 'route_change', 'other'];
const allowedStatuses = ['pending', 'accepted', 'denied', 'on_hold'];

// POST /api/requests (driver creates request)
exports.createRequest = async (req, res) => {
  try {
    const { category, title, message } = req.body;
    const missingFields = [];
    if (!category) missingFields.push('category');
    if (!title) missingFields.push('title');
    if (!message) missingFields.push('message');
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required field(s): ${missingFields.join(', ')}` });
    }
    // Data type and value checks
    if (typeof category !== 'string' || !allowedCategories.includes(category)) {
      return res.status(400).json({ error: `Invalid category. Allowed: ${allowedCategories.join(', ')}` });
    }
    if (typeof title !== 'string' || title.length > 100) {
      return res.status(400).json({ error: 'Title must be a string up to 100 characters.' });
    }
    if (typeof message !== 'string') {
      return res.status(400).json({ error: 'Message must be a string.' });
    }
    const request = await Request.create({
      driver_id: req.user.user_id,
      category,
      title,
      message
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create request.' });
  }
};

// GET /api/requests (operator sees all, driver sees own)
exports.getAllRequests = async (req, res) => {
  try {
    let where = {};
    if (req.user.role === 'driver') {
      where.driver_id = req.user.user_id;
    }
    // Filtering support
    if (req.query.category) {
      where.category = req.query.category;
    }
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.driver) {
      if (!isNaN(Number(req.query.driver))) {
        where.driver_id = req.query.driver;
      } else {

      }
    }

    const requests = await Request.findAll({
      where,
      include: [
        {
          model: User,
          as: 'driver',
          attributes: ['user_id', 'name'],
          where: req.query.driver && isNaN(Number(req.query.driver))
            ? { name: { [Op.like]: `%${req.query.driver}%` } }
            : undefined
        },
        { model: User, as: 'operator', attributes: ['user_id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests.' });
  }
};

// GET /api/requests/:id
exports.getRequestById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Request ID must be a valid number.' });
    }
    const request = await Request.findByPk(id, {
      include: [
        { model: User, as: 'driver', attributes: ['user_id', 'name'] },
        { model: User, as: 'operator', attributes: ['user_id', 'name'] }
      ]
    });
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    if (req.user.role === 'driver' && request.driver_id !== req.user.user_id) {
      return res.status(403).json({ error: 'You do not have enough permissions to access this content.' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch request.' });
  }
};

// PATCH /api/requests/:id (operator updates status/response)
exports.updateRequest = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Request ID must be a valid number.' });
    }
    const { status, response } = req.body;
    if (status && (typeof status !== 'string' || !allowedStatuses.includes(status))) {
      return res.status(400).json({ error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
    }
    if (response !== undefined && typeof response !== 'string') {
      return res.status(400).json({ error: 'Response must be a string.' });
    }
    const request = await Request.findByPk(id);
    if (!request) return res.status(404).json({ error: 'Request not found.' });

    // Only update allowed fields
    if (status) request.status = status;
    if (response !== undefined) request.response = response;
    request.operator_id = req.user.user_id;
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update request.' });
  }
};

// DELETE /api/requests/:id (driver deletes own pending request)
exports.deleteRequest = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Request ID must be a valid number.' });
    }
    const request = await Request.findByPk(id);
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    if (request.driver_id !== req.user.user_id) {
      return res.status(403).json({ error: 'Forbidden.' });
    }
    await request.destroy();
    res.json({ message: 'Request deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete request.' });
  }
};