document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const copyBtn = document.getElementById("copy-btn");
    const copyMessage = document.getElementById("copy-message");

    let verbForms = {};  // Store verb conjugations dynamically

    // Load verb forms from CSV
    fetch("verbforms.csv")
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n");
            lines.forEach(line => {
                const [V1, V2, V3, V4, V5] = line.split(",");
                if (V1) {
                    verbForms[V1.trim().toLowerCase()] = { V2, V3, V4, V5 };
                }
            });
        });

    enhanceBtn.addEventListener("click", () => {
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
        }, 5000);
    }

    function enhancePrompt(prompt) {
        if (!prompt) return "";

        let sentences = prompt.split(/(?<=[.!?])\s+/); // Split sentences properly
        let enhancedSentences = sentences.map(sentence => processSentence(sentence));

        return enhancedSentences.join(" ");
    }

    function processSentence(sentence) {
        let words = sentence.split(/\s+/);
        let updatedWords = [];
        let tense = detectTense(sentence); // Identify tense

        words.forEach((word, index) => {
            let lowerWord = word.toLowerCase();

            // Fix contractions
            if (lowerWord === "dont") words[index] = "don't";
            if (lowerWord === "wanna") words[index] = "want to";
            if (lowerWord === "gonna") words[index] = "going to";

            // Apply tense correction to verbs
            if (verbForms[lowerWord]) {
                words[index] = applyTenseTransformation(lowerWord, tense);
            }

            updatedWords.push(words[index]);
        });

        let correctedSentence = updatedWords.join(" ");
        correctedSentence = correctedSentence.replace(/\si\s/g, " I "); // Capitalize 'I'
        correctedSentence = correctedSentence.replace(/\bpls\b/gi, "please");

        // Ensure proper punctuation
        if (!/[.!?]$/.test(correctedSentence)) {
            correctedSentence += ".";
        }

        return correctedSentence;
    }

    function detectTense(sentence) {
        let lowerSentence = sentence.toLowerCase();

        if (lowerSentence.includes("yesterday") || lowerSentence.includes("last") || lowerSentence.includes("ago")) {
            return "past";
        }
        if (lowerSentence.includes("has") || lowerSentence.includes("have") || lowerSentence.includes("had")) {
            return "perfect";
        }
        if (lowerSentence.includes("tomorrow") || lowerSentence.includes("next") || lowerSentence.includes("will")) {
            return "future";
        }
        return "present"; // Default tense
    }

    function applyTenseTransformation(word, tense) {
        let verb = verbForms[word];

        if (!verb) return word; // No transformation needed if verb is not found

        switch (tense) {
            case "past":
                return verb.V2 || word; // Simple past
            case "perfect":
                return verb.V3 || word; // Past participle
            case "future":
                return "will " + (verb.V1 || word); // Future tense
            default:
                return word; // Present tense (no change)
        }
    }
});
