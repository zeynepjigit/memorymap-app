# MemoryMap Backend Setup Guide

## Quick Fix for Coach Chat 500 Error

The most common cause of the 500 Internal Server Error in the coach chat endpoint is missing environment variables. Follow these steps:

### 1. Set Up Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```bash
# Required for coach chat functionality
OPENAI_API_KEY=your_actual_openai_api_key_here

# Optional but recommended
JWT_SECRET_KEY=your_jwt_secret_here
```

### 2. Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

### 3. Test the Setup

Run the debug script to check if everything is working:

```bash
cd backend
python debug_coach_chat.py
```

### 4. Common Issues and Solutions

#### Issue: "OPENAI_API_KEY is not configured"
**Solution**: Make sure you have a `.env` file in the backend directory with your OpenAI API key.

#### Issue: "OpenAI provider test failed"
**Solution**: 
- Check if your API key is valid
- Make sure you have sufficient credits in your OpenAI account
- Verify the API key format (should start with `sk-`)

#### Issue: "RAG service test failed"
**Solution**: 
- Make sure ChromaDB is properly installed: `pip install chromadb`
- Check if the `chroma_db` directory exists and is writable

#### Issue: "Import tests failed"
**Solution**: Install missing dependencies:
```bash
pip install -r requirements.txt
```

### 5. Start the Server

After setting up the environment variables:

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Test the Endpoint

You can test the coach chat endpoint using curl or any API client:

```bash
curl -X POST "http://localhost:8000/api/v1/coach/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"message": "I am feeling stressed about work", "top_k": 4}'
```

### 7. Additional Configuration

For full functionality, you may also want to set up:

- **Firebase** (for user authentication and data storage)
- **FAL AI** (for image generation features)
- **Database** (for persistent storage)

See `env_template.txt` for all available environment variables.

## Image Generation with FAL AI

Set the following environment variables in your `.env` file to enable image generation via fal.ai:

```bash
# fal.ai
FAL_KEY=your_fal_api_key_here
# Optional: override model or REST base
FAL_MODEL=fal-ai/flux/dev
FAL_REST_BASE=https://fal.run
```

Endpoints:

- POST `/api/v1/vision/generate` with body:

```json
{
  "text": "a serene landscape at golden hour",
  "width": 768,
  "height": 512,
  "steps": 16
}
```

The response contains `result.image_url` when successful.

Health check:

- GET `/api/v1/vision/status` returns the fal configuration readiness and selected model.

## Troubleshooting

If you're still getting errors after following these steps:

1. Check the server logs for detailed error messages
2. Run the debug script to identify the specific issue
3. Make sure all dependencies are installed correctly
4. Verify that your API keys are valid and have sufficient credits

## Support

If you continue to have issues, please:
1. Run the debug script and share the output
2. Check the server logs for error details
3. Verify your environment variables are set correctly
