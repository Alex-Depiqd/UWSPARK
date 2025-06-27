// Scripts UI Management
function populateScriptsSection() {
  if (!window.UWScripts) {
    console.warn('Script library not loaded');
    return;
  }

  // Populate Invitation Scripts
  populateScriptCategory('newInviteScripts', UWScripts.invitations.new);
  populateScriptCategory('experiencedInviteScripts', UWScripts.invitations.experienced);

  // Populate Follow-up Scripts
  populateScriptCategory('newFollowUpScripts', UWScripts.followUp.new);
  populateScriptCategory('experiencedFollowUpScripts', UWScripts.followUp.experienced);

  // Populate Objection Scripts
  populateObjectionScripts();

  // Populate Urgency Scripts
  populateScriptCategory('newUrgencyScripts', UWScripts.urgency.new);
  populateScriptCategory('experiencedUrgencyScripts', UWScripts.urgency.experienced);

  // Populate Referral Scripts
  populateScriptCategory('newReferralScripts', UWScripts.referrals.new);
  populateScriptCategory('experiencedReferralScripts', UWScripts.referrals.experienced);
}

function populateScriptCategory(containerId, scripts) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  // Handle different script structures
  if (Array.isArray(scripts)) {
    // Direct array of scripts
    scripts.forEach((script, index) => {
      addScriptItem(container, script, `Script ${index + 1}`);
    });
  } else if (typeof scripts === 'object') {
    // Object with subcategories (like friends, family, work)
    Object.entries(scripts).forEach(([context, scriptArray]) => {
      if (Array.isArray(scriptArray)) {
        scriptArray.forEach((script, index) => {
          addScriptItem(container, script, `${context.charAt(0).toUpperCase() + context.slice(1)} - Script ${index + 1}`);
        });
      }
    });
  }
}

function populateObjectionScripts() {
  const container = document.getElementById('objectionScripts');
  if (!container) return;

  container.innerHTML = '';

  Object.entries(UWScripts.objections).forEach(([objection, responses]) => {
    responses.forEach((response, index) => {
      addScriptItem(container, response, `Response to "${objection}" - ${index + 1}`);
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