// Initialize AppData
const AppData = {
  contacts: JSON.parse(localStorage.getItem('contacts')) || [],
  outreachLog: JSON.parse(localStorage.getItem('outreachLog')) || [],
  activeContact: null
};

// Save data to localStorage
function saveData() {
  localStorage.setItem('contacts', JSON.stringify(AppData.contacts));
  localStorage.setItem('outreachLog', JSON.stringify(AppData.outreachLog));
}

// Add contact
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const category = document.getElementById('category').value;
  const notes = document.getElementById('notes').value.trim();

  if (name) {
    AppData.contacts.push({ name, category, notes });
    saveData();
    document.getElementById('contactForm').reset();
    alert('Contact saved!');
  }
});

// Render contact list
window.renderContacts = function () {
  const list = document.getElementById('contact-list');
  list.innerHTML = '';

  AppData.contacts.forEach((contact, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${contact.name}</strong> (${contact.category})<br/>
      <em>${contact.notes || 'No notes'}</em><br/>
      <button onclick="sendMessageToContact(${index})">📩 Send Message</button>
    `;
    list.appendChild(li);
  });
};

// Send Message action
function sendMessageToContact(index) {
  AppData.activeContact = AppData.contacts[index];
  switchTab('log');
  setTimeout(() => {
    document.getElementById('outreachNote').value = `Message to ${AppData.activeContact.name}`;
    document.getElementById('outreachType').value = 'Message';
  }, 100);
}

// Outreach form logging
document.getElementById('outreachForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const type = document.getElementById('outreachType').value;
  const note = document.getElementById('outreachNote').value.trim();
  const timestamp = new Date().toLocaleString();
  const name = AppData.activeContact?.name || 'Unknown';

  const log = { name, type, note, timestamp };
  AppData.outreachLog.push(log);
  saveData();
  renderOutreachLog();
  alert('Outreach logged!');
  document.getElementById('outreachForm').reset();
});

// Render outreach log
function renderOutreachLog() {
  const logDiv = document.getElementById('outreachLog');
  logDiv.innerHTML = '';

  if (AppData.outreachLog.length === 0) {
    logDiv.innerHTML = '<p>No outreach actions logged yet.</p>';
    return;
  }

  const ul = document.createElement('ul');
  AppData.outreachLog.slice().reverse().forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${entry.name}</strong> - ${entry.type} - ${entry.timestamp}<br/>
      <em>${entry.note || 'No notes'}</em>
    `;
    ul.appendChild(li);
  });

  logDiv.appendChild(ul);
}
window.renderOutreachLog = renderOutreachLog;

// Fast Start Widget
window.renderFastStartWidget = function () {
  const total = AppData.contacts.length;
  const goal = 100;
  const percent = Math.min(100, Math.round((total / goal) * 100));
  const html = `
    <h3>Fast Start Tracker</h3>
    <div style="border: 1px solid #ccc; border-radius: 6px; padding: 10px;">
      <div style="font-weight: bold;">${total} of ${goal} contacts added</div>
      <div style="background: #eee; border-radius: 4px; height: 20px; margin-top: 5px;">
        <div style="width: ${percent}%; background: #9b0f63; height: 100%; border-radius: 4px;"></div>
      </div>
      <div style="margin-top: 5px;">${percent}% complete</div>
    </div>
  `;
  document.getElementById('fastStartProgress').innerHTML = html;
};

// Total Contact Count
window.updateTotalContactsCount = function () {
  document.getElementById('totalContacts').textContent = AppData.contacts.length;
};

// Initial tab rendering
document.addEventListener('DOMContentLoaded', () => {
  const activeTab = document.querySelector('.tab:not([style*="display: none"])');
  if (activeTab && activeTab.id === 'view' && window.renderContacts) {
    window.renderContacts();
  }
});
