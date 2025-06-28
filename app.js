// Global variables
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
let activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];

// Define trackActivityForContact at the top level
function trackActivityForContact(name) {
  console.log('Track Activity clicked for:', name);
  // Store the contact name in localStorage for pre-filling
  localStorage.setItem('activityContact', name);
  // Switch to Tracker tab
  switchTab('log');
  
  // Pre-fill only the activity type
  const activityType = document.getElementById('activityType');
  if (activityType) {
    activityType.value = 'Invite'; // Default to Invite
  }
}

// Expose function to window object
window.trackActivityForContact = trackActivityForContact;

function saveContacts() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

function saveActivityLog() {
  localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

function updateTotalContactsCount() {
  const totalContactsElement = document.getElementById('totalContacts');
  if (totalContactsElement) {
    totalContactsElement.innerText = contacts.length;
  }
}

function renderContacts() {
  const contactList = document.getElementById('contact-list');
  if (!contactList) return;

  const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
  contactList.innerHTML = contacts.map(contact => `
    <li>
      <div class="contact-info">
        <strong>${contact.name}</strong>
        ${contact.email ? `<br>📧 ${contact.email}` : ''}
        ${contact.telephone ? `<br>📞 ${contact.telephone}` : ''}
        <br><span class="category">${contact.category}</span>
      </div>
      <div class="contact-actions">
        <button onclick="(function() { trackActivityForContact('${contact.name}'); })()">Track Activity</button>
        <button onclick="editContact('${contact.name}')">Edit</button>
        <button onclick="deleteContact('${contact.name}')">Delete</button>
      </div>
    </li>
  `).join('');
}

// Set up event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const contactList = document.getElementById('contact-list');
  if (contactList) {
    contactList.addEventListener('click', function(e) {
      if (e.target.classList.contains('track-activity-btn')) {
        const name = e.target.getAttribute('data-contact');
        trackActivityForContact(name);
      }
    });
  }
});

function logActivityFromContact(name) {
  const now = new Date().toISOString();
  document.getElementById('outreachNote').value = `Message sent to ${name}`;
  document.getElementById('outreachType').value = 'Invite';
  switchTab('log');
  
  activityLog.push({ date: now, type: 'Invite', note: `Sent to ${name}` });
  saveActivityLog();
  renderActivityLog();
}

function deleteContact(name) {
  if (confirm(`Delete ${name}?`)) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const updatedContacts = contacts.filter(c => c.name !== name);
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    renderContacts();
  }
}

function editContact(name) {
  const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
  const contact = contacts.find(c => c.name === name);
  if (!contact) return;

  // Populate the edit form
  document.getElementById('editName').value = contact.name;
  document.getElementById('editEmail').value = contact.email || '';
  document.getElementById('editTelephone').value = contact.telephone || '';
  document.getElementById('editCategory').value = contact.category;
  document.getElementById('editNotes').value = contact.notes || '';

  // Show the modal
  const modal = document.getElementById('editContactModal');
  modal.style.display = 'block';

  // Store the original name for updating
  modal.dataset.originalName = name;
}

// Add event listener for edit form submission
document.getElementById('editContactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const modal = document.getElementById('editContactModal');
  const originalName = modal.dataset.originalName;
  const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
  
  const contactIndex = contacts.findIndex(c => c.name === originalName);
  if (contactIndex === -1) return;

  // Update contact
  contacts[contactIndex] = {
    name: document.getElementById('editName').value,
    email: document.getElementById('editEmail').value,
    telephone: document.getElementById('editTelephone').value,
    category: document.getElementById('editCategory').value,
    notes: document.getElementById('editNotes').value
  };

  // Save and update display
  localStorage.setItem('contacts', JSON.stringify(contacts));
  modal.style.display = 'none';
  renderContacts();
  updateTotalContactsCount();
});

// Close modal when clicking the X
document.querySelector('.close').addEventListener('click', function() {
  document.getElementById('editContactModal').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('editContactModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const form = this;  // Store reference to the form
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const telephone = document.getElementById('telephone').value;
  const category = document.getElementById('category').value;
  const notes = document.getElementById('notes').value;

  const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
  contacts.push({ name, email, telephone, category, notes });
  localStorage.setItem('contacts', JSON.stringify(contacts));

  // Show confirmation message
  const confirmation = document.createElement('div');
  confirmation.className = 'confirmation-message';
  confirmation.textContent = `Contact "${name}" added successfully!`;
  form.appendChild(confirmation);

  // Remove confirmation after 3 seconds
  setTimeout(() => {
    confirmation.remove();
  }, 3000);

  // Clear form
  form.reset();
  updateTotalContactsCount();
});

function renderActivityLog() {
  const logContainer = document.getElementById('activityLog');
  if (!logContainer) return;

  logContainer.innerHTML = activityLog.map(entry => `
    <div class="log-entry">
      <strong>${new Date(entry.date).toLocaleString()}</strong>
      <br />
      ${entry.type}: ${entry.note}
      ${entry.contact ? `<br /><em>Contact: ${entry.contact}</em>` : ''}
    </div>
  `).join('');
}

// Remove the old outreachForm handler and keep only the activityForm handler
document.getElementById('activityForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = this;  // Store reference to the form
  const date = new Date().toISOString();
  const type = document.getElementById('activityType').value;
  const note = document.getElementById('activityNote').value.trim();
  const contactName = localStorage.getItem('activityContact') || '';

  // Add to activity log
  activityLog.push({ 
    date, 
    type, 
    note,
    contact: contactName 
  });
  saveActivityLog();
  
  // Update metrics
  if (typeof updateMetrics === 'function') {
    updateMetrics(type);
  }
  
  // If dashboard is visible, refresh AI Coach advice
  const dashboardTab = document.getElementById('dashboard');
  if (dashboardTab && dashboardTab.style.display !== 'none') {
    if (typeof updateDashboard === 'function') updateDashboard();
  }
  
  // Show confirmation message
  const confirmation = document.createElement('div');
  confirmation.className = 'confirmation-message';
  confirmation.textContent = `Activity logged successfully!`;
  form.appendChild(confirmation);

  // Remove confirmation after 3 seconds
  setTimeout(() => {
    confirmation.remove();
  }, 3000);
  
  // Clear form and stored contact
  form.reset();
  localStorage.removeItem('activityContact');
  
  // Update displays
  renderActivityLog();
  if (typeof updateDashboard === 'function') {
    updateDashboard();
  }
});

function renderFastStartWidget() {
  const card = document.querySelector('.metric-card');
  const cardTitle = card ? card.querySelector('h3') : null;
  const customerProgressEl = document.getElementById('customerProgress');
  const partnerProgressEl = document.getElementById('partnerProgress');
  const customerProgressBar = document.getElementById('customerProgressBar');
  const partnerProgressBar = document.getElementById('partnerProgressBar');
  const dayCountEl = document.getElementById('dayCount');
  if (!card || !cardTitle || !customerProgressEl || !partnerProgressEl || !customerProgressBar || !partnerProgressBar || !dayCountEl) return;

  const partnerType = localStorage.getItem('partnerType');
  const joinDate = localStorage.getItem('joinDate');
  let daysInBusiness = 0;
  if (joinDate) {
    const startDate = new Date(joinDate);
    const today = new Date();
    daysInBusiness = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));
    dayCountEl.textContent = daysInBusiness;
  } else {
    dayCountEl.textContent = 0;
  }

  if (partnerType === 'established') {
    // Show Next Promotion for experienced partners
    const currentLevel = localStorage.getItem('currentLevel');
    const targetLevel = localStorage.getItem('targetLevel');
    const targetDate = new Date(localStorage.getItem('targetDate'));
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24)));
    const customerCount = parseInt(localStorage.getItem('customerCount')) || 0;
    const partnerCount = parseInt(localStorage.getItem('partnerCount')) || 0;

    // Define level requirements
    const levelRequirements = {
      'QDStar': { customers: 6, partners: 1 },
      'SQD': { customers: 12, partners: 2 },
      'FTL': { customers: 18, partners: 3 },
      'TL': { customers: 24, partners: 4 },
      'STL': { customers: 30, partners: 5 },
      'GL': { customers: 36, partners: 6 },
      'SGL': { customers: 42, partners: 7 },
      'NGL': { customers: 48, partners: 8 },
      'NNL': { customers: 54, partners: 9 }
    };
    const requirements = levelRequirements[targetLevel] || { customers: 0, partners: 0 };
    const customerProgress = Math.min(100, (customerCount / requirements.customers) * 100);
    const partnerProgress = Math.min(100, (partnerCount / requirements.partners) * 100);

    cardTitle.textContent = `Next Promotion: ${currentLevel} → ${targetLevel}`;
    customerProgressEl.textContent = `${customerCount}/${requirements.customers}`;
    partnerProgressEl.textContent = `${partnerCount}/${requirements.partners}`;
    customerProgressBar.style.width = `${customerProgress}%`;
    partnerProgressBar.style.width = `${partnerProgress}%`;

    // Optionally, show days left and requirements in the card (add to the DOM if needed)
    let extra = card.querySelector('.next-promotion-extra');
    if (!extra) {
      extra = document.createElement('div');
      extra.className = 'next-promotion-extra';
      card.appendChild(extra);
    }
    extra.innerHTML = `<p>⏳ Days Remaining: ${daysLeft}</p>`;
  } else {
    // Show Fast Start Progress for new partners
    const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
    const customers = metrics.customersSignedCount || 0;
    const partners = metrics.partnersSignedCount || 0;
    const customerTarget = 6;
    const partnerTarget = 1;
    const customerProgress = Math.min(100, (customers / customerTarget) * 100);
    const partnerProgress = Math.min(100, (partners / partnerTarget) * 100);

    cardTitle.textContent = 'Fast Start Progress';
    customerProgressEl.textContent = `${customers}/${customerTarget}`;
    partnerProgressEl.textContent = `${partners}/${partnerTarget}`;
    customerProgressBar.style.width = `${customerProgress}%`;
    partnerProgressBar.style.width = `${partnerProgress}%`;

    // Remove extra info if present
    const extra = card.querySelector('.next-promotion-extra');
    if (extra) extra.remove();
  }
}

function resetApp() {
  if (confirm('Are you sure you want to reset the app? This will clear all your data.')) {
    // Clear all localStorage items
    localStorage.clear();
    
    // Reload the page to show onboarding modal
    window.location.reload();
  }
}

function switchTab(tabId) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';

  if (tabId === 'view' && window.renderContacts) {
    window.renderContacts();
  }

  if (tabId === 'dashboard') {
    if (window.updateTotalContactsCount) window.updateTotalContactsCount();
    if (window.renderFastStartWidget) window.renderFastStartWidget();
    setTimeout(loadQuoteOfTheDay, 100);
  }

  if (tabId === 'log') {
    if (window.renderActivityLog) window.renderActivityLog();
  }
}

window.updateTotalContactsCount = updateTotalContactsCount;
window.renderContacts = renderContacts;
window.renderFastStartWidget = renderFastStartWidget;
window.renderActivityLog = renderActivityLog;
window.deleteContact = deleteContact;
window.logActivityFromContact = logActivityFromContact;
window.resetApp = resetApp;
window.editContact = editContact;
window.switchTab = switchTab;

// Generate daily tasks and suggestions
function generateDailyTasks() {
  const partnerType = localStorage.getItem('partnerType') || 'new';
  const currentLevel = localStorage.getItem('currentLevel') || 'QD';
  const metrics = getMetrics();
  const daysInBusiness = calculateDaysInBusiness();
  
  let tasks = [];
  let suggestions = [];

  if (partnerType === 'new') {
    // Fast Start tasks
    if (daysInBusiness <= 60) {
      tasks.push("Complete 3 conversations today");
      tasks.push("Book at least 1 supported appointment");
      tasks.push("Update your contact list with 5 new names");
      
      if (metrics.appointmentsSetCount < 10) {
        suggestions.push("Focus on booking supported appointments - aim for 10 in your first 2 weeks");
      }
      if (metrics.customersSignedCount < 3) {
        suggestions.push("Practice your customer presentation with your mentor");
      }
    }
  } else {
    // Experienced partner tasks
    const nextLevel = getNextLevel(currentLevel);
    if (nextLevel) {
      const levelData = levels[nextLevel];
      
      // Add tasks based on requirements
      if (levelData.requirements.personal_customers > metrics.customersSignedCount) {
        tasks.push(`Find ${levelData.requirements.personal_customers - metrics.customersSignedCount} more customers`);
      }
      if (levelData.requirements.group_customers > metrics.groupCustomersCount) {
        tasks.push(`Support your team to reach ${levelData.requirements.group_customers} group customers`);
      }
      
      // Add suggestions based on progress
      if (metrics.partnersSignedCount < 1) {
        suggestions.push("Look for potential partners among your customers");
      }
      if (metrics.appointmentsSetCount < 3) {
        suggestions.push("Focus on setting appointments with your warm contacts");
      }
    }
  }

  // Add general tasks
  tasks.push("Check in with your team members");
  tasks.push("Review your activity log from yesterday");
  
  // Add general suggestions
  suggestions.push("Use the FROGS method to identify new contacts");
  suggestions.push("Practice your micro-pitch with 3 people today");

  return { tasks, suggestions };
}

// Update the dashboard to include AI Coach section
function updateDashboard() {
  // ... existing dashboard update code ...

  // Add AI Coach section
  const aiCoachSection = document.createElement('div');
  aiCoachSection.className = 'card';
  aiCoachSection.innerHTML = `
    <h3>UW AI Coach</h3>
    <div class="ai-coach-content">
      <div class="daily-tasks">
        <h4>Today's Tasks</h4>
        <ul id="dailyTasks"></ul>
      </div>
      <div class="coach-suggestions">
        <h4>Coach Suggestions</h4>
        <ul id="coachSuggestions"></ul>
      </div>
    </div>
  `;
  
  // Insert AI Coach section after the progress card
  const progressCard = document.querySelector('.card');
  progressCard.parentNode.insertBefore(aiCoachSection, progressCard.nextSibling);

  // Populate tasks and suggestions
  const { tasks, suggestions } = generateDailyTasks();
  const tasksList = document.getElementById('dailyTasks');
  const suggestionsList = document.getElementById('coachSuggestions');

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task;
    tasksList.appendChild(li);
  });

  suggestions.forEach(suggestion => {
    const li = document.createElement('li');
    li.textContent = suggestion;
    suggestionsList.appendChild(li);
  });

  // Update Invite to Customer Ratio (desktop grid)
  const invites = metrics.invitesCount || 0;
  const customers = metrics.customersSignedCount || 0;
  let ratioDisplay = '—';
  if (invites > 0) {
    ratioDisplay = `${customers} per ${invites}`;
  }
  const inviteCustomerRatioEl = document.getElementById('inviteCustomerRatio');
  if (inviteCustomerRatioEl) inviteCustomerRatioEl.textContent = ratioDisplay;

  // Update Total Contacts (desktop grid)
  const totalContactsEl = document.getElementById('totalContacts');
  if (totalContactsEl) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    totalContactsEl.textContent = contacts.length;
  }

  // --- Accordion (mobile) ---
  // Update Invite to Customer Ratio (accordion)
  if (inviteCustomerRatioAcc) inviteCustomerRatioAcc.textContent = ratioDisplay;

  // Update Total Contacts (accordion)
  const totalContactsAcc = document.getElementById('totalContactsAccordion');
  if (totalContactsAcc) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    totalContactsAcc.textContent = contacts.length;
  }
}

// --- PWA Update Notification ---
function showUpdateBanner() {
  if (document.getElementById('updateBanner')) return;
  const banner = document.createElement('div');
  banner.id = 'updateBanner';
  banner.style.position = 'fixed';
  banner.style.bottom = '0';
  banner.style.left = '0';
  banner.style.right = '0';
  banner.style.background = '#560691';
  banner.style.color = 'white';
  banner.style.padding = '1em';
  banner.style.textAlign = 'center';
  banner.style.zIndex = '9999';
  banner.innerHTML = `
    <strong>🔄 A new version of SPARK is available.</strong><br>
    Please close and reopen the app to update.
    <button id="reloadNowBtn" style="margin-left:1em; background:white; color:#560691; border:none; border-radius:4px; padding:0.5em 1em; font-weight:bold; cursor:pointer;">Reload Now</button>
  `;
  document.body.appendChild(banner);
  document.getElementById('reloadNowBtn').onclick = () => {
    window.location.reload();
  };
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    if (reg.waiting) {
      showUpdateBanner();
    }
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateBanner();
        }
      });
    });
  });
  // Listen for controllerchange (when new SW takes over)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Optionally, you could auto-reload here
  });
}

// Daily Focus (Get Started) logic
function getDailyFocus() {
  const partnerType = localStorage.getItem('partnerType') || 'new';
  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
  const invites = metrics.invitesCount || 0;
  const appointmentsSet = metrics.appointmentsSetCount || 0;
  const appointmentsSat = metrics.appointmentsSatCount || 0;
  const customers = metrics.customersSignedCount || 0;
  const partners = metrics.partnersSignedCount || 0;
  let focus = '';

  if (invites >= 5 && appointmentsSet === 0) {
    focus = "You've sent several invitations but haven't set any appointments. Try phoning your contacts instead of messaging—it's often more effective. If you're unsure what to say, review the scripts or ask your mentor for tips!";
  } else if (appointmentsSet > 0 && appointmentsSat === 0) {
    focus = "You've set appointments but haven't sat any yet. Confirm your appointments and follow up with your contacts to ensure they attend.";
  } else if (appointmentsSat > 0 && customers === 0) {
    focus = "You're getting appointments, but haven't signed any customers yet. Consider asking your mentor to observe your next presentation or review your approach together.";
  } else if (customers > 0 && partners === 0 && partnerType === 'established') {
    focus = "You're signing customers! Now, think about who in your network might be open to joining your team. Invite someone to learn about the partner opportunity.";
  } else if (invites < 3) {
    focus = "Today's focus: Send out at least 2 more invitations. Consistent outreach is key to building momentum!";
  } else {
    focus = "Great work! Keep building on your progress. Support a teammate, review your next promotion requirements, or reflect on what's working best for you.";
  }

  focus += "<br><br><em>Remember: Small daily actions lead to big results!</em>";
  return focus;
}

// Modal logic for Get Started
const getStartedBtn = document.getElementById('getStartedBtn');
const focusModal = document.getElementById('focusModal');
const closeFocusModal = document.getElementById('closeFocusModal');
const focusContent = document.getElementById('focusContent');

if (getStartedBtn && focusModal && closeFocusModal && focusContent) {
  getStartedBtn.addEventListener('click', async () => {
    // Gather metrics and partnerType
    const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
    const partnerType = localStorage.getItem('partnerType') || 'new';

    // Show loading state
    focusContent.innerHTML = "Generating your focus for today...";
    focusModal.style.display = 'block';

    try {
      const response = await fetch('/.netlify/functions/suggestFocus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics, partnerType })
      });
      const data = await response.json();
      if (data.focus) {
        focusContent.innerHTML = data.focus;
      } else {
        focusContent.innerHTML = getDailyFocus();
      }
    } catch (error) {
      focusContent.innerHTML = getDailyFocus();
    }
  });
  closeFocusModal.addEventListener('click', () => {
    focusModal.style.display = 'none';
  });
  window.addEventListener('click', (event) => {
    if (event.target === focusModal) {
      focusModal.style.display = 'none';
    }
  });
}

// Burger menu logic for mobile navigation
const burgerMenuBtn = document.getElementById('burgerMenuBtn');
const mobileNavMenu = document.getElementById('mobileNavMenu');
const mainNavButtons = document.getElementById('mainNavButtons');

if (burgerMenuBtn && mobileNavMenu && mainNavButtons) {
  // Populate mobile menu with nav buttons
  mobileNavMenu.innerHTML = mainNavButtons.innerHTML;

  burgerMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileNavMenu.style.display === 'block') {
      mobileNavMenu.style.display = 'none';
    } else {
      mobileNavMenu.style.display = 'block';
    }
  });

  // Hide menu when clicking outside
  window.addEventListener('click', (e) => {
    if (mobileNavMenu.style.display === 'block' && !mobileNavMenu.contains(e.target) && e.target !== burgerMenuBtn) {
      mobileNavMenu.style.display = 'none';
    }
  });

  // Hide menu when clicking a nav button
  mobileNavMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      mobileNavMenu.style.display = 'none';
    }
  });
}

// Dashboard accordion logic for mobile
function setupDashboardAccordion() {
  if (window.innerWidth > 600) return; // Only on mobile
  const sections = document.querySelectorAll('.dashboard-accordion .accordion-section');
  sections.forEach((section, idx) => {
    const header = section.querySelector('.accordion-header');
    const content = section.querySelector('.accordion-content');
    if (!header || !content) return;
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      // Collapse all
      sections.forEach((s, i) => {
        s.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        s.querySelector('.accordion-content').style.display = 'none';
      });
      // Expand this one if it was not already open
      if (!expanded) {
        header.setAttribute('aria-expanded', 'true');
        content.style.display = 'block';
      }
    });
    // Default: first section open
    if (idx === 0) {
      header.setAttribute('aria-expanded', 'true');
      content.style.display = 'block';
    } else {
      header.setAttribute('aria-expanded', 'false');
      content.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', setupDashboardAccordion);
window.addEventListener('resize', setupDashboardAccordion);

// Quote of the Day logic
function loadQuoteOfTheDay() {
  const card = document.getElementById('quoteOfTheDayCard');
  if (!card) return;
  card.innerHTML = '<div class="quote-text">Loading quote...</div>';
  fetch('/.netlify/functions/quoteOfTheDay')
    .then(res => res.json())
    .then(data => {
      card.innerHTML = `
        <div class="quote-text">“${data.text}”</div>
        <div class="quote-author">${data.author}</div>
      `;
    })
    .catch(() => {
      card.innerHTML = '<div class="quote-text">Stay positive and keep moving forward!</div><div class="quote-author">SPARK Daily Tip</div>';
    });
}

// Show quote when dashboard tab is shown
const dashboardTabBtn = document.querySelector('button[onclick="switchTab(\'dashboard\')"]');
if (dashboardTabBtn) {
  dashboardTabBtn.addEventListener('click', () => {
    setTimeout(loadQuoteOfTheDay, 100);
  });
}
