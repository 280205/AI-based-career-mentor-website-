from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Warning: GEMINI_API_KEY not found in environment. Check .env file.")
genai.configure(api_key=api_key)

# Initialize Gemini model
try:
    model = genai.GenerativeModel('gemini-1.5-pro')
except Exception as e:
    print(f"Failed to initialize Gemini model: {e}")
    model = None

# Endpoint: Profile to Career Recommendation
@app.route('/api/profile', methods=['POST'])
def update_profile():
    try:
        profile = request.json.get('profile', {})
        if not profile:
            return jsonify({'error': 'No profile data received'}), 400

        skills = profile.get('skills', ['Not specified'])
        interests = profile.get('interests', ['Not specified'])
        education = profile.get('education', 'Not specified')
        experience = profile.get('experience', 'Not specified')

        # Tightly scoped prompt with no invitation for questions
        prompt = f"""
        Given the user profile below, suggest one suitable career role.

        Respond with:
        - Career Title
        - 3 to 4 key responsibilities
        - How user's skills and interests match this role
        - Growth opportunities
        - 2 actionable next steps to pursue this role

        Avoid questions or follow-ups. Use "-" for bullets. Keep it short and helpful.

        User Profile:
        - Skills: {', '.join(skills)}
        - Interests: {', '.join(interests)}
        - Education: {education}
        - Experience: {experience}
        """

        if not model:
            return jsonify({'error': 'Model not initialized'}), 500
        response = model.generate_content(prompt)
        career_description = response.text.strip()

        return jsonify({'career_description': career_description})
    except Exception as e:
        print(f"Error in update_profile: {e}")
        return jsonify({'error': str(e)}), 500

# Endpoint: Mentor Chat
@app.route('/api/chat', methods=['POST'])
def chat_with_mentor():
    try:
        user_message = request.json.get('message', '')
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        prompt = f"""
        You are a professional career mentor.

        Respond clearly and helpfully to the user's question below:
        - No follow-up questions.
        - No vague answers.
        - Use "-" for bullet points if needed.
        - Keep the reply concise and practical.

        User Question:
        {user_message}
        """

        if not model:
            return jsonify({'error': 'Model not initialized'}), 500
        response = model.generate_content(prompt)
        mentor_response = response.text.strip()

        return jsonify({'response': mentor_response})
    except Exception as e:
        print(f"Error in chat_with_mentor: {e}")
        return jsonify({'error': str(e)}), 500

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
