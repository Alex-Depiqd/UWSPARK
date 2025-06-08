let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
let outreachLog = JSON.parse(localStorage.getItem('outreachLog')) || [];

function saveContacts() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

function saveOutreachLog() {
  localStorage.setItem('outreachLog', JSON.stringify(outreachLog));
}

function updateTotalContactsCount() {
  document.getElementById('totalContacts').innerText = contacts.length;
}

function renderContacts() {
  const list = document.getElementById('contact-list');
  list.innerHTML = '';
  contacts.forEach((contact, index) => {
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
  outreachLog.push({ date: now, type: 'Message', note: `Sent to ${name}` });
  saveOutreachLog();
  renderOutreachLog();
}

function deleteContact(index) {
  if (confirm("Are you sure you want to delete this contact?")) {
    contacts.splice(index, 1);
    saveContacts();
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
  contacts.push({ name, category, notes });
  saveContacts();
  this.reset();
  updateTotalContactsCount();
  renderContacts();
  renderFastStartWidget();
  switchTab('view');
});

function renderOutreachLog() {
  const logContainer = document.getElementById('outreachLog');
  logContainer.innerHTML = '';
  outreachLog.forEach(entry => {
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
  outreachLog.push({ date, type, note });
  saveOutreachLog();
  this.reset();
  renderOutreachLog();
  renderFastStartWidget();
});

function renderFastStartWidget() {
  const fastStartBox = document.getElementById('fastStartProgress');
  if (!fastStartBox) return;

  const fastStartStart = new Date(localStorage.getItem('fastStartStart') || new Date());
  const now = new Date();
  const elapsed = Math.floor((now - fastStartStart) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, 30 - elapsed);
  const targetContacts = 20;
  const added = contacts.length;
  const complete = added >= targetContacts;

  fastStartBox.innerHTML = `
    <h3>🎯 Fast Start Tracker</h3>
    <p>📅 Day: ${elapsed + 1} of 30</p>
    <p>🧑‍💼 Contacts Added: ${added} / ${targetContacts}</p>
    <p>⏳ Days Remaining: ${daysLeft}</p>
    <p>${complete ? '✅ Fast Start goal achieved!' : '🚀 Keep going!'}</p>
  `;

  localStorage.setItem('fastStartStart', fastStartStart.toISOString());
}

window.updateTotalContactsCount = updateTotalContactsCount;
window.renderContacts = renderContacts;
window.renderFastStartWidget = renderFastStartWidget;
window.renderOutreachLog = renderOutreachLog;
