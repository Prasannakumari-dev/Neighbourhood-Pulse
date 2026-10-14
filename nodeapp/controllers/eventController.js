const Event = require('../models/Event');

// @desc    Create a new event
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, contactNumber, organizerName } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location || !contactNumber || !organizerName) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, description, date, location, contactNumber, organizerName'
      });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      contactNumber,
      organizerName
    });

    const savedEvent = await newEvent.save();
    return res.status(201).json(savedEvent);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create event',
      error: error.message
    });
  }
};

// @desc    Retrieve all events
// @route   GET /api/events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

// @desc    Retrieve event by ID
// @route   GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: `Event not found with id: ${id}`
      });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch event',
      error: error.message
    });
  }
};

// @desc    Update event details
// @route   PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, contactNumber, organizerName } = req.body;

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({
        message: `Event not found with id: ${id}`
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title: title !== undefined ? title : existingEvent.title,
        description: description !== undefined ? description : existingEvent.description,
        date: date !== undefined ? date : existingEvent.date,
        location: location !== undefined ? location : existingEvent.location,
        contactNumber: contactNumber !== undefined ? contactNumber : existingEvent.contactNumber,
        organizerName: organizerName !== undefined ? organizerName : existingEvent.organizerName
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedEvent);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update event',
      error: error.message
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({
        message: `Event not found with id: ${id}`
      });
    }

    return res.status(200).json({
      message: 'Event deleted successfully',
      event: deletedEvent
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete event',
      error: error.message
    });
  }
};
