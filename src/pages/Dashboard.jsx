import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabase'          // Login DB
import { supabaseLogs } from '../supabaseLogs'  // Dashboard DB
import './Dashboard.css'

function Dashboard() {
  const [medicineLogs, setMedicineLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [userId, setUserId] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchLogs = async () => {

      // 1️⃣ Get logged-in user from Auth DB
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData.user) {
        console.error('User not logged in')
        setLoading(false)
        return
      }

      const userEmail = userData.user.email

      setUserId(userData.user.id)

      // 2️⃣ Find patient in Dashboard DB
      const { data: patient, error: patientError } = await supabaseLogs
        .from('patients')
        .select('id')
        .eq('email', userEmail)
        .single()

      if (patientError || !patient) {
        console.error('Patient not found in dashboard DB')
        setLoading(false)
        return
      }

      const patientId = patient.id

      // 3️⃣ Fetch only that patient’s logs
      const { data: logs, error: logsError } = await supabaseLogs
        .from('medicine_logs')
        .select('medicine_name, provided_at, nurse_name')
        .eq('patient_id', patientId)
        .order('provided_at', { ascending: false })

      if (logsError) {
        console.error(logsError)
      } else {
        setMedicineLogs(logs)
      }

      setLoading(false)

      // 4️⃣ Fetch uploaded files
      fetchFiles(userData.user.id)
    }

    fetchLogs()
  }, [])

  const fetchFiles = async (uid) => {
    const { data, error } = await supabase.storage
      .from('patient_documents')
      .list(`${uid}/`, { sortBy: { column: 'created_at', order: 'desc' } })

    if (error) {
      console.error('Error listing files:', error)
      return
    }

    const filesWithUrls = (data || [])
      .filter(f => f.name !== '.emptyFolderPlaceholder')
      .map(f => {
        const { data: urlData } = supabase.storage
          .from('patient_documents')
          .getPublicUrl(`${uid}/${f.name}`)
        return {
          ...f,
          url: urlData.publicUrl,
          size: f.metadata?.size || f.size || 0,
          createdAt: f.created_at || f.updated_at || ''
        }
      })

    setFiles(filesWithUrls)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    const maxSize = 10 * 1024 * 1024
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

    if (file.size > maxSize) {
      alert('File too large. Maximum size is 10MB.')
      return
    }
    if (!allowedTypes.includes(file.type)) {
      alert('Unsupported file type. Please upload PDF, JPG, or PNG.')
      return
    }

    setUploading(true)

    const filePath = `${userId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage
      .from('patient_documents')
      .upload(filePath, file, { contentType: file.type, upsert: false })

    if (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file: ' + (error.message || error.statusCode || JSON.stringify(error)))
    } else {
      await fetchFiles(userId)
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDeleteFile = async (fileName) => {
    if (!userId) return
    const { error } = await supabase.storage
      .from('patient_documents')
      .remove([`${userId}/${fileName}`])

    if (error) {
      console.error('Delete error:', error)
      alert('Failed to delete file.')
    } else {
      await fetchFiles(userId)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '—'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (name) => {
    const ext = name.split('.').pop().toLowerCase()
    if (ext === 'pdf') return '📄'
    if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️'
    return '📎'
  }

  return (
    <div className="dashboard-container">

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents &amp; Uploads
        </button>
      </div>

      {/* ─── Documents Tab ─── */}
      {activeTab === 'documents' && (
        <div className="documents-section">
          <div className="documents-header">
            <span className="documents-upload-icon">⬆</span>
            <span className="documents-upload-label">Upload New File</span>
          </div>

          <div
            className="documents-dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('dragover') }}
            onDragLeave={e => e.currentTarget.classList.remove('dragover')}
            onDrop={e => {
              e.preventDefault()
              e.currentTarget.classList.remove('dragover')
              if (e.dataTransfer.files[0]) {
                handleFileUpload({ target: { files: e.dataTransfer.files } })
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <div className="dropzone-plus">+</div>
            <div className="dropzone-text">
              {uploading ? 'Uploading...' : 'Click to upload or drag files here'}
            </div>
            <div className="dropzone-hint">Support for PDF, JPG, PNG (Max 10MB)</div>
          </div>

          <div className="documents-list-header">
            <span className="documents-list-title">Attached Documents</span>
            <span className="documents-list-count">{files.length} File{files.length !== 1 ? 's' : ''}</span>
          </div>

          {files.length === 0 && (
            <div className="documents-empty">No documents uploaded yet.</div>
          )}

          <div className="documents-list">
            {files.map((f, i) => (
              <div className="document-item" key={i}>
                <div className="document-icon">{getFileIcon(f.name)}</div>
                <div className="document-info">
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="document-name">
                    {f.name.replace(/^\d+_/, '')}
                  </a>
                  <span className="document-meta">
                    {formatFileSize(f.size)}
                    {f.createdAt && ` · ${new Date(f.createdAt).toLocaleDateString()}`}
                  </span>
                </div>
                <button className="document-delete" onClick={() => handleDeleteFile(f.name)} title="Delete">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Overview Tab (Medicine Timeline) ─── */}
      {activeTab === 'overview' && (
        <>
          <h2 className="dashboard-title">Medicine Timeline</h2>

          {loading && <div className="dashboard-empty">Loading...</div>}

          {!loading && medicineLogs.length === 0 && (
            <div className="dashboard-empty">No medicine logs found.</div>
          )}

          <div className="dashboard-timeline">
            <div className="timeline">
              {medicineLogs.map((log, index) => (
                <div
                  className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                  key={index}
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-connector"></div>

                  <div className="timeline-card">
                    <div className="timeline-card-header">
                      <span className="timeline-card-title">
                        {log.medicine_name}
                      </span>
                      <span className="timeline-card-date">
                        {new Date(log.provided_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="timeline-card-body">
                      <div className="timeline-card-nurse">
                        Nurse: {log.nurse_name}
                      </div>
                      <div className="timeline-card-time">
                        {new Date(log.provided_at).toLocaleTimeString()}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard