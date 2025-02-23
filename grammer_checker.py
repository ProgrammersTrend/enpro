import sys
import json
import language_tool_python

# Initialize LanguageTool for English grammar correction
tool = language_tool_python.LanguageTool('en-US')

def correct_grammar(text):
    matches = tool.check(text)
    corrected_text = language_tool_python.utils.correct(text, matches)

    # Collect suggestions
    suggestions = [
        match.replacements[0] if match.replacements else text
        for match in matches
    ]

    return {
        "correctedText": corrected_text,
        "suggestions": suggestions
    }

if __name__ == "__main__":
    input_text = sys.stdin.read().strip()
    result = correct_grammar(input_text)
    print(json.dumps(result))  # Output in JSON format
