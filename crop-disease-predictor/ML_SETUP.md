# Crop Disease Predictor - ML Setup Guide

This guide explains how to set up and train the crop disease prediction model using the Kaggle PlantDisease dataset.

## Quick Start

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Kaggle API Credentials

The model training uses the Kaggle CLI to download the PlantDisease dataset.

**Steps:**
1. Go to https://www.kaggle.com/settings/account
2. Click "Create New API Token" (downloads `kaggle.json`)
3. Create the `.kaggle` directory in your home folder:
   ```bash
   mkdir ~/.kaggle
   ```
4. Move the downloaded `kaggle.json` to `~/.kaggle/`
5. Set proper permissions (Linux/Mac):
   ```bash
   chmod 600 ~/.kaggle/kaggle.json
   ```

### 3. Train the Model

```bash
python train_model.py
```

**What this does:**
- Downloads the PlantDisease dataset from Kaggle (~900MB)
- Extracts and processes images
- Builds a CNN using transfer learning (MobileNetV2)
- Trains on ~70,000 images across 38 disease classes
- Saves the trained model to `models/plant_disease_model.h5`
- Saves class mapping to `models/class_mapping.json`

**Training Details:**
- **Model**: MobileNetV2 pre-trained on ImageNet
- **Input Size**: 224×224 pixels
- **Batch Size**: 32
- **Epochs**: 20 (with early stopping)
- **Expected Accuracy**: 95-98% on validation set

### 4. Start the Backend Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 5. Start the Frontend (in another terminal)

```bash
npm install
npm start
```

## Dataset Information

The **PlantDisease** dataset contains:
- **~70,000 images** of plant leaves
- **38 disease classes** across various crops:
  - Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper
  - Potato, Raspberry, Rice, Soybean, Squash, Strawberry, Tomato, etc.
- Each class includes both diseased and healthy leaf images
- High-quality RGB images with varied backgrounds

**Dataset URL**: https://www.kaggle.com/datasets/emmarex/plantdisease

## How It Works

### Training Pipeline (`train_model.py`)

1. **Data Download**: Uses Kaggle API to download and extract dataset
2. **Data Loading**: Recursively loads images and creates labels
3. **Preprocessing**: Resizes to 224×224 and normalizes to [0, 1]
4. **Model Architecture**:
   ```
   Input Image (224×224×3)
   ↓
   MobileNetV2 (pre-trained) → Feature Extraction
   ↓
   Global Average Pooling
   ↓
   Dense(512, ReLU) + Dropout(0.3)
   ↓
   Dense(256, ReLU) + Dropout(0.2)
   ↓
   Dense(num_classes, Softmax) → Disease Classification
   ```
5. **Training**: Adam optimizer with learning rate scheduling
6. **Evaluation**: Reports accuracy and loss on validation set

### Prediction Pipeline (`disease_predictor.py`)

1. **Image Preprocessing**: Converts bytes to normalized array
2. **Model Inference**: Passes through trained model
3. **Result Processing**: Gets top 3 predictions with confidence scores
4. **Knowledge Mapping**: Links prediction to treatment/prevention info
5. **Response Format**: Returns structured JSON with disease details

### API Endpoint (`app.py`)

**POST** `/api/predict`
- **Input**: Multipart form data with image file
- **Output**: JSON with disease prediction and treatment info

**Example Response:**
```json
{
  "disease_detected": true,
  "disease_name": "Early Blight",
  "affected_crop": "Tomato",
  "confidence": 94.2,
  "severity": "High",
  "symptoms": [
    "Dark concentric spots on older leaves",
    "Yellowing around lesions"
  ],
  "causes": [
    "Fungal pathogen Alternaria solani",
    "High humidity"
  ],
  "treatment": [
    "Remove infected leaves",
    "Apply fungicide every 7-10 days"
  ],
  "prevention": [
    "Rotate crops yearly",
    "Use resistant varieties"
  ],
  "top_predictions": [
    {"disease": "Early Blight", "confidence": 94.2},
    {"disease": "Late Blight", "confidence": 3.8},
    {"disease": "Leaf Spot", "confidence": 1.2}
  ]
}
```

## Model Files

After training, you'll have:

- **`models/plant_disease_model.h5`**: Trained model (~90MB)
- **`models/class_mapping.json`**: Mapping of class indices to disease names

## Troubleshooting

### "Model not found" error
```
Solution: Run python train_model.py first to train and save the model
```

### Kaggle API authentication error
```
Solution: Check that ~/.kaggle/kaggle.json exists and has correct permissions
chmod 600 ~/.kaggle/kaggle.json
```

### Out of memory during training
```
Solution: Reduce BATCH_SIZE in train_model.py (try 16 or 8)
```

### Slow training on CPU
```
Solution: Install GPU support for TensorFlow (CUDA/cuDNN)
or use Google Colab for free GPU access
```

### Low accuracy on predictions
```
Solution: 
1. Ensure images are well-lit and clear
2. Make sure leaf is in focus
3. Try different crop/disease combinations from the dataset
```

## Performance Metrics

Expected performance on the test set:
- **Overall Accuracy**: 96-98%
- **Inference Time**: ~100-200ms per image
- **Model Size**: ~90MB

## Advanced Usage

### Fine-tuning the Model

To improve accuracy, you can fine-tune the base model:

```python
# In train_model.py, after initial training:
base_model.trainable = True  # Unfreeze base model
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.0001),  # Lower LR
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
model.fit(X_train, y_train, ...)  # Train again for 5-10 epochs
```

### Using Different Pre-trained Models

Replace MobileNetV2 with other models:
```python
from tensorflow.keras.applications import (
    ResNet50,  # Higher accuracy but slower
    EfficientNetB0,  # Good balance
    InceptionV3  # Higher accuracy but slower
)
```

## Next Steps

1. Deploy the model to a cloud service (AWS, GCP, Azure)
2. Add more crops/diseases to the knowledge base
3. Implement user feedback to retrain and improve model
4. Add confidence threshold warnings for low-confidence predictions
5. Integrate with real-time camera feeds for in-field detection

## References

- **Dataset**: https://www.kaggle.com/datasets/emmarex/plantdisease
- **TensorFlow**: https://tensorflow.org
- **MobileNetV2**: https://arxiv.org/abs/1801.04381
- **Transfer Learning**: https://www.tensorflow.org/guide/transfer_learning
