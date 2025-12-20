# Crop Disease Predictor - Setup Guide

## Backend Setup (Python Flask API)

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- flask-cors (CORS support for React)
- Pillow (image processing)
- numpy (numerical operations)

### 2. Start the Backend Server

```bash
python app.py
```

The API will start on `http://localhost:5000`

### 3. Verify Backend is Running

Visit `http://localhost:5000/api/health` in your browser. You should see:
```json
{"status": "ok", "has_image_libs": true}
```

## Frontend Setup (React)

### 1. Install Dependencies (if not already done)

```bash
npm install
```

### 2. Start the React Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## How It Works

### Image Analysis Process

1. **User uploads an image** → Frontend sends image to backend API
2. **Backend analyzes image** using computer vision:
   - Extracts color features (green, brown, yellow, white percentages)
   - Analyzes texture and edge patterns
   - Detects spots and lesions
3. **Prediction algorithm** determines:
   - **Crop type** (Paddy, Tomato, Corn, Potato) based on color patterns
   - **Disease type** based on visual symptoms detected
   - **Confidence score** based on feature consistency
4. **Returns structured data** with disease information from knowledge base

### Supported Crops and Diseases

- **Paddy**: Healthy, Bacterial Leaf Blight, Brown Spot, Blast
- **Tomato**: Healthy, Early Blight, Late Blight, Bacterial Spot
- **Corn**: Healthy, Northern Leaf Blight, Common Rust
- **Potato**: Healthy, Late Blight, Early Blight

### Improving Accuracy

The current implementation uses basic computer vision. For production use, consider:

1. **Train a CNN model** on a large dataset (e.g., PlantVillage dataset)
2. **Use transfer learning** with pre-trained models (ResNet, EfficientNet)
3. **Fine-tune** on your specific crop images
4. **Replace** the `predict_crop_and_disease()` function with model inference

## Testing

1. Upload different crop images (paddy, tomato, corn, potato)
2. Each image should return different predictions based on visual features
3. Check that crop names match the uploaded image type
4. Verify disease predictions vary based on image symptoms

## Troubleshooting

- **Backend not starting**: Check if port 5000 is available
- **CORS errors**: Ensure flask-cors is installed and CORS is enabled
- **Image analysis fails**: Verify Pillow and numpy are installed correctly
- **Same predictions**: Check that backend is running and frontend is connecting to it

