document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const suggestionsList = document.getElementById("suggestions-list");
    const copyBtn = document.getElementById("copy-btn");

    enhanceBtn.addEventListener("click", () => {
        const prompt = userInput.value.trim();
        if (prompt) {
            const { correctedText, suggestions } = enhancePrompt(prompt);
            enhancedOutput.value = correctedText;
            displaySuggestions(suggestions);
        }
    });

    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(enhancedOutput.value);
        showAlert("Prompt copied!", "success");
    });

    function showAlert(message, type) {
        const alertBox = document.createElement("div");
        alertBox.textContent = message;
        alertBox.className = `fixed top-5 right-5 px-4 py-2 rounded-lg text-white text-sm ${type === "success" ? "bg-green-500" : "bg-red-500"}`;
        document.body.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 2000);
    }
});

function enhancePrompt(prompt) {
    if (!prompt) return { correctedText: "", suggestions: [] };

    let correctedText = prompt.charAt(0).toUpperCase() + prompt.slice(1);
    correctedText = correctedText.replace(/\bi\b/g, 'I');
    correctedText = correctedText.replace(/\bpls\b/gi, 'please');
    correctedText = correctedText.replace(/\bthx\b|\bty\b/gi, 'thank you');
    correctedText = correctedText.replace(/\bai\b/gi, 'Artificial Intelligence');

    if (!/[.!?]$/.test(correctedText)) {
        correctedText += '.';
    }

    const suggestions = [
        correctedText.replace("please", "kindly"),
        correctedText.replace("thank you", "thanks"),
        correctedText.replace("Artificial Intelligence", "AI"),
        correctedText.replace("Enhance", "Improve"),
    ];

    return { correctedText, suggestions };
}

function displaySuggestions(suggestions) {
    suggestionsList.innerHTML = "";
    suggestions.forEach(suggestion => {
        const li = document.createElement("li");
        li.textContent = suggestion;
        li.className = "bg-gray-800 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition";
        li.addEventListener("click", () => {
            document.getElementById("enhanced-output").value = suggestion;
        });
        suggestionsList.appendChild(li);
    });
}
