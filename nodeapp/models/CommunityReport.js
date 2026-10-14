const mongoose = require('mongoose');

const communityReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Roads',
        'Streetlights',
        'Garbage',
        'Water',
        'Safety',
        'Public Spaces',
        'Community Events',
        'Other'
      ]
    },
    location: {
      type: String,
      required: true,
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
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'CommunityReport',
  communityReportSchema
);