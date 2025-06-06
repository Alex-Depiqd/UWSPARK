// app.js - Core logic for contact management, Fast Start, and Outreach Log

function renderContacts() {
  const contactList = document.getElementById('contact-list');
  const contacts = AppData.contacts;
  contactList.innerHTML = '';

  if (contacts.length === 0) {
    contactList.innerHTML = '<p>No contacts found.</p>';
    updateTotalContactsCount();
    return;
  }

  contacts.forEach((contact, index) => {
    const div = document.createElement('div');
    div.className = 'contact-block';

    const name = document.createElement('h3');
    name.textContent = contact.name;

    const category = document.createElement('p');
    category.textContent = `Category: ${contact.category}`;

    const notes = document.createElement('p');
    notes.textContent = `Notes: ${contact.notes}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => {
      if (confirm(`Are you sure you want to delete ${contact.name}?`)) {
        AppData.contacts.splice(index, 1);
        AppData.stats.contactsAdded = AppData.contacts.length;
        saveAppData();
        renderContacts();
      }
    };

    div.appendChild(name);
    div.appendChild(category);
    div.appendChild(notes);
    div.appendChild(deleteBtn);
    contactList.appendChild(div);
  });

  updateTotalContactsCount();
}

function updateTotalContactsCount() {
  const countSpan = document.getElementById('totalContacts');
  if (countSpan) countSpan.textContent = AppData.contacts.length.toString();
}

function renderFastStartWidget() {
  const stats = AppData.stats || {};
  const fsContainer = document.getElementById('fastStartProgress');
  if (!fsContainer) return;

  fsContainer.innerHTML = '';

  if (!stats.fastStartDate) {
    fsContainer.innerHTML = `
      <p><strong>Fast Start not started yet.</strong></p>
      <p>Click below to start your 30-day tracker.</p>
      <button id="startFastStart">Start Fast Start</button>
    `;
    document.getElementById('startFastStart').onclick = () => {
      AppData.stats.fastStartDate = new Date().toISOString();
      saveAppData();
      renderFastStartWidget();
    };
    return;
  }

  const startDate = new Date(stats.fastStartDate);
  const now = new Date();
  const elapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, 30 - elapsed);

  fsContainer.innerHTML = `
    <h3>🚀 Fast Start Progress</h3>
    <p><strong>Customers:</strong> ${stats.customers}</p>
    <p><strong>Partners:</strong> ${stats.partners}</p>
    <p><strong>Days Remaining:</strong> ${daysRemaining} of 30</p>
    <button id="addCustomer">➕ Add Customer</button>
    <button id="addPartner">➕ Add Partner</button>
  `;

  document.getElementById('addCustomer').onclick = () => {
    AppData.stats.customers += 1;
    saveAppData();
    renderFastStartWidget();
  };

  document.getElementById('addPartner').onclick = () => {
    AppData.stats.partners += 1;
    saveAppData();
    renderFastStartWidget();
  };
}

function renderOutreachLog() {
  const logContainer = document.getElementById('outreachLog');
  const log = AppData.stats.outreachLog || [];
  if (!logContainer) return;

  if (log.length === 0) {
    logContainer.innerHTML = '<p>No outreach logged yet.</p>';
    return;
  }

  logContainer.innerHTML = '<ul>' + log.map(entry => `
    <li><strong>${entry.type}</strong> — ${entry.note || 'No note'} <em>(${new Date(entry.timestamp).toLocaleString()})</em></li>
  `).reverse().join('') + '</ul>';
}

function setupOutreachForm() {
  const form = document.getElementById('outreachForm');
  if (!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const type = document.getElementById('outreachType').value;
    const note = document.getElementById('outreachNote').value.trim();
    const newEntry = {
      type,
      note,
      timestamp: new Date().toISOString()
    };

    AppData.stats.outreachLog = AppData.stats.outreachLog || [];
    AppData.stats.outreachLog.push(newEntry);
    saveAppData();
    form.reset();
    renderOutreachLog();
  };
}

window.renderContacts = renderContacts;
window.updateTotalContactsCount = updateTotalContactsCount;
window.renderFastStartWidget = renderFastStartWidget;
window.renderOutreachLog = renderOutreachLog;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof loadAppData === 'function') loadAppData();
  renderContacts();
  updateTotalContactsCount();
  renderFastStartWidget();
  renderOutreachLog();
  setupOutreachForm();
});
