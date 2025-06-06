// app.js - STELLA v2.1.1 - Contact + Outreach Integration

function renderContacts() {
  const contactList = document.getElementById('contact-list');
  const stored = localStorage.getItem('contacts');
  const contacts = stored ? JSON.parse(stored) : [];
  contactList.innerHTML = '';

  if (contacts.length === 0) {
    contactList.innerHTML = '<p>No contacts found.</p>';
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
        contacts.splice(index, 1);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        renderContacts();
        updateTotalContactsCount();
      }
    };

    const messageBtn = document.createElement('button');
    messageBtn.innerHTML = '📩 Send Message';
    messageBtn.style.marginLeft = '0.5rem';
    messageBtn.onclick = () => {
      prefillOutreachForm(contact.name, "Message", `Message sent to ${contact.name}`);
      logOutreach(contact.name, "Message", `Message sent to ${contact.name}`);
      switchTab('log');
    };

    div.appendChild(name);
    div.appendChild(category);
    div.appendChild(notes);
    div.appendChild(deleteBtn);
    div.appendChild(messageBtn);
    contactList.appendChild(div);
  });
}

function prefillOutreachForm(contactName, type, note) {
  document.getElementById('outreachType').value = type;
  document.getElementById('outreachNote').value = note;
}

function logOutreach(contactName, type, note) {
  const stored = localStorage.getItem('contacts');
  const contacts = stored ? JSON.parse(stored) : [];
  const timestamp = new Date().toISOString();

  const index = contacts.findIndex(c => c.name === contactName);
  if (index !== -1) {
    if (!contacts[index].history) contacts[index].history = [];
    contacts[index].history.push({ type, note, timestamp });
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }
}

function updateTotalContactsCount() {
  const stored = localStorage.getItem('contacts');
  const contacts = stored ? JSON.parse(stored) : [];
  const countSpan = document.getElementById('totalContactsCount');
  if (countSpan) countSpan.textContent = contacts.length.toString();
}

// Expose functions globally
window.renderContacts = renderContacts;
window.updateTotalContactsCount = updateTotalContactsCount;

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderContacts();
  updateTotalContactsCount();
});
