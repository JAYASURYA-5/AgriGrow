"""
Train a crop disease classification model using the Kaggle PlantDisease dataset.

This script:
1. Downloads the dataset from Kaggle (requires kaggle API credentials)
2. Trains a CNN using transfer learning (MobileNetV2)
3. Saves the trained model and class mapping

Setup:
1. Install dependencies: pip install kaggle tensorflow pillow
2. Get Kaggle API credentials from https://www.kaggle.com/settings/account
3. Place kaggle.json in ~/.kaggle/
4. Run: python train_model.py
"""

import os
import json
import shutil
from pathlib import Path
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from sklearn.model_selection import train_test_split
from PIL import Image
import subprocess

# Configuration
DATASET_NAME = "emmarex/plantdisease"
DATASET_DIR = "plant_disease_dataset"
MODEL_DIR = "models"
MODEL_FILE = os.path.join(MODEL_DIR, "plant_disease_model.h5")
CLASS_MAPPING_FILE = os.path.join(MODEL_DIR, "class_mapping.json")
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20
VALIDATION_SPLIT = 0.2


def download_dataset():
    """Download the PlantDisease dataset from Kaggle."""
    print("📥 Downloading PlantDisease dataset from Kaggle...")
    
    if os.path.exists(DATASET_DIR):
        print(f"Dataset already exists in {DATASET_DIR}")
        return
    
    try:
        # Use kaggle CLI to download dataset
        subprocess.run(
            ["kaggle", "datasets", "download", "-d", DATASET_NAME],
            check=True
        )
        
        # Extract the zip file
        import zipfile
        zip_files = [f for f in os.listdir(".") if f.endswith(".zip")]
        for zip_file in zip_files:
            print(f"Extracting {zip_file}...")
            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                zip_ref.extractall(DATASET_DIR)
            os.remove(zip_file)
        
        print("✅ Dataset downloaded successfully")
    except Exception as e:
        print(f"❌ Error downloading dataset: {e}")
        print("Make sure you have:")
        print("1. Installed kaggle: pip install kaggle")
        print("2. Set up Kaggle API credentials in ~/.kaggle/kaggle.json")
        raise


def load_images_from_directory(directory, label, images, labels):
    """Recursively load images from a directory."""
    if not os.path.isdir(directory):
        return
    
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        
        if os.path.isdir(filepath):
            # Recursively process subdirectories
            load_images_from_directory(filepath, label, images, labels)
        else:
            try:
                # Load and validate image
                img = Image.open(filepath).convert("RGB")
                img = img.resize(IMAGE_SIZE)
                img_array = np.array(img) / 255.0
                images.append(img_array)
                labels.append(label)
            except Exception as e:
                print(f"⚠️  Could not load {filepath}: {e}")


def prepare_dataset():
    """Load and prepare the dataset."""
    print("📂 Preparing dataset...")
    
    images = []
    labels = []
    class_names = []
    label_idx = 0
    
    # Find all disease classes (subdirectories)
    dataset_path = os.path.join(DATASET_DIR, "color")
    if not os.path.exists(dataset_path):
        # Try alternative path structure
        dataset_path = DATASET_DIR
    
    disease_dirs = [d for d in os.listdir(dataset_path) 
                    if os.path.isdir(os.path.join(dataset_path, d))]
    disease_dirs.sort()
    
    print(f"Found {len(disease_dirs)} disease classes")
    
    # Load images for each disease class
    for disease in disease_dirs:
        disease_path = os.path.join(dataset_path, disease)
        print(f"Loading {disease}...", end=" ")
        
        initial_count = len(images)
        load_images_from_directory(disease_path, label_idx, images, labels)
        
        loaded_count = len(images) - initial_count
        print(f"({loaded_count} images)")
        
        class_names.append(disease)
        label_idx += 1
    
    # Convert to numpy arrays
    X = np.array(images, dtype=np.float32)
    y = np.array(labels, dtype=np.int32)
    
    print(f"✅ Dataset ready: {len(X)} images, {len(class_names)} classes")
    
    return X, y, class_names


def build_model(num_classes):
    """Build a transfer learning model using MobileNetV2."""
    print("🏗️  Building model...")
    
    # Load pre-trained MobileNetV2
    base_model = MobileNetV2(
        input_shape=(*IMAGE_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model weights
    base_model.trainable = False
    
    # Build custom head
    model = models.Sequential([
        layers.Input(shape=(*IMAGE_SIZE, 3)),
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.1),
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print("✅ Model built successfully")
    return model


def train_model(model, X, y, class_names):
    """Train the model."""
    print("🚀 Training model...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=VALIDATION_SPLIT, random_state=42, stratify=y
    )
    
    # Create callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=0.00001,
            verbose=1
        )
    ]
    
    # Train
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        batch_size=BATCH_SIZE,
        epochs=EPOCHS,
        callbacks=callbacks,
        verbose=1
    )
    
    # Evaluate
    test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
    print(f"✅ Training complete - Test Accuracy: {test_accuracy:.2%}")
    
    return model, class_names


def save_model(model, class_names):
    """Save the model and class mapping."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    print(f"💾 Saving model to {MODEL_FILE}...")
    model.save(MODEL_FILE)
    
    # Save class mapping
    class_mapping = {i: name for i, name in enumerate(class_names)}
    with open(CLASS_MAPPING_FILE, 'w') as f:
        json.dump(class_mapping, f, indent=2)
    
    print(f"💾 Saving class mapping to {CLASS_MAPPING_FILE}...")
    print("✅ Model saved successfully")


def main():
    """Main training pipeline."""
    print("🌱 Crop Disease Prediction Model Training")
    print("=" * 50)
    
    # Download dataset
    download_dataset()
    
    # Prepare dataset
    X, y, class_names = prepare_dataset()
    
    # Build model
    model = build_model(len(class_names))
    
    # Train model
    model, class_names = train_model(model, X, y, class_names)
    
    # Save model
    save_model(model, class_names)
    
    print("\n" + "=" * 50)
    print("🎉 Training pipeline complete!")
    print(f"Model saved to: {MODEL_FILE}")
    print(f"Classes: {', '.join(class_names)}")


if __name__ == "__main__":
    main()
