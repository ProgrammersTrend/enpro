document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const suggestionsList = document.getElementById("suggestions-list");
    const copyBtn = document.getElementById("copy-btn");
    const copyMessage = document.getElementById("copy-message");

    let verbForms = {};  // Dictionary to store verb mappings

    // Load verb forms from CSV
    async function loadVerbForms() {
        try {
            const response = await fetch("verbforms.csv");
            const data = await response.text();
            const lines = data.split("\n");
            lines.forEach(line => {
                const [V1, V2, V3, V4, V5] = line.split(",").map(v => v.trim());
                if (V1) {
                    verbForms[V1.toLowerCase()] = { V2, V3, V4, V5 };
                }
            });
        } catch (error) {
            console.error("Error loading verb forms:", error);
        }
    }

    enhanceBtn.addEventListener("click", async () => {
        await loadVerbForms();  // Ensure verb list is loaded before processing
        const prompt = userInput.value.trim();
        if (prompt) {
            const correctedText = enhancePrompt(prompt);
            enhancedOutput.value = correctedText;
        }
    });

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

    function enhancePrompt(prompt) {
        if (!prompt) return "";

        // Capitalize first letter of each sentence
        let sentences = prompt.split(/(?<=[.!?])\s+/).map(sentence => {
            return sentence.charAt(0).toUpperCase() + sentence.slice(1);
        });

        let correctedSentences = sentences.map(sentence => correctGrammar(sentence));

        return correctedSentences.join(" ");
    }

    function correctGrammar(sentence) {
        let words = sentence.split(" ");
        let correctedWords = words.map((word, index) => {
            let lowerWord = word.toLowerCase().replace(/[.,!?;]/g, '');  // Remove punctuation temporarily

            if (verbForms[lowerWord]) {
                // Choose correct verb form based on context (basic heuristic)
                if (words[index - 1] && words[index - 1].toLowerCase() === "has") {
                    return verbForms[lowerWord].V3;  // Past participle
                } else if (words[index - 1] && words[index - 1].toLowerCase() === "will") {
                    return verbForms[lowerWord].V1;  // Base form for future
                } else if (index === 0 || words[index - 1].toLowerCase() === "he" || words[index - 1].toLowerCase() === "she") {
                    return verbForms[lowerWord].V2;  // Singular present
                } else {
                    return verbForms[lowerWord].V1;  // Default to base form
                }
            }
            return word;  // Return unchanged if not a verb
        });

        // Re-add punctuation where necessary
        let correctedSentence = correctedWords.join(" ");
        if (!/[.!?]$/.test(correctedSentence)) {
            correctedSentence += ".";  // Add full stop if missing
        }

        return correctedSentence;
    }
});
