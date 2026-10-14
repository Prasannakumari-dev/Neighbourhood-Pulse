import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';

const EVENTS_API = 'http://localhost:8080/api/events';
const REPORTS_API = 'http://localhost:8080/api/reports';

// Default map view: Coimbatore.
// This is only the starting view, not an event's actual location.
const DEFAULT_CENTER = [11.0168, 76.9558];

function NeighbourhoodMap() {
  const [events, setEvents] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        setError('');

        const [eventsResponse, reportsResponse] = await Promise.all([
          axios.get(EVENTS_API),
          axios.get(REPORTS_API)
        ]);

        setEvents(
          Array.isArray(eventsResponse.data)
            ? eventsResponse.data
            : eventsResponse.data.events || []
        );

        setReports(
          Array.isArray(reportsResponse.data)
            ? reportsResponse.data
            : reportsResponse.data.reports || []
        );
      } catch (err) {
        console.error('Error loading map data:', err);
        setError(
          'Unable to load events and reports. Make sure the backend is running on port 8080.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  const hasCoordinates = (item) => {
    const lat = Number(item.latitude ?? item.coordinates?.lat);
    const lng = Number(item.longitude ?? item.coordinates?.lng);

    return (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180 &&
      (item.latitude != null || item.coordinates?.lat != null) &&
      (item.longitude != null || item.coordinates?.lng != null)
    );
  };

  const getPosition = (item) => [
    Number(item.latitude ?? item.coordinates.lat),
    Number(item.longitude ?? item.coordinates.lng)
  ];

  const mappedEvents = events.filter(hasCoordinates);
  const mappedReports = reports.filter(hasCoordinates);
  const unmappedCount =
    events.length - mappedEvents.length +
    reports.length - mappedReports.length;

  return (
    <div className="map-page">
      <div className="map-header">
        <div>
          <h1>Neighbourhood Map</h1>
          <p>Explore community events and reported issues.</p>
        </div>
      </div>

      <div className="map-summary">
        <div className="map-stat">
          <span className="map-stat-number">{events.length}</span>
          <span>Total Events</span>
        </div>

        <div className="map-stat">
          <span className="map-stat-number">{reports.length}</span>
          <span>Community Reports</span>
        </div>

        <div className="map-stat">
          <span className="map-stat-number">
            {mappedEvents.length + mappedReports.length}
          </span>
          <span>Mapped Locations</span>
        </div>
      </div>

      {loading && <p>Loading map data...</p>}

      {error && <p className="map-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="map-legend">
            <span>
              <span className="legend-dot event-dot"></span>
              Events
            </span>
            <span>
              <span className="legend-dot report-dot"></span>
              Community Reports
            </span>
          </div>

          <div className="neighbourhood-map-container">
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={12}
              scrollWheelZoom={true}
              className="neighbourhood-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {mappedEvents.map((event) => (
                <Marker
                  key={`event-${event._id}`}
                  position={getPosition(event)}
                >
                  <Popup>
                    <strong>{event.title}</strong>
                    <br />
                    <span>Community Event</span>
                    <br />
                    {event.location && <span>{event.location}</span>}
                    {event.date && (
                      <>
                        <br />
                        <span>Date: {event.date}</span>
                      </>
                    )}
                    {event.description && (
                      <p>{event.description}</p>
                    )}
                  </Popup>
                </Marker>
              ))}

              {mappedReports.map((report) => (
                <Marker
                  key={`report-${report._id}`}
                  position={getPosition(report)}
                >
                  <Popup>
                    <strong>{report.title}</strong>
                    <br />
                    <span>Community Report</span>
                    <br />
                    {report.location && <span>{report.location}</span>}
                    <br />
                    <span>Status: {report.status}</span>
                    {report.category && (
                      <>
                        <br />
                        <span>Category: {report.category}</span>
                      </>
                    )}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {unmappedCount > 0 && (
            <div className="map-notice">
              <strong>{unmappedCount} item(s) need map coordinates.</strong>
              <p>
                These items are saved in your application but cannot appear
                at their actual locations until latitude and longitude are
                added.
              </p>
            </div>
          )}

          {events.length === 0 && reports.length === 0 && (
            <p className="map-empty">
              No events or community reports yet. Add one to get started.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default NeighbourhoodMap;