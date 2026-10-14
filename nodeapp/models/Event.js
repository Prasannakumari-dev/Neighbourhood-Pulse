const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    date: {
      type: String,
      required: [true, 'Event date is required']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true
    },
    organizerName: {
      type: String,
      required: [true, 'Organizer name is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Event', eventSchema);