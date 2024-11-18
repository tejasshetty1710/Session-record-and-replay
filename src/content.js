import unique from 'unique-selector'; 
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
    replaySession(request.sessionId);
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

  const sessionId = Date.now();
  const session = {
    id: sessionId,
    name: `Session ${new Date(sessionId).toLocaleString()}`,
    events: events
  };

  chrome.storage.local.get('sessions', (data) => {
    const sessions = data.sessions || [];
    sessions.push(session);
    chrome.storage.local.set({ sessions: sessions });
    chrome.runtime.sendMessage({ action: 'sessionSaved' });
  });
}


function replaySession(sessionId) {
  chrome.storage.local.get('sessions', (data) => {
    const sessions = data.sessions || [];
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      simulateEvents(session.events);
    } else {
      alert('Session not found.');
      chrome.runtime.sendMessage({ action: 'replayFinished' });
    }
  });
}

function attachEventListeners() {
    document.addEventListener('click', recordEvent, true);
    document.addEventListener('input', recordEvent, true);
    document.addEventListener('scroll', recordScroll, true);
  }
  

  function detachEventListeners() {
    document.removeEventListener('click', recordEvent, true);
    document.removeEventListener('input', recordEvent, true);
    document.removeEventListener('scroll', recordScroll, true);
  }
  

function recordEvent(e) {
    console.log('not recording', !isRecording);
  if (!isRecording) return;

  const eventRecord = {
    type: e.type,
    timestamp: Date.now(),
    selector: getUniqueSelector(e.target),
  };

  if (e.type === 'input') {
    eventRecord.value = e.target.value || null;
  }

  console.log('recordEvent', eventRecord);

  events.push(eventRecord);
}

let scrollTimeouts = new Map();

function recordScroll(e) {
  if (!isRecording) return;

  const target = e.target;
  if (!target) return;

  if (scrollTimeouts.has(target)) {
    clearTimeout(scrollTimeouts.get(target));
  }

  scrollTimeouts.set(
    target,
    setTimeout(() => {
      const scrollX = target.scrollLeft;
      const scrollY = target.scrollTop;

      console.log('recordScroll', scrollX, scrollY);

      events.push({
        type: 'scroll',
        timestamp: Date.now(),
        selector: getUniqueSelector(target),
        scrollX: scrollX,
        scrollY: scrollY
      });

      scrollTimeouts.delete(target);
    }, 100) 
  );
}

  
function getUniqueSelector(element) {
    return unique(element);
}

  
  

  function simulateEvents(eventList) {
    let index = 0;
  
    function next() {
        if (index >= eventList.length) {
            chrome.runtime.sendMessage({ action: 'replayFinished' });
            if (chrome.runtime.lastError) {
              // No receiver; handle if necessary
              console.warn('No receiver for replayFinished message:', chrome.runtime.lastError.message);
            }
            return;
          }
  
      const event = eventList[index];
      const delay =
        index === 0 ? 0 : event.timestamp - eventList[index - 1].timestamp;
  
      setTimeout(() => {
        simulateEvent(event);
        index++;
        next();
      }, delay);
    }
  
    next();
  }
  
  function simulateEvent(event) {
    if (event.type === 'scroll') {
        const element = document.querySelector(event.selector);
        if (element) {
          element.scrollTo({
            left: event.scrollX,
            top: event.scrollY,
            behavior: 'smooth'
          });
        }
      } else {
      const element = document.querySelector(event.selector);
      console.log('simulateEvent', event, element);
      if (element) {
        if (event.type === 'click') {
            console.log('click', event.selector);
          simulateClick(element);
        } else if (event.type === 'input' && event.value !== undefined) {
          element.focus();
          element.value = event.value;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  }
  
  function simulateClick(element) {
    ['mousedown', 'mouseup', 'click'].forEach((eventType) => {
      const event = new MouseEvent(eventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      });
      element.dispatchEvent(event);
    });
  }
  
