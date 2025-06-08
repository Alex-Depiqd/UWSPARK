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

loadAppData();