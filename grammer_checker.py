import subprocess
import json
import sys
from flask import Flask, request, jsonify
import language_tool_python  # Grammar correction library

app = Flask(__name__)
tool = language_tool_python.LanguageTool('en-US')  # English Grammar Checker

@app.route('/correct', methods=['POST'])
def correct_grammar():
    data = request.get_json()
    prompt = data.get("text", "")

    # Grammar Correction
    matches = tool.check(prompt)
    corrected_text = language_tool_python.utils.correct(prompt, matches)

    # Suggestions
    suggestions = [match.replacements[0] for match in matches if match.replacements]

    return jsonify({"correctedText": corrected_text, "suggestions": suggestions})

if __name__ == "__main__":
    # Automatically start the server in the background
    subprocess.Popen([sys.executable, __file__], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    app.run(host="127.0.0.1", port=5000, debug=False)
