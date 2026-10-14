import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-badge">Community First</div>
        <h1 className="hero-title">Neighbourhood Event Management System</h1>
        <p className="hero-subtitle">
          Empowering neighborhoods and local organizations to schedule, collaborate,
          and participate in community gatherings with seamless event tracking.
        </p>

        <div className="hero-actions">
          <Link to="/add" className="btn btn-primary btn-lg">
            Schedule an Event
          </Link>
          <Link to="/view" className="btn btn-secondary btn-lg">
            View All Events
          </Link>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Easy Event Scheduling</h3>
          <p>
            Create detailed community events with date, venue location, organizer contact,
            and descriptions in seconds.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Centralized Registry</h3>
          <p>
            Browse all neighborhood activities in one centralized view, updated live from
            the community database.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚙️</div>
          <h3>Instant Updates & Deletion</h3>
          <p>
            Keep event schedules accurate. Organizers can modify event timing or remove
            cancelled activities with a click.
          </p>
        </div>
      </div>

      <div className="instructions-card">
        <h3>How to Use the System</h3>
        <ol className="instructions-list">
          <li>
            <strong>Add an Event:</strong> Click <em>"Add Event"</em> in the navbar or hero
            button. Fill in the title, description, date, location, organizer name, and 10-digit
            contact number.
          </li>
          <li>
            <strong>View All Events:</strong> Click <em>"View Events"</em> to see all scheduled
            community gatherings in an organized tabular format.
          </li>
          <li>
            <strong>Edit or Remove:</strong> Use the <em>"Update"</em> button in the table to modify
            details or <em>"Delete"</em> to remove an event.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Home;
