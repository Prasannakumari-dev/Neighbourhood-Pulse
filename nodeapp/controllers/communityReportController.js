const CommunityReport = require('../models/CommunityReport');

// Create a new community report
exports.createReport = async (req, res) => {
  try {
    const { title, description, category, location, priority } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        message: 'Title, description, category and location are required.'
      });
    }

    const report = await CommunityReport.create({
      title,
      description,
      category,
      location,
      priority
    });

    res.status(201).json({
      message: 'Community report created successfully.',
      report
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create community report.',
      error: error.message
    });
  }
};

// Get all community reports
exports.getReports = async (req, res) => {
  try {
    const reports = await CommunityReport.find().sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch community reports.',
      error: error.message
    });
  }
};

// Update report status
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['Open', 'In Progress', 'Resolved'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status.'
      });
    }

    const report = await CommunityReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        message: 'Community report not found.'
      });
    }

    res.status(200).json({
      message: 'Report status updated successfully.',
      report
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update report status.',
      error: error.message
    });
  }
};

// Delete a community report
exports.deleteReport = async (req, res) => {
  try {
    const report = await CommunityReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: 'Community report not found.'
      });
    }

    res.status(200).json({
      message: 'Community report deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete community report.',
      error: error.message
    });
  }
};