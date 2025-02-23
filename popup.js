document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const copyBtn = document.getElementById("copy-btn");
    const copyMessage = document.getElementById("copy-message");

    let verbForms = {}; // Stores verb forms from CSV

    // Load CSV and store verb forms
    fetch("verbforms.csv")
        .then(response => response.text())
        .then(data => parseCSV(data))
        .catch(error => console.error("Error loading CSV:", error));

    function parseCSV(data) {
        const rows = data.split("\n").map(row => row.split(","));
        rows.forEach(row => {
            if (row.length >= 5) {
                let [V1, V2, V3, V4, V5] = row.map(v => v.trim().toLowerCase());
                verbForms[V1] = { V1, V2, V3, V4, V5 };
            }
        });
    }

    // Event Listener for Enhance Button
    enhanceBtn.addEventListener("click", () => {
        const prompt = userInput.value.trim();
        if (prompt) {
            const correctedText = enhancePrompt(prompt);
            enhancedOutput.value = correctedText;
        }
    });

    // Copy Enhanced Text
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(enhancedOutput.value);
        showCopyMessage();
    });

    function showCopyMessage() {
        copyMessage.classList.remove("hidden");
        clearTimeout(copyMessage.timeout);
        copyMessage.timeout = setTimeout(() => {
            copyMessage.classList.add("hidden");
        }, 3000);
    }

    function enhancePrompt(text) {
        let sentences = text.split(/([.!?;])/g); // Splits while keeping punctuation
        let correctedText = "";

        sentences.forEach((sentence, index) => {
            if (index % 2 === 0) {
                let words = sentence.split(/\s+/);
                words = words.map(word => correctVerb(word));
                sentence = words.join(" ");
            }
            correctedText += sentence;
        });

        return correctedText.charAt(0).toUpperCase() + correctedText.slice(1);
    }

    function correctVerb(word) {
        let lowerWord = word.toLowerCase();
        if (verbForms[lowerWord]) {
            return verbForms[lowerWord].V2; // Replaces with past tense (V2)
        }
        return word;
    }
});
