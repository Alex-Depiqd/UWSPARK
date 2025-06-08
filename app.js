// Unified and refactored app.js using AppData as the single source of truth

function updateTotalContactsCount() {
  document.getElementById('totalContacts').innerText = AppData.contacts.length;
}

function renderContacts() {
  const list = document.getElementById('contact-list');
  list.innerHTML = '';
  AppData.contacts.forEach((contact, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${contact.name}</strong> (${contact.category}) - ${contact.notes || ''}
      <button onclick="logOutreachFromContact('${contact.name}')">Send Message</button>
      <button onclick="deleteContact(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function logOutreachFromContact(name) {
  switchTab('log');
  document.getElementById('outreachNote').value = `Message sent to ${name}`;
  document.getElementById('outreachType').value = 'Message';

  const now = new Date().toLocaleString();
  AppData.stats.messagesSent += 1;
  if (!AppData.outreachLog) AppData.outreachLog = [];
  AppData.outreachLog.push({ date: now, type: 'Message', note: `Sent to ${name}` });
  saveAppData();
  renderOutreachLog();
}

function deleteContact(index) {
  if (confirm("Are you sure you want to delete this contact?")) {
    AppData.contacts.splice(index, 1);
    AppData.stats.contactsAdded = AppData.contacts.length;
    saveAppData();
    renderContacts();
    updateTotalContactsCount();
    renderFastStartWidget();
  }
}

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const category = document.getElementById('category').value;
  const notes = document.getElementById('notes').value.trim();
  if (!name) return alert('Please enter a name');
  addContact(name, category, notes);
  this.reset();
  updateTotalContactsCount();
  renderContacts();
  renderFastStartWidget();
  switchTab('view');
});

function renderOutreachLog() {
  const logContainer = document.getElementById('outreachLog');
  logContainer.innerHTML = '';
  const log = AppData.outreachLog || [];
  log.forEach(entry => {
    const div = document.createElement('div');
    div.textContent = `${entry.date} - ${entry.type}: ${entry.note}`;
    logContainer.appendChild(div);
  });
}

document.getElementById('outreachForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const type = document.getElementById('outreachType').value;
  const note = document.getElementById('outreachNote').value.trim();
  const date = new Date().toLocaleString();
  AppData.outreachLog = AppData.outreachLog || [];
  AppData.outreachLog.push({ date, type, note });
  AppData.stats.messagesSent += 1;
  saveAppData();
  this.reset();
  renderOutreachLog();
  renderFastStartWidget();
});

function renderFastStartWidget() {
  const fastStartBox = document.getElementById('fastStartProgress');
  if (!fastStartBox) return;

  if (!AppData.stats.fastStartDate) {
    AppData.stats.fastStartDate = new Date().toISOString();
    saveAppData();
  }

  const fastStartStart = new Date(AppData.stats.fastStartDate);
  const now = new Date();
  const elapsed = Math.floor((now - fastStartStart) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, 30 - elapsed);
  const targetContacts = 20;
  const added = AppData.contacts.length;
  const complete = added >= targetContacts;

  fastStartBox.innerHTML = `
    <h3>🎯 Fast Start Tracker</h3>
    <p>📅 Day: ${elapsed + 1} of 30</p>
    <p>🧑‍💼 Contacts Added: ${added} / ${targetContacts}</p>
    <p>⏳ Days Remaining: ${daysLeft}</p>
    <p>${complete ? '✅ Fast Start goal achieved!' : '🚀 Keep going!'}</p>
  `;
}

function renderStatsSummary() {
  const statsBox = document.getElementById('stats');
  if (!statsBox) return;
  const stats = getStatsSummary();
  statsBox.innerHTML = `
    <h3>📈 Your Stats</h3>
    <p>Contacts Added: ${stats.contactsAdded}</p>
    <p>Messages Sent: ${stats.messagesSent}</p>
    <p>Appointments Booked: ${stats.appointmentsBooked}</p>
    <p>Appointments Sat: ${stats.appointmentsSat}</p>
    <p>Customers Signed: ${stats.customers}</p>
    <p>Partners Signed: ${stats.partners}</p>
  `;
}

window.updateTotalContactsCount = updateTotalContactsCount;
window.renderContacts = renderContacts;
window.renderFastStartWidget = renderFastStartWidget;
window.renderOutreachLog = renderOutreachLog;
window.renderStatsSummary = renderStatsSummary;
