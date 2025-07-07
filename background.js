// Background script for Instagram DM Automator
chrome.runtime.onInstalled.addListener(function() {
  console.log('Instagram DM Automator installed');
});

// Handle messages between popup and content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Forward messages if needed
  if (request.action === 'updateProgress' || 
      request.action === 'automationComplete' || 
      request.action === 'automationError') {
    // These messages are handled by popup.js
    return;
  }
});

// Optional: Add context menu for quick access
chrome.contextMenus.create({
  id: "instagram-dm-automator",
  title: "Open Instagram DM Automator",
  contexts: ["page"],
  documentUrlPatterns: ["https://www.instagram.com/*", "https://instagram.com/*"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "instagram-dm-automator") {
    chrome.action.openPopup();
  }
});
