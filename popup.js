document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const suggestionsList = document.getElementById("suggestions-list");
    const copyBtn = document.getElementById("copy-btn");
    const copyMessage = document.getElementById("copy-message");

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
        li.className = "suggestion";
        li.addEventListener("click", () => {
            document.getElementById("enhanced-output").value = suggestion;
        });
        suggestionsList.appendChild(li);
    });
}
