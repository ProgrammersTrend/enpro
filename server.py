from flask import Flask, request, jsonify
from flask_cors import CORS
from gramformer import Gramformer
import torch

app = Flask(__name__)
CORS(app)  # Allow requests from popup.js

# Load Gramformer model
gf = Gramformer(quality=1, device='cuda' if torch.cuda.is_available() else 'cpu')

@app.route('/enhance', methods=['POST'])
def enhance_prompt():
    data = request.json
    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({"enhanced": ""})

    # Correct grammar and spelling
    corrected_sentences = gf.correct(prompt, max_candidates=1)
    enhanced_prompt = list(corrected_sentences)[0] if corrected_sentences else prompt

    return jsonify({"enhanced": enhanced_prompt})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
