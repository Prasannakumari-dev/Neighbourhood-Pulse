import axios from 'axios';

// Base URL configured for both Examly port 8080 or proxy/same-origin
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/events';

class EventService {
  // Get all events
  getAllEvents() {
    return axios.get(API_BASE_URL);
  }

  // Get single event by ID
  getEventById(id) {
    return axios.get(`${API_BASE_URL}/${id}`);
  }

  // Create new event
  createEvent(eventData) {
    return axios.post(API_BASE_URL, eventData);
  }

  // Update event details
  updateEvent(id, eventData) {
    return axios.put(`${API_BASE_URL}/${id}`, eventData);
  }

  // Delete event
  deleteEvent(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
}

export default new EventService();
