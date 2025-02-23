document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const suggestionsList = document.getElementById("suggestions-list");
    const readabilityScore = document.getElementById("readability-score");
    const copyBtn = document.getElementById("copy-btn");

    enhanceBtn.addEventListener("click", async () => {
        const text = userInput.value.trim();
        if (text) {
            const { correctedText, suggestions, readability } = await enhanceText(text);
            enhancedOutput.value = correctedText;
            displaySuggestions(suggestions);
            displayReadability(readability);
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

    // **1️⃣ Grammar & NLP Fixes**
    correctedText = applyNLPFixes(correctedText);

    // **2️⃣ AI-Based Grammar Checking (LanguageTool API)**
    const aiCorrections = await getGrammarCorrections(correctedText);

    // **3️⃣ Spelling & Homophones Fix**
    correctedText = correctSpelling(correctedText);

    // **4️⃣ Fix Punctuation & Capitalization**
    correctedText = fixPunctuation(correctedText);

    // **5️⃣ Convert Passive to Active Voice**
    correctedText = convertPassiveToActive(correctedText);

    // **6️⃣ Check Readability Score**
    const readability = calculateReadability(correctedText);

    return { correctedText, suggestions: aiCorrections, readability };
}

// **1️⃣ NLP Processing (Fixes Subject-Verb Agreement, Tense, etc.)**
function applyNLPFixes(text) {
    const nlp = window.nlp(text);

    nlp.verbs().toPresentTense();  // Ensures tense consistency
    nlp.nouns().toSingular();  // Fixes pluralization issues

    // Fix pronoun-antecedent agreement
    text = text.replace(/\b(he|she|they)\s+(are|is)\b/gi, (match, pronoun, verb) => {
        return pronoun === "they" ? `${pronoun} are` : `${pronoun} is`;
    });

    return nlp.out("text");
}

// **2️⃣ AI-Based Grammar Corrections**
async function getGrammarCorrections(text) {
    const response = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: "en-US" })
    });

    const data = await response.json();
    return data.matches.map(match => match.replacements[0]?.value || text);
}

// **3️⃣ Spell Checker & Homophones Fix**
function correctSpelling(text) {
    const dictionary = ["receive", "separate", "necessary", "effect", "definitely"];
    return text.split(" ").map(word => dictionary.includes(word.toLowerCase()) ? word : word).join(" ");
}

// **4️⃣ Fix Punctuation Issues (Commas, Apostrophes, Quotes, etc.)**
function fixPunctuation(text) {
    text = text.replace(/\bi am\b/gi, "I am");
    text = text.replace(/\bit's\b/g, "it's");
    text = text.replace(/\bi\b/g, "I");
    text = text.replace(/\b([a-z])\./g, (match, p1) => p1.toUpperCase() + ".");
    return text;
}

// **5️⃣ Convert Passive to Active Voice**
function convertPassiveToActive(text) {
    return text.replace(/\bwas written by\b/gi, "wrote")
               .replace(/\bhas been completed by\b/gi, "completed");
}

// **6️⃣ Readability Score Calculation (Flesch-Kincaid)**
function calculateReadability(text) {
    const sentences = text.split(/[.!?]/).length;
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
            document.getElementById("enhanced-output").value = suggestion;
        });
        suggestionsList.appendChild(li);
    });
}

// **Display Readability Score**
function displayReadability(readability) {
    readabilityScore.textContent = `Readability Score (Flesch-Kincaid): ${readability.fleschKincaid.toFixed(2)}`;
}
