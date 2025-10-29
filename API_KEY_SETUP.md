# API Key Setup Instructions

## 🔑 Setting up Google API Key for KrushiVerse

The KrushiVerse agricultural chatbot uses Google's Gemini AI for intelligent responses. Follow these steps to set up your API key:

### Step 1: Get Your Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Configure the API Key

#### Option 1: Using .env file (Recommended)
1. Open the `.env` file in the project root directory
2. Replace `your_google_api_key_here` with your actual API key:
   ```
   GOOGLE_API_KEY=AIzaSyC-your-actual-api-key-here
   ```
3. Save the file

#### Option 2: Using Environment Variables
Set the environment variable in your system:

**Windows (PowerShell):**
```powershell
$env:GOOGLE_API_KEY="AIzaSyC-your-actual-api-key-here"
```

**Windows (Command Prompt):**
```cmd
set GOOGLE_API_KEY=AIzaSyC-your-actual-api-key-here
```

**Linux/Mac:**
```bash
export GOOGLE_API_KEY="AIzaSyC-your-actual-api-key-here"
```

### Step 3: Restart the Server

After setting up the API key, restart the backend server:
```bash
python -m uvicorn api_server:app --host 0.0.0.0 --port 8000
```

### Step 4: Verify Setup

1. Open `http://localhost:8000/health` in your browser
2. Check that `rag_available` is `true` in the response
3. Test the chatbot with questions about agriculture

## 🛡️ Security Notes

- Never commit your actual API key to version control
- The `.env` file is already added to `.gitignore`
- Keep your API key secure and don't share it publicly

## 🔧 Troubleshooting

**If you see "Warning: GOOGLE_API_KEY not found":**
- Check that your `.env` file exists and contains the correct API key
- Ensure there are no extra spaces or quotes around the API key
- Restart the server after making changes

**If the chatbot gives generic responses:**
- Verify your API key is valid at [Google AI Studio](https://aistudio.google.com/app/apikey)
- Check the server logs for any error messages
- Ensure you have an active internet connection

## 📞 Support

If you continue to have issues, check the server logs in the terminal for specific error messages.