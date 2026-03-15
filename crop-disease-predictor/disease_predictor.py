"""
Load and use the trained plant disease model for predictions.
"""

import os
import json
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

# Model paths
MODEL_DIR = "models"
MODEL_FILE = os.path.join(MODEL_DIR, "plant_disease_model.h5")
CLASS_MAPPING_FILE = os.path.join(MODEL_DIR, "class_mapping.json")
IMAGE_SIZE = (224, 224)

# Global model cache
_model = None
_class_mapping = None


def load_model():
    """Load the trained model from disk."""
    global _model
    if _model is None:
        if not os.path.exists(MODEL_FILE):
            raise FileNotFoundError(
                f"Model not found at {MODEL_FILE}. "
                "Please run train_model.py first."
            )
        _model = tf.keras.models.load_model(MODEL_FILE)
        print(f"✓ Model loaded from {MODEL_FILE}")
    return _model


def load_class_mapping():
    """Load the class name mapping from disk."""
    global _class_mapping
    if _class_mapping is None:
        if not os.path.exists(CLASS_MAPPING_FILE):
            raise FileNotFoundError(
                f"Class mapping not found at {CLASS_MAPPING_FILE}. "
                "Please run train_model.py first."
            )
        with open(CLASS_MAPPING_FILE, 'r') as f:
            _class_mapping = json.load(f)
    return _class_mapping


def preprocess_image(image_bytes):
    """
    Preprocess image bytes for model inference.
    
    Args:
        image_bytes: Raw image bytes
        
    Returns:
        Preprocessed image array ready for model
    """
    # Load image from bytes
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    
    # Resize to model input size
    img = img.resize(IMAGE_SIZE)
    
    # Normalize to [0, 1]
    img_array = np.array(img, dtype=np.float32) / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array


def predict_disease(image_bytes):
    """
    Predict crop disease from image bytes.
    
    Args:
        image_bytes: Raw image bytes from upload
        
    Returns:
        Dictionary with prediction results
    """
    model = load_model()
    class_mapping = load_class_mapping()
    
    # Preprocess image
    img_array = preprocess_image(image_bytes)
    
    # Make prediction
    predictions = model.predict(img_array, verbose=0)
    confidence_scores = predictions[0]
    
    # Get top prediction
    predicted_idx = np.argmax(confidence_scores)
    predicted_class = class_mapping[str(predicted_idx)]
    confidence = float(confidence_scores[predicted_idx]) * 100
    
    # Get top 3 predictions
    top_3_indices = np.argsort(confidence_scores)[::-1][:3]
    top_3_predictions = [
        {
            "disease": class_mapping[str(idx)],
            "confidence": float(confidence_scores[idx]) * 100
        }
        for idx in top_3_indices
    ]
    
    # Parse disease name (format usually: "CropName___DiseaseName")
    # Handle both "___" (three underscores) and "__" (two underscores) formats
    crop_name, disease_name = _extract_crop_and_disease(predicted_class)
    
    # Determine if healthy or diseased
    is_healthy = "healthy" in disease_name.lower()
    
    return {
        "disease_detected": not is_healthy,
        "disease_name": disease_name.strip(),
        "crop": crop_name.strip(),
        "confidence": round(confidence, 2),
        "top_predictions": top_3_predictions,
        "raw_prediction": predicted_class
    }


def get_disease_info(disease_name, crop_name):
    """
    Get treatment and prevention info for a disease.
    This is a knowledge base that maps diseases to their treatment.
    
    Args:
        disease_name: Name of the disease
        crop_name: Name of the crop
        
    Returns:
        Dictionary with treatment and prevention info
    """
    
    # Knowledge base of common plant diseases
    disease_knowledge = {
        "early_blight": {
            "symptoms": [
                "Dark concentric spots on older leaves",
                "Yellowing around lesions",
                "Lower leaves wilting"
            ],
            "causes": [
                "Fungal pathogen Alternaria solani",
                "High humidity and warm temperatures"
            ],
            "treatment": [
                "Remove infected leaves; avoid overhead watering",
                "Apply chlorothalonil/mancozeb fungicide every 7-10 days",
                "Improve airflow; stake/prune plants"
            ],
            "prevention": [
                "Rotate crops; avoid planting in same spot yearly",
                "Use resistant varieties and clean debris",
                "Mulch to reduce soil splash"
            ]
        },
        "late_blight": {
            "symptoms": [
                "Water-soaked spots on leaves and stems",
                "White mold on leaf undersides",
                "Rapid spread in humid conditions"
            ],
            "causes": [
                "Phytophthora infestans fungus",
                "Cool wet weather"
            ],
            "treatment": [
                "Remove and destroy infected plant parts",
                "Apply copper or chlorothalonil fungicide",
                "Reduce humidity by improving air circulation"
            ],
            "prevention": [
                "Plant resistant varieties",
                "Space plants for air circulation",
                "Avoid overhead watering"
            ]
        },
        "powdery_mildew": {
            "symptoms": [
                "White powdery coating on leaves",
                "Leaves may curl and wither",
                "Affects new growth first"
            ],
            "causes": [
                "Fungal infection",
                "Warm days and cool nights",
                "Poor air circulation"
            ],
            "treatment": [
                "Apply sulfur or neem oil fungicide",
                "Remove heavily infected leaves",
                "Improve air circulation"
            ],
            "prevention": [
                "Maintain good spacing",
                "Avoid overhead watering",
                "Remove plant debris"
            ]
        },
        "leaf_spot": {
            "symptoms": [
                "Brown or black spots on leaves",
                "Spots may have yellow halos",
                "Spots enlarge over time"
            ],
            "causes": [
                "Fungal or bacterial infection",
                "High humidity"
            ],
            "treatment": [
                "Remove infected leaves",
                "Apply fungicide regularly",
                "Improve air flow"
            ],
            "prevention": [
                "Avoid wetting foliage",
                "Clean up plant debris",
                "Rotate crops"
            ]
        },
        "rust": {
            "symptoms": [
                "Orange, brown, or yellow pustules on leaf undersides",
                "Yellow spots above",
                "Leaves may drop prematurely"
            ],
            "causes": [
                "Fungal spores",
                "Moderate temperature and high humidity"
            ],
            "treatment": [
                "Apply sulfur or copper fungicide",
                "Remove infected leaves",
                "Improve air circulation"
            ],
            "prevention": [
                "Remove alternate hosts",
                "Improve spacing",
                "Avoid wetting foliage"
            ]
        }
    }
    
    # Normalize disease name for lookup
    normalized_disease = disease_name.lower().replace(" ", "_")
    
    # Try exact match first
    if normalized_disease in disease_knowledge:
        return disease_knowledge[normalized_disease]
    
    # Try partial match
    for key in disease_knowledge:
        if key in normalized_disease or normalized_disease in key:
            return disease_knowledge[key]
    
    # Default generic response
    return {
        "symptoms": [
            "Visible discoloration or spotting on leaves",
            "Abnormal growth patterns",
            "Wilting or leaf drop"
        ],
        "causes": [
            "Various pathogenic organisms",
            "Environmental stress"
        ],
        "treatment": [
            "Isolate infected plants",
            "Apply broad-spectrum fungicide or pesticide",
            "Consult local agricultural extension"
        ],
        "prevention": [
            "Maintain plant hygiene",
            "Ensure proper spacing and air circulation",
            "Practice crop rotation"
        ]
    }

def _extract_crop_and_disease(class_name):
    """
    Extract crop name and disease name from class label.
    
    Handles multiple formats:
    - "CropName___DiseaseName" (three underscores)
    - "CropName__DiseaseName" (two underscores)
    - "CropName_DiseaseName" (single underscore)
    
    Args:
        class_name: Raw class name from model prediction
        
    Returns:
        Tuple of (crop_name, disease_name)
    """
    # Try three underscores first (most common format)
    if "___" in class_name:
        parts = class_name.split("___", 1)  # Split on first occurrence
        if len(parts) == 2:
            crop_name, disease_name = parts
            # Clean up and format properly
            crop_name = _format_name(crop_name)
            disease_name = _format_name(disease_name)
            return crop_name, disease_name
    
    # Try two underscores
    if "__" in class_name:
        parts = class_name.split("__", 1)
        if len(parts) == 2:
            crop_name, disease_name = parts
            crop_name = _format_name(crop_name)
            disease_name = _format_name(disease_name)
            return crop_name, disease_name
    
    # Try single underscore (fallback)
    if "_" in class_name:
        parts = class_name.rsplit("_", 1)  # Split on last underscore
        if len(parts) == 2 and len(parts[0]) > 0 and len(parts[1]) > 0:
            crop_name, disease_name = parts
            crop_name = _format_name(crop_name)
            disease_name = _format_name(disease_name)
            return crop_name, disease_name
    
    # If no separator found, return the whole thing as disease name
    return "Unknown", _format_name(class_name)


def _format_name(name):
    """
    Format a name string nicely (title case, replace underscores with spaces).
    
    Args:
        name: Raw name string
        
    Returns:
        Formatted name string
    """
    # Replace underscores and hyphens with spaces
    formatted = name.replace("_", " ").replace("-", " ")
    # Title case
    formatted = " ".join(word.capitalize() for word in formatted.split())
    return formatted