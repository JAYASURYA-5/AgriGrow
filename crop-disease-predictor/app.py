"""
Crop disease prediction backend using image analysis.
This Flask app analyzes uploaded images using computer vision techniques
to detect crop type and disease patterns.
"""

from __future__ import annotations

import base64
import os
import hashlib
from io import BytesIO
from typing import Dict, Any, Tuple

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

try:
    from PIL import Image
    import numpy as np
    HAS_IMAGE_LIBS = True
except ImportError:
    print("⚠️  Warning: PIL/numpy not installed. Install with: pip install Pillow numpy")
    HAS_IMAGE_LIBS = False

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Disease knowledge base
DISEASE_DATABASE = {
    "paddy": {
        "healthy": {
            "symptoms": ["Bright green leaves", "No spots or discoloration", "Normal growth"],
            "causes": [],
            "treatment": ["Maintain proper water levels", "Apply balanced fertilizer"],
            "prevention": ["Use certified seeds", "Practice crop rotation", "Monitor water quality"]
        },
        "bacterial_leaf_blight": {
            "symptoms": ["Yellow to white streaks along leaf veins", "Lesions with wavy margins", "Leaves turn yellow and dry"],
            "causes": ["Bacterium Xanthomonas oryzae", "High humidity", "Wet conditions"],
            "treatment": ["Apply copper-based bactericides", "Remove infected plants", "Drain standing water"],
            "prevention": ["Use resistant varieties", "Avoid overhead irrigation", "Clean equipment between fields"]
        },
        "brown_spot": {
            "symptoms": ["Small brown spots on leaves", "Spots enlarge and merge", "Leaves turn yellow"],
            "causes": ["Fungal pathogen Bipolaris oryzae", "High humidity", "Poor drainage"],
            "treatment": ["Apply fungicides like propiconazole", "Improve field drainage", "Remove infected debris"],
            "prevention": ["Use disease-free seeds", "Maintain proper spacing", "Avoid excessive nitrogen"]
        },
        "blast": {
            "symptoms": ["Diamond-shaped lesions", "Gray centers with brown margins", "Severe leaf damage"],
            "causes": ["Fungal pathogen Magnaporthe oryzae", "High humidity", "Cool temperatures"],
            "treatment": ["Apply tricyclazole or azoxystrobin", "Remove infected plants", "Improve air circulation"],
            "prevention": ["Use resistant varieties", "Avoid excessive nitrogen", "Maintain proper spacing"]
        }
    },
    "tomato": {
        "healthy": {
            "symptoms": ["Green healthy leaves", "No spots or discoloration", "Normal growth"],
            "causes": [],
            "treatment": [],
            "prevention": ["Regular monitoring", "Proper watering", "Balanced nutrition"]
        },
        "early_blight": {
            "symptoms": ["Dark brown spots with concentric rings", "Yellowing around lesions", "Lower leaves affected first"],
            "causes": ["Fungal pathogen Alternaria solani", "High humidity", "Warm temperatures"],
            "treatment": ["Apply chlorothalonil or mancozeb fungicide", "Remove infected leaves", "Improve air circulation"],
            "prevention": ["Use resistant varieties", "Crop rotation", "Avoid overhead watering"]
        },
        "late_blight": {
            "symptoms": ["Water-soaked lesions", "White mold on underside", "Rapid leaf death"],
            "causes": ["Fungal pathogen Phytophthora infestans", "Cool wet conditions", "High humidity"],
            "treatment": ["Apply copper-based fungicides", "Remove infected plants immediately", "Improve drainage"],
            "prevention": ["Use resistant varieties", "Avoid overhead irrigation", "Proper spacing"]
        },
        "bacterial_spot": {
            "symptoms": ["Small dark spots", "Yellow halos around spots", "Leaves may drop"],
            "causes": ["Bacterial pathogens", "Wet conditions", "Warm temperatures"],
            "treatment": ["Apply copper-based bactericides", "Remove infected leaves", "Avoid overhead watering"],
            "prevention": ["Use disease-free seeds", "Crop rotation", "Proper spacing"]
        }
    },
    "corn": {
        "healthy": {
            "symptoms": ["Green healthy leaves", "No spots or discoloration"],
            "causes": [],
            "treatment": [],
            "prevention": ["Proper nutrition", "Regular monitoring"]
        },
        "northern_leaf_blight": {
            "symptoms": ["Long elliptical gray-green lesions", "Lesions turn brown", "Severe defoliation"],
            "causes": ["Fungal pathogen Exserohilum turcicum", "High humidity", "Warm temperatures"],
            "treatment": ["Apply fungicides like propiconazole", "Remove infected debris", "Improve air circulation"],
            "prevention": ["Use resistant hybrids", "Crop rotation", "Proper spacing"]
        },
        "common_rust": {
            "symptoms": ["Small reddish-brown pustules", "Pustules rupture releasing spores", "Yellowing of leaves"],
            "causes": ["Fungal pathogen Puccinia sorghi", "High humidity", "Moderate temperatures"],
            "treatment": ["Apply fungicides early", "Remove infected leaves", "Improve air flow"],
            "prevention": ["Use resistant varieties", "Avoid late planting", "Proper spacing"]
        }
    },
    "potato": {
        "healthy": {
            "symptoms": ["Green healthy leaves", "No spots"],
            "causes": [],
            "treatment": [],
            "prevention": []
        },
        "late_blight": {
            "symptoms": ["Dark water-soaked lesions", "White mold on underside", "Rapid spread"],
            "causes": ["Fungal pathogen Phytophthora infestans", "Cool wet weather"],
            "treatment": ["Apply fungicides immediately", "Remove infected plants", "Improve drainage"],
            "prevention": ["Use certified seed", "Crop rotation", "Avoid overhead irrigation"]
        },
        "early_blight": {
            "symptoms": ["Dark spots with concentric rings", "Yellowing leaves", "Lower leaves affected"],
            "causes": ["Fungal pathogen Alternaria solani", "High humidity"],
            "treatment": ["Apply fungicides", "Remove infected leaves", "Improve air circulation"],
            "prevention": ["Crop rotation", "Proper spacing", "Avoid overhead watering"]
        }
    }
}


def analyze_image_features(image_bytes: bytes) -> Dict[str, Any]:
    """
    Analyze image to extract features for crop and disease detection.
    
    Returns:
        Dictionary with extracted features
    """
    if not HAS_IMAGE_LIBS:
        return {"error": "Image processing libraries not available"}
    
    try:
        img = Image.open(BytesIO(image_bytes))
        img = img.convert('RGB')
        
        # Resize for consistent analysis
        img_resized = img.resize((224, 224))
        img_array = np.array(img_resized)
        
        # Calculate color statistics
        mean_color = np.mean(img_array, axis=(0, 1))
        std_color = np.std(img_array, axis=(0, 1))
        
        # Convert to HSV for better color analysis
        img_hsv = img.convert('HSV')
        hsv_array = np.array(img_hsv)
        
        # Analyze green content (indicator of healthy leaves)
        green_mask = (hsv_array[:, :, 0] > 40) & (hsv_array[:, :, 0] < 80)
        green_percentage = np.sum(green_mask) / (hsv_array.shape[0] * hsv_array.shape[1]) * 100
        
        # Analyze brown/yellow content (indicator of disease)
        brown_yellow_mask = ((hsv_array[:, :, 0] > 15) & (hsv_array[:, :, 0] < 40)) | \
                           ((hsv_array[:, :, 0] > 0) & (hsv_array[:, :, 0] < 15))
        brown_yellow_percentage = np.sum(brown_yellow_mask) / (hsv_array.shape[0] * hsv_array.shape[1]) * 100
        
        # Analyze white/light areas (indicator of powdery mildew or spots)
        white_mask = hsv_array[:, :, 2] > 200
        white_percentage = np.sum(white_mask) / (hsv_array.shape[0] * hsv_array.shape[1]) * 100
        
        # Detect spots/lesions using edge detection
        gray = img.convert('L')
        from PIL import ImageFilter
        edges = gray.filter(ImageFilter.FIND_EDGES)
        edge_array = np.array(edges)
        edge_density = np.mean(edge_array > 50) * 100
        
        # Calculate texture variance (diseased leaves have more variation)
        gray_array = np.array(gray)
        texture_variance = np.var(gray_array)
        
        # Analyze color distribution
        color_diversity = np.std(mean_color)
        
        return {
            "green_percentage": float(green_percentage),
            "brown_yellow_percentage": float(brown_yellow_percentage),
            "white_percentage": float(white_percentage),
            "edge_density": float(edge_density),
            "texture_variance": float(texture_variance),
            "color_diversity": float(color_diversity),
            "mean_color": mean_color.tolist(),
            "image_hash": hashlib.md5(image_bytes).hexdigest()[:8]
        }
    except Exception as e:
        print(f"Error analyzing image: {e}")
        return {"error": str(e)}


def predict_crop_and_disease(features: Dict[str, Any]) -> Tuple[str, str, float]:
    """
    Predict crop type and disease based on image features.
    
    Returns:
        Tuple of (crop_name, disease_name, confidence)
    """
    if "error" in features:
        return "Unknown", "Unknown Disease", 0.0
    
    green_pct = features.get("green_percentage", 0)
    brown_yellow_pct = features.get("brown_yellow_percentage", 0)
    white_pct = features.get("white_percentage", 0)
    edge_density = features.get("edge_density", 0)
    texture_var = features.get("texture_variance", 0)
    
    # Determine if healthy or diseased
    is_healthy = green_pct > 60 and brown_yellow_pct < 15 and white_pct < 10
    
    # Predict crop type based on color characteristics
    # Paddy typically has more uniform green, tomato has varied greens
    # Corn has broader leaves, potato has different leaf shape
    
    crop = "Unknown"
    disease = "Unknown Disease"
    confidence = 50.0
    
    # Crop detection based on color patterns
    if green_pct > 70 and texture_var < 500:
        crop = "Paddy"
    elif green_pct > 50 and texture_var > 800:
        crop = "Tomato"
    elif green_pct > 55 and texture_var < 700:
        crop = "Corn"
    elif green_pct > 45:
        crop = "Potato"
    
    # Disease detection
    if is_healthy:
        disease = "Healthy"
        confidence = min(95.0, 70.0 + green_pct * 0.3)
    else:
        # Determine disease type based on symptoms
        if white_pct > 15:
            disease = "Powdery Mildew"
            confidence = 75.0 + min(15, white_pct * 0.5)
        elif brown_yellow_pct > 25:
            if crop == "Paddy":
                disease = "Bacterial Leaf Blight"
            elif crop == "Tomato":
                disease = "Early Blight"
            else:
                disease = "Leaf Blight"
            confidence = 70.0 + min(20, brown_yellow_pct * 0.4)
        elif edge_density > 15:
            if crop == "Paddy":
                disease = "Blast"
            elif crop == "Tomato":
                disease = "Late Blight"
            else:
                disease = "Leaf Spot"
            confidence = 75.0 + min(15, edge_density * 0.5)
        elif texture_var > 1000:
            disease = "Bacterial Spot"
            confidence = 70.0 + min(15, (texture_var - 1000) / 100)
        else:
            disease = "Leaf Spot Disease"
            confidence = 65.0
    
    # Adjust confidence based on feature consistency
    if crop == "Unknown":
        confidence *= 0.7
    
    return crop, disease, min(95.0, max(50.0, confidence))


@app.route("/api/health", methods=["GET"])
def health() -> Any:
    return {"status": "ok", "has_image_libs": HAS_IMAGE_LIBS}


@app.route("/api/predict", methods=["POST"])
def predict() -> Any:
    """
    Accepts multipart/form-data with an image file under the key "image".
    Returns a JSON payload with disease prediction details.
    """
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400
    
    image_bytes = file.read()
    
    # Analyze image features
    features = analyze_image_features(image_bytes)
    
    # Predict crop and disease
    crop, disease, confidence = predict_crop_and_disease(features)
    
    # Get disease information from database
    crop_lower = crop.lower()
    disease_lower = disease.lower().replace(" ", "_").replace("-", "_")
    
    # Try to get disease info from database
    disease_info = DISEASE_DATABASE.get(crop_lower, {}).get(disease_lower, {})
    
    # If disease not found, try generic fallback or healthy plant info
    if not disease_info:
        # Try to find similar disease in other crops
        for crop_key in DISEASE_DATABASE:
            if disease_lower in DISEASE_DATABASE[crop_key]:
                disease_info = DISEASE_DATABASE[crop_key][disease_lower]
                break
        
        # If still not found, use generic disease info or healthy plant info
        if not disease_info:
            if disease.lower() == "healthy":
                disease_info = DISEASE_DATABASE.get(crop_lower, {}).get("healthy", {
                    "symptoms": ["Healthy plant appearance", "No visible disease symptoms"],
                    "causes": ["Proper care and maintenance"],
                    "treatment": ["Continue regular care practices"],
                    "prevention": ["Maintain optimal growing conditions"]
                })
            else:
                # Generic disease information
                disease_info = {
                    "symptoms": [
                        f"Visible symptoms detected on {crop.lower()} leaves",
                        "Discoloration or spots may be present",
                        "Abnormal leaf patterns observed"
                    ],
                    "causes": [
                        "Pathogenic infection",
                        "Environmental stress factors",
                        "Poor growing conditions"
                    ],
                    "treatment": [
                        "Remove affected plant parts",
                        "Apply appropriate fungicide or bactericide",
                        "Improve growing conditions",
                        "Ensure proper spacing and air circulation",
                        "Monitor plant health regularly"
                    ],
                    "prevention": [
                        "Use disease-resistant varieties",
                        "Practice crop rotation",
                        "Maintain proper plant spacing",
                        "Avoid overhead watering",
                        "Remove plant debris regularly"
                    ]
                }
    
    # Determine severity - always return a value
    if disease.lower() == "healthy":
        severity = "None (Healthy)"
    elif confidence > 85:
        severity = "High"
    elif confidence > 70:
        severity = "Medium"
    else:
        severity = "Low"
    
    # Ensure all fields have values (use defaults if missing)
    symptoms = disease_info.get("symptoms", [])
    causes = disease_info.get("causes", [])
    treatment = disease_info.get("treatment", [])
    prevention = disease_info.get("prevention", [])
    
    # Ensure we always have some content - provide defaults if empty
    if not symptoms:
        if disease.lower() == "healthy":
            symptoms = ["Bright green healthy leaves", "No visible spots or discoloration", "Normal growth pattern"]
        else:
            symptoms = ["Symptoms detected - further analysis recommended"]
    
    if not causes:
        if disease.lower() == "healthy":
            causes = ["Proper care and maintenance", "Adequate nutrition and water", "Good environmental conditions"]
        else:
            causes = ["Pathogenic infection or environmental stress"]
    
    if not treatment:
        if disease.lower() == "healthy":
            treatment = ["Continue regular watering schedule", "Maintain proper fertilization", "Monitor for any changes"]
        else:
            treatment = ["Consult agricultural expert", "Apply appropriate treatment based on disease type"]
    
    if not prevention:
        if disease.lower() == "healthy":
            prevention = ["Regular monitoring", "Proper watering practices", "Balanced nutrition", "Maintain optimal growing conditions"]
        else:
            prevention = ["Practice crop rotation", "Use disease-resistant varieties", "Maintain proper plant spacing"]
    
    # Build response - always include all fields
    response = {
        "disease_detected": disease.lower() != "healthy",
        "disease_name": disease,
        "confidence": round(confidence, 1),
        "affected_crop": crop,
        "severity": severity,
        "symptoms": symptoms,
        "causes": causes,
        "treatment": treatment,
        "prevention": prevention,
    }
    
    return jsonify(response)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🌾 Crop Disease Predictor API starting on port {port}")
    print(f"📦 Image processing: {'Available' if HAS_IMAGE_LIBS else 'Not Available'}")
    app.run(host="0.0.0.0", port=port, debug=True)
