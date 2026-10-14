import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventService from '../services/EventService';

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    contactNumber: '',
    organizerName: ''
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadEventDetails(id);
    }
  }, [id]);

  const loadEventDetails = async (eventId) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await EventService.getEventById(eventId);
      const data = response.data;
      setFormData({
        title: data.title || '',
        description: data.description || '',
        date: data.date ? data.date.slice(0, 10) : '',
        location: data.location || '',
        contactNumber: data.contactNumber || '',
        organizerName: data.organizerName || ''
      });
    } catch (err) {
      console.error('Failed to load event for editing:', err);
      setErrorMessage(
        err.response?.data?.message || 'Could not load event details. Check event ID or server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/[-\s]/g, ''))) {
      newErrors.contactNumber = 'Contact number must be a valid 10-digit number';
    }

    if (!formData.organizerName.trim()) {
      newErrors.organizerName = 'Organizer name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await EventService.updateEvent(id, formData);
      // Redirect back to View Events page upon success
      navigate('/view');
    } catch (err) {
      console.error('Error updating event:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to update event. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/view');
  };

  if (loading) {
    return (
      <div className="event-form-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading event information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-form-container">
      <div className="card">
        <h2 className="form-title">Update Event Details</h2>
        <p className="form-subtitle">Modify the details of your community event below.</p>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <div className="error-text">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Event Description *</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <div className="error-text">{errors.description}</div>}
          </div>

          <div className="form-row">
            <div className="form-group col-half">
              <label htmlFor="date">Event Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <div className="error-text">{errors.date}</div>}
            </div>

            <div className="form-group col-half">
              <label htmlFor="location">Event Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && <div className="error-text">{errors.location}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-half">
              <label htmlFor="contactNumber">Contact Number *</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
                value={formData.contactNumber}
                onChange={handleChange}
              />
              {errors.contactNumber && <div className="error-text">{errors.contactNumber}</div>}
            </div>

            <div className="form-group col-half">
              <label htmlFor="organizerName">Organizer Name *</label>
              <input
                type="text"
                id="organizerName"
                name="organizerName"
                className={`form-control ${errors.organizerName ? 'is-invalid' : ''}`}
                value={formData.organizerName}
                onChange={handleChange}
              />
              {errors.organizerName && <div className="error-text">{errors.organizerName}</div>}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Event'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEvent;
