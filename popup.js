document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const suggestionsList = document.getElementById("suggestions-list");
    const readabilityScore = document.getElementById("readability-score");
    const copyBtn = document.getElementById("copy-btn");

    enhanceBtn.addEventListener("click", async () => {
        const text = userInput.value.trim();
        if (!text) {
            alert("Please enter a valid text!");
            return;
        }

        try {
            const { correctedText, suggestions, readability } = await enhanceText(text);
            enhancedOutput.value = correctedText;
            displaySuggestions(suggestions);
            displayReadability(readability);
        } catch (error) {
            console.error("Enhancement failed:", error);
            alert("An error occurred while processing. Please try again.");
        }
    });

    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(enhancedOutput.value);
        alert("Copied to clipboard!");
    });
});

// **Enhance text with NLP, AI Grammar Fixes, and Readability Enhancements**
async function enhanceText(text) {
    let correctedText = text.trim();

    // **1️⃣ NLP Fixes**
    correctedText = applyNLPFixes(correctedText);

    // **2️⃣ AI Grammar Corrections**
    const aiCorrections = await getGrammarCorrections(correctedText);

    // **3️⃣ Spelling & Homophones Fix**
    correctedText = correctSpelling(correctedText);

    // **4️⃣ Fix Punctuation & Capitalization**
    correctedText = fixPunctuation(correctedText);

    // **5️⃣ Convert Passive to Active Voice**
    correctedText = convertPassiveToActive(correctedText);

    // **6️⃣ Calculate Readability Score**
    const readability = calculateReadability(correctedText);

    return { correctedText, suggestions: aiCorrections, readability };
}

// **1️⃣ NLP Processing (Fixes Subject-Verb Agreement, Tense, etc.)**
function applyNLPFixes(text) {
    const doc = nlp(text); // ✅ Fixed incorrect window.nlp usage

    doc.verbs().toPresentTense();
    doc.nouns().toSingular();
    
    return doc.text(); // ✅ Corrected output retrieval
}

// **2️⃣ AI Grammar Corrections (Handled API Errors)**
async function getGrammarCorrections(text) {
    try {
        const response = await fetch("https://api.languagetool.org/v2/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, language: "en-US" })
        });

        if (!response.ok) throw new Error("LanguageTool API failed!");

        const data = await response.json();
        return data.matches.map(match => match.replacements[0]?.value || text);
    } catch (error) {
        console.error("Grammar API error:", error);
        return []; // Return empty suggestions if API fails
    }
}

// **3️⃣ Spell Checker**
function correctSpelling(text) {
    const dictionary = { "recieve": "receive", "seperate": "separate", "neccessary": "necessary" };
    return text.split(" ").map(word => dictionary[word.toLowerCase()] || word).join(" ");
}

// **4️⃣ Fix Punctuation**
function fixPunctuation(text) {
    return text.replace(/\bi am\b/gi, "I am")
               .replace(/\bit's\b/g, "it's")
               .replace(/\bi\b/g, "I")
               .replace(/\b([a-z])\./g, (match, p1) => p1.toUpperCase() + ".");
}

// **5️⃣ Convert Passive to Active Voice**
function convertPassiveToActive(text) {
    return text.replace(/\bwas written by\b/gi, "wrote")
               .replace(/\bhas been completed by\b/gi, "completed");
}

// **6️⃣ Calculate Readability Score**
function calculateReadability(text) {
    const sentences = text.split(/[.!?]/).filter(s => s.trim()).length;
    const words = text.split(/\s+/).length;
    const syllables = text.split(/[aeiouy]+/).length - 1;

    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    return { fleschKincaid: score, sentences, words };
}

// **Display AI Suggestions**
function displaySuggestions(suggestions) {
    suggestionsList.innerHTML = "";
    suggestions.forEach(suggestion => {
        const li = document.createElement("li");
        li.textContent = suggestion;
        li.className = "suggestion";
        li.addEventListener("click", () => {
            enhancedOutput.value = suggestion;
        });
        suggestionsList.appendChild(li);
    });
}

// **Display Readability Score**
function displayReadability(readability) {
    readabilityScore.textContent = `Readability Score (Flesch-Kincaid): ${readability.fleschKincaid.toFixed(2)}`;
}
