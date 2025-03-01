document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const enhanceBtn = document.getElementById("enhance-btn");
    const enhancedOutput = document.getElementById("enhanced-output");
    const copyBtn = document.getElementById("copy-btn");
    const copyMessage = document.getElementById("copy-message");

    enhanceBtn.addEventListener("click", async () => {
        const prompt = userInput.value.trim();
        if (!prompt) return;

        enhancedOutput.value = "Enhancing..."; // Show loading state

        try {
            const response = await fetch("http://127.0.0.1:5000/enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt })
            });

            const data = await response.json();
            enhancedOutput.value = data.enhanced || "Error enhancing prompt.";
        } catch (error) {
            enhancedOutput.value = "Failed to connect to server.";
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
        }, 2000);
    }
});
