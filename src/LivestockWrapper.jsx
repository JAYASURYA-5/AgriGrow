import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LivestockWrapper = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* Header with Back Button */}
      <div style={{ 
        padding: '16px 20px', 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e0e0e0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
      }}>
        <button 
          onClick={handleBack}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#112212', 
            color: 'white', 
            border: 'none',
            borderRadius: '6px', 
            textDecoration: 'none', 
            cursor: 'pointer', 
            fontWeight: 500,
            fontSize: '14px'
          }}
        >
          ← Back
        </button>
        <h1 style={{ margin: 0, color: '#112212', fontSize: '20px', fontWeight: 600 }}>Livestock Management</h1>
        <div style={{ width: '80px' }}></div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e0e0e0',
        padding: '0 20px',
        display: 'flex',
        gap: '20px'
      }}>
        {['Dashboard', 'Animals', 'Health', 'Tracking', 'Feed', 'Reports'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{
              padding: '12px 0',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === tab.toLowerCase() ? '#112212' : '#999',
              fontWeight: activeTab === tab.toLowerCase() ? '600' : '500',
              borderBottom: activeTab === tab.toLowerCase() ? '3px solid #112212' : 'none',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '30px 20px', overflow: 'auto' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ color: '#112212', marginTop: 0, marginBottom: '24px' }}>Farm Livestock Dashboard</h2>
            
            {/* Stats Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {[
                { icon: '🐄', title: 'Total Cattle', value: '45', change: '+2' },
                { icon: '🐑', title: 'Total Sheep', value: '78', change: '+5' },
                { icon: '🐖', title: 'Total Pigs', value: '32', change: '-1' },
                { icon: '🐔', title: 'Total Poultry', value: '156', change: '+12' }
              ].map((stat, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#ffffff',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid #f0f0f0'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                  <div style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>{stat.title}</div>
                  <div style={{ color: '#112212', fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{stat.value}</div>
                  <div style={{ color: '#4CAF50', fontSize: '12px' }}>{stat.change} this month</div>
                </div>
              ))}
            </div>

            {/* Recent Activities */}
            <h3 style={{ color: '#112212', marginBottom: '16px' }}>Recent Activities</h3>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              {[
                { animal: 'Cattle #05', activity: 'Health checkup completed', time: '2 hours ago', status: '✅' },
                { animal: 'Pig #12', activity: 'Feed schedule updated', time: '4 hours ago', status: '✅' },
                { animal: 'Sheep #23', activity: 'Weight recorded', time: '6 hours ago', status: '✅' },
                { animal: 'Poultry #156', activity: 'Daily production logged', time: '8 hours ago', status: '✅' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  padding: '16px 20px',
                  borderBottom: idx < 3 ? '1px solid #f0f0f0' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ color: '#112212', fontWeight: '500', marginBottom: '4px' }}>{item.animal}</div>
                    <div style={{ color: '#999', fontSize: '12px' }}>{item.activity}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>{item.status}</div>
                    <div style={{ color: '#999', fontSize: '11px' }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'animals' && (
          <div>
            <h2 style={{ color: '#112212', marginTop: 0, marginBottom: '24px' }}>Manage Animals</h2>
            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐄</div>
              <p style={{ color: '#999' }}>Animal management module coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div>
            <h2 style={{ color: '#112212', marginTop: 0, marginBottom: '24px' }}>Health Records</h2>
            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚕️</div>
              <p style={{ color: '#999' }}>Health management module coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'tracking' && (
          <div>
            <h2 style={{ color: '#112212', marginTop: 0, marginBottom: '24px' }}>Animal Tracking</h2>
            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
              <p style={{ color: '#999' }}>Tracking module coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'feed' && (
          <div>
            <h2 style={{ color: '#112212', marginTop: 0, marginBottom: '24px' }}>Feed Planning</h2>
            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌾</div>
              <p style={{ color: '#999' }}>Feed planning module coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 style={{ color: '#112212', marginTop: 0, marginBottom: '24px' }}>Reports & Analytics</h2>
            <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <p style={{ color: '#999' }}>Reports module coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivestockWrapper;
