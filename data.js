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

// Update dashboard display
function updateDashboard() {
  const metrics = JSON.parse(localStorage.getItem('metrics') || '{}');
  const joinDate = localStorage.getItem('joinDate');
  
  // Update metric displays
  document.getElementById('invitesCount').textContent = metrics.invitesCount || 0;
  document.getElementById('appointmentsSetCount').textContent = metrics.appointmentsSetCount || 0;
  document.getElementById('appointmentsSatCount').textContent = metrics.appointmentsSatCount || 0;
  document.getElementById('customersSignedCount').textContent = metrics.customersSignedCount || 0;
  document.getElementById('partnersSignedCount').textContent = metrics.partnersSignedCount || 0;

  // Update Fast Start progress
  const customerProgress = (metrics.customersSignedCount || 0) / 6 * 100;
  const partnerProgress = (metrics.partnersSignedCount || 0) / 1 * 100;
  
  document.getElementById('customerProgress').textContent = `${metrics.customersSignedCount || 0}/6`;
  document.getElementById('partnerProgress').textContent = `${metrics.partnersSignedCount || 0}/1`;
  document.getElementById('customerProgressBar').style.width = `${customerProgress}%`;
  document.getElementById('partnerProgressBar').style.width = `${partnerProgress}%`;

  // Update time tracking
  if (joinDate) {
    const startDate = new Date(joinDate);
    const today = new Date();
    const dayCount = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 30 - dayCount);
    
    document.getElementById('dayCount').textContent = dayCount;
    document.getElementById('daysRemaining').textContent = daysRemaining;
  }

  // Update motivational message
  updateMotivationalMessage(metrics);
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