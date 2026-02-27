import React, { useState } from 'react';
import './Dashboard.css';

const dummyHistory = [
  {
    doctor: 'Dr. Ayesha Khan',
    specialty: 'Cardiologist',
    date: '2026-02-10',
    location: 'Medrox Clinic, Lahore',
  },
  {
    doctor: 'Dr. Imran Siddiqui',
    specialty: 'Dermatologist',
    date: '2026-01-22',
    location: 'Medrox Clinic, Karachi',
  },
  {
    doctor: 'Dr. Sara Malik',
    specialty: 'Pediatrician',
    date: '2025-12-15',
    location: 'Medrox Clinic, Islamabad',
  },
];

function Dashboard() {
  const [history] = useState(dummyHistory);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Doctor Visit History</h2>
      <div className="dashboard-history-list">
        {history.length === 0 ? (
          <div className="dashboard-empty">No history found.</div>
        ) : (
          history.map((item, idx) => (
            <div className="dashboard-history-item" key={idx}>
              <div className="dashboard-history-doctor">{item.doctor}</div>
              <div className="dashboard-history-specialty">{item.specialty}</div>
              <div className="dashboard-history-date">Visited: {item.date}</div>
              <div className="dashboard-history-location">{item.location}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
