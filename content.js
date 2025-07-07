// Content script for Instagram DM automation
let isAutomationRunning = false;
let automationData = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'startAutomation') {
    startAutomation(request);
    sendResponse({status: 'started'});
  } else if (request.action === 'stopAutomation') {
    stopAutomation();
    sendResponse({status: 'stopped'});
  }
});

// Start automation process
async function startAutomation(data) {
  if (isAutomationRunning) return;
  
  isAutomationRunning = true;
  automationData = data;
  
  try {
    await processUsers(data.usernames, data.message, data.minDelay, data.maxDelay);
  } catch (error) {
    console.error('Automation error:', error);
    chrome.runtime.sendMessage({
      action: 'automationError',
      error: error.message
    });
  }
  
  isAutomationRunning = false;
}

// Stop automation
function stopAutomation() {
  isAutomationRunning = false;
  automationData = null;
}

// Process all users
async function processUsers(usernames, message, minDelay, maxDelay) {
  let successful = 0;
  let failed = 0;
  
  for (let i = 0; i < usernames.length && isAutomationRunning; i++) {
    const username = usernames[i];
    
    // Update progress
    chrome.runtime.sendMessage({
      action: 'updateProgress',
      current: i + 1,
      total: usernames.length,
      username: username
    });
    
    try {
      await sendMessageToUser(username, message);
      successful++;
    } catch (error) {
      console.error(`Failed to send message to ${username}:`, error);
      failed++;
    }
    
    // Random delay between messages (human-like behavior)
    if (i < usernames.length - 1 && isAutomationRunning) {
      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      await sleep(delay);
    }
  }
  
  if (isAutomationRunning) {
    chrome.runtime.sendMessage({
      action: 'automationComplete',
      successful: successful,
      total: usernames.length,
      failed: failed
    });
  }
}

// Send message to individual user
async function sendMessageToUser(username, message) {
  return new Promise(async (resolve, reject) => {
    try {
      // Navigate to user's profile
      const profileUrl = `https://www.instagram.com/${username}/`;
      
      // Check if we're already on the profile page
      if (window.location.href !== profileUrl) {
        window.location.href = profileUrl;
        
        // Wait for page to load
        await waitForPageLoad();
      }
      
      // Wait for profile to load
      await waitForElement('article, main');
      
      // Random delay to simulate human browsing
      await sleep(Math.floor(Math.random() * 2000) + 1000);
      
      // Find and click the Message button
      const messageButton = await findMessageButton();
      if (!messageButton) {
        throw new Error('Message button not found - user may be private or not exist');
      }
      
      // Click message button
      messageButton.click();
      
      // Wait for DM interface to load
      await waitForElement('textarea[placeholder*="message"], textarea[placeholder*="Message"]');
      
      // Random delay before typing
      await sleep(Math.floor(Math.random() * 1500) + 500);
      
      // Find message input and type message
      const messageInput = document.querySelector('textarea[placeholder*="message"], textarea[placeholder*="Message"]');
      if (!messageInput) {
        throw new Error('Message input not found');
      }
      
      // Type message with human-like delays
      await typeMessage(messageInput, message);
      
      // Random delay before sending
      await sleep(Math.floor(Math.random() * 1000) + 500);
      
      // Find and click send button
      const sendButton = document.querySelector('button[type="submit"], button:has(svg[aria-label*="Send"])');
      if (!sendButton) {
        throw new Error('Send button not found');
      }
      
      sendButton.click();
      
      // Wait for message to be sent
      await sleep(1000);
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Find the message button on profile page
async function findMessageButton() {
  const selectors = [
    'button:has(div:contains("Message"))',
    'button[type="button"]:contains("Message")',
    'a[href*="/direct/"]',
    'button[class*="message"]',
    'div[role="button"]:contains("Message")'
  ];
  
  for (let i = 0; i < 10; i++) {
    for (const selector of selectors) {
      try {
        const button = document.querySelector(selector);
        if (button && button.textContent.toLowerCase().includes('message')) {
          return button;
        }
      } catch (e) {
        // Continue searching
      }
    }
    
    // Also try to find by text content
    const buttons = document.querySelectorAll('button, a, div[role="button"]');
    for (const button of buttons) {
      if (button.textContent.toLowerCase().includes('message')) {
        return button;
      }
    }
    
    await sleep(500);
  }
  
  return null;
}

// Type message with human-like delays
async function typeMessage(input, message) {
  input.focus();
  input.value = '';
  
  for (let i = 0; i < message.length; i++) {
    input.value += message[i];
    
    // Trigger input event
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
    
    // Random delay between keystrokes (20-100ms)
    await sleep(Math.floor(Math.random() * 80) + 20);
  }
  
  // Trigger final events
  const changeEvent = new Event('change', { bubbles: true });
  input.dispatchEvent(changeEvent);
}

// Wait for element to appear
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkForElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        return;
      }
      
      setTimeout(checkForElement, 100);
    };
    
    checkForElement();
  });
}

// Wait for page to load
function waitForPageLoad() {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve);
    }
  });
}

// Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Add some utility functions for better Instagram interaction
function simulateHumanBehavior() {
  // Random small mouse movements
  const moveEvent = new MouseEvent('mousemove', {
    clientX: Math.floor(Math.random() * 100) + 100,
    clientY: Math.floor(Math.random() * 100) + 100
  });
  document.dispatchEvent(moveEvent);
}

// Periodically simulate human behavior
setInterval(() => {
  if (isAutomationRunning) {
    simulateHumanBehavior();
  }
}, Math.floor(Math.random() * 10000) + 5000);

console.log('Instagram DM Automator content script loaded');
