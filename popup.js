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
            const response = await fetch("http://127.0.0.1:5000/correct", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: prompt }),
            });

            if (response.ok) {
                const { correctedText, suggestions } = await response.json();
                enhancedOutput.value = correctedText;
                displaySuggestions(suggestions);
            } else {
                enhancedOutput.value = "Error processing text.";
            }
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
