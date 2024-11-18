const startButton = document.getElementById('start-recording');
const stopButton = document.getElementById('stop-recording');
const replayButton = document.getElementById('replay-session');
const statusDisplay = document.getElementById('status');


startButton.addEventListener('click', () => {
    startButton.disabled = true;
    stopButton.disabled = false;
    statusDisplay.innerText = 'Recording...';
  });

  stopButton.addEventListener('click', () => {
    startButton.disabled = false;
    stopButton.disabled = true;
    statusDisplay.innerText = 'Recording stopped.';
  });

  replayButton.addEventListener('click', () => {
    statusDisplay.innerText = 'Replaying session...';
  });
