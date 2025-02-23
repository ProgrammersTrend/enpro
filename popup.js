document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const suggestionsList = document.getElementById("suggestions-list");
    const copyBtn = document.getElementById("copy-btn");
    const copyMessage = document.getElementById("copy-message");

    let verbForms = {};

    // Load verb forms from CSV file
    fetch("verbforms.csv")
        .then(response => response.text())
        .then(csvText => {
            const lines = csvText.split("\n");
            lines.forEach(line => {
                const [V1, V2, V3, V4, V5] = line.split(",");
                if (V1) {
                    verbForms[V1.trim().toLowerCase()] = {
                        V1: V1.trim(), V2: V2.trim(), V3: V3.trim(), V4: V4.trim(), V5: V5.trim()
                    };
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

        let words = prompt.split(/\s+/);
        let enhancedWords = [];

        for (let i = 0; i < words.length; i++) {
            let word = words[i].toLowerCase();
            let nextWord = words[i + 1] ? words[i + 1].toLowerCase() : "";

            // Detect time-related words to determine the correct tense
            let tense = "present";
            if (word === "yesterday" || word === "last" || nextWord === "ago") tense = "past";
            if (word === "tomorrow" || word === "next" || nextWord === "will") tense = "future";
            if (word === "already" || word === "since" || word === "for") tense = "perfect";

            // Check if the word is a verb and replace it accordingly
            if (verbForms[word]) {
                if (tense === "past") {
                    enhancedWords.push(verbForms[word].V2);
                } else if (tense === "future") {
                    enhancedWords.push("will " + verbForms[word].V1);
                } else if (tense === "perfect") {
                    enhancedWords.push("has " + verbForms[word].V3);
                } else {
                    enhancedWords.push(verbForms[word].V1);
                }
            } else {
                enhancedWords.push(words[i]);
            }
        }

        let correctedText = enhancedWords.join(" ");

        // Ensure correct punctuation
        correctedText = correctedText.replace(/\si\s/g, " I "); // Capitalize "I"
        correctedText = correctedText.replace(/(\w+)([.,!?])/g, "$1 $2"); // Fix punctuation spacing
        correctedText = correctedText.replace(/\s+/g, " ").trim(); // Remove extra spaces
        if (!/[.!?]$/.test(correctedText)) correctedText += "."; // Add final punctuation

        return correctedText;
    }
});
