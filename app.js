// app.js

// --- Load and Save Contacts in localStorage ---
function getContacts() {
  return JSON.parse(localStorage.getItem("contacts") || "[]");
}

function saveContacts(contacts) {
  localStorage.setItem("contacts", JSON.stringify(contacts));
  updateTotalContactsCount();
  renderStatsSummary();
  renderFastStartWidget();
}

// --- Add Contact Logic ---
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value;
  const notes = document.getElementById("notes").value.trim();

  const contacts = getContacts();
  contacts.push({ name, category, notes });
  saveContacts(contacts);
  this.reset();
  alert("Contact added!");
});

// --- Render Contact List ---
function renderContacts() {
  const list = document.getElementById("contact-list");
  list.innerHTML = "";
  const contacts = getContacts();
  contacts.forEach((contact, index) => {
    const li = document.createElement("li");
    li.className = "contact-block";
    li.innerHTML = `
      <strong>${contact.name}</strong><br />
      Category: ${contact.category}<br />
      Notes: ${contact.notes}<br />
      <button class="delete-btn" onclick="deleteContact(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteContact(index) {
  const contacts = getContacts();
  if (confirm(`Are you sure you want to delete ${contacts[index].name}?`)) {
    contacts.splice(index, 1);
    saveContacts(contacts);
    renderContacts();
  }
}

// --- Stats ---
function updateTotalContactsCount() {
  const contacts = getContacts();
  document.getElementById("totalContacts").textContent = contacts.length;
}

function renderStatsSummary() {
  const contacts = getContacts();
  const statsDiv = document.getElementById("stats");
  const frogs = {
    "Friends & Family": 0,
    Recreation: 0,
    Occupation: 0,
    Geographic: 0,
    "Same Name": 0,
  };

  contacts.forEach((c) => frogs[c.category]++);

  statsDiv.innerHTML = `
    <p>Friends & Family: ${frogs["Friends & Family"]}</p>
    <p>Recreation: ${frogs["Recreation"]}</p>
    <p>Occupation: ${frogs["Occupation"]}</p>
    <p>Geographic: ${frogs["Geographic"]}</p>
    <p>Same Name: ${frogs["Same Name"]}</p>
  `;
}

function renderFastStartWidget() {
  const contacts = getContacts();
  const fsDiv = document.getElementById("fastStartProgress");
  fsDiv.innerHTML = `
    <h3>Fast Start Tracker</h3>
    <p>Contacts added: <strong>${contacts.length}</strong></p>
    <p>Goal: <strong>45 in 30 days</strong></p>
  `;
}

// --- Attach Functions to Window for Tab Switching ---
window.renderContacts = renderContacts;
window.updateTotalContactsCount = updateTotalContactsCount;
window.renderStatsSummary = renderStatsSummary;
window.renderFastStartWidget = renderFastStartWidget;
