chrome.runtime.onInstalled.addListener(() => {
    console.log("EnPro Extension Installed");
    chrome.runtime.getPlatformInfo((info) => {
        let pythonPath = "python"; // Adjust this if needed

        if (info.os === "win") {
            pythonPath = "python"; // Use full path if necessary
        } else if (info.os === "mac" || info.os === "linux") {
            pythonPath = "python3";
        }

        // Start Python script
        chrome.runtime.sendMessage({ action: "start-python", path: pythonPath });
    });
});
