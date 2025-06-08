// app.js

let AppData = JSON.parse(localStorage.getItem('appData')) || {
  contacts: [],
  stats: {
    trackerLog: [],
    invitesSent: 0,
    followUps: 0,
    signedUp: 0,
    appointmentsBooked: 0,
  }
};

function saveAppData() {
  localStorage.setItem('appData', JSON.stringify(AppData));
}

function addContact(name, category, phone, email, notes) {
  AppData.contacts.push({ name, category, phone, email, notes });
  saveAppData();
  showToast('Contact saved successfully!');
}

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const category = document.getElementById('category').value;
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const notes = document.getElementById('notes').value.trim();
  if (name) {
    addContact(name, category, phone, email, notes);
    this.reset();
    renderContacts();
    renderFastStartWidget();
  }
});

function renderContacts() {
  const list = document.getElementById('contact-list');
  list.innerHTML = '';
  AppData.contacts.forEach((contact, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${contact.name}</strong> (${contact.category})<br />
      Phone: ${contact.phone || '—'}<br />
      Email: ${contact.email || '—'}<br />
      Notes: ${contact.notes || '—'}<br />
      <button onclick="openEditModal(${index})">Edit</button>
      <button onclick="startMessage(${index})">Send Message</button>`;
    if (contact.booked) {
      li.style.backgroundColor = '#e6ffec';
      li.innerHTML += `<div><strong>📅 Appointment Booked</strong></div>`;
    }
    list.appendChild(li);
  });
}

function openEditModal(index) {
  const contact = AppData.contacts[index];
  document.getElementById('editIndex').value = index;
  document.getElementById('editName').value = contact.name;
  document.getElementById('editCategory').value = contact.category;
  document.getElementById('editPhone').value = contact.phone;
  document.getElementById('editEmail').value = contact.email;
  document.getElementById('editNotes').value = contact.notes;
  document.getElementById('editModal').style.display = 'block';
}

function saveEditContact() {
  const index = document.getElementById('editIndex').value;
  AppData.contacts[index] = {
    ...AppData.contacts[index],
    name: document.getElementById('editName').value.trim(),
    category: document.getElementById('editCategory').value,
    phone: document.getElementById('editPhone').value.trim(),
    email: document.getElementById('editEmail').value.trim(),
    notes: document.getElementById('editNotes').value.trim()
  };
  saveAppData();
  closeEditModal();
  renderContacts();
  showToast('Contact updated successfully!');
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

document.getElementById('trackerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const type = document.getElementById('trackerType').value;
  const note = document.getElementById('trackerNote').value.trim();
  const date = new Date().toISOString();

  AppData.stats.trackerLog.push({ date, type, note });

  if (type === 'Invite') AppData.stats.invitesSent++;
  if (type === 'Follow-Up') AppData.stats.followUps++;
  if (type === 'Signed') AppData.stats.signedUp++;
  if (type === 'Booked') {
    AppData.stats.appointmentsBooked++;
    const matched = AppData.contacts.find(c => note.includes(c.name));
    if (matched) matched.booked = true;
  }

  saveAppData();
  renderFastStartWidget();
  renderTrackerLog();
  renderContacts();
  this.reset();
  showToast('Action logged successfully!');
});

function renderTrackerLog() {
  const log = document.getElementById('trackerLog');
  log.innerHTML = '';
  AppData.stats.trackerLog.forEach(entry => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${entry.type}</strong> — ${new Date(entry.date).toLocaleString()}<br />${entry.note || ''}<hr />`;
    log.appendChild(div);
  });
}

function renderFastStartWidget() {
  const box = document.getElementById('fastStartProgress');
  const total = AppData.contacts.length;
  const invites = AppData.stats.invitesSent || 0;
  const followUps = AppData.stats.followUps || 0;
  const booked = AppData.stats.appointmentsBooked || 0;
  const signed = AppData.stats.signedUp || 0;

  box.innerHTML = `
    <h3>🚀 Fast Start Tracker</h3>
    <p>👥 Contacts Added: ${total}</p>
    <p>📩 Invites Sent: ${invites}</p>
    <p>🔁 Follow-Ups: ${followUps}</p>
    <p>📅 Appointments Booked: ${booked}</p>
    <p>✅ Signed Up: ${signed}</p>
  `;
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

window.renderContacts = renderContacts;
window.renderFastStartWidget = renderFastStartWidget;
window.renderTrackerLog = renderTrackerLog;
