#!/usr/bin/env python3
"""
Setup script for AIFD Project Backend
This script helps you configure environment variables and test the application.
"""

import os
import sys
from pathlib import Path

def create_env_file():
    """Create a .env file with template values"""
    env_content = """# Required API Keys for AIFD Project Backend
# Copy this file to .env and fill in your actual API keys

# OpenAI API Key (required for text generation and embeddings)
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini API Key (required for LLM functionality)
GEMINI_API_KEY=your_gemini_api_key_here

# FAL AI API Key (for image generation)
FAL_KEY=your_fal_api_key_here
FAL_MODEL=fal-ai/flux/dev
FAL_REST_BASE=https://fal.run

# Stability AI API Key (alternative image generation)
STABILITY_API_KEY=your_stability_api_key_here

# Hugging Face API Token (for some AI models)
HUGGINGFACE_API_TOKEN=your_huggingface_token_here

# JWT Secret Key (for authentication)
SECRET_KEY=your_jwt_secret_key_here

# Firebase Configuration (optional - uses firebase-service-account.json by default)
FIREBASE_CREDENTIALS=firebase-service-account.json
FIREBASE_STORAGE_BUCKET=your_firebase_bucket_here

# OpenAI Chat Models Configuration (optional)
APP_OPENAI_CHAT_MODELS=gpt-4,gpt-3.5-turbo
"""
    
    env_file = Path(".env")
    if env_file.exists():
        print("⚠️  .env file already exists. Skipping creation.")
        return
    
    with open(env_file, "w", encoding="utf-8") as f:
        f.write(env_content)
    
    print("✅ Created .env file with template values")
    print("📝 Please edit the .env file and add your actual API keys")

def test_imports():
    """Test if all required modules can be imported"""
    print("🔍 Testing module imports...")
    
    try:
        from app.main import app
        print("✅ Main app imports successfully")
    except Exception as e:
        print(f"❌ Main app import failed: {e}")
        return False
    
    try:
        from app.services.quote_service import quote_service
        print("✅ Quote service imports successfully")
    except Exception as e:
        print(f"❌ Quote service import failed: {e}")
        return False
    
    try:
        from app.services.rag_coaching import rag_coaching_service
        print("✅ RAG coaching service imports successfully")
    except Exception as e:
        print(f"❌ RAG coaching service import failed: {e}")
        return False
    
    return True

def test_environment():
    """Test environment variables"""
    print("\n🔍 Testing environment variables...")
    
    required_vars = [
        "GEMINI_API_KEY",
        "OPENAI_API_KEY",
        "SECRET_KEY"
    ]
    
    optional_vars = [
        "FAL_KEY",
        "STABILITY_API_KEY",
        "HUGGINGFACE_API_TOKEN"
    ]
    
    print("Required variables:")
    for var in required_vars:
        value = os.getenv(var)
        if value and value != "your_gemini_api_key_here":
            print(f"  ✅ {var}: SET")
        else:
            print(f"  ❌ {var}: NOT SET")
    
    print("\nOptional variables:")
    for var in optional_vars:
        value = os.getenv(var)
        if value and value != "your_fal_api_key_here":
            print(f"  ✅ {var}: SET")
        else:
            print(f"  ⚠️  {var}: NOT SET (optional)")

def main():
    """Main setup function"""
    print("🚀 AIFD Project Backend Setup")
    print("=" * 40)
    
    # Create .env file if it doesn't exist
    create_env_file()
    
    # Test imports
    if not test_imports():
        print("\n❌ Setup failed due to import errors")
        print("💡 Make sure all dependencies are installed:")
        print("   pip install -r requirements.txt")
        return
    
    # Test environment
    test_environment()
    
    print("\n" + "=" * 40)
    print("🎉 Setup completed!")
    print("\n📋 Next steps:")
    print("1. Edit the .env file and add your API keys")
    print("2. Run: uvicorn app.main:app --reload")
    print("3. Test the API at: http://localhost:8000/docs")

if __name__ == "__main__":
    main()
