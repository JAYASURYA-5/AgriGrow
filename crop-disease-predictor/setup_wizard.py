#!/usr/bin/env python3
"""
AgriGrow Enhanced Disease Predictor - Setup Wizard
Helps configure the system for maximum accuracy with API integration
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from dotenv import load_dotenv, set_key  # type: ignore


class SetupWizard:
    """Interactive setup wizard for disease predictor configuration."""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.env_file = self.project_root / '.env'
        self.env_example = self.project_root / '.env.example'
        self.config = {}
        
    def print_header(self):
        """Print welcome header."""
        print("\n" + "="*70)
        print(" 🌾 AgriGrow Enhanced Disease Predictor - Setup Wizard 🌾")
        print("="*70)
        print("\nThis wizard will help you configure the system for maximum accuracy.")
        print("We'll set up API keys and optimize prediction models.\n")
    
    def print_section(self, title):
        """Print section header."""
        print(f"\n{'='*70}")
        print(f" {title}")
        print(f"{'='*70}\n")
    
    def input_required(self, prompt, default=None):
        """Get required input from user."""
        while True:
            if default:
                user_input = input(f"{prompt} (default: {default}): ").strip()
                if not user_input:
                    return default
            else:
                user_input = input(f"{prompt}: ").strip()
                if user_input:
                    return user_input
            print("⚠️  This field is required. Please try again.")
    
    def input_optional(self, prompt, default=""):
        """Get optional input from user."""
        response = input(f"{prompt} [Enter to skip]: ").strip()
        return response if response else default
    
    def yes_no(self, prompt):
        """Ask yes/no question."""
        while True:
            response = input(f"{prompt} (yes/no): ").strip().lower()
            if response in ['yes', 'y']:
                return True
            elif response in ['no', 'n']:
                return False
            print("⚠️  Please answer 'yes' or 'no'")
    
    def step_1_environment_setup(self):
        """Step 1: Create .env file."""
        self.print_section("Step 1: Environment Setup")
        
        if self.env_file.exists():
            if self.yes_no("⚠️  .env file already exists. Overwrite?"):
                self.env_file.unlink()
            else:
                print("✅ Keeping existing .env file")
                return
        
        # Copy from template
        if self.env_example.exists():
            self.env_file.write_text(self.env_example.read_text())
            print("✅ Created .env from template")
        else:
            self.env_file.write_text("# AgriGrow Configuration\n")
            print("✅ Created new .env file")
    
    def step_2_clarifai_setup(self):
        """Step 2: Configure Clarifai API."""
        self.print_section("Step 2: Clarifai API Configuration (Recommended)")
        
        print("Clarifai provides the best accuracy for crop disease detection.")
        print("It supports multiple crop types and diseases.")
        print("\n📋 To get your API keys:")
        print("  1. Visit: https://www.clarifai.com")
        print("  2. Create free account")
        print("  3. Go to: https://clarifai.com/settings/applications")
        print("  4. Create new application")
        print("  5. Copy API Key, User ID, and App ID\n")
        
        if self.yes_no("Do you have Clarifai API keys?"):
            api_key = self.input_required("Enter Clarifai API Key")
            user_id = self.input_required("Enter Clarifai User ID")
            app_id = self.input_required("Enter Clarifai App ID")
            
            set_key(str(self.env_file), 'CLARIFAI_API_KEY', api_key)
            set_key(str(self.env_file), 'CLARIFAI_USER_ID', user_id)
            set_key(str(self.env_file), 'CLARIFAI_APP_ID', app_id)
            
            print("✅ Clarifai API configured")
            self.config['clarifai'] = True
        else:
            print("⏭️  Skipping Clarifai (system will use local model)")
            self.config['clarifai'] = False
    
    def step_3_google_vision_setup(self):
        """Step 3: Configure Google Cloud Vision API."""
        self.print_section("Step 3: Google Cloud Vision API (Optional)")
        
        print("Google Vision improves accuracy with additional feature detection.")
        print("\n📋 To set up:")
        print("  1. Visit: https://console.cloud.google.com")
        print("  2. Create new project")
        print("  3. Enable Vision API")
        print("  4. Create Service Account (IAM & Admin)")
        print("  5. Download JSON key file")
        print("  6. Enable billing (optional - free tier available)\n")
        
        if self.yes_no("Do you want to configure Google Vision API?"):
            key_path = self.input_required("Enter path to service account JSON key")
            api_key = self.input_optional("Enter Google API Key (optional)")
            
            if os.path.exists(key_path):
                set_key(str(self.env_file), 'GOOGLE_APPLICATION_CREDENTIALS', key_path)
                if api_key:
                    set_key(str(self.env_file), 'GOOGLE_API_KEY', api_key)
                print("✅ Google Cloud Vision configured")
                self.config['google_vision'] = True
            else:
                print("❌ Key file not found. Skipping Google Vision.")
                self.config['google_vision'] = False
        else:
            print("⏭️  Skipping Google Vision")
            self.config['google_vision'] = False
    
    def step_4_flask_settings(self):
        """Step 4: Configure Flask settings."""
        self.print_section("Step 4: Flask Application Settings")
        
        environment = "production"
        if self.yes_no("Are you running in development mode?"):
            environment = "development"
        
        set_key(str(self.env_file), 'FLASK_ENV', environment)
        
        if environment == "development":
            set_key(str(self.env_file), 'FLASK_DEBUG', '1')
            print("✅ Development mode enabled (debug=true)")
        else:
            set_key(str(self.env_file), 'FLASK_DEBUG', '0')
            print("✅ Production mode enabled (debug=false)")
    
    def step_5_install_dependencies(self):
        """Step 5: Install Python dependencies."""
        self.print_section("Step 5: Install Dependencies")
        
        if self.yes_no("Install required Python packages?"):
            try:
                print("\n📦 Installing packages...")
                subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'],
                              check=True, cwd=str(self.project_root))
                print("✅ Dependencies installed")
                
                if self.config.get('clarifai') or self.config.get('google_vision'):
                    if self.yes_no("\nInstall optional API packages?"):
                        optional = []
                        if self.config.get('clarifai'):
                            optional.append('clarifai')
                        if self.config.get('google_vision'):
                            optional.append('google-cloud-vision')
                        optional.append('tensorflow-hub')
                        
                        print(f"\n📦 Installing: {', '.join(optional)}...")
                        subprocess.run([sys.executable, '-m', 'pip', 'install'] + optional,
                                      check=True)
                        print("✅ Optional packages installed")
            except subprocess.CalledProcessError as e:
                print(f"❌ Installation failed: {e}")
                print("Please run manually: pip install -r requirements.txt")
    
    def step_6_train_model(self):
        """Step 6: Train/download model."""
        self.print_section("Step 6: Local Disease Detection Model")
        
        model_file = self.project_root / 'models' / 'plant_disease_model.h5'
        
        if model_file.exists():
            print("✅ Model already exists")
            if self.yes_no("Retrain model with latest data?"):
                self._train_model()
        else:
            print("⚠️  Model not found. Training is recommended for accuracy.")
            if self.yes_no("Train model now? (This may take 10-30 minutes)"):
                self._train_model()
            else:
                print("⏭️  Skipping model training")
                print("Note: System will use basic feature analysis")
    
    def _train_model(self):
        """Train the disease detection model."""
        try:
            print("\n🔄 Training model...")
            print("This will download PlantVillage dataset (~2GB)")
            print("and train a CNN model (~20-30 minutes)\n")
            
            script = self.project_root / 'train_model.py'
            if script.exists():
                subprocess.run([sys.executable, str(script)], check=True)
                print("✅ Model trained successfully")
            else:
                print("❌ train_model.py not found")
        except subprocess.CalledProcessError as e:
            print(f"❌ Training failed: {e}")
            print("You can retrain later with: python train_model.py")
    
    def step_7_test_setup(self):
        """Step 7: Test the setup."""
        self.print_section("Step 7: Test Configuration")
        
        if self.yes_no("Test the setup now?"):
            print("\n🧪 Running tests...\n")
            self._run_tests()
        else:
            print("⏭️  Skipping tests")
    
    def _run_tests(self):
        """Run setup verification tests."""
        print("Available APIs:")
        print("-" * 50)
        
        env = os.environ.copy()
        if self.env_file.exists():
            load_dotenv(self.env_file)
        
        # Check APIs
        if os.getenv('CLARIFAI_API_KEY'):
            print("✅ Clarifai API configured")
        else:
            print("❌ Clarifai API - NOT configured")
        
        if os.getenv('GOOGLE_APPLICATION_CREDENTIALS'):
            print("✅ Google Vision API configured")
        else:
            print("❌ Google Vision API - NOT configured")
        
        # Check model
        model_file = self.project_root / 'models' / 'plant_disease_model.h5'
        if model_file.exists():
            print("✅ Local model available")
        else:
            print("⚠️  Local model - NOT found (use: python train_model.py)")
        
        print("\n" + "="*50)
    
    def step_8_summary(self):
        """Step 8: Display configuration summary."""
        self.print_section("Setup Complete ✅")
        
        print("🎉 Configuration complete!\n")
        print("Next steps:")
        print("-" * 50)
        print("1. Start the server:")
        print("   python app.py")
        print("\n2. Test API health:")
        print("   curl http://localhost:5000/api/health")
        print("\n3. Make predictions:")
        print("   POST to http://localhost:5000/api/predict")
        print("   with multipart/form-data containing image file\n")
        
        print("Documentation:")
        print("-" * 50)
        print("• Setup Guide: ENHANCED_SETUP.md")
        print("• API Config: API_CONFIGURATION.md")
        print("• Environment: .env\n")
        
        if self.config:
            print("Configuration Status:")
            print("-" * 50)
            for key, value in self.config.items():
                status = "✅" if value else "❌"
                print(f"{status} {key.replace('_', ' ').title()}")
            print()
    
    def run(self):
        """Run the complete setup wizard."""
        try:
            self.print_header()
            
            self.step_1_environment_setup()
            self.step_2_clarifai_setup()
            self.step_3_google_vision_setup()
            self.step_4_flask_settings()
            self.step_5_install_dependencies()
            self.step_6_train_model()
            self.step_7_test_setup()
            self.step_8_summary()
            
            print("✨ Setup wizard completed!")
            print("For help, see documentation in crop-disease-predictor/ directory\n")
            
        except KeyboardInterrupt:
            print("\n\n⏭️  Setup wizard cancelled")
            sys.exit(0)
        except Exception as e:
            print(f"\n❌ Error during setup: {e}")
            sys.exit(1)


if __name__ == "__main__":
    wizard = SetupWizard()
    wizard.run()
