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

  // Calculate and display Invite to Customer Ratio
  const invites = metrics.invitesCount || 0;
  const customers = metrics.customersSignedCount || 0;
  let ratioDisplay = '—';
  if (invites > 0) {
    const ratio = customers / invites;
    ratioDisplay = (ratio * 100).toFixed(1) + '%'; // Show as percentage
  }
  document.getElementById('inviteCustomerRatio').textContent = ratioDisplay;

  // --- AI Coach Section ---
  // Remove existing AI Coach card if present
  const oldCoach = document.getElementById('aiCoachCard');
  if (oldCoach) oldCoach.remove();

  // Find where to insert (after first .metric-card)
  const dashboardSection = document.querySelector('#dashboard .dashboard-grid');
  if (dashboardSection) {
    const aiCoachCard = document.createElement('div');
    aiCoachCard.className = 'metric-card';
    aiCoachCard.id = 'aiCoachCard';
    aiCoachCard.innerHTML = `
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
    // Insert after the first metric-card
    const firstCard = dashboardSection.querySelector('.metric-card');
    if (firstCard && firstCard.nextSibling) {
      dashboardSection.insertBefore(aiCoachCard, firstCard.nextSibling);
    } else {
      dashboardSection.appendChild(aiCoachCard);
    }
    // Populate tasks and suggestions
    const { tasks, suggestions } = generateDailyTasks();
    const tasksList = aiCoachCard.querySelector('#dailyTasks');
    const suggestionsList = aiCoachCard.querySelector('#coachSuggestions');
    tasksList.innerHTML = '';
    suggestionsList.innerHTML = '';
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