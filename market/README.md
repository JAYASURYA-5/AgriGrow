# Agri Market Dashboard

A modern web application for visualizing agricultural market prices and trends. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Interactive Filters**: Filter by category, commodity, state, districts, date range, and calculation type
- **Price Visualization**: View current prices with month-over-month changes
- **Historical Data Table**: Scrollable table showing detailed price history
- **Interactive Charts**: Time-series charts with toggleable price lines (Modal, Min, Max)
- **Data Export**: Download price data as CSV
- **Responsive Design**: Works on desktop and tablet devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # React components
│   ├── Filters.tsx      # Filter controls
│   ├── LeftPanel.tsx    # Price display and table
│   ├── RightPanel.tsx   # Chart display
│   ├── PriceChart.tsx   # Interactive chart component
│   └── PriceTable.tsx   # Data table component
├── data/            # Mock data
│   └── mockData.ts     # Sample commodity data
├── types.ts         # TypeScript type definitions
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Chart library
- **date-fns** - Date utilities

## Mock Data

The application includes sample data for:
- Wheat (Cereals category)
- Jasmine (Flowers and Herbs category)

You can switch between commodities using the filter dropdown.

## Future Enhancements

- Connect to real API endpoints
- Add heatmap and bar chart visualizations
- Implement quantity/arrival data
- Add data comparison features
- Export charts as images
- Share chart functionality

