let isRecording = false;
let events = [];

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'startRecording') {
    startRecording();
  } else if (request.action === 'stopRecording') {
    stopRecording();
  } else if (request.action === 'replaySession') {
    replaySession();
  }
});

function startRecording() {
  isRecording = true;
  events = [];
  attachEventListeners();
  alert('Recording started.');
}

function stopRecording() {
  isRecording = false;
  detachEventListeners();
  chrome.storage.local.set({ recordedEvents: events }, () => {
    alert('Recording stopped.');
  });
}

function replaySession() {
  chrome.storage.local.get('recordedEvents', (data) => {
    if (data.recordedEvents && data.recordedEvents.length > 0) {
      simulateEvents(data.recordedEvents);
    } else {
      alert('No recorded session found.');
    }
  });
}

function attachEventListeners() {
  document.addEventListener('click', recordEvent, true);
  document.addEventListener('input', recordEvent, true);
  window.addEventListener('scroll', recordScroll, true);
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

let scrollTimeout;
function recordScroll() {
  if (!isRecording) return;

  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    events.push({
      type: 'scroll',
      timestamp: Date.now(),
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    });
  }, 100);
}

function getUniqueSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  } else {
    const path = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.className) {
        selector += '.' + element.className.trim().replace(/\s+/g, '.');
      }
      path.unshift(selector);
      element = element.parentNode;
    }
    return path.join(' > ');
  }
}

function simulateEvents(eventList) {
  let index = 0;

  function next() {
    if (index >= eventList.length) return;

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
    window.scrollTo({
      top: event.scrollY,
      left: event.scrollX,
      behavior: 'smooth',
    });
  } else {
    const element = document.querySelector(event.selector);
    if (element) {
      if (event.type === 'click') {
        simulateClick(element);
      } else if (event.type === 'input' && event.value !== undefined) {
        element.value = event.value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }
}

function simulateClick(element) {
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  ['mousedown', 'mouseup', 'click'].forEach((eventType) => {
    const event = new MouseEvent(eventType, {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
    });
    element.dispatchEvent(event);
  });
}
