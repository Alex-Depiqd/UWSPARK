
// app.js - Core logic for contact management and UI

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

    div.appendChild(name);
    div.appendChild(category);
    div.appendChild(notes);
    div.appendChild(deleteBtn);
    contactList.appendChild(div);
  });
}

function updateTotalContactsCount() {
  const stored = localStorage.getItem('contacts');
  const contacts = stored ? JSON.parse(stored) : [];
  const countSpan = document.getElementById('totalContactsCount');
  if (countSpan) countSpan.textContent = contacts.length.toString();
}

// Expose functions globally for import.js to use
window.renderContacts = renderContacts;
window.updateTotalContactsCount = updateTotalContactsCount;

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
  renderContacts();
  updateTotalContactsCount();
});
