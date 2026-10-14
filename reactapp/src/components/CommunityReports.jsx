import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from 'react-leaflet';

const API_URL = 'http://localhost:8080/api/reports';
const DEFAULT_CENTER = [11.0168, 76.9558];

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'Roads',
  location: '',
  priority: 'Medium',
  latitude: null,
  longitude: null
};

function ReportLocationPicker({ position, onLocationSelect }) {
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

function CommunityReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({ ...EMPTY_FORM });

  const selectedPosition =
    form.latitude !== null && form.longitude !== null
      ? [form.latitude, form.longitude]
      : null;

  const loadReports = async () => {
    try {
      const response = await axios.get(API_URL);
      setReports(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error('Error loading reports:', error);
      setMessage(
        'Could not load reports. Check whether the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleLocationSelect = ({ latitude, longitude }) => {
    setForm((previous) => ({
      ...previous,
      latitude,
      longitude
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);

    try {
      await axios.post(API_URL, form);

      setForm({ ...EMPTY_FORM });
      setMessage('Community report submitted successfully!');
      await loadReports();
    } catch (error) {
      console.error('Error submitting report:', error);
      setMessage(
        error.response?.data?.message ||
          'Could not submit the report. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/${id}/status`, { status });
      setMessage('Report status updated.');
      await loadReports();
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('Could not update report status.');
    }
  };

  const deleteReport = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this report?'
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage('Report deleted.');
      await loadReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      setMessage('Could not delete report.');
    }
  };

  return (
    <div className="community-page">
      <header className="community-header">
        <div>
          <p className="community-eyebrow">
            COMMUNITY INTELLIGENCE PLATFORM
          </p>
          <h1>Neighbourhood Pulse</h1>
          <p>
            Report local problems, track progress and help improve your
            neighbourhood.
          </p>
        </div>
      </header>

      {message && (
        <div className="community-message" role="status">
          {message}
        </div>
      )}

      <section className="community-summary">
        <div className="summary-card">
          <span>Total Reports</span>
          <strong>{reports.length}</strong>
        </div>

        <div className="summary-card">
          <span>Open Issues</span>
          <strong>
            {reports.filter((report) => report.status === 'Open').length}
          </strong>
        </div>

        <div className="summary-card">
          <span>In Progress</span>
          <strong>
            {reports.filter((report) => report.status === 'In Progress').length}
          </strong>
        </div>

        <div className="summary-card">
          <span>Resolved</span>
          <strong>
            {reports.filter((report) => report.status === 'Resolved').length}
          </strong>
        </div>
      </section>

      <section className="community-panel">
        <h2>Report a Community Need</h2>
        <p>Describe the issue and select where it is happening.</p>

        <form onSubmit={handleSubmit} className="community-form">
          <label htmlFor="report-title">Report title</label>
          <input
            id="report-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Broken streetlight near the park"
            required
            maxLength={120}
          />

          <label htmlFor="report-description">Description</label>
          <textarea
            id="report-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Explain the issue or community need..."
            rows={4}
            required
            maxLength={2000}
          />

          <div className="community-form-grid">
            <div>
              <label htmlFor="report-category">Category</label>
              <select
                id="report-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option>Roads</option>
                <option>Streetlights</option>
                <option>Garbage</option>
                <option>Water</option>
                <option>Safety</option>
                <option>Public Spaces</option>
                <option>Community Events</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="report-priority">Priority</label>
              <select
                id="report-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <label htmlFor="report-location">
            Neighbourhood / location
          </label>
          <input
            id="report-location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Near the public park, Sector 2"
            required
            maxLength={200}
          />

          <label>Select issue location on the map</label>
          <p>
            Click the map to place a marker at the location of the issue.
            You can zoom and move the map to find the correct spot.
          </p>

          <div
            style={{
              height: '350px',
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #d1d5db',
              marginBottom: '12px'
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

              <ReportLocationPicker
                position={selectedPosition}
                onLocationSelect={handleLocationSelect}
              />
            </MapContainer>
          </div>

          {selectedPosition ? (
            <p>
              <strong>Selected coordinates:</strong>{' '}
              {form.latitude}, {form.longitude}
            </p>
          ) : (
            <p>
              No map location selected. You can still submit the report,
              but it will not have a map marker.
            </p>
          )}

          <button
            type="submit"
            className="community-submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </section>

      <section className="community-panel">
        <h2>Community Reports</h2>
        <p>Review reported needs and track their progress.</p>

        {loading ? (
          <p>Loading reports...</p>
        ) : reports.length === 0 ? (
          <p>No reports yet. Submit the first community report above.</p>
        ) : (
          <div className="community-report-list">
            {reports.map((report) => (
              <article className="report-card" key={report._id}>
                <div className="report-card-heading">
                  <div>
                    <span className="report-category">
                      {report.category}
                    </span>
                    <h3>{report.title}</h3>
                  </div>

                  <span
                    className={`report-status status-${report.status
                      .toLowerCase()
                      .replace(/\s+/g, '-')}`}
                  >
                    {report.status}
                  </span>
                </div>

                <p>{report.description}</p>
                <p>
                  <strong>Location:</strong> {report.location}
                </p>
                <p>
                  <strong>Priority:</strong> {report.priority}
                </p>

                {report.latitude != null &&
                  report.longitude != null && (
                    <p>
                      <strong>Coordinates:</strong>{' '}
                      {report.latitude}, {report.longitude}
                    </p>
                  )}

                <div className="report-actions">
                  <label htmlFor={`status-${report._id}`}>
                    Update status
                  </label>

                  <select
                    id={`status-${report._id}`}
                    value={report.status}
                    onChange={(event) =>
                      updateStatus(report._id, event.target.value)
                    }
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>

                  <button
                    type="button"
                    className="report-delete"
                    onClick={() => deleteReport(report._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CommunityReports;