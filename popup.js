document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-recording');
    const stopButton = document.getElementById('stop-recording');
    const replayButton = document.getElementById('replay-session');
    const statusDisplay = document.getElementById('status');
  
    // Get the recording status and update the UI
    getRecordingStatus((isRecording) => {
      if (isRecording) {
        startButton.disabled = true;
        stopButton.disabled = false;
        statusDisplay.innerText = 'Recording...';
      } else {
        startButton.disabled = false;
        stopButton.disabled = true;
        statusDisplay.innerText = '';
      }
    });
  
    startButton.addEventListener('click', () => {
      sendMessageToContentScript({ action: 'startRecording' });
      startButton.disabled = true;
      stopButton.disabled = false;
      statusDisplay.innerText = 'Recording...';
    });
  
    stopButton.addEventListener('click', () => {
      sendMessageToContentScript({ action: 'stopRecording' });
      startButton.disabled = false;
      stopButton.disabled = true;
      statusDisplay.innerText = 'Recording stopped.';
    });
  
    replayButton.addEventListener('click', () => {
      sendMessageToContentScript({ action: 'replaySession' });
      statusDisplay.innerText = 'Replaying session...';
    });
  });
  

  function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id !== undefined) {
        const tabId = tabs[0].id;  
        chrome.tabs.sendMessage(tabId, { action: 'ping' }, (response) => {
          if (chrome.runtime.lastError) {
            chrome.scripting.executeScript(
              {
                target: { tabId: tabId },
                files: ['content.js'],
              },
              () => {
                chrome.tabs.sendMessage(tabId, message, (response) => {
                  if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError.message);
                  }
                });
              }
            );
          } else {
            chrome.tabs.sendMessage(tabId, message, (response) => {
              if (chrome.runtime.lastError) {
                console.error('Error sending message:', chrome.runtime.lastError.message);
              }
            });
          }
        });
      } else {
        console.error('No active tab found.');
      }
    });
  }
  
  
