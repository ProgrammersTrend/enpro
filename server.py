from flask import Flask, request, jsonify
import language_tool_python

app = Flask(__name__)

# Initialize LanguageTool for English
tool = language_tool_python.LanguageTool('en-US')

@app.route('/enhance', methods=['POST'])
def enhance_prompt():
    data = request.json
    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({"enhanced": ""})

    # Correct grammar and spelling
    corrected_prompt = tool.correct(prompt)

    return jsonify({"enhanced": corrected_prompt})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
