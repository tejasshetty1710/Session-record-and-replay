let isRecording = false;
let events = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    sendResponse({ status: 'alive' });
    return;
  }

  if (request.action === 'getStatus') {
    sendResponse({ isRecording });
    return;
  }

  if (request.action === 'startRecording') {
    startRecording();
    sendResponse({ status: 'started' });
  } else if (request.action === 'stopRecording') {
    stopRecording();
    sendResponse({ status: 'stopped' });
  } else if (request.action === 'replaySession') {
    replaySession();
    sendResponse({ status: 'replaying' });
  } else {
    sendResponse({ status: 'unknown action' });
  }
});

function startRecording() {
  isRecording = true;
  events = [];
  attachEventListeners();
}

function stopRecording() {
  isRecording = false;
  detachEventListeners();
  chrome.storage.local.set({ recordedEvents: events });
}


function replaySession() {
  chrome.storage.local.get('recordedEvents', (data) => {
    if (data.recordedEvents && data.recordedEvents.length > 0) {
      simulateEvents(data.recordedEvents);
    } else {
      chrome.runtime.sendMessage({ action: 'replayFinished' });
    }
  });
}

function attachEventListeners() {
    document.addEventListener('click', recordEvent, true);
    document.addEventListener('input', recordEvent, true);
    window.addEventListener('scroll', recordScroll, true); // Capture scroll events on all elements
  }
  

  function detachEventListeners() {
    document.removeEventListener('click', recordEvent, true);
    document.removeEventListener('input', recordEvent, true);
    window.removeEventListener('scroll', recordScroll, true);
  }


function recordEvent(e) {
    if (!isRecording) return;
  
    const eventRecord = {
      type: e.type,
      timestamp: Date.now(),
      selector: getUniqueSelector(e.target),
    };
  
    if (e.type === 'input') {
      eventRecord.value = e.target.value || null;
    }
  
    events.push(eventRecord);
  }
  
  