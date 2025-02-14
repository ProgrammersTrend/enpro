
document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const copyBtn = document.getElementById("copy-btn");

    enhanceBtn.addEventListener("click", () => {
        const prompt = userInput.value.trim();
        if (prompt) {
            enhancedOutput.value = enhancePrompt(prompt);
        }
    });

    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(enhancedOutput.value);
        showAlert("Prompt copied!", "success");
    });

    function showAlert(message, type) {
        const alertBox = document.createElement("div");
        alertBox.textContent = message;
        alertBox.className = `fixed top-5 right-5 px-4 py-2 rounded-lg text-white shadow-md ${
            type === "success" ? "bg-green-500" : "bg-red-500"
        }`;
        document.body.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 2000);
    }
});

function enhancePrompt(prompt) {
    if (!prompt) return "";

    // Preserve programming code and commands
    if (/```[\s\S]*?```/.test(prompt)) {
        return prompt;
    }

    // Basic grammar enhancements
    prompt = prompt.charAt(0).toUpperCase() + prompt.slice(1);
    prompt = prompt.replace(/\s+/g, ' ');
    prompt = prompt.replace(/\bi\b/g, 'I');
    prompt = prompt.replace(/(?:^|\.\s+)([a-z])/g, (match, p1) => match.replace(p1, p1.toUpperCase()));
    prompt = prompt.replace(/\bpls\b/gi, 'please');
    prompt = prompt.replace(/\bthx\b|\bty\b/gi, 'thank you');
    prompt = prompt.replace(/\bai\b/gi, 'Artificial Intelligence');

    // Ensure ending punctuation
    if (!/[.!?]$/.test(prompt) && !/```/.test(prompt)) {
        prompt += '.';
    }
    return prompt;
}
