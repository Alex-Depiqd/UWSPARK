// app.js

const AppData = {
  contacts: JSON.parse(localStorage.getItem('contacts') || '[]'),
  outreachLog: JSON.parse(localStorage.getItem('outreachLog') || '[]'),
  activeContact: null
};

function saveContacts() {
  localStorage.setItem('contacts', JSON.stringify(AppData.contacts));
}

function saveOutreachLog() {
  localStorage.setItem('outreachLog', JSON.stringify(AppData.outreachLog));
}

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const notes = document.getElementById('notes').value;

  AppData.contacts.push({ name, category, notes });
  saveContacts();
  this.reset();
  alert('Contact saved!');
});

function renderContacts() {
  const list = document.getElementById('contact-list');
  list.innerHTML = '';

  AppData.contacts.forEach((contact, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${contact.name}</strong> - ${contact.category}<br />
      <em>${contact.notes || ''}</em><br />
      <button onclick="sendMessageToContact(${index})">📩 Send Message</button>
      <button onclick="removeContact(${index})">❌ Remove</button>
    `;
    list.appendChild(li);
  });
}

function removeContact(index) {
  if (confirm('Are you sure you want to delete this contact?')) {
    AppData.contacts.splice(index, 1);
    saveContacts();
    renderContacts();
    updateTotalContactsCount();
  }
}

function sendMessageToContact(index) {
  AppData.activeContact = AppData.contacts[index];
  switchTab('log');
  setTimeout(() => {
    document.getElementById('outreachNote').value = `Message to ${AppData.activeContact.name}`;
    document.getElementById('outreachType').value = 'Message';
  }, 200);
}

function updateTotalContactsCount() {
  document.getElementById('totalContacts').textContent = AppData.contacts.length;
}

document.getElementById('outreachForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const type = document.getElementById('outreachType').value;
  const note = document.getElementById('outreachNote').value;
  const timestamp = new Date().toLocaleString();

  const entry = {
    type,
    note,
    timestamp,
    contact: AppData.activeContact ? AppData.activeContact.name : 'Unknown'
  };

  AppData.outreachLog.push(entry);
  saveOutreachLog();
  this.reset();
  AppData.activeContact = null;
  renderOutreachLog();
  alert('Outreach logged!');
});

function renderOutreachLog() {
  const container = document.getElementById('outreachLog');
  container.innerHTML = '';

  AppData.outreachLog.forEach(entry => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${entry.type}</strong> with <em>${entry.contact}</em><br />
      ${entry.note}<br />
      <small>${entry.timestamp}</small>
      <hr />
    `;
    container.appendChild(div);
  });
}

function renderFastStartWidget() {
  const target = 30;
  const progress = AppData.outreachLog.length;
  const percentage = Math.min(100, Math.round((progress / target) * 100));
  const container = document.getElementById('fastStartProgress');
  container.innerHTML = `
    <h3>🚀 Fast Start Progress</h3>
    <div style="background:#ddd; border-radius:6px; overflow:hidden;">
      <div style="width:${percentage}%; background:#9b0f63; color:white; padding:4px;">${progress} / ${target}</div>
    </div>
    <p>${target - progress} actions to go!</p>
  `;
}

window.renderContacts = renderContacts;
window.updateTotalContactsCount = updateTotalContactsCount;
window.renderFastStartWidget = renderFastStartWidget;
window.renderOutreachLog = renderOutreachLog;
