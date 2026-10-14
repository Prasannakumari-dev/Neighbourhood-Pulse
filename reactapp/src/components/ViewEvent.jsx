import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventService from '../services/EventService';

const ViewEvent = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await EventService.getAllEvents();
      setEvents(response.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to fetch events from server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const filteredEvents = events.filter((event) => {
    if (!event.date) {
      return dateFilter === 'all';
    }

    const eventDate = String(event.date).slice(0, 10);
    const today = getLocalDate();

    if (dateFilter === 'upcoming') {
      return eventDate >= today;
    }

    if (dateFilter === 'past') {
      return eventDate < today;
    }

    if (dateFilter === 'specific') {
      return selectedDate !== '' && eventDate === selectedDate;
    }

    return true;
  });

  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete the event: "' +
        (title || 'this event') +
        '"?'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await EventService.deleteEvent(id);

      setSuccessMessage('Event deleted successfully.');
      setEvents((previousEvents) =>
        previousEvents.filter(
          (event) => (event._id || event.id) !== id
        )
      );

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting event:', err);
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to delete event. Please try again.'
      );
    }
  };

  const clearFilter = () => {
    setDateFilter('all');
    setSelectedDate('');
  };

  return (
    <div className="view-events-container">
      <div className="view-header">
        <div>
          <h2>Scheduled Community Events</h2>
          <p className="subtitle">
            Overview of all scheduled neighborhood programs and gatherings
          </p>
        </div>

        <Link to="/add" className="btn btn-primary">
          + Add New Event
        </Link>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading neighborhood events...</p>
        </div>
      ) : (
        <>
          {events.length > 0 && (
            <div className="event-date-filter">
              <label htmlFor="dateFilter">
                <strong>Filter by date:</strong>
              </label>

              <select
                id="dateFilter"
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value)
                }
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming Events</option>
                <option value="past">Past Events</option>
                <option value="specific">Choose a Specific Date</option>
              </select>

              {dateFilter === 'specific' && (
                <input
                  type="date"
                  aria-label="Choose event date"
                  value={selectedDate}
                  onChange={(event) =>
                    setSelectedDate(event.target.value)
                  }
                />
              )}

              <span className="event-count">
                Showing {filteredEvents.length} of {events.length} events
              </span>

              {dateFilter !== 'all' && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={clearFilter}
                >
                  Clear Filter
                </button>
              )}
            </div>
          )}

          {events.length === 0 ? (
            <div className="empty-state">
              <h3>No Events Scheduled Yet</h3>
              <p>
                Be the first organizer to schedule a community event
                for your neighborhood.
              </p>
              <Link to="/add" className="btn btn-primary">
                Create First Event
              </Link>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="empty-state">
              <h3>No Events Found</h3>
              <p>
                No events match your selected date.
                Try another date or clear the filter.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={clearFilter}
              >
                Show All Events
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Contact</th>
                    <th>Organizer</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEvents.map((event) => {
                    const eventId = event._id || event.id;

                    return (
                      <tr key={eventId}>
                        <td className="font-semibold">{event.title}</td>
                        <td className="desc-cell">{event.description}</td>
                        <td className="date-cell">{event.date}</td>
                        <td>{event.location}</td>
                        <td>{event.contactNumber}</td>
                        <td>{event.organizerName}</td>
                        <td className="action-cell">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleUpdate(eventId)}
                          >
                            Update
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDelete(eventId, event.title)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewEvent;
