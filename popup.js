document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const suggestionsList = document.getElementById("suggestions-list");
    const copyBtn = document.getElementById("copy-btn");
    const copyMessage = document.getElementById("copy-message");

    enhanceBtn.addEventListener("click", async () => {
        const prompt = userInput.value.trim();
        if (prompt) {
            const { correctedText, suggestions } = await enhancePrompt(prompt);
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

async function enhancePrompt(prompt) {
    if (!prompt) return { correctedText: "", suggestions: [] };

    try {
        const response = await fetch("http://localhost:5000/correct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: prompt })
        });

        const data = await response.json();
        return { correctedText: data.correctedText, suggestions: data.suggestions };

    } catch (error) {
        console.error("Error:", error);
        return { correctedText: prompt, suggestions: [] };
    }
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
