from flask import Flask, request, jsonify
from gingerit.gingerit import GingerIt

app = Flask(__name__)

# Initialize GingerIt
ginger = GingerIt()

@app.route('/enhance', methods=['POST'])
def enhance_prompt():
    data = request.json
    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({"enhanced": ""})

    # Correct grammar and spelling
    corrected_prompt = ginger.parse(prompt)["result"]

    return jsonify({"enhanced": corrected_prompt})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
