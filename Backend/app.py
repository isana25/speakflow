from flask import Flask, request, jsonify
from flask_cors import CORS  # Import Flask-CORS
import requests
import logging
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from langdetect import detect

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# IBM Watson API Credentials
IBM_API_KEY = "NNFdMnmNWYNw1bx4MuHOIAnmWABci3-5aZ_wZXmyrIYw"

# IBM Watson Service URLs
WATSONX_API_URL = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"
PROJECT_ID = "8323eb5c-db81-438a-8ae1-1696d9550cbf"
MODEL_ID = "ibm/granite-20b-multilingual"

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Function to get OAuth token
def get_access_token(api_key):
    token_url = "https://iam.cloud.ibm.com/identity/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "urn:ibm:params:oauth:grant-type:apikey", "apikey": api_key}
    response = requests.post(token_url, headers=headers, data=data)
    if response.status_code != 200:
        logger.error("Failed to get access token: %s", response.text)
        raise Exception(f"Failed to get access token: {response.text}")
    token = response.json()["access_token"]
    return token

# Get access token
access_token = get_access_token(IBM_API_KEY)
@app.route('/translate', methods=['POST'])
def translate():
    try:
        # Get input data
        data = request.get_json()

        # Check for 'text' and 'target_language' in the request
        if 'text' not in data or 'target_language' not in data:
            return jsonify({"error": "Missing 'text' or 'target_language' in request body"}), 400
        
        text = data['text']
        target_language = data.get('target_language', 'en')  # Use 'en' if target_language is not provided

        # Step 1: Detect the language of the input text
        detected_language = detect(text)
        logger.info(f"Detected language: {detected_language}")
        target_language="es"
        # Step 2: If the detected language is the same as the target language, skip translation
        if detected_language == target_language:
            return jsonify({
                "original_text": text,
                "detected_language": detected_language,
                "translated_text": text
            })

        # Step 3: Translate text using WatsonX AI (Granite model) or fallback to Language Translator
        try:
            headers = {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}"
            }

            body = {
                "input": f"Translate the following text from {detected_language} to {target_language}: '{text}'",
                "parameters": {
                    "decoding_method": "greedy",
                    "max_new_tokens": 900,
                    "min_new_tokens": 0,
                    "repetition_penalty": 1.05
                },
                "model_id": MODEL_ID,
                "project_id": PROJECT_ID
            }

            response = requests.post(WATSONX_API_URL, headers=headers, json=body)

            logger.info(f"API Response: {response.text}")  # Log the response to understand what's happening

            if response.status_code != 200:
                raise Exception(f"Granite translation failed: {response.text}")

            data = response.json()

            # Extract translation
            translated_text = data.get("results", [{}])[0].get("generated_text", "").strip()
            if not translated_text:
                translated_text = "Translation failed or empty response"

            logger.info(f"Translated text: {translated_text}")

        except Exception as e:
            logger.error(f"Granite translation failed, fallback to Watson Language Translator: {e}")
            translated_text = "Translation failed"

        # Return the translated text
        return jsonify({
            "original_text": text,
            "detected_language": detected_language,
            "translated_text": translated_text
        })

    except Exception as e:
        logger.error(f"Translation processing failed: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
