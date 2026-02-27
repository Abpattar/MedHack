import React, { useEffect, useState } from 'react'
import { supabaseLogs } from '../supabaseLogs'
import './Dashboard.css'

function Dashboard() {
  const [medicineLogs, setMedicineLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabaseLogs
        .from('medicine_logs')
        .select('medicine_name, provided_at, nurse_name')
        .order('provided_at', { ascending: false })

      if (error) {
        console.error(error)
      } else {
        setMedicineLogs(data)
      }

      setLoading(false)
    }

    fetchLogs()
  }, [])

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Medicine Timeline</h2>

      {loading && <div className="dashboard-empty">Loading...</div>}

      {!loading && medicineLogs.length === 0 && (
        <div className="dashboard-empty">No medicine logs found.</div>
      )}
<div className="dashboard-timeline">
  <div className="timeline">
    {medicineLogs.map((log, index) => (
      <div className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`} key={index}>
        <div className="timeline-dot"></div>
        <div className="timeline-connector"></div>
        <div className="timeline-card">
          <div className="timeline-card-header">
            <span className="timeline-card-title">{log.medicine_name}</span>
            <span className="timeline-card-date">{new Date(log.provided_at).toLocaleDateString()}</span>
          </div>
          <div className="timeline-card-body">
            <div className="timeline-card-nurse">Nurse: {log.nurse_name}</div>
            <div className="timeline-card-time">{new Date(log.provided_at).toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
    </div>
  )
}

export default Dashboard