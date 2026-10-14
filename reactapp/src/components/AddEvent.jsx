import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from 'react-leaflet';
import EventService from '../services/EventService';

const DEFAULT_CENTER = [11.0168, 76.9558];

function LocationPicker({ position, onLocationSelect }) {
  useMapEvents({
    click(event) {
      onLocationSelect({
        latitude: Number(event.latlng.lat.toFixed(6)),
        longitude: Number(event.latlng.lng.toFixed(6))
      });
    }
  });

  return position ? <Marker position={position} /> : null;
}

const AddEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    latitude: null,
    longitude: null,
    contactNumber: '',
    organizerName: ''
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPosition =
    formData.latitude !== null && formData.longitude !== null
      ? [formData.latitude, formData.longitude]
      : null;

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
    } else if (
      !/^\d{10}$/.test(
        formData.contactNumber.replace(/[-\s]/g, '')
      )
    ) {
      newErrors.contactNumber =
        'Contact number must be a valid 10-digit number';
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

  const handleLocationSelect = ({ latitude, longitude }) => {
    setFormData((prev) => ({
      ...prev,
      latitude,
      longitude
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await EventService.createEvent(formData);
      navigate('/view');
    } catch (err) {
      console.error('Error creating event:', err);

      setErrorMessage(
        err.response?.data?.message ||
          'Failed to create event. Please check backend connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/view');
  };

  return (
    <div className="event-form-container">
      <div className="card">
        <h2 className="form-title">Add New Neighbourhood Event</h2>

        <p className="form-subtitle">
          Fill in the details below to publish a community event
          for your neighborhood.
        </p>

        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-control ${
                errors.title ? 'is-invalid' : ''
              }`}
              placeholder="e.g. Neighborhood Cleanup"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <div className="error-text">{errors.title}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Event Description *</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className={`form-control ${
                errors.description ? 'is-invalid' : ''
              }`}
              placeholder="Describe the purpose, schedule, and what participants should bring..."
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <div className="error-text">{errors.description}</div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group col-half">
              <label htmlFor="date">Event Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                className={`form-control ${
                  errors.date ? 'is-invalid' : ''
                }`}
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && (
                <div className="error-text">{errors.date}</div>
              )}
            </div>

            <div className="form-group col-half">
              <label htmlFor="location">Event Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                className={`form-control ${
                  errors.location ? 'is-invalid' : ''
                }`}
                placeholder="e.g. Central Community Park"
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && (
                <div className="error-text">{errors.location}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Select Event Location on Map</label>
            <p style={{ color: '#64748b', marginTop: 4 }}>
              Click the map to mark where the event will take place.
              The map initially opens near Coimbatore; zoom or move it
              to find your location.
            </p>

            <div
              style={{
                height: '350px',
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #d1d5db'
              }}
            >
              <MapContainer
                center={DEFAULT_CENTER}
                zoom={12}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationPicker
                  position={selectedPosition}
                  onLocationSelect={handleLocationSelect}
                />
              </MapContainer>
            </div>

            {selectedPosition ? (
              <p style={{ color: '#15803d', marginTop: 10 }}>
                Location selected: Latitude {formData.latitude},
                Longitude {formData.longitude}
              </p>
            ) : (
              <p style={{ color: '#b45309', marginTop: 10 }}>
                No map location selected yet. You can still submit
                the event, but it won't have a map marker.
              </p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group col-half">
              <label htmlFor="contactNumber">Contact Number *</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                className={`form-control ${
                  errors.contactNumber ? 'is-invalid' : ''
                }`}
                placeholder="e.g. 9876543210"
                value={formData.contactNumber}
                onChange={handleChange}
              />
              {errors.contactNumber && (
                <div className="error-text">
                  {errors.contactNumber}
                </div>
              )}
            </div>

            <div className="form-group col-half">
              <label htmlFor="organizerName">Organizer Name *</label>
              <input
                type="text"
                id="organizerName"
                name="organizerName"
                className={`form-control ${
                  errors.organizerName ? 'is-invalid' : ''
                }`}
                placeholder="e.g. John Smith"
                value={formData.organizerName}
                onChange={handleChange}
              />
              {errors.organizerName && (
                <div className="error-text">
                  {errors.organizerName}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving Event...' : 'Submit Event'}
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

export default AddEvent;