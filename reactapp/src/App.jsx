import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link
} from 'react-router-dom';

import Home from './components/Home';
import AddEvent from './components/AddEvent';
import ViewEvent from './components/ViewEvent';
import UpdateEvent from './components/UpdateEvent';
import CommunityReports from './components/CommunityReports';
import NeighbourhoodMap from './components/NeighbourhoodMap';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <header className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-brand">
              <span className="nav-brand-icon">🏘️</span>
              <span>Neighbourhood Pulse</span>
            </Link>

            <nav>
              <ul className="nav-links">
                <li>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                  >
                    Home
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/add"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                  >
                    Add Event
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/view"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                  >
                    View Events
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/community"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                  >
                    Community Pulse
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/map"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                  >
                    Neighbourhood Map
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddEvent />} />
            <Route path="/view" element={<ViewEvent />} />
            <Route path="/update/:id" element={<UpdateEvent />} />
            <Route path="/community" element={<CommunityReports />} />
            <Route path="/map" element={<NeighbourhoodMap />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;