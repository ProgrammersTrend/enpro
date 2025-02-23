from flask import Flask, request, jsonify
import subprocess
import json

app = Flask(__name__)

@app.route("/correct", methods=["POST"])
def correct():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"correctedText": "", "suggestions": []})

    # Call grammar_checker.py
    result = subprocess.run(["python", "grammar_checker.py"], input=text, text=True, capture_output=True)
    output = json.loads(result.stdout)

    return jsonify(output)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
