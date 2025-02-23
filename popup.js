document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const suggestionsList = document.getElementById("suggestions-list");
    const copyBtn = document.getElementById("copy-btn");
    const copyMessage = document.getElementById("copy-message");

    let verbForms = {}; // Stores verb conjugations

    // ✅ Load CSV File with 9000+ Verbs
    fetch("./verbforms.csv")
        .then(response => response.text())
        .then(data => parseCSV(data))
        .catch(error => console.error("Error loading CSV:", error));

    function parseCSV(csvText) {
        const rows = csvText.split("\n");
        rows.forEach(row => {
            const [V1, V2, V3, V4, V5] = row.split(",").map(word => word.trim());
            if (V1 && V2 && V3) {
                verbForms[V1.toLowerCase()] = { base: V1, past: V2, pastParticiple: V3, thirdPerson: V4 || V1 + "s", gerund: V5 || V1 + "ing" };
            }
        });
    }

    enhanceBtn.addEventListener("click", () => {
        const prompt = userInput.value.trim();
        if (prompt) {
            const correctedText = enhanceText(prompt);
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
});

// ✅ Enhances Multi-Paragraph Text
function enhanceText(text) {
    let paragraphs = text.split(/\n+/);
    let enhancedParagraphs = paragraphs.map(paragraph => {
        let sentences = splitIntoSentences(paragraph);
        let enhancedSentences = sentences.map(sentence => enhanceSentence(sentence));
        return enhancedSentences.join(" ");
    });
    return enhancedParagraphs.join("\n\n");
}

// ✅ Splits Sentences While Keeping Punctuation
function splitIntoSentences(text) {
    return text.match(/[^.!?;]+[.!?;]?/g) || [text];
}

// ✅ Enhances a Single Sentence
function enhanceSentence(sentence) {
    let words = sentence.split(" ");
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1); // Capitalize first word

    let fixedSentence = words.join(" ");
    fixedSentence = correctTense(fixedSentence);
    fixedSentence = correctPunctuation(fixedSentence);

    return fixedSentence;
}

// ✅ Corrects Verb Tenses Using CSV Data
function correctTense(sentence) {
    return sentence.replace(/\b([a-z]+)\b/gi, (match, verb) => {
        let verbLower = verb.toLowerCase();
        if (verbForms[verbLower]) {
            return verbForms[verbLower].base; // Use base form to ensure tense accuracy
        }
        return match;
    });
}

// ✅ Ensures Correct Punctuation (., !, ;, -)
function correctPunctuation(sentence) {
    sentence = sentence.replace(/\s+([.,!;-])/g, "$1"); // Remove unnecessary spaces before punctuation
    sentence = sentence.replace(/([.,!;-])([a-zA-Z])/g, "$1 $2"); // Ensure space after punctuation
    if (!/[.!?;-]$/.test(sentence)) sentence += "."; // Ensure a proper sentence-ending punctuation
    return sentence;
}
