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

        let previousWord = ""; // Track last word for context

        words.forEach((word, index) => {
            let cleanedWord = word.toLowerCase().replace(/[.,!?;]/g, ''); // Remove punctuation for lookup
            let correctedWord = word;

            // Detect tense based on timeline words
            let isSimplePresent = previousWord.match(/\b(always|usually|every|often|sometimes|never|generally)\b/i);
            let isPresentContinuous = previousWord.match(/\b(now|currently|at the moment|right now)\b/i);
            let isPresentPerfect = previousWord.match(/\b(since|for|ever|never|so far|just|yet|already|recently|lately)\b/i);
            let isPresentPerfectContinuous = previousWord.match(/\b(since|for)\b/i);

            let isSimplePast = previousWord.match(/\b(yesterday|last|ago|before|previously)\b/i);
            let isPastContinuous = previousWord.match(/\b(while|when)\b/i);
            let isPastPerfect = previousWord.match(/\b(before|after)\b/i);
            let isPastPerfectContinuous = previousWord.match(/\b(for|since)\b/i);

            let isSimpleFuture = previousWord.match(/\b(tomorrow|soon|next|later|someday)\b/i);
            let isFutureContinuous = previousWord.match(/\b(soon|by then)\b/i);
            let isFuturePerfect = previousWord.match(/\b(by|before|by the time)\b/i);
            let isFuturePerfectContinuous = previousWord.match(/\b(for|since|by then)\b/i);

            // Fix verb tense while ensuring sentence structure remains
            if (verbForms[cleanedWord]) {
                if (isSimplePresent) {
                    correctedWord = verbForms[cleanedWord].V2; // Present simple (3rd person singular)
                } else if (isPresentContinuous) {
                    correctedWord = "is " + verbForms[cleanedWord].V4; // Present continuous (-ing form)
                } else if (isPresentPerfect) {
                    correctedWord = "has " + verbForms[cleanedWord].V3; // Present perfect
                } else if (isPresentPerfectContinuous) {
                    correctedWord = "has been " + verbForms[cleanedWord].V4; // Present perfect continuous

                } else if (isSimplePast) {
                    correctedWord = verbForms[cleanedWord].V3; // Past simple
                } else if (isPastContinuous) {
                    correctedWord = "was " + verbForms[cleanedWord].V4; // Past continuous
                } else if (isPastPerfect) {
                    correctedWord = "had " + verbForms[cleanedWord].V3; // Past perfect
                } else if (isPastPerfectContinuous) {
                    correctedWord = "had been " + verbForms[cleanedWord].V4; // Past perfect continuous

                } else if (isSimpleFuture) {
                    correctedWord = "will " + verbForms[cleanedWord].V1; // Future simple
                } else if (isFutureContinuous) {
                    correctedWord = "will be " + verbForms[cleanedWord].V4; // Future continuous
                } else if (isFuturePerfect) {
                    correctedWord = "will have " + verbForms[cleanedWord].V3; // Future perfect
                } else if (isFuturePerfectContinuous) {
                    correctedWord = "will have been " + verbForms[cleanedWord].V4; // Future perfect continuous
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
