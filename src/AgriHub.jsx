import React from 'react';

const AgriHub = () => {
  return (
    <div className="agrihub-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#eaf6e0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#2d5016' }}>AgriHub</h1>
      <img
        src="/image.png"
        alt="AgriGrow Smart Agriculture Hardware System"
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '18px', boxShadow: '0 4px 24px rgba(44, 62, 80, 0.15)' }}
      />
    </div>
  );
};

export default AgriHub;
