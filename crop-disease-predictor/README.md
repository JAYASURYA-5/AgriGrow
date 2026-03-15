# Crop Disease Predictor

A modern React web application for predicting crop diseases from images. Upload an image of a diseased crop, and the app will analyze it to identify the disease and provide step-by-step treatment guidance.

## Features

- 🖼️ **Image Upload**: Drag-and-drop or click to upload crop images
- 🔍 **Disease Detection**: AI-powered analysis to identify crop diseases
- 📋 **Treatment Guide**: Step-by-step treatment instructions
- 🛡️ **Prevention Tips**: Recommendations to prevent future outbreaks
- 📊 **Detailed Information**: Symptoms, causes, severity, and confidence scores
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
crop-disease-predictor/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ImageUpload.js
│   │   ├── ImageUpload.css
│   │   ├── Results.js
│   │   └── Results.css
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## API Integration

The app currently uses a mock API for demonstration purposes. To integrate with a real disease prediction API:

1. Open `src/services/api.js`
2. Replace the `mockAnalyzeDisease` function with your actual API endpoint
3. Update the request format to match your API's requirements

### Example API Integration

```javascript
const response = await fetch('YOUR_API_ENDPOINT', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    image: base64Data,
  }),
});

const data = await response.json();
return formatResponse(data);
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## Technologies Used

- React 18
- CSS3 (with modern features)
- File API for image handling
- Base64 encoding for image processing

## Future Enhancements

- Integration with real disease prediction APIs
- Support for multiple image formats
- History of previous analyses
- Export results as PDF
- Multi-language support

## License

MIT

