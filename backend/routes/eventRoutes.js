const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      category,
      outcomes,
      startTime,
      endTime,
      visibility,
      invitedUsers,
      minStake,
      maxStake
    } = req.body;

    // Validate date formats
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: 'Invalid date format for startTime or endTime' });
    }

    // Validate private event requirements
    if (visibility === 'private' && (!Array.isArray(invitedUsers) || invitedUsers.length === 0)) {
      return res.status(400).json({ error: 'Private events require at least one invited user' });
    }

    const event = new Event({
      title,
      category,
      outcomes: Array.isArray(outcomes) && outcomes.length >= 2 ? outcomes : ['Yes', 'No'],
      startTime: start,
      endTime: end,
      visibility: visibility || 'public',
      invitedUsers: visibility === 'private' ? invitedUsers : [],
      minStake: typeof minStake === 'number' ? minStake : 0,
      maxStake: typeof maxStake === 'number' ? maxStake : 100,
      creator: req.user.id
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all upcoming events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ 
      startTime: { $gt: new Date() } 
    }).sort('startTime').populate('creator', 'username');
    
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get events created by current user
router.get('/my-events', auth, async (req, res) => {
  try {
    const events = await Event.find({ creator: req.user.id }).sort('-createdAt');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;