import React from 'react';
import './CropCalendar.css';

const cropData = [
  {
    crop: 'Rice',
    season: 'Kharif',
    seasonType: 'kharif',
    sowing: 'June-July',
    harvesting: 'October-November',
    duration: '120 days',
    soil: 'Clay/Loamy'
  },
  {
    crop: 'Wheat',
    season: 'Rabi',
    seasonType: 'rabi',
    sowing: 'November-December',
    harvesting: 'April-May',
    duration: '120 days',
    soil: 'Loamy'
  },
  {
    crop: 'Cotton',
    season: 'Kharif',
    seasonType: 'kharif',
    sowing: 'April-May',
    harvesting: 'October-December',
    duration: '180 days',
    soil: 'Black/Loamy'
  },
  {
    crop: 'Sugarcane',
    season: 'Year-round',
    seasonType: 'year-round',
    sowing: 'February-March',
    harvesting: 'December-March',
    duration: '365 days',
    soil: 'Loamy'
  },
  {
    crop: 'Maize',
    season: 'Kharif',
    seasonType: 'kharif',
    sowing: 'June-July',
    harvesting: 'September-October',
    duration: '90 days',
    soil: 'Loamy/Sandy'
  },
  {
    crop: 'Soybean',
    season: 'Kharif',
    seasonType: 'kharif',
    sowing: 'June-July',
    harvesting: 'October-November',
    duration: '90 days',
    soil: 'Clay/Loamy'
  },
  {
    crop: 'Groundnut',
    season: 'Kharif',
    seasonType: 'kharif',
    sowing: 'June-July',
    harvesting: 'October-November',
    duration: '120 days',
    soil: 'Sandy/Loamy'
  },
  {
    crop: 'Mustard',
    season: 'Rabi',
    seasonType: 'rabi',
    sowing: 'October-November',
    harvesting: 'February-March',
    duration: '120 days',
    soil: 'Loamy'
  },
  {
    crop: 'Gram (Chickpea)',
    season: 'Rabi',
    seasonType: 'rabi',
    sowing: 'October-November',
    harvesting: 'March-April',
    duration: '150 days',
    soil: 'Clay/Loamy'
  }
];

const CropCalendar = () => {
  return (
    <div className="crop-calendar-container">
      <header className="header">
        <h1>
          <span className="icon">📅</span> Crop Calendar
        </h1>
      </header>

      <div className="guide-box">
        <p>
          <strong>Crop Calendar Guide:</strong> Plan your agricultural activities throughout the year with planting and harvesting schedules for major crops.
        </p>
      </div>

      <div className="table-wrapper">
        <div className="table-container">
          <table className="crop-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Season</th>
                <th>Sowing Time</th>
                <th>Harvesting Time</th>
                <th>Duration (Days)</th>
                <th>Best Soil</th>
              </tr>
            </thead>
            <tbody>
              {cropData.map((item, index) => (
                <tr key={index}>
                  <td className="crop-name">{item.crop}</td>
                  <td>
                    <span className={`badge ${item.seasonType}`}>
                      {item.season}
                    </span>
                  </td>
                  <td>{item.sowing}</td>
                  <td>{item.harvesting}</td>
                  <td>{item.duration}</td>
                  <td>{item.soil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CropCalendar;
