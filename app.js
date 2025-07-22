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
  // Store the contact name in localStorage for pre-filling
  localStorage.setItem('activityContact', name);
  // Set a flag to indicate contact was intentionally selected
  localStorage.setItem('contactIntentionallySelected', 'true');
  // Switch to Tracker tab
  switchTab('log');

  // Pre-fill the activity type and contact name
  setTimeout(() => {
    const activityType = document.getElementById('activityType');
    if (activityType) {
      activityType.value = 'Invite'; // Default to Invite
      
      // Trigger AI Coach popup after setting the value
      setTimeout(() => {
        const aiCoachPopup = document.getElementById('aiCoachPopup');
        const aiCoachBanner = document.getElementById('aiCoachBanner');
        const aiCoachPopupShown = localStorage.getItem('aiCoachPopupShown') === 'true';
        
        if (aiCoachPopup && aiCoachBanner) {
          if (!aiCoachPopupShown) {
            aiCoachPopup.style.display = 'block';
            localStorage.setItem('aiCoachPopupShown', 'true');
          } else {
            aiCoachBanner.style.display = 'block';
          }
        }
      }, 100); // Small delay to ensure value is set
    }
    const activityNote = document.getElementById('activityNote');
    if (activityNote) {
      activityNote.value = '';
    }
    const activityContact = document.getElementById('activityContact');
    if (activityContact) {
      activityContact.value = name;
    }
  }, 150);
}

// Expose function to window object
window.trackActivityForContact = trackActivityForContact;

function saveContacts() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

function saveActivityLog() {
  localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

function updateDashboard() {
  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
  const joinDate = localStorage.getItem('joinDate');
  
  // Update metric displays (desktop grid)
  const invitesCountEl = document.getElementById('invitesCount');
  const appointmentsSetCountEl = document.getElementById('appointmentsSetCount');
  const appointmentsSatCountEl = document.getElementById('appointmentsSatCount');
  const customersSignedCountEl = document.getElementById('customersSignedCount');
  const partnersSignedCountEl = document.getElementById('partnersSignedCount');
  const customerProgressEl = document.getElementById('customerProgress');
  const partnerProgressEl = document.getElementById('partnerProgress');
  const customerProgressBarEl = document.getElementById('customerProgressBar');
  const partnerProgressBarEl = document.getElementById('partnerProgressBar');
  const dayCountEl = document.getElementById('dayCount');
  const daysRemainingEl = document.getElementById('daysRemaining');
  const inviteCustomerRatioEl = document.getElementById('inviteCustomerRatio');
  const totalContactsEl = document.getElementById('totalContacts');

  if (invitesCountEl) invitesCountEl.textContent = metrics.invitesCount || 0;
  if (appointmentsSetCountEl) appointmentsSetCountEl.textContent = metrics.appointmentsSetCount || 0;
  if (appointmentsSatCountEl) appointmentsSatCountEl.textContent = metrics.appointmentsSatCount || 0;
  if (customersSignedCountEl) customersSignedCountEl.textContent = metrics.customersSignedCount || 0;
  if (partnersSignedCountEl) partnersSignedCountEl.textContent = metrics.partnersSignedCount || 0;

  // Update Fast Start progress (desktop grid)
  const customerProgress = (metrics.customersSignedCount || 0) / 6 * 100;
  const partnerProgress = (metrics.partnersSignedCount || 0) / 1 * 100;
  if (customerProgressEl) customerProgressEl.textContent = `${metrics.customersSignedCount || 0}/6`;
  if (partnerProgressEl) partnerProgressEl.textContent = `${metrics.partnersSignedCount || 0}/1`;
  if (customerProgressBarEl) customerProgressBarEl.style.width = `${customerProgress}%`;
  if (partnerProgressBarEl) partnerProgressBarEl.style.width = `${partnerProgress}%`;

  // Update time tracking (desktop grid)
  if (joinDate) {
    const startDate = new Date(joinDate);
    const today = new Date();
    const dayCount = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 30 - dayCount);
    if (dayCountEl) dayCountEl.textContent = dayCount;
    if (daysRemainingEl) daysRemainingEl.textContent = daysRemaining;
  }

  // Update Invite to Customer Ratio (desktop grid)
  const invites = metrics.invitesCount || 0;
  const customers = metrics.customersSignedCount || 0;
  let ratioDisplay = '—';
  if (invites > 0) {
    ratioDisplay = `${customers} per ${invites}`;
  }
  if (inviteCustomerRatioEl) inviteCustomerRatioEl.textContent = ratioDisplay;

  // Update Total Contacts (desktop grid)
  if (totalContactsEl) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    totalContactsEl.textContent = contacts.length;
  }

  // --- Accordion (mobile) ---
  // Update metric displays (accordion)
  const invitesCountAcc = document.getElementById('invitesCountAccordion');
  const appointmentsSetCountAcc = document.getElementById('appointmentsSetCountAccordion');
  const appointmentsSatCountAcc = document.getElementById('appointmentsSatCountAccordion');
  const customersSignedCountAcc = document.getElementById('customersSignedCountAccordion');
  const partnersSignedCountAcc = document.getElementById('partnersSignedCountAccordion');
  const customerProgressAcc = document.getElementById('customerProgressAccordion');
  const partnerProgressAcc = document.getElementById('partnerProgressAccordion');
  const customerProgressBarAcc = document.getElementById('customerProgressBarAccordion');
  const partnerProgressBarAcc = document.getElementById('partnerProgressBarAccordion');
  const dayCountAcc = document.getElementById('dayCountAccordion');
  const daysRemainingAcc = document.getElementById('daysRemainingAccordion');
  const inviteCustomerRatioAcc = document.getElementById('inviteCustomerRatioAccordion');
  const totalContactsAcc = document.getElementById('totalContactsAccordion');

  if (invitesCountAcc) invitesCountAcc.textContent = metrics.invitesCount || 0;
  if (appointmentsSetCountAcc) appointmentsSetCountAcc.textContent = metrics.appointmentsSetCount || 0;
  if (appointmentsSatCountAcc) appointmentsSatCountAcc.textContent = metrics.appointmentsSatCount || 0;
  if (customersSignedCountAcc) customersSignedCountAcc.textContent = metrics.customersSignedCount || 0;
  if (partnersSignedCountAcc) partnersSignedCountAcc.textContent = metrics.partnersSignedCount || 0;

  // Update Fast Start progress (accordion)
  if (customerProgressAcc) customerProgressAcc.textContent = `${metrics.customersSignedCount || 0}/6`;
  if (partnerProgressAcc) partnerProgressAcc.textContent = `${metrics.partnersSignedCount || 0}/1`;
  if (customerProgressBarAcc) customerProgressBarAcc.style.width = `${customerProgress}%`;
  if (partnerProgressBarAcc) partnerProgressBarAcc.style.width = `${partnerProgress}%`;

  // Update time tracking (accordion)
  if (joinDate) {
    const startDate = new Date(joinDate);
    const today = new Date();
    const dayCount = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 30 - dayCount);
    if (dayCountAcc) dayCountAcc.textContent = dayCount;
    if (daysRemainingAcc) daysRemainingAcc.textContent = daysRemaining;
  }

  // Update Invite to Customer Ratio (accordion)
  if (inviteCustomerRatioAcc) inviteCustomerRatioAcc.textContent = ratioDisplay;

  // Update Total Contacts (accordion)
  if (totalContactsAcc) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    totalContactsAcc.textContent = contacts.length;
  }

  // --- AI Coach Section ---
  // Remove existing AI Coach cards if present
  const oldCoachGrid = document.getElementById('aiCoachCardGrid');
  const oldCoachAccordion = document.getElementById('aiCoachCardAccordion');
  if (oldCoachGrid) oldCoachGrid.innerHTML = '';
  if (oldCoachAccordion) oldCoachAccordion.innerHTML = '';

  // Create AI Coach card HTML
  const aiCoachHTML = `
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
  if (oldCoachGrid) oldCoachGrid.innerHTML = aiCoachHTML;
  if (oldCoachAccordion) oldCoachAccordion.innerHTML = aiCoachHTML;

  // Populate tasks and suggestions in both layouts
  const { tasks, suggestions } = generateDailyTasks();
  [document.getElementById('dailyTasks'), document.getElementById('coachSuggestions')].forEach((el, idx) => {
    if (!el) return;
    el.innerHTML = '';
    (idx === 0 ? tasks : suggestions).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      el.appendChild(li);
    });
  });
  // For accordion
  [oldCoachAccordion && oldCoachAccordion.querySelector('#dailyTasks'), oldCoachAccordion && oldCoachAccordion.querySelector('#coachSuggestions')].forEach((el, idx) => {
    if (!el) return;
    el.innerHTML = '';
    (idx === 0 ? tasks : suggestions).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      el.appendChild(li);
    });
  });

  // Update gamification display
  updateGamificationDisplay();
  renderAchievements();
  
  // Update XP display (Dashboard summary)
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  const xpDisplay = document.getElementById('xpDisplay');
  if (xpDisplay) {
    xpDisplay.textContent = `${gamificationData.xp || 0} XP`;
  }
  // Update mobile XP display (Dashboard summary)
  const mobileXpDisplay = document.getElementById('mobileXpDisplay');
  if (mobileXpDisplay) {
    mobileXpDisplay.textContent = `${gamificationData.xp || 0} XP`;
  }
  // Ensure dashboard accordion is initialized after updates
  if (typeof setupDashboardAccordion === 'function') {
    setTimeout(setupDashboardAccordion, 0);
  }
}

function displayContacts() {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  const contactsList = document.getElementById('contactsList');
  const contactCount = document.getElementById('contactCount');
  
  if (!contactsList) return;

  // Get filter and sort values
  const searchTerm = document.getElementById('contactSearch')?.value?.toLowerCase() || '';
  const categoryFilter = document.getElementById('categoryFilter')?.value || '';
  const activityFilter = document.getElementById('activityFilter')?.value || '';
  const statusFilter = document.getElementById('statusFilter')?.value || '';
  const sortBy = document.getElementById('contactSort')?.value || 'name-asc';

  // Filter contacts
  let filteredContacts = contacts.filter(contact => {
    // Ensure contact has required fields
    if (!contact || !contact.name) return false;
    
    const matchesSearch = !searchTerm || 
      contact.name.toLowerCase().includes(searchTerm) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm)) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchTerm)) ||
      (contact.notes && contact.notes.toLowerCase().includes(searchTerm));
    
    const matchesCategory = !categoryFilter || (contact.category && contact.category === categoryFilter);
    
    // Check activity filter
    const hasActivity = contact.history && contact.history.length > 0;
    const matchesActivity = !activityFilter || 
      (activityFilter === 'has-activity' && hasActivity) ||
      (activityFilter === 'no-activity' && !hasActivity);
    
    // Check status filter
    const matchesStatus = !statusFilter || (contact.status && contact.status === statusFilter);
    
    return matchesSearch && matchesCategory && matchesActivity && matchesStatus;
  });

  // Sort contacts
  filteredContacts.sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '');
      case 'date-added-desc':
        return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      case 'date-added-asc':
        return new Date(a.dateAdded || 0) - new Date(b.dateAdded || 0);
      case 'category-asc':
        return (a.category || '').localeCompare(b.category || '');
      default:
        return (a.name || '').localeCompare(b.name || '');
    }
  });

  // Update contact count
  if (contactCount) {
    const totalContacts = contacts.length;
    const filteredCount = filteredContacts.length;
    if (filteredCount === totalContacts) {
      contactCount.textContent = `${totalContacts} contact${totalContacts !== 1 ? 's' : ''}`;
    } else {
      contactCount.textContent = `${filteredCount} of ${totalContacts} contact${totalContacts !== 1 ? 's' : ''}`;
    }
  }

  if (filteredContacts.length === 0) {
    if (contacts.length === 0) {
      contactsList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No contacts added yet. Add your first contact to get started!</p>';
    } else {
      contactsList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No contacts match your current filters. Try adjusting your search or filter criteria.</p>';
    }
    return;
  }

  contactsList.innerHTML = '';
  
  filteredContacts.forEach(contact => {
    const contactCard = document.createElement('div');
    contactCard.className = 'contact-card';
    
    const dateAdded = new Date(contact.dateAdded).toLocaleDateString();
    
    // Generate history HTML
    let historyHTML = '';
    if (contact.history && contact.history.length > 0) {
      const historyItems = contact.history.slice(0, 5).map(entry => {
        const date = new Date(entry.timestamp).toLocaleDateString();
        const time = new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const activityIcons = {
          'Invite': '📤',
          'AppointmentSet': '📅',
          'AppointmentSat': '✅',
          'CustomerSigned': '🎉',
          'PartnerSigned': '🤝'
        };
        const icon = activityIcons[entry.type] || '📝';
        return `
          <div style="padding: 8px; border-bottom: 1px solid #eee; font-size: 0.9rem;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.1rem;">${icon}</span>
              <span style="font-weight: 600; color: #333;">${entry.type}</span>
              <span style="color: #666; font-size: 0.8rem;">${date} ${time}</span>
            </div>
            ${entry.notes ? `<div style="margin-left: 28px; color: #555; font-style: italic;">${entry.notes}</div>` : ''}
          </div>
        `;
      }).join('');
      
      const moreCount = contact.history.length > 5 ? contact.history.length - 5 : 0;
      historyHTML = `
        <div class="contact-history" style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
          <button onclick="toggleHistory(${contact.id})" class="btn-history" style="background: none; border: none; color: #007bff; cursor: pointer; font-size: 0.9rem; padding: 5px 0;">
            📋 Activity History (${contact.history.length}) ▼
          </button>
          <div id="history-${contact.id}" class="history-content" style="display: none; margin-top: 10px; background: #f8f9fa; border-radius: 8px; padding: 10px; max-height: 300px; overflow-y: auto;">
            ${historyItems}
            ${moreCount > 0 ? `<div style="text-align: center; color: #666; font-style: italic; padding: 8px;">... and ${moreCount} more activities</div>` : ''}
          </div>
        </div>
      `;
    }
    
    contactCard.innerHTML = `
      <div class="contact-header">
        <h3>${contact.name}</h3>
        <div style="display: flex; align-items: center; gap: 8px;">
          <select onchange="updateContactStatus(${contact.id}, this.value)" style="font-size: 0.8rem; padding: 2px 4px; border-radius: 6px; border: 1px solid #ddd; background: white;">
            <option value="New" ${contact.status === 'New' ? 'selected' : ''}>⏳ New</option>
            <option value="Active" ${contact.status === 'Active' ? 'selected' : ''}>📝 Active</option>
            <option value="No For Now" ${contact.status === 'No For Now' ? 'selected' : ''}>⏸️ No For Now</option>
          </select>
        </div>
      </div>
      <div class="contact-details">
        <p><strong>Category:</strong> ${contact.category || 'Friends & Family'}</p>
        ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
        ${contact.email ? `<p><strong>Email:</strong> ${contact.email}</p>` : ''}
        ${contact.notes ? `<p><strong>Notes:</strong> ${contact.notes}</p>` : ''}
        <p><strong>Added:</strong> ${dateAdded}</p>
      </div>
      ${historyHTML}
      <div class="contact-actions">
        <button onclick="trackActivityForContact('${contact.name.replace(/'/g, "&#39;")}' )" class="btn-message">📝 Log Activity</button>
        <button onclick="editContactModalOpen(${contact.id})" class="btn-edit">✏️ Edit</button>
        <button onclick="deleteContact(${contact.id})" class="btn-delete">🗑️ Delete</button>
      </div>
    `;
    
    contactsList.appendChild(contactCard);
  });
}

// Add toggle function for history
function toggleHistory(contactId) {
  const historyContent = document.getElementById(`history-${contactId}`);
  const button = historyContent.previousElementSibling;
  
  if (historyContent.style.display === 'none') {
    historyContent.style.display = 'block';
    button.innerHTML = button.innerHTML.replace('▼', '▲');
  } else {
    historyContent.style.display = 'none';
    button.innerHTML = button.innerHTML.replace('▲', '▼');
  }
}

// Expose function to window object
window.toggleHistory = toggleHistory;

// Add event listeners for contact filtering and sorting
function setupContactFilters() {
  const searchInput = document.getElementById('contactSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const activityFilter = document.getElementById('activityFilter');
  const statusFilter = document.getElementById('statusFilter');
  const contactSort = document.getElementById('contactSort');
  const toggleFiltersBtn = document.getElementById('toggleFilters');
  const filterOptions = document.getElementById('filterOptions');

  if (searchInput) {
    // Add debounce to search input for better performance
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(displayContacts, 300);
    });
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', displayContacts);
  }
  
  if (activityFilter) {
    activityFilter.addEventListener('change', displayContacts);
  }
  
  if (statusFilter) {
    statusFilter.addEventListener('change', displayContacts);
  }
  
  if (contactSort) {
    contactSort.addEventListener('change', displayContacts);
  }

  // Toggle filter options
  if (toggleFiltersBtn && filterOptions) {
    // Use a simple click handler with proper state checking
    toggleFiltersBtn.onclick = function() {
      const isVisible = filterOptions.style.display === 'block';
      
      if (isVisible) {
        filterOptions.style.display = 'none';
        this.classList.remove('active');
        const toggleText = this.querySelector('.filter-toggle-text');
        if (toggleText) toggleText.textContent = 'Filters';
      } else {
        filterOptions.style.display = 'block';
        this.classList.add('active');
        const toggleText = this.querySelector('.filter-toggle-text');
        if (toggleText) toggleText.textContent = 'Hide Filters';
      }
    };
  }
}

// Function to update contact status
function updateContactStatus(contactId, newStatus) {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  const contactIndex = contacts.findIndex(c => c.id === contactId);
  
  if (contactIndex !== -1) {
    contacts[contactIndex].status = newStatus;
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    // Refresh the display
    initializeContactView();
    
    // Show confirmation
    showToast(`Contact status updated to "${newStatus}"`);
  }
}

// Initialize contact filters when the view tab is shown
function initializeContactView() {
  setupContactFilters();
  displayContacts();
  
  // Ensure filter options start hidden
  const filterOptions = document.getElementById('filterOptions');
  const toggleFiltersBtn = document.getElementById('toggleFilters');
  if (filterOptions && toggleFiltersBtn) {
    filterOptions.style.display = 'none';
    toggleFiltersBtn.classList.remove('active');
    const toggleText = toggleFiltersBtn.querySelector('.filter-toggle-text');
    if (toggleText) toggleText.textContent = 'Filters';
  }
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
  updateDashboard();
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

function deleteContact(contactId) {
  const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
  const contact = contacts.find(c => c.id === contactId);
  if (!contact) return;
  if (confirm(`Delete ${contact.name}?`)) {
    const updatedContacts = contacts.filter(c => c.id !== contactId);
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    initializeContactView();
    updateDashboard();
    showToast('Contact deleted successfully!');
  }
}

function editContactModalOpen(contactId) {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  const contact = contacts.find(c => c.id === contactId);
  if (!contact) {
    showNotification('Contact not found', 'error');
    return;
  }
  document.getElementById('editName').value = contact.name;
  document.getElementById('editEmail').value = contact.email || '';
  document.getElementById('editTelephone').value = contact.phone || '';
  document.getElementById('editCategory').value = contact.category;
  document.getElementById('editNotes').value = contact.notes || '';
  const modal = document.getElementById('editContactModal');
  modal.style.display = 'block';
  modal.dataset.contactId = contactId;
}

// Add event listener for edit form submission
document.getElementById('editContactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const modal = document.getElementById('editContactModal');
  const contactId = modal.dataset.contactId;
  const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
  const contactIndex = contacts.findIndex(c => c.id == contactId);
  if (contactIndex === -1) return;
  // Update contact
  contacts[contactIndex] = {
    ...contacts[contactIndex],
    name: document.getElementById('editName').value,
    email: document.getElementById('editEmail').value,
    phone: document.getElementById('editTelephone').value,
    category: document.getElementById('editCategory').value,
    notes: document.getElementById('editNotes').value
  };
  // Save and update display
  localStorage.setItem('contacts', JSON.stringify(contacts));
  modal.style.display = 'none';
  initializeContactView();
  updateDashboard();
  showToast('Contact updated successfully!');
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

// Contact form event listener
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('addContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('telephone').value.trim();
      const email = document.getElementById('email').value.trim();
      const category = document.getElementById('category').value;
      const notes = document.getElementById('notes').value.trim();
      if (!name) {
        showNotification('Please enter a contact name', 'error');
        return;
      }
      if (!phone && !email) {
        showNotification('Please enter either a phone number or email address', 'error');
        return;
      }
      // Check for duplicates
      const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
      if (contacts.some(c => c.name.toLowerCase() === name.toLowerCase() || (email && c.email && c.email.toLowerCase() === email.toLowerCase()) || (phone && c.phone && c.phone === phone))) {
        showNotification('A contact with this name, email, or phone already exists.', 'error');
        showToast('Duplicate contact not added.');
        return;
      }
      // Add contact
      const contact = {
        id: Date.now(),
        name: name,
        phone: phone,
        email: email,
        category: category,
        notes: notes,
        dateAdded: new Date().toISOString(),
        status: 'New',
        history: [],
        activities: []
      };
      const updatedContacts = contacts.concat(contact);
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
      // Update total contacts count immediately
      updateDashboard();
      // Award XP for adding a contact
      addXP(25, 'Contact Added');
      // Clear form
      this.reset();
      // Update dashboard metrics, gamification, and contact list
      updateDashboard();
      updateGamificationDisplay();
      // Switch to View Contacts tab
      switchTab('view');
    });
  }
});

function renderActivityLog() {
  const logContainer = document.getElementById('activityLog');
  if (!logContainer) return;

  logContainer.innerHTML = activityLog.map(entry => `
    <div class="log-entry">
      <strong>${new Date(entry.timestamp || entry.date).toLocaleString()}</strong>
      <br />
      ${entry.type}: ${entry.notes || entry.note}
      ${entry.contactName || entry.contact ? `<br /><em>Contact: ${entry.contactName || entry.contact}</em>` : ''}
    </div>
  `).join('');
}

// Initialize gamification on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize gamification
  initializeGamification();
  renderAchievements();
  
  // Set up activity form submission
  const activityForm = document.getElementById('activityForm');
  if (activityForm) {
    activityForm.addEventListener('submit', function(e) {
      e.preventDefault();
      logActivity();
    });
  }
});

function renderAchievements() {
  const achievementsGrid = document.getElementById('achievementsGrid');
  const gamificationAchievementsGrid = document.getElementById('gamificationAchievementsGrid');
  
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  const unlockedAchievements = gamificationData.achievements || {};
  
  // Render for dashboard (desktop only)
  if (achievementsGrid) {
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
  
  // Render for gamification tab
  if (gamificationAchievementsGrid) {
    gamificationAchievementsGrid.innerHTML = '';
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
      
      gamificationAchievementsGrid.appendChild(achievementItem);
    });
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
  // Clear contact selection when switching away from log tab, but preserve if going to view tab
  const currentTab = document.querySelector('.tab[style*="block"]');
  if (currentTab && currentTab.id === 'log' && tabId !== 'log' && tabId !== 'view') {
    const activityContact = document.getElementById('activityContact');
    if (activityContact) {
      activityContact.value = '';
    }
    // Also clear the localStorage contact
    localStorage.removeItem('activityContact');
    localStorage.removeItem('contactIntentionallySelected');
  }

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
    // Always scroll to top when loading Home tab
    if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      selectedTab.scrollTop = 0;
    }
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
  } else if (tabId === 'view') {
    // Display contacts when view tab is shown
    setTimeout(() => {
      initializeContactView();
    }, 100);
  } else if (tabId === 'log') {
    // Display activities when log tab is shown
    setTimeout(() => {
      if (typeof displayActivities === 'function') {
        displayActivities();
      }
      // Check if a contact is selected, if not prompt for selection
      checkContactSelection();
    }, 100);
  } else if (tabId === 'gamification') {
    // Populate gamification tab
    setTimeout(() => {
      updateGamificationDisplay();
      renderAchievements();
      renderLevelProgression();
      renderRecentActivity();
      
      // Update XP display for gamification tab
      const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
      const xpDisplay = document.getElementById('gamificationXpDisplay');
      if (xpDisplay) {
        xpDisplay.textContent = `${gamificationData.xp || 0} XP`;
      }
    }, 100);
  }
}

window.updateTotalContactsCount = updateDashboard;
window.displayContacts = displayContacts;
window.renderFastStartWidget = renderFastStartWidget;
window.renderActivityLog = renderActivityLog;
window.deleteContact = deleteContact;
window.logActivityFromContact = logActivityFromContact;
window.resetApp = resetApp;
window.editContactModalOpen = editContactModalOpen;
window.switchTab = switchTab;
window.initializeContactView = initializeContactView;
window.setupContactFilters = setupContactFilters;
window.updateContactStatus = updateContactStatus;
window.closeContactSelectionModal = closeContactSelectionModal;
window.selectContactForActivity = selectContactForActivity;

// Function to check if a contact is selected and prompt if not
function checkContactSelection() {
  const activityContact = document.getElementById('activityContact');
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  const contactIntentionallySelected = localStorage.getItem('contactIntentionallySelected') === 'true';
  
  // If no contact is selected, we have contacts available, and contact wasn't intentionally selected
  if ((!activityContact || !activityContact.value.trim()) && contacts.length > 0 && !contactIntentionallySelected) {
    // Create and show contact selection modal
    showContactSelectionModal();
  }
  
  // Clear the flag after checking
  localStorage.removeItem('contactIntentionallySelected');
}

// Function to show contact selection modal
function showContactSelectionModal() {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  
  // Create modal HTML with search functionality
  const modalHTML = `
    <div id="contactSelectionModal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 450px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0; color: #4B0082;">Select Contact</h3>
          <button onclick="closeContactSelectionModal()" style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
          ">&times;</button>
        </div>
        
        <p style="color: #666; margin-bottom: 15px;">
          Who would you like to log activity for?
        </p>
        
        <!-- Search Input -->
        <div style="margin-bottom: 20px;">
          <input type="text" id="modalContactSearch" placeholder="🔍 Search contacts..." style="
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            box-sizing: border-box;
            transition: border-color 0.3s ease;
          " onfocus="this.style.borderColor='#9b0f63'" onblur="this.style.borderColor='#e0e0e0'">
        </div>
        
        <!-- Filter Controls -->
        <div style="margin-bottom: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
          <select id="modalCategoryFilter" style="
            padding: 8px 12px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
            background: white;
          ">
            <option value="">All Categories</option>
            <option value="Friends & Family">Friends & Family</option>
            <option value="Recreation">Recreation</option>
            <option value="Occupation">Occupation</option>
            <option value="Geographic">Geographic</option>
            <option value="Same Name">Same Name</option>
          </select>
          
          <select id="modalStatusFilter" style="
            padding: 8px 12px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
            background: white;
          ">
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Active">Active</option>
            <option value="No For Now">No For Now</option>
          </select>
        </div>
        
        <!-- Contact Count -->
        <div style="margin-bottom: 15px; font-size: 14px; color: #666;">
          <span id="modalContactCount">${contacts.length} contacts</span>
        </div>
        
        <!-- Contacts List -->
        <div id="modalContactsList" style="max-height: 300px; overflow-y: auto;">
          ${contacts.map(contact => `
            <div onclick="selectContactForActivity('${contact.name}')" class="modal-contact-item" data-name="${contact.name.toLowerCase()}" data-category="${contact.category || ''}" data-status="${contact.status || 'New'}" style="
              padding: 12px;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              margin-bottom: 8px;
              cursor: pointer;
              transition: all 0.2s ease;
              display: flex;
              justify-content: space-between;
              align-items: center;
            " onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='white'">
              <div>
                <div style="font-weight: 600; color: #333;">${contact.name}</div>
                <div style="font-size: 0.9em; color: #666;">${contact.category || 'No category'} • ${contact.status || 'New'}</div>
              </div>
              <div style="color: #9b0f63; font-size: 1.2em;">→</div>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
          <button onclick="closeContactSelectionModal()" style="
            background: #666;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
          ">Cancel</button>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to page
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Set up search and filter functionality
  setupModalContactSearch();
}

// Function to close contact selection modal
function closeContactSelectionModal() {
  const modal = document.getElementById('contactSelectionModal');
  if (modal) {
    modal.remove();
  }
}

// Function to set up search and filter functionality for the modal
function setupModalContactSearch() {
  const searchInput = document.getElementById('modalContactSearch');
  const categoryFilter = document.getElementById('modalCategoryFilter');
  const statusFilter = document.getElementById('modalStatusFilter');
  
  // Add event listeners with debouncing for search
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(filterModalContacts, 300);
    });
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterModalContacts);
  }
  
  if (statusFilter) {
    statusFilter.addEventListener('change', filterModalContacts);
  }
  
  // Focus on search input for immediate typing
  if (searchInput) {
    searchInput.focus();
  }
}

// Function to filter contacts in the modal
function filterModalContacts() {
  const searchTerm = document.getElementById('modalContactSearch')?.value.toLowerCase() || '';
  const categoryFilter = document.getElementById('modalCategoryFilter')?.value || '';
  const statusFilter = document.getElementById('modalStatusFilter')?.value || '';
  const contactItems = document.querySelectorAll('.modal-contact-item');
  const contactCount = document.getElementById('modalContactCount');
  
  let visibleCount = 0;
  
  contactItems.forEach(item => {
    const name = item.getAttribute('data-name') || '';
    const category = item.getAttribute('data-category') || '';
    const status = item.getAttribute('data-status') || '';
    
    // Check if item matches search term
    const matchesSearch = !searchTerm || name.includes(searchTerm);
    
    // Check if item matches category filter
    const matchesCategory = !categoryFilter || category === categoryFilter;
    
    // Check if item matches status filter
    const matchesStatus = !statusFilter || status === statusFilter;
    
    // Show/hide item based on all filters
    if (matchesSearch && matchesCategory && matchesStatus) {
      item.style.display = 'flex';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });
  
  // Update contact count
  if (contactCount) {
    contactCount.textContent = `${visibleCount} contact${visibleCount !== 1 ? 's' : ''}`;
  }
}

// Function to select a contact for activity logging
function selectContactForActivity(contactName) {
  const activityContact = document.getElementById('activityContact');
  if (activityContact) {
    activityContact.value = contactName;
  }
  
  // Close the modal
  closeContactSelectionModal();
  
  // Show success message
  showToast(`Selected ${contactName} for activity logging`);
}

// Add function to analyze contact history and provide personalized recommendations
function analyzeContactHistory() {
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  const recommendations = [];
  
  contacts.forEach(contact => {
    if (!contact.history || contact.history.length === 0) {
      // New contact with no activity
      recommendations.push({
        type: 'new_contact',
        contact: contact.name,
        action: 'Send initial invitation',
        priority: 'high',
        reason: 'No activity recorded yet'
      });
      return;
    }
    
    // Get the most recent activity
    const latestActivity = contact.history[0];
    const daysSinceLastActivity = Math.floor((new Date() - new Date(latestActivity.timestamp)) / (1000 * 60 * 60 * 24));
    
    // Analyze based on last activity type
    switch (latestActivity.type) {
      case 'Invite':
        if (daysSinceLastActivity >= 3) {
          recommendations.push({
            type: 'follow_up',
            contact: contact.name,
            action: 'Follow up on invitation',
            priority: 'high',
            reason: `Sent invitation ${daysSinceLastActivity} days ago - time to check in`
          });
        }
        break;
        
      case 'AppointmentSet':
        if (daysSinceLastActivity >= 1) {
          recommendations.push({
            type: 'appointment_reminder',
            contact: contact.name,
            action: 'Confirm appointment',
            priority: 'high',
            reason: 'Appointment set - send reminder and confirm attendance'
          });
        }
        break;
        
      case 'AppointmentSat':
        if (daysSinceLastActivity <= 2) {
          recommendations.push({
            type: 'post_appointment',
            contact: contact.name,
            action: 'Follow up after appointment',
            priority: 'high',
            reason: 'Appointment completed - follow up on their decision'
          });
        } else if (daysSinceLastActivity >= 7) {
          recommendations.push({
            type: 're_engage',
            contact: contact.name,
            action: 'Re-engage contact',
            priority: 'medium',
            reason: 'Appointment completed but no further activity - check their status'
          });
        }
        break;
        
      case 'CustomerSigned':
        // Check if they might be interested in partnership
        const hasPartnerActivity = contact.history.some(h => h.type === 'PartnerSigned');
        if (!hasPartnerActivity) {
          recommendations.push({
            type: 'partner_opportunity',
            contact: contact.name,
            action: 'Discuss partnership opportunity',
            priority: 'medium',
            reason: 'Customer signed - they might be interested in joining your team'
          });
        }
        break;
        
      default:
        if (daysSinceLastActivity >= 14) {
          recommendations.push({
            type: 're_engage',
            contact: contact.name,
            action: 'Re-engage contact',
            priority: 'medium',
            reason: `No activity for ${daysSinceLastActivity} days - time to reconnect`
          });
        }
    }
  });
  
  return recommendations;
}

function generateDailyTasks() {
  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
  const customerCount = metrics.customersSignedCount || 0;
  const partnerType = customerCount < 6 ? 'new' : 'experienced';
  const currentLevel = localStorage.getItem('currentLevel') || 'QD';
  const daysInBusiness = calculateDaysInBusiness();
  
  let tasks = [];
  let suggestions = [];

  // Get personalized contact recommendations
  const contactRecommendations = analyzeContactHistory();
  
  // Add high-priority contact follow-ups to tasks
  const highPriorityFollowUps = contactRecommendations
    .filter(rec => rec.priority === 'high')
    .slice(0, 3); // Limit to top 3 high-priority items
    
  highPriorityFollowUps.forEach(rec => {
    tasks.push(`📞 ${rec.action} with ${rec.contact}`);
  });
  
  // Add medium-priority recommendations to suggestions
  const mediumPriorityFollowUps = contactRecommendations
    .filter(rec => rec.priority === 'medium')
    .slice(0, 2); // Limit to top 2 medium-priority items
    
  mediumPriorityFollowUps.forEach(rec => {
    suggestions.push(`💡 ${rec.action} with ${rec.contact} - ${rec.reason}`);
  });

  if (partnerType === 'new') {
    // Fast Start tasks
    if (daysInBusiness <= 60) {
      if (highPriorityFollowUps.length < 3) {
        tasks.push("Complete 3 conversations today");
      }
      if (metrics.appointmentsSetCount < 10) {
        tasks.push("Book at least 1 supported appointment");
      }
      if (metrics.invitesCount < 20) {
        tasks.push("Update your contact list with 5 new names");
      }
      
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

  // Add general tasks if we have room
  if (tasks.length < 5) {
    tasks.push("Check in with your team members");
    tasks.push("Review your activity log from yesterday");
  }
  
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
  
  let focusTitle = '';
  let focusPoints = [];
  let actionItems = [];

  if (invites >= 5 && appointmentsSet === 0) {
    focusTitle = '🎯 Focus: Convert Invitations to Appointments';
    focusPoints = [
      '📞 Phone calls are more effective than messages',
      '🗣️ Use your scripts for confidence',
      '👥 Ask your mentor for tips'
    ];
    actionItems = [
      'Call 3 contacts who received invitations',
      'Practice your appointment-setting script',
      'Book 1 supported appointment this week'
    ];
  } else if (appointmentsSet > 0 && appointmentsSat === 0) {
    focusTitle = '📅 Focus: Confirm and Attend Appointments';
    focusPoints = [
      '✅ Confirm appointments 24 hours before',
      '📱 Send reminder messages',
      '🎯 Follow up to ensure attendance'
    ];
    actionItems = [
      'Confirm all scheduled appointments',
      'Send reminder messages today',
      'Prepare for your next presentation'
    ];
  } else if (appointmentsSat > 0 && customers === 0) {
    focusTitle = '💼 Focus: Convert Appointments to Customers';
    focusPoints = [
      '🎯 Ask for the sale confidently',
      '👨‍🏫 Have your mentor observe your presentation',
      '📝 Review and improve your approach'
    ];
    actionItems = [
      'Ask your mentor to observe your next presentation',
      'Practice your closing techniques',
      'Review what worked in past appointments'
    ];
  } else if (customers > 0 && partners === 0 && partnerType === 'established') {
    focusTitle = '🤝 Focus: Build Your Team';
    focusPoints = [
      '👥 Look for potential partners among customers',
      '🌟 Share the partner opportunity',
      '📈 Focus on team building'
    ];
    actionItems = [
      'Identify 3 customers who might be interested in partnership',
      'Share the partner opportunity with 1 person',
      'Attend team training sessions'
    ];
  } else if (invites < 3) {
    focusTitle = '📤 Focus: Increase Outreach';
    focusPoints = [
      '📈 Consistent outreach builds momentum',
      '🎯 Quality conversations over quantity',
      '📝 Track all your activities'
    ];
    actionItems = [
      'Send at least 2 more invitations today',
      'Add 5 new contacts to your list',
      'Use the FROGS method to identify prospects'
    ];
  } else {
    focusTitle = '🚀 Focus: Build on Your Success';
    focusPoints = [
      '🎉 You\'re making great progress!',
      '👥 Support your team members',
      '📊 Review your next promotion requirements'
    ];
    actionItems = [
      'Check in with 2 team members',
      'Review your next level requirements',
      'Reflect on what\'s working best for you'
    ];
  }

  // Build the HTML structure
  const focusHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #007bff; margin-bottom: 10px;">${focusTitle}</h2>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h3 style="color: #333; margin-bottom: 10px;">💡 Key Insights</h3>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${focusPoints.map(point => `
          <li style="padding: 8px 0; border-bottom: 1px solid #eee; display: flex; align-items: center;">
            <span style="margin-right: 10px;">${point.split(' ')[0]}</span>
            <span>${point.split(' ').slice(1).join(' ')}</span>
          </li>
        `).join('')}
      </ul>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h3 style="color: #333; margin-bottom: 10px;">✅ Action Items</h3>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${actionItems.map(item => `
          <li style="padding: 8px 0; border-bottom: 1px solid #eee; display: flex; align-items: center;">
            <span style="margin-right: 10px;">🎯</span>
            <span>${item}</span>
          </li>
        `).join('')}
      </ul>
    </div>
    
    <div style="text-align: center; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
      <em style="color: #666; font-size: 0.9rem;">💪 Small daily actions lead to big results!</em>
    </div>
  `;
  
  return focusHTML;
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
      // If the server returns HTML, use it; otherwise, use the new bullet-pointed HTML
      if (data.focus && (data.focus.includes('<div') || data.focus.includes('<ul'))) {
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

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  // Check if this is the first visit
  if (!localStorage.getItem('joinDate')) {
    localStorage.setItem('joinDate', new Date().toISOString());
  }
  
  // Initialize gamification if not exists
  if (!localStorage.getItem('gamification')) {
    const initialGamification = {
      xp: 0,
      level: 1,
      streak: 0,
      achievements: {},
      lastActivityDate: null
    };
    localStorage.setItem('gamification', JSON.stringify(initialGamification));
  }
  
  // Initialize metrics if not exists
  if (!localStorage.getItem('metrics')) {
    const initialMetrics = {
      invitesCount: 0,
      appointmentsSetCount: 0,
      appointmentsSatCount: 0,
      customersSignedCount: 0,
      partnersSignedCount: 0
    };
    localStorage.setItem('metrics', JSON.stringify(initialMetrics));
  }
  
  // Initialize activity log if not exists
  if (!localStorage.getItem('activityLog')) {
    localStorage.setItem('activityLog', JSON.stringify([]));
  }
  
  // Initialize burger menu for mobile navigation
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
  
  // Show onboarding if first time
  if (!localStorage.getItem('onboardingComplete')) {
    showOnboarding();
  } else {
    // Show home tab by default
    switchTab('home');
  }
  
  // Update all displays
  updateDashboard();
  updateGamificationDisplay();
  renderAchievements();
  
  // Update mobile XP display
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  const mobileXpDisplay = document.getElementById('mobileXpDisplay');
  if (mobileXpDisplay) {
    mobileXpDisplay.textContent = `${gamificationData.xp || 0} XP`;
  }
  
  // Load quote of the day
  loadQuoteOfTheDay();
});

function logActivity() {
  const activityType = document.getElementById('activityType').value;
  const notes = document.getElementById('activityNote').value.trim();
  const contactName = document.getElementById('activityContact').value.trim();

  if (!activityType) {
    showNotification('Please select an activity type', 'error');
    return;
  }

  // Get current metrics
  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');

  // Update metrics based on activity type
  switch (activityType) {
    case 'Invite':
      metrics.invitesCount = (metrics.invitesCount || 0) + 1;
      break;
    case 'AppointmentSet':
      metrics.appointmentsSetCount = (metrics.appointmentsSetCount || 0) + 1;
      break;
    case 'AppointmentSat':
      metrics.appointmentsSatCount = (metrics.appointmentsSatCount || 0) + 1;
      break;
    case 'CustomerSigned':
      metrics.customersSignedCount = (metrics.customersSignedCount || 0) + 1;
      break;
    case 'PartnerSigned':
      metrics.partnersSignedCount = (metrics.partnersSignedCount || 0) + 1;
      break;
  }

  // Save updated metrics
  localStorage.setItem('metrics', JSON.stringify(metrics));

  // Create activity object
  const activity = {
    id: Date.now(),
    type: activityType,
    notes: notes,
    contactName: contactName,
    timestamp: new Date().toISOString()
  };

  // Get existing activities
  const activities = JSON.parse(localStorage.getItem('activities') || '[]');
  activities.push(activity);
  localStorage.setItem('activities', JSON.stringify(activities));

  // Add to activity log for gamification
  const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
  activityLog.push(activity);
  localStorage.setItem('activityLog', JSON.stringify(activityLog));

  // Add to contact's history if a contact was specified
  if (contactName && contactName.trim() !== '') {
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const contactIndex = contacts.findIndex(c => c.name === contactName);
    
    if (contactIndex !== -1) {
      // Initialize history array if it doesn't exist
      if (!Array.isArray(contacts[contactIndex].history)) {
        contacts[contactIndex].history = [];
      }
      
      // Add activity to contact's history
      contacts[contactIndex].history.push({
        type: activityType,
        notes: notes,
        timestamp: activity.timestamp
      });
      
      // Save updated contacts
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  // Award XP based on activity type
  const xpRewards = {
    'Invite': 25,
    'AppointmentSet': 50,
    'AppointmentSat': 75,
    'CustomerSigned': 200,
    'PartnerSigned': 300
  };

  const xpEarned = xpRewards[activityType] || 0;
  if (xpEarned > 0) {
    addXP(xpEarned, activityType, notes || `Logged ${activityType.toLowerCase()}`);
  }

  // Clear form but preserve contact if it was intentionally selected
  const activityForm = document.getElementById('activityForm');
  if (activityForm) {
    activityForm.reset();
  }

  // Show success message
  showToast('Activity logged successfully! +XP gained!');

  // Update dashboard
  updateDashboard();

  // Refresh activities display if on log tab
  if (document.getElementById('log').style.display !== 'none') {
    displayActivities();
  }

  // If activity was logged for a specific contact, return to View Contacts tab
  if (contactName && contactName.trim() !== '') {
    // Small delay to ensure the toast message is visible
    setTimeout(() => {
      // Clear the contact selection before switching tabs
      const activityContact = document.getElementById('activityContact');
      if (activityContact) {
        activityContact.value = '';
      }
      localStorage.removeItem('activityContact');
      localStorage.removeItem('contactIntentionallySelected');
      
      switchTab('view');
      // Refresh the contact display to show the new activity
      setTimeout(() => {
        initializeContactView();
      }, 100);
    }, 1500);
  }
}

function displayActivities() {
  const activities = JSON.parse(localStorage.getItem('activities') || '[]');
  const activitiesList = document.getElementById('activitiesList');
  
  if (!activitiesList) return;

  if (activities.length === 0) {
    activitiesList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No activities logged yet. Start tracking your progress!</p>';
    return;
  }

  activitiesList.innerHTML = '';
  
  activities.slice().reverse().forEach(activity => {
    const activityCard = document.createElement('div');
    activityCard.className = 'activity-card';
    
    const date = new Date(activity.timestamp).toLocaleDateString();
    const time = new Date(activity.timestamp).toLocaleTimeString();
    
    activityCard.innerHTML = `
      <div class="activity-header">
        <h3>${activity.type}</h3>
        <span class="activity-date">${date} at ${time}</span>
      </div>
      <div class="activity-details">
        ${activity.contactName ? `<p><strong>Contact:</strong> ${activity.contactName}</p>` : ''}
        ${activity.notes ? `<p><strong>Notes:</strong> ${activity.notes}</p>` : ''}
      </div>
    `;
    
    activitiesList.appendChild(activityCard);
  });
}

function initializeGamification() {
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  if (!gamificationData.xp) {
    gamificationData.xp = 0;
    gamificationData.level = 1;
    gamificationData.streak = 0;
    gamificationData.achievements = {};
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
  
  // Check for achievements immediately
  checkAchievements();
  
  updateGamificationDisplay();
  if (typeof updateDashboard === 'function') updateDashboard();
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
  const existingXP = document.querySelector('.xp-notification');
  if (existingXP) existingXP.remove();
  const notification = document.createElement('div');
  notification.className = 'xp-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4CAF50, #8BC34A);
    color: white;
    padding: 12px 16px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 14px;
    z-index: 10000;
    max-width: 280px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    word-wrap: break-word;
    line-height: 1.4;
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
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 2.5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 2500);
}

function showAchievementUnlocked(achievement) {
  const existingAch = document.querySelector('.progress-celebration');
  if (existingAch) existingAch.remove();
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
  
  // Update level indicator if it exists (desktop)
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
  
  // Update mobile level indicator
  const mobileLevelIndicator = document.getElementById('mobileLevelIndicator');
  if (mobileLevelIndicator) {
    mobileLevelIndicator.innerHTML = `Level ${currentLevel.level} - ${currentLevel.name}`;
  }
  
  // Update gamification tab level indicator
  const gamificationLevelIndicator = document.getElementById('gamificationLevelIndicator');
  if (gamificationLevelIndicator) {
    gamificationLevelIndicator.innerHTML = `
      <div style="position: relative; z-index: 1;">
        <div style="font-size: 1.2rem; margin-bottom: 0.3rem;">Level ${currentLevel.level}</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">${currentLevel.name}</div>
        ${nextLevel ? `<div style="font-size: 0.8rem; margin-top: 0.3rem;">${gamificationData.xp - currentLevel.xpRequired} / ${nextLevel.xpRequired - currentLevel.xpRequired} XP to next level</div>` : ''}
      </div>
    `;
  }
  
  // Update XP bar if it exists (desktop)
  const xpBar = document.getElementById('xpBar');
  if (xpBar && nextLevel) {
    const xpProgress = ((gamificationData.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100;
    xpBar.style.width = `${xpProgress}%`;
  }
  
  // Update mobile XP bar
  const mobileXpBar = document.getElementById('mobileXpBar');
  if (mobileXpBar && nextLevel) {
    const xpProgress = ((gamificationData.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100;
    mobileXpBar.style.width = `${xpProgress}%`;
  }
  
  // Update gamification tab XP bar
  const gamificationXpBar = document.getElementById('gamificationXpBar');
  if (gamificationXpBar && nextLevel) {
    const xpProgress = ((gamificationData.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100;
    gamificationXpBar.style.width = `${xpProgress}%`;
  }
  
  // Update streak counter if it exists (desktop)
  const streakCounter = document.getElementById('streakCounter');
  if (streakCounter) {
    streakCounter.innerHTML = `
      <span class="streak-icon">🔥</span>
      <span>${gamificationData.streak || 0} Day Streak</span>
    `;
  }
  
  // Update mobile streak counter
  const mobileStreakCounter = document.getElementById('mobileStreakCounter');
  if (mobileStreakCounter) {
    mobileStreakCounter.innerHTML = `
      <span class="streak-icon">🔥</span>
      <span>${gamificationData.streak || 0} Day Streak</span>
    `;
  }
  
  // Update gamification tab streak counter
  const gamificationStreakCounter = document.getElementById('gamificationStreakCounter');
  if (gamificationStreakCounter) {
    gamificationStreakCounter.innerHTML = `
      <span class="streak-icon">🔥</span>
      <span>${gamificationData.streak || 0} Day Streak</span>
    `;
  }
}

// Add gamification to activity logging
function logActivityWithGamification(actionType, notes = '', contactName = '') {
  const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
  const newActivity = {
    id: Date.now(),
    type: actionType,
    notes: notes,
    contactName: contactName,
    timestamp: new Date().toISOString()
  };
  activityLog.unshift(newActivity);
  localStorage.setItem('activityLog', JSON.stringify(activityLog));

  // --- Add to contact's history array if contactName is provided ---
  if (contactName) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const contact = contacts.find(c => c.name === contactName);
    if (contact) {
      if (!Array.isArray(contact.history)) contact.history = [];
      contact.history.push({
        type: actionType,
        notes: notes,
        timestamp: newActivity.timestamp
      });
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  updateMetrics(actionType);
  let xpGained = 0;
  let reason = '';
  switch (actionType) {
    case 'Invite': xpGained = 25; reason = 'Sent invitation'; break;
    case 'AppointmentSet': xpGained = 50; reason = 'Set appointment'; break;
    case 'AppointmentSat': xpGained = 75; reason = 'Sat appointment'; break;
    case 'CustomerSigned': xpGained = 200; reason = 'Signed customer'; break;
    case 'PartnerSigned': xpGained = 300; reason = 'Signed partner'; break;
  }
  if (xpGained > 0) addXP(xpGained, reason);
  checkAchievements();
  renderActivityLog();
  updateDashboard();
}

function renderLevelProgression() {
  const levelProgressionGrid = document.getElementById('levelProgressionGrid');
  if (!levelProgressionGrid) return;
  
  const gamificationData = JSON.parse(localStorage.getItem('gamification') || '{}');
  const currentLevel = gamificationData.level || 1;
  
  levelProgressionGrid.innerHTML = '';
  
  levels.forEach(level => {
    const levelItem = document.createElement('div');
    const isCurrent = level.level === currentLevel;
    const isCompleted = level.level < currentLevel;
    
    levelItem.className = `level-progression-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`;
    
    const levelIcon = isCompleted ? '✅' : isCurrent ? '🎯' : '🔒';
    
    levelItem.innerHTML = `
      <div class="level-info">
        <div class="level-icon">${levelIcon}</div>
        <div class="level-details">
          <h4>Level ${level.level} - ${level.name}</h4>
          <p>${level.xpRequired} XP Required</p>
        </div>
      </div>
      <div class="level-xp">
        ${isCompleted ? 'Completed' : isCurrent ? 'Current' : `${level.xpRequired} XP`}
      </div>
    `;
    
    levelProgressionGrid.appendChild(levelItem);
  });
}

function renderRecentActivity() {
  const recentActivityLog = document.getElementById('recentActivityLog');
  if (!recentActivityLog) return;
  
  const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
  const recentActivities = activityLog.slice(0, 10); // Show last 10 activities
  
  recentActivityLog.innerHTML = '';
  
  if (recentActivities.length === 0) {
    recentActivityLog.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No recent activity. Start logging your actions to see them here!</p>';
    return;
  }
  
  recentActivities.forEach(activity => {
    const activityItem = document.createElement('div');
    activityItem.className = 'recent-activity-item';
    
    const activityIcons = {
      'Invite': '📤',
      'AppointmentSet': '📅',
      'AppointmentSat': '✅',
      'CustomerSigned': '🎉',
      'PartnerSigned': '🤝'
    };
    
    const xpRewards = {
      'Invite': 25,
      'AppointmentSet': 50,
      'AppointmentSat': 75,
      'CustomerSigned': 200,
      'PartnerSigned': 300
    };
    
    const icon = activityIcons[activity.type] || '📝';
    const xp = xpRewards[activity.type] || 0;
    const date = new Date(activity.timestamp).toLocaleDateString();
    
    activityItem.innerHTML = `
      <div class="activity-info">
        <div class="activity-icon">${icon}</div>
        <div class="activity-details">
          <h4>${activity.type.replace(/([A-Z])/g, ' $1').trim()}</h4>
          <p>${date}${activity.notes ? ` - ${activity.notes}` : ''}</p>
        </div>
      </div>
      <div class="activity-xp">+${xp} XP</div>
    `;
    
    recentActivityLog.appendChild(activityItem);
  });
}

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

function showOnboarding() {
  // Implementation of showOnboarding function
}

function showNotification(message, type) {
  console.log('[showNotification]', { message, type, stack: new Error().stack });
  // Create notification element
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) existingNotification.remove();
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 8px 12px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    font-size: 13px;
    z-index: 10000;
    max-width: 250px;
    height: auto;
    min-height: 0;
    max-height: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    word-wrap: break-word;
    line-height: 1.3;
    white-space: normal;
    overflow: visible;
  `;
  
  // Set background color based on type
  if (type === 'success') {
    notification.style.backgroundColor = '#4CAF50';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#f44336';
  } else {
    notification.style.backgroundColor = '#2196F3';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 2.5 seconds (for debugging)
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 2500);
}

function showToast(message) {
  // Create toast element
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    background: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: transform 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 100);
  // Remove after 2 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 2000);
}

// Accordion setup for mobile dashboard
function setupDashboardAccordion() {
  document.querySelectorAll('.dashboard-accordion .accordion-header').forEach(header => {
    header.onclick = function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      // Collapse all
      document.querySelectorAll('.dashboard-accordion .accordion-header').forEach(h => {
        h.setAttribute('aria-expanded', 'false');
        if (h.nextElementSibling) h.nextElementSibling.style.display = 'none';
      });
      // Expand clicked if it was not already open
      if (!expanded) {
        this.setAttribute('aria-expanded', 'true');
        if (this.nextElementSibling) this.nextElementSibling.style.display = 'block';
      }
    };
  });
  // Optionally, expand the first section by default
  const firstHeader = document.querySelector('.dashboard-accordion .accordion-header');
  if (firstHeader) {
    firstHeader.setAttribute('aria-expanded', 'true');
    if (firstHeader.nextElementSibling) firstHeader.nextElementSibling.style.display = 'block';
  }
}