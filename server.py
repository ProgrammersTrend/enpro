from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load Grammar Correction Model
grammar_corrector = pipeline("text2text-generation", model="vennify/t5-base-grammar-correction")

@app.route('/enhance', methods=['POST'])
def enhance_prompt():
    data = request.json
    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({"enhanced": ""})

    # AI-based grammar correction
    enhanced_prompt = grammar_corrector(prompt, max_length=128)[0]["generated_text"]

    return jsonify({"enhanced": enhanced_prompt})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
