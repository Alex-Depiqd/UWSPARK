// data.js

let AppData = {
  contacts: [],
  stats: {
    contactsAdded: 0,
    messagesSent: 0,
    appointmentsBooked: 0,
    appointmentsSat: 0,
    customers: 0,
    partners: 0,
    fastStartDate: null
  }
};

function loadAppData() {
  const stored = localStorage.getItem('stella-app');
  if (stored) {
    try {
      AppData = JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored app data', e);
    }
  }
}

function saveAppData() {
  localStorage.setItem('stella-app', JSON.stringify(AppData));
}

function addContact(name, category, notes = '') {
  const newContact = {
    id: crypto.randomUUID(),
    name,
    category,
    notes,
    status: 'New'
  };
  AppData.contacts.push(newContact);
  AppData.stats.contactsAdded = AppData.contacts.length;
  saveAppData();
  return newContact;
}

function getStatsSummary() {
  return { ...AppData.stats };
}

function getFastStartProgress() {
  if (!AppData.stats.fastStartDate) {
    return {
      customers: AppData.stats.customers,
      partners: AppData.stats.partners,
      daysRemaining: 'N/A'
    };
  }
  const startDate = new Date(AppData.stats.fastStartDate);
  const now = new Date();
  const elapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, 60 - elapsed);
  return {
    customers: AppData.stats.customers,
    partners: AppData.stats.partners,
    daysRemaining
  };
}

// Initialize metrics in localStorage if not present
function initializeMetrics() {
  const metrics = {
    invitesCount: 0,
    appointmentsSetCount: 0,
    appointmentsSatCount: 0,
    customersSignedCount: 0,
    partnersSignedCount: 0,
    dayCount: 0,
    daysRemaining: 30
  };

  if (!localStorage.getItem('metrics')) {
    localStorage.setItem('metrics', JSON.stringify(metrics));
  }
}

// Update metrics based on action type
function updateMetrics(actionType) {
  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
  
  switch(actionType) {
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

  localStorage.setItem('metrics', JSON.stringify(metrics));
  updateDashboard();
}

// Generate daily tasks and suggestions (moved from app.js)
function generateDailyTasks() {
  const partnerType = localStorage.getItem('partnerType') || 'new';
  const currentLevel = localStorage.getItem('currentLevel') || 'QD';
  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
  const joinDate = localStorage.getItem('joinDate');
  let daysInBusiness = 0;
  if (joinDate) {
    const startDate = new Date(joinDate);
    const today = new Date();
    daysInBusiness = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));
  }

  let tasks = [];
  let suggestions = [];

  if (partnerType === 'new') {
    // Fast Start tasks
    if (daysInBusiness <= 60) {
      tasks.push("Complete 3 conversations today");
      tasks.push("Book at least 1 supported appointment");
      tasks.push("Update your contact list with 5 new names");
      if ((metrics.appointmentsSetCount || 0) < 10) {
        suggestions.push("Focus on booking supported appointments - aim for 10 in your first 2 weeks");
      }
      if ((metrics.customersSignedCount || 0) < 3) {
        suggestions.push("Practice your customer presentation with your mentor");
      }
    }
  } else {
    // Experienced partner tasks
    // (You can expand this logic with your level structure if needed)
    if ((metrics.customersSignedCount || 0) < 10) {
      tasks.push(`Find ${10 - (metrics.customersSignedCount || 0)} more customers to reach your next milestone`);
    }
    if ((metrics.partnersSignedCount || 0) < 2) {
      tasks.push(`Support your team to sign ${2 - (metrics.partnersSignedCount || 0)} more partners`);
    }
    if ((metrics.appointmentsSetCount || 0) < 3) {
      suggestions.push("Focus on setting appointments with your warm contacts");
    }
    if ((metrics.partnersSignedCount || 0) < 1) {
      suggestions.push("Look for potential partners among your customers");
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

// Update dashboard display
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

  // Ensure dashboard accordion is initialized after updates
  if (typeof setupDashboardAccordion === 'function') {
    setupDashboardAccordion();
  }
}

// Generate motivational message based on progress
function updateMotivationalMessage(metrics) {
  const messages = [
    "Keep going! Every invitation is a step closer to your goals.",
    "You're making progress! Focus on setting those appointments.",
    "Great work on the appointments! Now let's convert them to customers.",
    "Amazing job on the customers! Let's find your first partner!",
    "You're crushing it! Keep up the momentum!"
  ];

  let messageIndex = 0;
  if (metrics.customersSignedCount >= 6 && metrics.partnersSignedCount >= 1) {
    messageIndex = 4;
  } else if (metrics.customersSignedCount >= 3) {
    messageIndex = 3;
  } else if (metrics.appointmentsSatCount >= 3) {
    messageIndex = 2;
  } else if (metrics.appointmentsSetCount >= 3) {
    messageIndex = 1;
  }

  document.getElementById('motivationalMessage').textContent = messages[messageIndex];
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
  initializeMetrics();
  updateDashboard();
});

loadAppData();