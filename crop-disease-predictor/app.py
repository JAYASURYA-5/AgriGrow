"""
Crop disease prediction backend using image analysis.
Flask app with enhanced disease detection using multiple APIs and ensemble methods.
"""

from __future__ import annotations

import base64
import os
import hashlib
from io import BytesIO
from typing import Dict, Any, Tuple

from flask import Flask, jsonify, request  # type: ignore
from flask_cors import CORS  # type: ignore
from werkzeug.utils import secure_filename  # type: ignore

try:
    from PIL import Image  # type: ignore  # pylint: disable=import-error
    import numpy as np  # type: ignore
    HAS_IMAGE_LIBS = True
except ImportError:
    print("⚠️  Warning: PIL/numpy not installed. Install with: pip install Pillow numpy")
    HAS_IMAGE_LIBS = False

# Try to import enhanced predictors
try:
    from improved_disease_predictor import predict_disease_improved
    HAS_IMPROVED_PREDICTOR = True
except ImportError:
    HAS_IMPROVED_PREDICTOR = False
    print("⚠️  Using basic predictor - Install improved_disease_predictor for better accuracy")

try:
    from enhanced_disease_predictor import predict_disease_enhanced
    HAS_ENHANCED_PREDICTOR = True
except ImportError:
    HAS_ENHANCED_PREDICTOR = False

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Disease knowledge base with comprehensive information
DISEASE_DATABASE = {
    "paddy": {
        "healthy": {
            "symptoms": ["Bright green leaves", "No spots or discoloration", "Normal growth"],
            "causes": ["Proper care and maintenance"],
            "treatment": ["Maintain proper water levels", "Apply balanced fertilizer"],
            "prevention": ["Use certified seeds", "Practice crop rotation", "Monitor water quality"],
            "reason": "Plant is receiving proper nutrients, water, and environmental conditions",
            "future_consequences": "Continue healthy growth and optimal yield production",
            "level_in_plant": "Whole plant is healthy",
            "plant_part_affected": []
        },
        "bacterial_leaf_blight": {
            "symptoms": ["Yellow to white streaks along leaf veins", "Lesions with wavy margins", "Leaves turn yellow and dry"],
            "causes": ["Bacterium Xanthomonas oryzae propagation in warm wet conditions", "Overhead irrigation spreading bacteria", "Poor field hygiene"],
            "treatment": ["Apply copper-based bactericides", "Remove infected plants", "Drain standing water"],
            "prevention": ["Use resistant varieties", "Avoid overhead irrigation", "Clean equipment between fields"],
            "reason": "Bacterial infection caused by Xanthomonas oryzae thriving in humid conditions",
            "future_consequences": "Will spread rapidly to other plants, causing leaf death and reducing grain yield by 30-50%",
            "level_in_plant": "Starts on lower leaves, progressively moves to upper portions",
            "plant_part_affected": ["Leaves", "Leaf veins", "Stems"]
        },
        "brown_spot": {
            "symptoms": ["Small brown spots on leaves", "Spots enlarge and merge", "Leaves turn yellow"],
            "causes": ["Fungal pathogen Bipolaris oryzae", "High humidity", "Poor drainage"],
            "treatment": ["Apply fungicides like propiconazole", "Improve field drainage", "Remove infected debris"],
            "prevention": ["Use disease-free seeds", "Maintain proper spacing", "Avoid excessive nitrogen"],
            "reason": "Fungal infection caused by Bipolaris oryzae in humid and poorly drained conditions",
            "future_consequences": "Leads to premature leaf death, reduced photosynthesis, and 20-30% yield loss if untreated",
            "level_in_plant": "Primarily affects lower and middle leaves first",
            "plant_part_affected": ["Leaves"]
        },
        "blast": {
            "symptoms": ["Diamond-shaped lesions", "Gray centers with brown margins", "Severe leaf damage"],
            "causes": ["Fungal pathogen Magnaporthe oryzae", "High humidity", "Cool temperatures"],
            "treatment": ["Apply tricyclazole or azoxystrobin", "Remove infected plants", "Improve air circulation"],
            "prevention": ["Use resistant varieties", "Avoid excessive nitrogen", "Maintain proper spacing"],
            "reason": "Magnaporthe oryzae fungal infection enhanced by cool, humid weather",
            "future_consequences": "Can spread to panicles causing total grain loss if not controlled immediately",
            "level_in_plant": "Starts on leaves, can progress to stems and grain heads",
            "plant_part_affected": ["Leaves", "Stems", "Panicles"]
        }
    },
    "tomato": {
        "healthy": {
            "symptoms": ["Green healthy leaves", "No spots or discoloration", "Normal growth"],
            "causes": ["Proper care and maintenance"],
            "treatment": [],
            "prevention": ["Regular monitoring", "Proper watering", "Balanced nutrition"],
            "reason": "Plant is well-cared for with optimal growing conditions",
            "future_consequences": "Will continue to grow and produce healthy fruits",
            "level_in_plant": "Whole plant is healthy and vigorous",
            "plant_part_affected": []
        },
        "early_blight": {
            "symptoms": ["Dark brown spots with concentric rings", "Yellowing around lesions", "Lower leaves affected first"],
            "causes": ["Fungal pathogen Alternaria solani spreads via water splash", "High humidity and warm temperatures", "Poor air circulation"],
            "treatment": ["Apply chlorothalonil or mancozeb fungicide", "Remove infected leaves", "Improve air circulation"],
            "prevention": ["Use resistant varieties", "Crop rotation", "Avoid overhead watering"],
            "reason": "Alternaria solani fungal infection activates in warm, humid conditions with poor ventilation",
            "future_consequences": "Defoliation progresses upward, reducing photosynthesis and fruit ripening by 40-60%",
            "level_in_plant": "Starts on lower leaves and progresses upward",
            "plant_part_affected": ["Lower leaves", "Stems", "Potentially fruits"]
        },
        "late_blight": {
            "symptoms": ["Water-soaked lesions", "White mold on underside", "Rapid leaf death"],
            "causes": ["Fungal pathogen Phytophthora infestans", "Cool wet conditions", "High humidity"],
            "treatment": ["Apply copper-based fungicides", "Remove infected plants immediately", "Improve drainage"],
            "prevention": ["Use resistant varieties", "Avoid overhead irrigation", "Proper spacing"],
            "reason": "Phytophthora infestans fungal infection thrives in cool, moist conditions",
            "future_consequences": "Rapid plant death within days if untreated, complete fruit loss",
            "level_in_plant": "Affects entire plant rapidly",
            "plant_part_affected": ["Leaves", "Stems", "Fruits", "Roots"]
        },
        "bacterial_spot": {
            "symptoms": ["Small dark spots", "Yellow halos around spots", "Leaves may drop"],
            "causes": ["Bacterial pathogens", "Wet conditions", "Warm temperatures"],
            "treatment": ["Apply copper-based bactericides", "Remove infected leaves", "Avoid overhead watering"],
            "prevention": ["Use disease-free seeds", "Crop rotation", "Proper spacing"],
            "reason": "Bacterial infection propagating through water, requiring warm and humid conditions",
            "future_consequences": "Progressive leaf drop reducing yield by 25-45%, fruit quality degradation",
            "level_in_plant": "Spreads from lower to upper leaves",
            "plant_part_affected": ["Leaves", "Stems", "Fruits"]
        }
    },
    "corn": {
        "healthy": {
            "symptoms": ["Green healthy leaves", "No spots or discoloration"],
            "causes": [],
            "treatment": [],
            "prevention": ["Proper nutrition", "Regular monitoring"],
            "reason": "Plant receives adequate nutrients and proper growing conditions",
            "future_consequences": "Healthy growth with maximum grain yield potential",
            "level_in_plant": "Entire plant is healthy",
            "plant_part_affected": []
        },
        "northern_leaf_blight": {
            "symptoms": ["Long elliptical gray-green lesions", "Lesions turn brown", "Severe defoliation"],
            "causes": ["Fungal pathogen Exserohilum turcicum", "High humidity", "Warm temperatures"],
            "treatment": ["Apply fungicides like propiconazole", "Remove infected debris", "Improve air circulation"],
            "prevention": ["Use resistant hybrids", "Crop rotation", "Proper spacing"],
            "reason": "Exserohilum turcicum fungal infection enhanced by warm and humid conditions",
            "future_consequences": "Severe defoliation leading to 30-50% yield reduction and poor grain maturation",
            "level_in_plant": "Affects middle and upper leaf portions",
            "plant_part_affected": ["Leaves", "Leaf blades"]
        },
        "common_rust": {
            "symptoms": ["Small reddish-brown pustules", "Pustules rupture releasing spores", "Yellowing of leaves"],
            "causes": ["Fungal pathogen Puccinia sorghi", "High humidity", "Moderate temperatures"],
            "treatment": ["Apply fungicides early", "Remove infected leaves", "Improve air flow"],
            "prevention": ["Use resistant varieties", "Avoid late planting", "Proper spacing"],
            "reason": "Puccinia sorghi fungal infection requiring high humidity and moderate warmth",
            "future_consequences": "Progressive leaf yellowing and death, 15-40% yield loss if unchecked",
            "level_in_plant": "Spreads across many leaves causing extensive damage",
            "plant_part_affected": ["Leaves"]
        }
    },
    "potato": {
        "healthy": {
            "symptoms": ["Green healthy leaves", "No spots"],
            "causes": [],
            "treatment": [],
            "prevention": [],
            "reason": "Plant is well-maintained with optimal conditions",
            "future_consequences": "Will develop healthy tubers with good yield",
            "level_in_plant": "Entire plant is vigorous",
            "plant_part_affected": []
        },
        "late_blight": {
            "symptoms": ["Dark water-soaked lesions", "White mold on underside", "Rapid spread"],
            "causes": ["Fungal pathogen Phytophthora infestans", "Cool wet weather"],
            "treatment": ["Apply fungicides immediately", "Remove infected plants", "Improve drainage"],
            "prevention": ["Use certified seed", "Crop rotation", "Avoid overhead irrigation"],
            "reason": "Phytophthora infestans fungal infection triggered by cool wet conditions",
            "future_consequences": "Complete plant death within days, tuber rot, 80-100% crop loss",
            "level_in_plant": "Spreads rapidly to all parts",
            "plant_part_affected": ["Leaves", "Stems", "Tubers"]
        },
        "early_blight": {
            "symptoms": ["Dark spots with concentric rings", "Yellowing leaves", "Lower leaves affected"],
            "causes": ["Fungal pathogen Alternaria solani", "High humidity"],
            "treatment": ["Apply fungicides", "Remove infected leaves", "Improve air circulation"],
            "prevention": ["Crop rotation", "Proper spacing", "Avoid overhead watering"],
            "reason": "Alternaria solani fungal infection in humid conditions",
            "future_consequences": "Progressive defoliation reducing tuber size and quality, 20-35% yield loss",
            "level_in_plant": "Starts on lower leaves progressing upward",
            "plant_part_affected": ["Leaves", "Stems"]
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
        from PIL import ImageFilter  # type: ignore
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
    Predict crop type and disease based on comprehensive image feature analysis.
    
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
    color_diversity = features.get("color_diversity", 0)
    
    # Determine if healthy or diseased based on multiple factors
    is_healthy = (green_pct > 65 and brown_yellow_pct < 12 and white_pct < 8 and 
                  edge_density < 12 and texture_var < 600)
    
    # ===== IMPROVED CROP DETECTION =====
    crop = "Unknown"
    leaf_type = "Unknown"
    
    if green_pct > 70 and texture_var < 400 and edge_density < 10:
        crop = "Paddy"
        leaf_type = "Narrow, elongated leaves with parallel veins"
    elif green_pct > 55 and texture_var > 700 and color_diversity > 2.5:
        crop = "Tomato"
        leaf_type = "Compound, serrated leaves with multiple leaflets"
    elif green_pct > 60 and texture_var < 600 and edge_density > 15:
        crop = "Corn"
        leaf_type = "Long, broad leaves with parallel veins"
    elif green_pct > 50 and texture_var > 600 and brown_yellow_pct > 5:
        crop = "Potato"
        leaf_type = "Compound, oval leaflets with toothed edges"
    elif green_pct > 45:
        crop = "General Crop"
        leaf_type = "Mixed leaf characteristics"
    
    # ===== HEALTH STATUS =====
    if is_healthy:
        return crop, "Healthy", min(95.0, 75.0 + green_pct * 0.2)
    
    # ===== IMPROVED DISEASE DETECTION WITH MULTIPLE POSSIBILITIES =====
    diseases_detected = []
    
    # Analyze discoloration patterns
    if brown_yellow_pct > 20:
        if crop == "Paddy":
            diseases_detected.append(("Bacterial Leaf Blight", 75 + min(15, brown_yellow_pct * 0.3)))
            diseases_detected.append(("Brown Spot", 65 + min(15, brown_yellow_pct * 0.25)))
        elif crop == "Tomato":
            diseases_detected.append(("Early Blight", 75 + min(15, brown_yellow_pct * 0.3)))
            diseases_detected.append(("Septoria Leaf Spot", 65 + min(10, brown_yellow_pct * 0.2)))
        elif crop == "Corn":
            diseases_detected.append(("Northern Leaf Blight", 75 + min(15, brown_yellow_pct * 0.3)))
        elif crop == "Potato":
            diseases_detected.append(("Early Blight", 75 + min(15, brown_yellow_pct * 0.3)))
    
    # Analyze edge/lesion patterns
    if edge_density > 12:
        if crop == "Paddy":
            diseases_detected.append(("Blast", 80 + min(10, edge_density * 2)))
        elif crop == "Tomato":
            diseases_detected.append(("Late Blight", 78 + min(12, edge_density * 1.5)))
            diseases_detected.append(("Bacterial Spot", 65 + min(10, edge_density)))
        elif crop == "Corn":
            diseases_detected.append(("Gray Leaf Spot", 70 + min(15, edge_density * 1.5)))
        elif crop == "Potato":
            diseases_detected.append(("Late Blight", 80 + min(10, edge_density * 1.5)))
    
    # Analyze white/powdery coverage
    if white_pct > 12:
        diseases_detected.append(("Powdery Mildew", 75 + min(15, white_pct * 2)))
        if crop == "Tomato":
            diseases_detected.append(("Septoria Leaf Spot", 60 + min(10, white_pct)))
    
    # Analyze texture variation (fungal/bacterial texture)
    if texture_var > 800:
        if crop == "Tomato":
            diseases_detected.append(("Bacterial Spot", 70 + min(10, (texture_var - 800) / 50)))
        if crop == "Paddy":
            diseases_detected.append(("Brown Spot", 68 + min(12, (texture_var - 800) / 60)))
    
    # Analyze combined symptoms
    if brown_yellow_pct > 15 and edge_density > 10:
        if crop == "Paddy":
            diseases_detected.append(("Brown Leaf Spot", 72 + min(10, (brown_yellow_pct + edge_density) * 0.2)))
        elif crop == "Tomato":
            diseases_detected.append(("Late Blight", 80 + min(8, (brown_yellow_pct + edge_density) * 0.15)))
    
    # If no specific diseases detected, provide generic diagnosis
    if not diseases_detected:
        if brown_yellow_pct > 10:
            diseases_detected.append(("Leaf Spot Disease", 65))
        elif edge_density > 8:
            diseases_detected.append(("Fungal Leaf Disease", 62))
        else:
            diseases_detected.append(("Plant Stress/Minor Disease", 60))
    
    # Sort by confidence and return top disease
    diseases_detected.sort(key=lambda x: x[1], reverse=True)
    top_disease, top_confidence = diseases_detected[0]
    
    # Cap confidence at reasonable level
    final_confidence = min(90.0, max(50.0, top_confidence))
    
    return crop, top_disease, final_confidence



def predict_multiple_diseases(features: Dict[str, Any], crop: str) -> list:
    """
    Detect multiple possible diseases based on comprehensive feature analysis.
    
    Returns:
        List of tuples (disease_name, confidence)
    """
    if "error" in features:
        return []
    
    green_pct = features.get("green_percentage", 0)
    brown_yellow_pct = features.get("brown_yellow_percentage", 0)
    white_pct = features.get("white_percentage", 0)
    edge_density = features.get("edge_density", 0)
    texture_var = features.get("texture_variance", 0)
    color_diversity = features.get("color_diversity", 0)
    
    diseases = []
    
    # Check for various disease indicators
    if brown_yellow_pct > 18:
        if crop == "Paddy":
            diseases.append(("Bacterial Leaf Blight", 75 + min(15, brown_yellow_pct * 0.3)))
            diseases.append(("Brown Spot", 65 + min(15, brown_yellow_pct * 0.25)))
        elif crop == "Tomato":
            diseases.append(("Early Blight", 75 + min(15, brown_yellow_pct * 0.3)))
            diseases.append(("Septoria Leaf Spot", 65 + min(10, brown_yellow_pct * 0.2)))
        elif crop == "Corn":
            diseases.append(("Northern Leaf Blight", 75 + min(15, brown_yellow_pct * 0.3)))
        elif crop == "Potato":
            diseases.append(("Early Blight", 75 + min(15, brown_yellow_pct * 0.3)))
    
    if edge_density > 10:
        if crop == "Paddy":
            diseases.append(("Blast", 80 + min(10, edge_density * 2)))
        elif crop == "Tomato":
            diseases.append(("Late Blight", 78 + min(12, edge_density * 1.5)))
            diseases.append(("Bacterial Spot", 65 + min(10, edge_density)))
        elif crop == "Corn":
            diseases.append(("Gray Leaf Spot", 70 + min(15, edge_density * 1.5)))
        elif crop == "Potato":
            diseases.append(("Late Blight", 80 + min(10, edge_density * 1.5)))
    
    if white_pct > 10:
        diseases.append(("Powdery Mildew", 75 + min(15, white_pct * 2)))
        if crop == "Tomato":
            diseases.append(("Septoria Leaf Spot", 60 + min(10, white_pct)))
    
    if texture_var > 700:
        if crop == "Tomato":
            diseases.append(("Bacterial Spot", 70 + min(10, (texture_var - 700) / 50)))
        if crop == "Paddy":
            diseases.append(("Brown Spot", 68 + min(12, (texture_var - 700) / 60)))
    
    # Remove duplicates and sort by confidence
    unique_diseases = {}
    for disease_name, conf in diseases:
        if disease_name not in unique_diseases or conf > unique_diseases[disease_name]:
            unique_diseases[disease_name] = conf
    
    result = sorted(unique_diseases.items(), key=lambda x: x[1], reverse=True)
    return result


def _detect_crop_from_disease(disease_name: str) -> str:
    """Detect crop type based on disease name using mapping."""
    disease_lower = disease_name.lower()
    
    # Disease to crop mapping
    disease_crop_map = {
        'bacterial_leaf_blight': 'paddy',
        'blast': 'paddy',
        'brown_spot': 'paddy',
        'early_blight': 'tomato',
        'late_blight': 'tomato',
        'bacterial_spot': 'tomato',
        'septoria': 'tomato',
        'northern_leaf_blight': 'corn',
        'common_rust': 'corn',
        'gray_leaf_spot': 'corn',
        'powdery_mildew': 'grape',
        'black_rot': 'apple',
        'stripe_rust': 'wheat',
        'fusarium': 'wheat',
    }
    
    for disease_key, crop in disease_crop_map.items():
        if disease_key in disease_lower:
            return crop.capitalize()
    
    # Fallback detection
    if any(x in disease_lower for x in ['paddy', 'rice', 'blight', 'blast']):
        return 'Paddy'
    elif any(x in disease_lower for x in ['tomato', 'leaf_spot']):
        return 'Tomato'
    elif any(x in disease_lower for x in ['corn', 'wheat', 'rust']):
        return 'Corn'
    
    return 'Unknown'


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
    
    # Use improved predictor for better accuracy
    if HAS_IMPROVED_PREDICTOR:
        improved_result = predict_disease_improved(image_bytes)
        leaf_type = "Unknown"
        
        if improved_result.get('status') == 'success':
            crop = improved_result.get('crop_name', 'Unknown')
            disease = improved_result.get('disease_name', 'Unknown')
            confidence = improved_result.get('confidence', 50.0)
            simple_explanation = improved_result.get('simple_description', '')
            
            print(f"✓ Improved Prediction: {disease} on {crop} ({confidence:.1f}%)")
        else:
            # Fallback to ensemble method
            if HAS_ENHANCED_PREDICTOR:
                ensemble_result = predict_disease_enhanced(image_bytes)
                disease = ensemble_result.get('disease_name', 'Unknown')
                confidence = ensemble_result.get('confidence', 50.0)
                crop = _detect_crop_from_disease(disease)
                simple_explanation = ""
            else:
                features = analyze_image_features(image_bytes)
                crop, disease, confidence, leaf_type = predict_crop_and_disease(features)
                simple_explanation = ""
    else:
        # Original basic prediction
        features = analyze_image_features(image_bytes)
        crop, disease, confidence, leaf_type = predict_crop_and_disease(features)
        simple_explanation = ""
    
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
    reason = disease_info.get("reason", "")
    future_consequences = disease_info.get("future_consequences", "")
    level_in_plant = disease_info.get("level_in_plant", "")
    plant_part_affected = disease_info.get("plant_part_affected", [])
    
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
    
    if not reason:
        if disease.lower() == "healthy":
            reason = "Plant is receiving proper care with optimal growing conditions"
        else:
            reason = "Pathogenic infection causing visible disease symptoms"
    
    if not future_consequences:
        if disease.lower() == "healthy":
            future_consequences = "Plant will continue to grow healthily and produce good yields"
        else:
            future_consequences = "Disease will spread if left untreated, leading to reduced yield and plant death"
    
    if not level_in_plant:
        if disease.lower() == "healthy":
            level_in_plant = "Entire plant is healthy"
        else:
            level_in_plant = "Disease affects various parts of the plant"
    
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
    
    
    # Detect multiple possible diseases
    if disease.lower() != "healthy" and not HAS_IMPROVED_PREDICTOR and not HAS_ENHANCED_PREDICTOR:
        features = analyze_image_features(image_bytes)
        possible_diseases = predict_multiple_diseases(features, crop)
        # Filter to top 3 diseases
        possible_diseases = possible_diseases[:3] if possible_diseases else [(disease, confidence)]
    else:
        possible_diseases = [(disease, confidence)]
    
    # Build response - always include all fields
    response = {
        "disease_detected": disease.lower() != "healthy",
        "disease_name": disease,
        "crop_name": crop,  # Plant/crop name
        "leaf_type": leaf_type,  # NEW: Leaf type description
        "possible_diseases": [{"name": d[0], "confidence": round(d[1], 1)} for d in possible_diseases],  # NEW: Multiple diseases detected
        "simple_explanation": simple_explanation,
        "confidence": round(confidence, 1),
        "affected_crop": crop,
        "severity": severity,
        "reason": reason,
        "future_consequences": future_consequences,
        "level_in_plant": level_in_plant,
        "plant_part_affected": plant_part_affected,
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
