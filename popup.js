document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const copyBtn = document.getElementById("copy-btn");
    const copyMessage = document.getElementById("copy-message");

    let verbForms = {}; // Store verb mappings

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
        await loadVerbForms(); // Ensure verbs are loaded before processing
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

        // Split into sentences based on punctuation
        let sentences = prompt.split(/(?<=[.!?])\s+/);

        let correctedSentences = sentences.map(sentence => correctGrammar(sentence));

        return correctedSentences.join(" ");
    }

    function correctGrammar(sentence) {
        let words = sentence.split(/\s+/);
        let correctedWords = [];

        let previousWord = ""; // Track last word for better verb tense changes

        words.forEach((word, index) => {
            let cleanedWord = word.toLowerCase().replace(/[.,!?;]/g, ''); // Remove punctuation for lookup
            let correctedWord = word;

            // Determine tense based on past indicators
            let isPast = previousWord.match(/\b(yesterday|last|ago|previous|before)\b/i);
            let isPresent = previousWord.match(/\b(now|currently|today)\b/i);
            let isFuture = previousWord.match(/\b(will|shall|going to|next|tomorrow|soon)\b/i);

            if (verbForms[cleanedWord]) {
                if (isPast) {
                    correctedWord = verbForms[cleanedWord].V3; // Past participle
                } else if (isFuture) {
                    correctedWord = verbForms[cleanedWord].V1; // Base form (future tense)
                } else if (isPresent) {
                    correctedWord = verbForms[cleanedWord].V2; // Present form
                } else {
                    correctedWord = verbForms[cleanedWord].V1; // Default to base
                }
            }

            correctedWords.push(correctedWord);
            previousWord = word;
        });

        // Ensure sentence structure remains intact
        let correctedSentence = correctedWords.join(" ");

        // Ensure punctuation is placed correctly
        if (!/[.!?]$/.test(correctedSentence)) {
            correctedSentence += "."; // Ensure it ends with a period
        }

        return correctedSentence.charAt(0).toUpperCase() + correctedSentence.slice(1);
    }
});
