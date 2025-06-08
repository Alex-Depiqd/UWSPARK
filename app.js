// Updated app.js with Appointments Booked tracking and Fast Start stat

if (AppData.stats.outreachLog && !AppData.stats.trackerLog) {
  AppData.stats.trackerLog = AppData.stats.outreachLog;
  delete AppData.stats.outreachLog;
  saveAppData();
}

function updateTotalContactsCount() {
  document.getElementById('totalContacts').innerText = AppData.contacts.length;
}

function renderContacts() {
  const list = document.getElementById('contact-list');
  list.innerHTML = '';
  AppData.contacts.forEach((contact, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${contact.name}</strong> (${contact.category})<br>
      📞 ${contact.phone || ''} | 📧 ${contact.email || ''}<br>
      📝 ${contact.notes || ''}
      <br />
      <button onclick="logTrackerFromContact('${contact.name}')">Send Message</button>
      <button onclick="deleteContact(${index})">Delete</button>
      <button onclick="openEditModal(${index})">Edit</button>
    `;
    if (contact.booked) {
      li.style.backgroundColor = '#c3f7d6'; // More obvious green
      li.style.border = '2px solid #2e7d32';
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
  document.getElementById('editPhone').value = contact.phone || '';
  document.getElementById('editEmail').value = contact.email || '';
  document.getElementById('editNotes').value = contact.notes || '';
  document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

function saveEditContact() {
  const index = parseInt(document.getElementById('editIndex').value);
  const contact = AppData.contacts[index];
  contact.name = document.getElementById('editName').value.trim();
  contact.category = document.getElementById('editCategory').value;
  contact.phone = document.getElementById('editPhone').value.trim();
  contact.email = document.getElementById('editEmail').value.trim();
  contact.notes = document.getElementById('editNotes').value.trim();
  saveAppData();
  closeEditModal();
  renderContacts();
  updateTotalContactsCount();
}

function logTrackerFromContact(name) {
  switchTab('tracker');
  document.getElementById('trackerNote').value = `Message sent to ${name}`;
  document.getElementById('trackerType').value = 'Message';
  const now = new Date().toLocaleString();
  if (!AppData.stats.trackerLog) AppData.stats.trackerLog = [];
  AppData.stats.trackerLog.push({ date: now, type: 'Message', note: `Sent to ${name}` });
  saveAppData();
  renderTrackerLog();
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
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!name) return alert('Please enter a name');

  const newContact = {
    id: crypto.randomUUID(),
    name,
    category,
    notes,
    phone,
    email,
    status: 'New'
  };

  AppData.contacts.push(newContact);
  AppData.stats.contactsAdded = AppData.contacts.length;
  saveAppData();

  showToast('✅ Contact saved successfully!', 'success');

  this.reset();
  updateTotalContactsCount();
  renderContacts();
  renderFastStartWidget();
  switchTab('view');
});

function renderTrackerLog() {
  const logContainer = document.getElementById('trackerLog');
  logContainer.innerHTML = '';
  const log = AppData.stats.trackerLog || [];
  log.forEach(entry => {
    const div = document.createElement('div');
    div.textContent = `${entry.date} - ${entry.type}: ${entry.note}`;
    logContainer.appendChild(div);
  });
}

document.getElementById('trackerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const type = document.getElementById('trackerType').value;
  const note = document.getElementById('trackerNote').value.trim();
  const date = new Date().toLocaleString();

  if (!AppData.stats.trackerLog) AppData.stats.trackerLog = [];
  AppData.stats.trackerLog.push({ date, type, note });

  if (type === 'Booked') {
  if (!AppData.stats.appointmentsBooked) AppData.stats.appointmentsBooked = 0;
  AppData.stats.appointmentsBooked++;

  const matched = AppData.contacts.find(c =>
    note.toLowerCase().includes(c.name.toLowerCase())
  );

  console.log('Looking for contact match in note:', note);
  console.log('Matched contact:', matched);

  if (matched) {
    matched.booked = true;
    saveAppData(); // Save immediately in case user navigates away
    showToast(`📅 Appointment booked for ${matched.name}!`, 'success');
  } else {
    showToast('⚠️ Appointment booked, but no contact matched from note.', 'warning');
  }
}

  saveAppData();
  this.reset();
  renderTrackerLog();
  renderFastStartWidget();
  renderContacts();
});

function renderFastStartWidget() {
  const fastStartBox = document.getElementById('fastStartProgress');
  if (!fastStartBox) {
    console.warn("Fast Start box not found");
    return;
  }

  if (!AppData.stats.fastStartDate) {
    AppData.stats.fastStartDate = new Date().toISOString();
    saveAppData();
  }

  const fastStartStart = new Date(AppData.stats.fastStartDate);
  const now = new Date();
  const elapsed = Math.floor((now - fastStartStart) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, 30 - elapsed);
  const added = AppData.contacts.length;
  const booked = AppData.stats.appointmentsBooked || 0;

  fastStartBox.innerHTML = `
    <h3>🎯 Fast Start Tracker</h3>
    <p>📅 Day: ${elapsed + 1} of 30</p>
    <p>🧑‍💼 Total Contacts: ${added}</p>
    <p>📅 Appointments Booked: ${booked}</p>
    <p>⏳ Days Remaining: ${daysLeft}</p>
    <p>🚀 Keep building your list and stay consistent!</p>
  `;
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.getElementById('toastContainer').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Expose global functions
window.updateTotalContactsCount = updateTotalContactsCount;
window.renderContacts = renderContacts;
window.renderFastStartWidget = renderFastStartWidget;
window.renderTrackerLog = renderTrackerLog;
