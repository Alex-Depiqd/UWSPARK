// Global variables
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
let activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];

// Gamification System
const achievements = {
  firstContact: { id: 'firstContact', name: 'First Contact', icon: '👋', description: 'Add your first contact', xp: 50, unlocked: false },
  tenContacts: { id: 'tenContacts', name: 'Network Builder', icon: '📇', description: 'Add 10 contacts', xp: 100, unlocked: false },
  fiftyContacts: { id: 'fiftyContacts', name: 'Contact Master', icon: '📚', description: 'Add 50 contacts', xp: 200, unlocked: false },
  firstInvite: { id: 'firstInvite', name: 'First Step', icon: '🚀', description: 'Send your first invitation', xp: 75, unlocked: false },
  tenInvites: { id: 'tenInvites', name: 'Outreach Pro', icon: '📢', description: 'Send 10 invitations', xp: 150, unlocked: false },
  firstAppointment: { id: 'firstAppointment', name: 'Meeting Setter', icon: '📅', description: 'Set your first appointment', xp: 100, unlocked: false },
  firstCustomer: { id: 'firstCustomer', name: 'First Customer', icon: '🎉', description: 'Sign your first customer', xp: 300, unlocked: false },
  fastStartComplete: { id: 'fastStartComplete', name: 'Fast Start Champion', icon: '🏆', description: 'Complete Fast Start (6 customers, 1 partner)', xp: 500, unlocked: false },
  threeDayStreak: { id: 'threeDayStreak', name: 'Consistency King', icon: '🔥', description: 'Log activity for 3 consecutive days', xp: 100, unlocked: false },
  sevenDayStreak: { id: 'sevenDayStreak', name: 'Week Warrior', icon: '⚡', description: 'Log activity for 7 consecutive days', xp: 250, unlocked: false },
  thirtyDayStreak: { id: 'thirtyDayStreak', name: 'Monthly Master', icon: '👑', description: 'Log activity for 30 consecutive days', xp: 1000, unlocked: false }
};

const levels = [
  { level: 1, name: 'Rookie', xpRequired: 0, color: '#9E9E9E' },
  { level: 2, name: 'Enthusiast', xpRequired: 100, color: '#4CAF50' },
  { level: 3, name: 'Dedicated', xpRequired: 300, color: '#2196F3' },
  { level: 4, name: 'Professional', xpRequired: 600, color: '#9C27B0' },
  { level: 5, name: 'Expert', xpRequired: 1000, color: '#FF9800' },
  { level: 6, name: 'Master', xpRequired: 1500, color: '#F44336' },
  { level: 7, name: 'Legend', xpRequired: 2500, color: '#E91E63' },
  { level: 8, name: 'Champion', xpRequired: 4000, color: '#673AB7' },
  { level: 9, name: 'Elite', xpRequired: 6000, color: '#3F51B5' },
  { level: 10, name: 'Ultimate', xpRequired: 10000, color: '#FFD700' }
];

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

function addContact(name, category, notes = '') {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  
  // Check if contact already exists
  if (contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase())) {
    alert('A contact with this name already exists.');
    return false;
  }
  
  const newContact = {
    name: name,
    category: category,
    notes: notes,
    dateAdded: new Date().toISOString()
  };
  
  contacts.push(newContact);
  localStorage.setItem('contacts', JSON.stringify(contacts));
  
  // Update total contacts count
  updateTotalContactsCount();
  
  // Check for achievements after adding contact
  checkAchievements();
  
  return true;
}

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

// Update the activity form submission to use gamified logging
document.addEventListener('DOMContentLoaded', function() {
  const activityForm = document.getElementById('activityForm');
  if (activityForm) {
    activityForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const actionType = document.getElementById('activityType').value;
      const notes = document.getElementById('activityNote').value;
      
      // Use gamified logging instead of regular logging
      logActivityWithGamification(actionType, notes);
      
      // Clear form
      document.getElementById('activityNote').value = '';
      
      // Show success message
      showToast('Activity logged successfully! +XP gained!');
    });
  }
  
  // Initialize gamification
  initializeGamification();
  renderAchievements();
});

function renderAchievements() {
  const achievementsGrid = document.getElementById('achievementsGrid');
  if (!achievementsGrid) return;
  
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  const unlockedAchievements = gamificationData.achievements || {};
  
  achievementsGrid.innerHTML = '';
  
  Object.values(achievements).forEach(achievement => {
    const isUnlocked = unlockedAchievements[achievement.id];
    const achievementItem = document.createElement('div');
    achievementItem.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
    
    achievementItem.innerHTML = `
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">${achievement.icon}</div>
      <div style="font-weight: 600; margin-bottom: 0.3rem;">${achievement.name}</div>
      <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.5rem;">${achievement.description}</div>
      <div style="font-size: 0.9rem; font-weight: 600; color: #4CAF50;">+${achievement.xp} XP</div>
      ${isUnlocked ? '<div style="font-size: 0.7rem; color: #4CAF50; margin-top: 0.3rem;">✓ Unlocked</div>' : ''}
    `;
    
    achievementsGrid.appendChild(achievementItem);
  });
}

// Update the updateDashboard function to include gamification
function updateDashboard() {
  // Existing dashboard update code...
  updateGamificationDisplay();
  renderAchievements();
  
  // Update XP display
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  const xpDisplay = document.getElementById('xpDisplay');
  if (xpDisplay) {
    xpDisplay.textContent = `${gamificationData.xp || 0} XP`;
  }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

function renderFastStartWidget() {
  const card = document.getElementById('aiCoachCardGrid');
  const cardTitle = card ? card.querySelector('h3') : null;
  const customerProgressEl = document.getElementById('customerProgress');
  const partnerProgressEl = document.getElementById('partnerProgress');
  const customerProgressBar = document.getElementById('customerProgressBar');
  const partnerProgressBar = document.getElementById('partnerProgressBar');
  const dayCountEl = document.getElementById('dayCount');
  if (!card || !cardTitle || !customerProgressEl || !partnerProgressEl || !customerProgressBar || !partnerProgressBar || !dayCountEl) return;

  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
  const customerCount = metrics.customersSignedCount || 0;
  const partnerType = customerCount < 6 ? 'new' : 'experienced';
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

  if (partnerType === 'experienced') {
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
  // Hide all tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.style.display = 'none';
  });

  // Remove active class from all nav buttons
  const navButtons = document.querySelectorAll('nav button');
  navButtons.forEach(button => {
    button.classList.remove('active');
  });

  // Show selected tab
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.style.display = 'block';
  }

  // Add active class to clicked button
  const activeButton = document.querySelector(`button[onclick="switchTab('${tabId}')"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }

  // Special handling for specific tabs
  if (tabId === 'dashboard') {
    updateDashboard();
    setTimeout(loadQuoteOfTheDay, 100);
  } else if (tabId === 'scripts') {
    // Populate scripts when scripts tab is shown
    setTimeout(() => {
      if (window.populateScriptsSection) {
        window.populateScriptsSection();
      }
    }, 100);
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
  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
  const customerCount = metrics.customersSignedCount || 0;
  const partnerType = customerCount < 6 ? 'new' : 'experienced';
  const currentLevel = localStorage.getItem('currentLevel') || 'QD';
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

// Daily Focus (Get Started) logic
function getDailyFocus() {
  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
  const customerCount = metrics.customersSignedCount || 0;
  const partnerType = customerCount < 6 ? 'new' : 'experienced';
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
    // Gather metrics and determine partner type automatically
    const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
    const customerCount = metrics.customersSignedCount || 0;
    const partnerType = customerCount < 6 ? 'new' : 'experienced';

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

function initializeGamification() {
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  if (!gamificationData.xp) {
    gamificationData.xp = 0;
    gamificationData.level = 1;
    gamificationData.achievements = {};
    gamificationData.streak = 0;
    gamificationData.lastActivityDate = null;
    localStorage.setItem('gamification', JSON.stringify(gamificationData));
  }
  checkAchievements();
  updateGamificationDisplay();
}

function addXP(amount, reason = '') {
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  const oldLevel = gamificationData.level || 1;
  gamificationData.xp = (gamificationData.xp || 0) + amount;
  
  // Calculate new level
  const newLevel = calculateLevel(gamificationData.xp);
  gamificationData.level = newLevel;
  
  localStorage.setItem('gamification', JSON.stringify(gamificationData));
  
  // Show XP gain notification
  showXPNotification(amount, reason);
  
  // Check for level up
  if (newLevel > oldLevel) {
    showLevelUpCelebration(newLevel);
  }
  
  updateGamificationDisplay();
}

function calculateLevel(xp) {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xpRequired) {
      return levels[i].level;
    }
  }
  return 1;
}

function checkAchievements() {
  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  
  // Check contact achievements
  if (contacts.length >= 1 && !gamificationData.achievements.firstContact) {
    unlockAchievement('firstContact');
  }
  if (contacts.length >= 10 && !gamificationData.achievements.tenContacts) {
    unlockAchievement('tenContacts');
  }
  if (contacts.length >= 50 && !gamificationData.achievements.fiftyContacts) {
    unlockAchievement('fiftyContacts');
  }
  
  // Check invitation achievements
  if ((metrics.invitesCount || 0) >= 1 && !gamificationData.achievements.firstInvite) {
    unlockAchievement('firstInvite');
  }
  if ((metrics.invitesCount || 0) >= 10 && !gamificationData.achievements.tenInvites) {
    unlockAchievement('tenInvites');
  }
  
  // Check appointment achievements
  if ((metrics.appointmentsSetCount || 0) >= 1 && !gamificationData.achievements.firstAppointment) {
    unlockAchievement('firstAppointment');
  }
  
  // Check customer achievements
  if ((metrics.customersSignedCount || 0) >= 1 && !gamificationData.achievements.firstCustomer) {
    unlockAchievement('firstCustomer');
  }
  
  // Check Fast Start completion
  if ((metrics.customersSignedCount || 0) >= 6 && (metrics.partnersSignedCount || 0) >= 1 && !gamificationData.achievements.fastStartComplete) {
    unlockAchievement('fastStartComplete');
  }
  
  // Check streak achievements
  updateStreak();
  const streak = gamificationData.streak || 0;
  if (streak >= 3 && !gamificationData.achievements.threeDayStreak) {
    unlockAchievement('threeDayStreak');
  }
  if (streak >= 7 && !gamificationData.achievements.sevenDayStreak) {
    unlockAchievement('sevenDayStreak');
  }
  if (streak >= 30 && !gamificationData.achievements.thirtyDayStreak) {
    unlockAchievement('thirtyDayStreak');
  }
}

function unlockAchievement(achievementId) {
  const achievement = achievements[achievementId];
  if (!achievement) return;
  
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  gamificationData.achievements[achievementId] = {
    unlockedAt: new Date().toISOString(),
    xp: achievement.xp
  };
  
  localStorage.setItem('gamification', JSON.stringify(gamificationData));
  
  // Add XP for achievement
  addXP(achievement.xp, `Achievement: ${achievement.name}`);
  
  // Show achievement notification
  showAchievementUnlocked(achievement);
}

function updateStreak() {
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  const today = new Date().toDateString();
  const lastActivityDate = gamificationData.lastActivityDate;
  
  if (lastActivityDate === today) {
    return; // Already logged today
  }
  
  if (lastActivityDate) {
    const lastDate = new Date(lastActivityDate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate.toDateString() === yesterday.toDateString()) {
      // Consecutive day
      gamificationData.streak = (gamificationData.streak || 0) + 1;
    } else {
      // Streak broken
      gamificationData.streak = 1;
    }
  } else {
    // First activity
    gamificationData.streak = 1;
  }
  
  gamificationData.lastActivityDate = today;
  localStorage.setItem('gamification', JSON.stringify(gamificationData));
}

function showXPNotification(amount, reason) {
  const notification = document.createElement('div');
  notification.className = 'xp-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4CAF50, #8BC34A);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    animation: slideInRight 0.5s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <span style="font-size: 1.2rem;">⭐</span>
      <div>
        <div>+${amount} XP</div>
        ${reason ? `<div style="font-size: 0.8rem; opacity: 0.9;">${reason}</div>` : ''}
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 3000);
}

function showAchievementUnlocked(achievement) {
  const celebration = document.createElement('div');
  celebration.className = 'progress-celebration';
  celebration.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">${achievement.icon}</div>
    <h3 style="margin: 0 0 0.5rem 0;">Achievement Unlocked!</h3>
    <h4 style="margin: 0 0 0.5rem 0; color: #ffd700;">${achievement.name}</h4>
    <p style="margin: 0 0 1rem 0; opacity: 0.9;">${achievement.description}</p>
    <div style="font-size: 1.2rem; font-weight: 600; color: #ffd700;">+${achievement.xp} XP</div>
  `;
  
  document.body.appendChild(celebration);
  
  setTimeout(() => {
    celebration.style.animation = 'celebrationPop 0.6s ease-in reverse';
    setTimeout(() => {
      if (celebration.parentNode) {
        celebration.parentNode.removeChild(celebration);
      }
    }, 600);
  }, 3000);
}

function showLevelUpCelebration(newLevel) {
  const levelData = levels.find(l => l.level === newLevel);
  const celebration = document.createElement('div');
  celebration.className = 'progress-celebration';
  celebration.innerHTML = `
    <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
    <h3 style="margin: 0 0 0.5rem 0;">Level Up!</h3>
    <h4 style="margin: 0 0 0.5rem 0; color: #ffd700;">Level ${newLevel} - ${levelData.name}</h4>
    <p style="margin: 0; opacity: 0.9;">Congratulations! You're making amazing progress!</p>
  `;
  
  document.body.appendChild(celebration);
  
  setTimeout(() => {
    celebration.style.animation = 'celebrationPop 0.6s ease-in reverse';
    setTimeout(() => {
      if (celebration.parentNode) {
        celebration.parentNode.removeChild(celebration);
      }
    }, 600);
  }, 4000);
}

function updateGamificationDisplay() {
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  const currentLevel = levels.find(l => l.level === (gamificationData.level || 1));
  const nextLevel = levels.find(l => l.level === (gamificationData.level || 1) + 1);
  
  // Update level indicator if it exists
  const levelIndicator = document.getElementById('levelIndicator');
  if (levelIndicator) {
    levelIndicator.innerHTML = `
      <div style="position: relative; z-index: 1;">
        <div style="font-size: 1.2rem; margin-bottom: 0.3rem;">Level ${currentLevel.level}</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">${currentLevel.name}</div>
        ${nextLevel ? `<div style="font-size: 0.8rem; margin-top: 0.3rem;">${gamificationData.xp - currentLevel.xpRequired} / ${nextLevel.xpRequired - currentLevel.xpRequired} XP to next level</div>` : ''}
      </div>
    `;
  }
  
  // Update XP bar if it exists
  const xpBar = document.getElementById('xpBar');
  if (xpBar && nextLevel) {
    const xpProgress = ((gamificationData.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100;
    xpBar.style.width = `${xpProgress}%`;
  }
  
  // Update streak counter if it exists
  const streakCounter = document.getElementById('streakCounter');
  if (streakCounter) {
    streakCounter.innerHTML = `
      <span class="streak-icon">🔥</span>
      <span>${gamificationData.streak || 0} Day Streak</span>
    `;
  }
}

// Add gamification to activity logging
function logActivityWithGamification(actionType, notes = '') {
  // Log the activity as before
  const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
  const newActivity = {
    id: Date.now(),
    type: actionType,
    notes: notes,
    timestamp: new Date().toISOString()
  };
  activityLog.unshift(newActivity);
  localStorage.setItem('activityLog', JSON.stringify(activityLog));
  
  // Update metrics
  updateMetrics(actionType);
  
  // Add gamification rewards
  let xpGained = 0;
  let reason = '';
  
  switch (actionType) {
    case 'Invite':
      xpGained = 25;
      reason = 'Sent invitation';
      break;
    case 'AppointmentSet':
      xpGained = 50;
      reason = 'Set appointment';
      break;
    case 'AppointmentSat':
      xpGained = 75;
      reason = 'Sat appointment';
      break;
    case 'CustomerSigned':
      xpGained = 200;
      reason = 'Signed customer';
      break;
    case 'PartnerSigned':
      xpGained = 300;
      reason = 'Signed partner';
      break;
  }
  
  if (xpGained > 0) {
    addXP(xpGained, reason);
  }
  
  // Check for new achievements
  checkAchievements();
  
  // Update displays
  renderActivityLog();
  updateDashboard();
}

// Contact form event listener
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const telephone = document.getElementById('telephone').value;
      const category = document.getElementById('category').value;
      const notes = document.getElementById('notes').value;
      
      if (addContact(name, category, notes)) {
        // Show success message with gamification
        showToast(`Contact "${name}" added successfully! +XP gained!`);
        
        // Clear form
        this.reset();
        
        // Update displays
        renderContacts();
        updateDashboard();
      }
    });
  }
});
