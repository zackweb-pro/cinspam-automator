document.addEventListener('DOMContentLoaded', function() {
  const usernamesInput = document.getElementById('usernames');
  const messageInput = document.getElementById('message');
  const minDelayInput = document.getElementById('minDelay');
  const maxDelayInput = document.getElementById('maxDelay');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const statusDiv = document.getElementById('status');
  const progressDiv = document.getElementById('progress');
  const progressBar = document.getElementById('progressBar');

  let isRunning = false;
  let currentProcess = null;

  // Load saved data
  chrome.storage.local.get(['usernames', 'message', 'minDelay', 'maxDelay'], function(data) {
    if (data.usernames) usernamesInput.value = data.usernames;
    if (data.message) messageInput.value = data.message;
    if (data.minDelay) minDelayInput.value = data.minDelay;
    if (data.maxDelay) maxDelayInput.value = data.maxDelay;
  });

  // Save data on input
  function saveData() {
    chrome.storage.local.set({
      usernames: usernamesInput.value,
      message: messageInput.value,
      minDelay: minDelayInput.value,
      maxDelay: maxDelayInput.value
    });
  }

  usernamesInput.addEventListener('input', saveData);
  messageInput.addEventListener('input', saveData);
  minDelayInput.addEventListener('input', saveData);
  maxDelayInput.addEventListener('input', saveData);

  // Validate inputs
  function validateInputs() {
    const usernames = usernamesInput.value.trim();
    const message = messageInput.value.trim();
    const minDelay = parseInt(minDelayInput.value);
    const maxDelay = parseInt(maxDelayInput.value);

    if (!usernames) {
      showStatus('Please enter at least one username', 'error');
      return false;
    }

    if (!message) {
      showStatus('Please enter a message', 'error');
      return false;
    }

    const usernameList = usernames.split(',').map(u => u.trim()).filter(u => u);
    if (usernameList.length > 100) {
      showStatus('Maximum 100 usernames allowed per session', 'error');
      return false;
    }

    if (minDelay >= maxDelay) {
      showStatus('Min delay must be less than max delay', 'error');
      return false;
    }

    return true;
  }

  // Show status message
  function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
  }

  // Update progress
  function updateProgress(current, total) {
    const percentage = (current / total) * 100;
    progressBar.style.width = percentage + '%';
    progressDiv.style.display = 'block';
  }

  // Start automation
  startBtn.addEventListener('click', async function() {
    if (!validateInputs()) return;

    // Check if we're on Instagram
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab.url.includes('instagram.com')) {
      showStatus('Please open Instagram in the current tab', 'error');
      return;
    }

    const usernames = usernamesInput.value.trim().split(',').map(u => u.trim()).filter(u => u);
    const message = messageInput.value.trim();
    const minDelay = parseInt(minDelayInput.value) * 1000;
    const maxDelay = parseInt(maxDelayInput.value) * 1000;

    isRunning = true;
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    
    showStatus(`Starting automation for ${usernames.length} users...`, 'info');
    updateProgress(0, usernames.length);

    // Send message to content script
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'startAutomation',
        usernames: usernames,
        message: message,
        minDelay: minDelay,
        maxDelay: maxDelay
      });
    } catch (error) {
      showStatus('Error: Please refresh the Instagram page and try again', 'error');
      resetUI();
    }
  });

  // Stop automation
  stopBtn.addEventListener('click', async function() {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    try {
      await chrome.tabs.sendMessage(tab.id, {action: 'stopAutomation'});
    } catch (error) {
      console.log('Error stopping automation:', error);
    }
    resetUI();
    showStatus('Automation stopped', 'info');
  });

  // Reset UI
  function resetUI() {
    isRunning = false;
    startBtn.style.display = 'block';
    stopBtn.style.display = 'none';
    progressDiv.style.display = 'none';
  }

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateProgress') {
      updateProgress(request.current, request.total);
      showStatus(`Processing ${request.current}/${request.total}: ${request.username}`, 'info');
    } else if (request.action === 'automationComplete') {
      resetUI();
      showStatus(`Automation complete! Sent to ${request.successful}/${request.total} users`, 'success');
    } else if (request.action === 'automationError') {
      resetUI();
      showStatus(`Error: ${request.error}`, 'error');
    }
  });

  // Real-time username counter
  usernamesInput.addEventListener('input', function() {
    const usernames = this.value.trim().split(',').map(u => u.trim()).filter(u => u);
    const count = usernames.length;
    
    if (count > 100) {
      this.style.borderColor = '#e74c3c';
      showStatus(`${count} usernames - Maximum 100 allowed`, 'error');
    } else {
      this.style.borderColor = '';
      if (count > 0) {
        showStatus(`${count} username${count > 1 ? 's' : ''} ready`, 'success');
      }
    }
  });
});
