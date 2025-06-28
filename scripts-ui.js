// Scripts UI Management
function populateScriptsSection() {
  if (!window.UWScripts) {
    console.warn('Script library not loaded');
    return;
  }

  // Determine partner type based on customer count
  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
  const customerCount = metrics.customersSignedCount || 0;
  const partnerType = customerCount < 6 ? 'new' : 'experienced';

  // Show/hide sections based on partner type
  const newPartnerSections = document.querySelectorAll('.script-subcategory');
  newPartnerSections.forEach(subcategory => {
    const h4 = subcategory.querySelector('h4');
    if (h4 && h4.textContent.includes('New Partners')) {
      subcategory.style.display = partnerType === 'new' ? 'block' : 'none';
    } else if (h4 && h4.textContent.includes('Experienced Partners')) {
      subcategory.style.display = partnerType === 'experienced' ? 'block' : 'none';
    }
  });

  // Populate Invitation Scripts
  populateScriptCategory('newInviteScripts', UWScripts.invitations.new, 'Invitation Scripts');
  populateScriptCategory('experiencedInviteScripts', UWScripts.invitations.experienced, 'Invitation Scripts');

  // Populate Follow-up Scripts
  populateScriptCategory('newFollowUpScripts', UWScripts.followUp.new, 'Follow-up Scripts');
  populateScriptCategory('experiencedFollowUpScripts', UWScripts.followUp.experienced, 'Follow-up Scripts');

  // Populate Objection Scripts
  populateObjectionScripts();

  // Populate Urgency Scripts
  populateScriptCategory('newUrgencyScripts', UWScripts.urgency.new, 'Urgency Scripts');
  populateScriptCategory('experiencedUrgencyScripts', UWScripts.urgency.experienced, 'Urgency Scripts');

  // Populate Referral Scripts
  populateScriptCategory('newReferralScripts', UWScripts.referrals.new, 'Referral Scripts');
  populateScriptCategory('experiencedReferralScripts', UWScripts.referrals.experienced, 'Referral Scripts');
}

function populateScriptCategory(containerId, scripts, categoryTitle) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  // Add Generate Script button for this category
  addGenerateScriptButton(container, categoryTitle.toLowerCase().replace(/\s+/g, ''), '', '');

  // Handle different script structures
  if (Array.isArray(scripts)) {
    scripts.forEach((script, index) => {
      addScriptItem(container, script, `Script ${index + 1}`);
    });
  } else if (typeof scripts === 'object') {
    Object.entries(scripts).forEach(([context, scriptArray]) => {
      if (Array.isArray(scriptArray)) {
        // Add context header
        const contextHeader = document.createElement('h5');
        contextHeader.textContent = context.charAt(0).toUpperCase() + context.slice(1);
        contextHeader.style.cssText = `
          margin: 1.5em 0 0.5em 0;
          color: #4B0082;
          font-size: 1rem;
          font-weight: 600;
          border-bottom: 1px solid #e3d6ef;
          padding-bottom: 0.3em;
        `;
        container.appendChild(contextHeader);
        
        // Add Generate Script button for each context
        const contextLabel = context.charAt(0).toUpperCase() + context.slice(1);
        addGenerateScriptButton(container, categoryTitle.toLowerCase().replace(/\s+/g, ''), contextLabel, '');
        
        scriptArray.forEach((script, index) => {
          addScriptItem(container, script, `${contextLabel} - Script ${index + 1}`);
        });
      }
    });
  }
}

function populateObjectionScripts() {
  const container = document.getElementById('objectionScripts');
  if (!container) return;

  container.innerHTML = '';

  // Add Generate Script button for objections
  addGenerateScriptButton(container, 'objections', '', '');

  Object.entries(UWScripts.objections).forEach(([objection, responses]) => {
    // Add objection header
    const objectionHeader = document.createElement('h5');
    objectionHeader.textContent = `"${objection}"`;
    objectionHeader.style.cssText = `
      margin: 1.5em 0 0.5em 0;
      color: #4B0082;
      font-size: 1rem;
      font-weight: 600;
      border-bottom: 1px solid #e3d6ef;
      padding-bottom: 0.3em;
    `;
    container.appendChild(objectionHeader);
    
    responses.forEach((response, index) => {
      addScriptItem(container, response, `Response ${index + 1}`);
    });
  });
}

function addScriptItem(container, scriptText, metaText) {
  const scriptItem = document.createElement('div');
  scriptItem.className = 'script-item';
  scriptItem.innerHTML = `
    <div class="script-text">${scriptText}</div>
    <div class="script-meta">${metaText}</div>
    <div class="copy-indicator">Copied!</div>
  `;

  scriptItem.addEventListener('click', () => {
    copyScriptToClipboard(scriptText, scriptItem);
  });

  container.appendChild(scriptItem);
}

function copyScriptToClipboard(text, element) {
  navigator.clipboard.writeText(text).then(() => {
    // Show copy indicator
    element.classList.add('copied');
    
    // Remove the copied class after 2 seconds
    setTimeout(() => {
      element.classList.remove('copied');
    }, 2000);

    // Show toast notification
    showToast('Script copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy script:', err);
    showToast('Failed to copy script. Please try again.');
  });
}

function showToast(message) {
  // Create toast notification
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = '#4CAF50';
  toast.style.color = 'white';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '6px';
  toast.style.zIndex = '10000';
  toast.style.animation = 'slideIn 0.3s ease-out';

  document.body.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

function addGenerateScriptButton(container, category, subcategory, contextLabel) {
  const button = document.createElement('button');
  button.className = 'generate-script-btn';
  button.textContent = '✨ Generate Script';
  const output = document.createElement('div');
  output.className = 'generated-script-output';
  button.onclick = async () => {
    output.innerHTML = '<em>Generating script...</em>';
    // Map category/subcategory to AI parameters
    let activity = category;
    let partnerLevel = subcategory;
    let notes = contextLabel || '';
    try {
      const res = await fetch('/.netlify/functions/suggestMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity, partnerLevel, notes })
      });
      const data = await res.json();
      if (data.message) {
        output.innerHTML = `
          <div class="generated-script-text">${data.message}</div>
          <button class="copy-generated-script-btn">Copy</button>
        `;
        output.querySelector('.copy-generated-script-btn').onclick = () => {
          navigator.clipboard.writeText(data.message);
          showToast('Script copied to clipboard!');
        };
      } else {
        output.innerHTML = `<span style='color:red;'>Error: ${data.error || 'No script returned.'}</span>`;
      }
    } catch (err) {
      output.innerHTML = `<span style='color:red;'>Error: ${err.message}</span>`;
    }
  };
  container.appendChild(button);
  container.appendChild(output);
}

// Initialize scripts section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Populate scripts when the scripts tab is shown
  const scriptsTab = document.querySelector('button[onclick="switchTab(\'scripts\')"]');
  if (scriptsTab) {
    scriptsTab.addEventListener('click', () => {
      // Small delay to ensure the tab is visible
      setTimeout(populateScriptsSection, 100);
    });
  }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { populateScriptsSection, copyScriptToClipboard };
}