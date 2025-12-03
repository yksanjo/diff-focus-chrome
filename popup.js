document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab.url && tab.url.includes('github.com') && tab.url.includes('/pull/')) {
    chrome.tabs.sendMessage(tab.id, { action: 'analyzeDiff' });
    window.close();
  } else {
    alert('Please navigate to a GitHub Pull Request page first.');
  }
});

