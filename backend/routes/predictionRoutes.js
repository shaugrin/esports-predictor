const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Submit prediction
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, outcomeIndex, stake } = req.body;
    const userId = req.user.id;

    // Get event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Validate prediction time
    if (new Date() > new Date(event.endTime)) {
      return res.status(400).json({ error: 'Event has already ended' });
    }

    // Validate outcome
    if (outcomeIndex < 0 || outcomeIndex >= event.outcomes.length) {
      return res.status(400).json({ error: 'Invalid outcome selection' });
    }

    // Validate stake amount
    if (stake < event.minStake || stake > event.maxStake) {
      return res.status(400).json({ 
        error: `Stake must be between ${event.minStake} and ${event.maxStake} points`
      });
    }

    // Create prediction
    const prediction = new Prediction({
      user: userId,
      event: eventId,
      outcomeIndex,
      stake
    });

    await prediction.save();
    res.status(201).json(prediction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get predictions for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const predictions = await Prediction.find({ 
      event: req.params.eventId 
    }).populate('user', 'username');
    
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's predictions 
router.get('/my-predictions', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find({ 
      user: req.user.id 
    }).populate('event', 'title outcomes status');
    
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;