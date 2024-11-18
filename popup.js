const startButton = document.getElementById('start-recording');
const stopButton = document.getElementById('stop-recording');
const replayButton = document.getElementById('replay-session');
const statusDisplay = document.getElementById('status');


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


  function sendMessageToContentScript(message) {
    chrome.tabs.sendMessage(tabId, message, (response) => {
    if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError.message);
    }
    });
  }
  
