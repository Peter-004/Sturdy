 document.getElementById("download").addEventListener("click", ()=>{
    // Send a message to the content script to trigger the action
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "trigger-action" });
        }
      });
    })