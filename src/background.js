// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'replayFinished') {
      // Optionally, you can perform actions here or store the message
      // For example, you might want to keep track of when replays finish
    }

    console.log('background.js received message:', message);
  
    // If the popup is open, forward the message to the popup
    chrome.runtime.sendMessage(message);
  
    // Indicate that no asynchronous response will be sent
    return false;
  });
  