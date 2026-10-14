const express = require('express');
const router = express.Router();

const {
  createReport,
  getReports,
  updateReportStatus,
  deleteReport
} = require('../controllers/communityReportController');

// Create a report
router.post('/', createReport);

// Get all reports
router.get('/', getReports);

// Update a report's status
router.patch('/:id/status', updateReportStatus);

// Delete a report
router.delete('/:id', deleteReport);

module.exports = router;