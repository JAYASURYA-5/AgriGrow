import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/Contexts';
import '../styles/Certificate.css';

/**
 * Certificate Viewer - Display earned certificates and allow printing
 * Features: Certificate gallery, details, download, printing
 */
const CertificateViewer = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [viewMode, setViewMode] = useState('gallery'); // gallery or detail

  // Fetch certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/lms/certificates', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to load certificates');
        const data = await response.json();
        setCertificates(data.certificates || []);
        setError(null);
      } catch (err) {
        console.error('Certificates error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCertificates();
  }, [user]);

  const handleCertificateSelect = (cert) => {
    setSelectedCert(cert);
    setViewMode('detail');
  };

  const handlePrint = () => {
    if (!selectedCert) return;
    window.print();
  };

  const handleDownload = async () => {
    if (!selectedCert) return;

    try {
      const response = await fetch(
        `/api/lms/certificates/${selectedCert.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Download failed');

      // Create blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedCert.certificate_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="certificate-viewer loading">
        <div className="spinner"></div>
        <p>Loading your certificates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="certificate-viewer error">
        <div className="error-box">
          <h2>⚠️ Error Loading Certificates</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate-viewer">
      {/* Gallery View */}
      {viewMode === 'gallery' && (
        <>
          <div className="certificates-header">
            <h1>🏆 Your Certificates</h1>
            <p>
              {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
            </p>
          </div>

          {certificates.length > 0 ? (
            <div className="certificates-grid">
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  className="certificate-card"
                  onClick={() => handleCertificateSelect(cert)}
                >
                  {/* Certificate Preview */}
                  <div className="cert-preview">
                    <div className="cert-ribbon">✓</div>
                    <div className="cert-header">Certificate of Completion</div>
                    <div className="cert-course">{cert.course_title}</div>
                    <div className="cert-number">{cert.certificate_number}</div>
                    <div className="cert-date">Issued {formatDate(cert.issued_date)}</div>
                  </div>

                  {/* Certificate Info */}
                  <div className="card-info">
                    <h3>{cert.course_title}</h3>
                    <p className="cert-id">ID: {cert.certificate_number}</p>
                    <p className="cert-score">Score: {Math.round(cert.score)}%</p>
                    <button className="btn-primary view-btn">View Certificate →</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📜</div>
              <h2>No Certificates Yet</h2>
              <p>Complete courses to earn certificates and showcase your skills</p>
            </div>
          )}
        </>
      )}

      {/* Detail View */}
      {viewMode === 'detail' && selectedCert && (
        <div className="certificate-detail">
          {/* Back Button */}
          <button
            className="back-btn"
            onClick={() => setViewMode('gallery')}
          >
            ← Back to Certificates
          </button>

          {/* Certificate Display */}
          <div className="certificate-display printable">
            {/* Certificate Outer Frame */}
            <div className="certificate-outer">
              {/* Certificate Border */}
              <div className="certificate-border">
                {/* Main Content */}
                <div className="certificate-main">
                  {/* Header Section */}
                  <div className="cert-header-section">
                    <div className="seal-left">🌾</div>
                    <div className="header-content">
                      <h1 className="cert-title">Certificate of Completion</h1>
                      <p className="cert-subtitle">AgriGrow Learning Platform</p>
                    </div>
                    <div className="seal-right">🥇</div>
                  </div>

                  {/* Recipient Section */}
                  <div className="recipient-section">
                    <p className="label">This is to certify that</p>
                    <h2 className="recipient-name">{selectedCert.recipient_name}</h2>
                    <p className="label">has successfully completed</p>
                  </div>

                  {/* Course Section */}
                  <div className="course-section">
                    <h3 className="course-name">{selectedCert.course_title}</h3>
                    <p className="course-details">
                      Level: {selectedCert.course_level}
                      <span className="separator">•</span>
                      Score: {Math.round(selectedCert.score)}%
                    </p>
                  </div>

                  {/* Details Section */}
                  <div className="details-section">
                    <div className="detail-item">
                      <span className="detail-label">Certificate Number</span>
                      <span className="detail-value">{selectedCert.certificate_number}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Issued Date</span>
                      <span className="detail-value">{formatDate(selectedCert.issued_date)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Learning Partner</span>
                      <span className="detail-value">AgriGrow Agricultural Network</span>
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div className="signature-section">
                    <div className="signature-line">
                      <span className="signature">_________________</span>
                    </div>
                    <div className="signature-title">Platform Director</div>
                  </div>

                  {/* Verification Code */}
                  <div className="verification-section">
                    <p className="verify-text">Verify this certificate at agrigrow.edu/verify/{selectedCert.certificate_number}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="certificate-details">
            <h2>{selectedCert.course_title}</h2>
            <div className="details-grid">
              <div className="detail-box">
                <h4>📊 Performance</h4>
                <p className="score">{Math.round(selectedCert.score)}%</p>
              </div>
              <div className="detail-box">
                <h4>📅 Issued</h4>
                <p>{formatDate(selectedCert.issued_date)}</p>
              </div>
              <div className="detail-box">
                <h4>⏱️ Duration</h4>
                <p>{selectedCert.course_duration_hours} hours</p>
              </div>
              <div className="detail-box">
                <h4>🎓 Level</h4>
                <p>{selectedCert.course_level}</p>
              </div>
            </div>

            {/* Skills Earned */}
            {selectedCert.skills_earned && (
              <div className="skills-section">
                <h3>Skills You've Learned</h3>
                <div className="skills-list">
                  {selectedCert.skills_earned.map((skill, idx) => (
                    <span key={idx} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="detail-actions">
              <button className="btn-secondary" onClick={handlePrint}>
                🖨️ Print Certificate
              </button>
              <button className="btn-primary" onClick={handleDownload}>
                ⬇️ Download PDF
              </button>
              <button className="btn-secondary share-btn">
                📤 Share Achievement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateViewer;
