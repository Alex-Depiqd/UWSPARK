let selectedContactId = null;

if (AppData.stats.outreachLog && !AppData.stats.trackerLog) {
  AppData.stats.trackerLog = AppData.stats.outreachLog;
  delete AppData.stats.outreachLog;
  saveAppData();
}

function updateTotalContactsCount() {
  document.getElementById('totalContacts').innerText = AppData.contacts.length;
}

const filterBooking = document.getElementById("filterBooking");
const searchInput = document.getElementById("searchInput");
const filterFROGS = document.getElementById("filterFROGS");

filterBooking.addEventListener("change", renderContacts);
searchInput.addEventListener("input", renderContacts);
filterFROGS.addEventListener("change", renderContacts);

function renderContacts() {
  const contactList = document.getElementById("contact-list");
  contactList.innerHTML = "";

  const sortValue = document.getElementById("sortContacts").value;
  const bookingValue = filterBooking.value;
  const searchTerm = searchInput.value.toLowerCase();
  const frogsValue = document.getElementById("filterFROGS").value;

  let filteredContacts = AppData.contacts.filter((contact) => {
    const isBooked = contact.tracker?.some(
      (t) => t.type === "Booked" || t.type === "Signed"
    );
    const matchesBooking =
      bookingValue === "all" ||
      (bookingValue === "booked" && isBooked) ||
      (bookingValue === "unbooked" && !isBooked);
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email?.toLowerCase().includes(searchTerm) ||
      contact.notes?.toLowerCase().includes(searchTerm);
    const matchesFROGS =
      frogsValue === "all" || contact.frogs === frogsValue;

  return matchesBooking && matchesSearch && matchesFROGS;
  });

  switch (sortValue) {
    case "az":
      filteredContacts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "za":
      filteredContacts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "oldest":
      filteredContacts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case "booked":
      filteredContacts.sort((a, b) => {
        const aBooked = a.tracker?.some((t) => t.type === "Booked" || t.type === "Signed");
        const bBooked = b.tracker?.some((t) => t.type === "Booked" || t.type === "Signed");
        return bBooked - aBooked;
      });
      break;
    case "unbooked":
      filteredContacts.sort((a, b) => {
        const aBooked = a.tracker?.some((t) => t.type === "Booked" || t.type === "Signed");
        const bBooked = b.tracker?.some((t) => t.type === "Booked" || t.type === "Signed");
        return aBooked - bBooked;
      });
      break;
    case "newest":
    default:
      filteredContacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  filteredContacts.forEach((contact, index) => {
  const li = document.createElement("li");
  li.className = "contact-block";
  
  const isBooked =
  contact.booked === true ||
  contact.tracker?.some(
    (t) => t.type === "Booked" || t.type === "Signed"
  );


if (isBooked) {
  li.style.backgroundColor = '#c3f7d6';
  li.style.border = '2px solid #2e7d32';
}

  li.innerHTML = `
  <strong>${contact.name}</strong><br />
  Phone: ${contact.phone || "N/A"}<br />
  Email: ${contact.email || "N/A"}<br />
  Notes: ${contact.notes || ""}<br />
  ${contact.frogs ? `<div><strong>FROGS:</strong> ${contact.frogs}</div>` : ""}
 ${isBooked ? `<div><strong>📅 Appointment Booked</strong></div>` : ""}
  <button onclick="logTrackerFromContact('${contact.id}')">Send Message</button>
  <button onclick="openEditModal(${index})">Edit</button>
  <button class="delete-btn" onclick="deleteContact(${index})">Delete</button>
`;
  contactList.appendChild(li);
});
}

function openEditModal(index) {
  const contact = AppData.contacts[index];
  document.getElementById('editIndex').value = index;
  document.getElementById('editName').value = contact.name;
  document.getElementById('editPhone').value = contact.phone || '';
  document.getElementById('editEmail').value = contact.email || '';
  document.getElementById('editNotes').value = contact.notes || '';
  document.getElementById('editFROGS').value = contact.frogs || '';
  document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

function saveEditContact() {
  const index = parseInt(document.getElementById('editIndex').value);
  const contact = AppData.contacts[index];
  contact.name = document.getElementById('editName').value.trim();
  contact.phone = document.getElementById('editPhone').value.trim();
  contact.email = document.getElementById('editEmail').value.trim();
  contact.notes = document.getElementById('editNotes').value.trim();
  contact.frogs = document.getElementById('editFROGS').value;
  saveAppData();
  closeEditModal();
  renderContacts();
  updateTotalContactsCount();
}

function logTrackerFromContact(id) {
  const contact = AppData.contacts.find(c => c.id === id);
  if (!contact) return;

  selectedContactId = id;

  switchTab('tracker');
  document.getElementById('trackerNote').value = `Message sent to ${contact.name}`;
  document.getElementById('trackerType').value = 'Message';

  const now = new Date().toLocaleString();
  if (!AppData.stats.trackerLog) AppData.stats.trackerLog = [];
  AppData.stats.trackerLog.push({ date: now, type: 'Message', note: `Sent to ${contact.name}`, contactId: id });
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
  const notes = document.getElementById('notes').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const frogs = document.getElementById('frogs').value;
  if (!name) return alert('Please enter a name');

  const newContact = {
    id: crypto.randomUUID(),
    name,
    frogs,
    notes,
    phone,
    email,
    status: 'New',
    createdAt: Date.now()
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
  const entry = { date, type, note };
  if (selectedContactId) entry.contactId = selectedContactId;
  AppData.stats.trackerLog.push(entry);

  if (type === 'Booked' || type === 'Signed') {
  if (!AppData.stats.appointmentsBooked) AppData.stats.appointmentsBooked = 0;
  AppData.stats.appointmentsBooked++;

  let matched = null;
  if (selectedContactId) {
    matched = AppData.contacts.find(c => c.id === selectedContactId);
  }

  if (matched) {
    matched.booked = true;
    showToast(`📅 ${type} appointment logged for ${matched.name}!`, 'success');
  } else {
    showToast(`⚠️ ${type} logged, but no contact matched.`, 'warning');
  }
}

  selectedContactId = null;
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

// 🔄 Re-render contacts when sort option changes
document.getElementById('sortContacts').addEventListener('change', renderContacts);
