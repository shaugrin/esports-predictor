const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const { title, category, outcomes, startTime } = req.body;

    // Use default outcomes if not provided or invalid
    const finalOutcomes = Array.isArray(outcomes) && outcomes.length >= 2 
      ? outcomes 
      : ["Yes", "No"];

    const event = new Event({
      title,
      category,
      outcomes: finalOutcomes,
      startTime: new Date(startTime),
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