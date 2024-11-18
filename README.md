# Session-record-and-replay

# Setup Instructions

## Prerequisites
- Node.js and npm

## Installation

### Clone the Repository
```bash
git clone https://github.com/tejasshetty1710/Session-record-and-replay.git
cd Session-record-and-replay
```

### Install Dependencies
Navigate to the project directory and install the required dependencies:
```bash
npm install
```

### Build the Extension
Build the extension using Webpack:
```bash
npm run build
```
This will generate the bundled scripts and assets in the `dist/` directory.

### Load the Extension into Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable Developer Mode (toggle switch in the top right corner)
3. Click on "Load unpacked" and select the `dist/` directory inside your project folder

### Test the Extension
1. Navigate to any web page (e.g., https://www.example.com)
2. Click on the extension icon to open the popup
3. Use the Start Recording, Stop Recording, and Replay Session features
4. View and manage saved sessions from the popup

## Key Design Decisions

### 1. Event Recording and Replay
- Event Types: The extension records user interactions such as clicks, inputs, and scrolls
- Event Storage: Recorded events are stored in chrome.storage.local with a unique session ID and name
- Event Simulation: During replay, the extension simulates the recorded events by dispatching synthetic events on target elements

### 2. Element Identification
- Unique Selectors: Uses the unique-selector library to generate robust CSS selectors
- Bundling External Libraries: Webpack bundles the unique-selector library into the content script

### 3. User Interface
- Popup UI: Controls for starting/stopping recordings and displaying saved sessions
- Session Management: Users can replay them, or delete them

### 4. Communication Between Scripts
- Content and Popup Scripts: Messages pass between scripts via the background script
- Background Script: Service worker facilitates communication when popup is closed

### 5. Persistent Data Storage
- chrome.storage.local: Stores sessions and recording status

### 6. Extension Architecture
- Webpack Bundling: Enables modern JavaScript features and module imports
- Manifest Version 3: Affects background script (service worker) handling

## Known Limitations
- Dynamic Web Pages: Replay may fail if page content changes significantly
- Popup Lifecycle: Updates may not be visible if popup is closed during replay
- Scroll Events: May not handle all complex scrolling scenarios
- Event Throttling: Scroll events are throttled for performance
- No Cross-Domain Support: Cannot record actions across different domains

## Future Improvement Suggestions

### Enhance Element Identification
- Implement robust element fingerprinting
- Explore XPath alternatives

### Improve User Interface
- Add session categorization/search
- Allow post-recording session name editing
- Filter out sessions based on the current tab URL
- Display mouse trail, to make it more realistic

### Handle Complex Events
- Support more event types
- Improve async action handling

### Add authentication
- Add a login page, so that users can login using their google account, and their sessions are saved in the cloud

### Session Export/Import
- Enable file export/import
- Implement data compression

### Cross-Domain Recording
- Investigate cross-domain solutions

### Background Script Enhancements
- Manage notifications/alerts
- Implement long-lived connections

### Error Handling and Reporting
- Provide detailed error messages
- Enable user issue reporting

### Performance Optimization
- Optimize event mechanisms
- Implement event batching

### Extension Settings
- Add configuration page
- Enable event type toggles

### Testing and Compatibility
- Test across various websites
- Ensure browser compatibility

## Contributing
Contributions are welcome! Please submit issues, feature requests, or pull requests.