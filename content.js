function analyzeDiff(diffText) {
  const analysis = {
    riskLevel: 'Low',
    summary: [],
    flags: [],
    fileTypes: []
  };

  const fileTypesSet = new Set();
  const filePattern = /diff --git a\/([^\s]+)/g;
  let match;
  
  while ((match = filePattern.exec(diffText)) !== null) {
    const filepath = match[1];
    if (filepath.endsWith('.jsx') || filepath.endsWith('.tsx')) {
      fileTypesSet.add('React Component');
    } else if (filepath.endsWith('.hh') || filepath.endsWith('.php')) {
      fileTypesSet.add('Hack/PHP Backend');
    } else if (filepath.endsWith('.py')) {
      fileTypesSet.add('Python');
    } else if (filepath.endsWith('.sql')) {
      fileTypesSet.add('SQL Migration');
    } else if (filepath.endsWith('.css') || filepath.endsWith('.scss')) {
      fileTypesSet.add('Styling');
    }
  }
  
  analysis.fileTypes = Array.from(fileTypesSet);
  let riskScore = 0;
  
  if (/DROP\s+TABLE|ALTER\s+TABLE|DELETE\s+FROM|TRUNCATE/i.test(diffText)) {
    analysis.flags.push({ type: 'danger', msg: 'Destructive database operation detected.' });
    riskScore += 5;
  }
  
  if (/Auth::|PrivacyCheck|ViewerContext|\.env|config\.|secrets/i.test(diffText)) {
    analysis.flags.push({ type: 'warning', msg: 'Authentication, privacy, or config change.' });
    riskScore += 2;
  }
  
  if (/torch\.(nn\.|optim|load|save)/i.test(diffText)) {
    analysis.flags.push({ type: 'warning', msg: 'PyTorch model logic modified (FAIR team relevance).' });
    riskScore += 2;
  }
  
  if (/console\.log|var_dump|print_r|pdb\.set_trace/i.test(diffText)) {
    analysis.flags.push({ type: 'info', msg: 'Debug artifact (console.log, var_dump, etc.) left in code.' });
  }
  
  if (fileTypesSet.has('React Component') && /useEffect|useState|useContext/.test(diffText)) {
    analysis.summary.push('Modifies React component logic or hooks.');
  }
  
  if (fileTypesSet.has('Styling') && riskScore === 0) {
    analysis.summary.push('Primarily a CSS/styling update.');
  }
  
  if (fileTypesSet.has('Python') && /class.*\(nn\.Module\)/.test(diffText)) {
    analysis.summary.push('Defines or modifies a PyTorch neural network module.');
  }
  
  if (/^\+\s*\/\/\s*TODO:|^#\s*TODO:/m.test(diffText)) {
    analysis.summary.push('Contains TODO comments – may indicate incomplete work.');
  }
  
  if (analysis.summary.length === 0) {
    analysis.summary.push('General code update with no clear pattern.');
  }
  
  if (riskScore >= 5) {
    analysis.riskLevel = 'High';
  } else if (riskScore >= 2) {
    analysis.riskLevel = 'Medium';
  } else {
    analysis.riskLevel = 'Low';
  }
  
  return analysis;
}

function extractDiffFromPage() {
  const diffElements = document.querySelectorAll('.file-header, .blob-code-inner');
  let diffText = '';
  
  document.querySelectorAll('.file-header').forEach(header => {
    const filePath = header.getAttribute('data-path');
    if (filePath) {
      diffText += `diff --git a/${filePath} b/${filePath}\n`;
    }
  });
  
  document.querySelectorAll('.blob-code-inner').forEach(code => {
    const line = code.textContent;
    if (code.closest('.blob-code-addition')) {
      diffText += `+${line}\n`;
    } else if (code.closest('.blob-code-deletion')) {
      diffText += `-${line}\n`;
    } else {
      diffText += ` ${line}\n`;
    }
  });
  
  return diffText;
}

function createAnalysisCard(analysis) {
  const card = document.createElement('div');
  card.className = 'diff-focus-card';
  card.innerHTML = `
    <div class="diff-focus-header">
      <h3>🔍 Diff-Focus Analysis</h3>
      <button class="diff-focus-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
    <div class="diff-focus-body">
      <div class="risk-badge risk-${analysis.riskLevel.toLowerCase()}">
        Risk Level: ${analysis.riskLevel}
      </div>
      ${analysis.fileTypes.length > 0 ? `
        <div class="diff-focus-section">
          <strong>File Types:</strong>
          <div class="file-types">
            ${analysis.fileTypes.map(t => `<span class="file-type">${t}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      ${analysis.summary.length > 0 ? `
        <div class="diff-focus-section">
          <strong>Summary:</strong>
          <ul>
            ${analysis.summary.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      ${analysis.flags.length > 0 ? `
        <div class="diff-focus-section">
          <strong>Flags:</strong>
          ${analysis.flags.map(f => `
            <div class="flag flag-${f.type}">
              <strong>${f.type.toUpperCase()}:</strong> ${f.msg}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
  return card;
}

function insertAnalysisCard(analysis) {
  const existingCard = document.querySelector('.diff-focus-card');
  if (existingCard) {
    existingCard.remove();
  }
  
  const card = createAnalysisCard(analysis);
  const prHeader = document.querySelector('.gh-header-actions') || 
                   document.querySelector('.gh-header-meta') ||
                   document.querySelector('.gh-header');
  
  if (prHeader) {
    prHeader.parentElement.insertBefore(card, prHeader);
  } else {
    document.body.insertBefore(card, document.body.firstChild);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeDiff') {
    const diffText = extractDiffFromPage();
    if (diffText.trim()) {
      const analysis = analyzeDiff(diffText);
      insertAnalysisCard(analysis);
      sendResponse({ success: true });
    } else {
      alert('No diff content found on this page.');
      sendResponse({ success: false, error: 'No diff content' });
    }
  }
  return true;
});

