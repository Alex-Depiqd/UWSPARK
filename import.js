// import.js - Enhanced with preview and categorisation before import

import Papa from 'papaparse';

function handleCSVUpload(file, previewDivId) {
  Papa.parse(file, {
    complete: (results) => {
      const contacts = results.data.slice(1).map(row => ({
        name: row[0]?.trim() || '',
        frogs: 'Friends & Family', // default FROGS category, editable in preview
        notes: row[1]?.trim() || ''
      }));

      // Build preview with editable category dropdowns
      const previewDiv = document.getElementById(previewDivId);
      let html = '<table><tr><th>Name</th><th>FROGS</th><th>Notes</th></tr>';
      contacts.forEach((contact, index) => {
        html += `<tr>
          <td>${contact.name}</td>
          <td>
            <select id="frogs-${index}">
              <option value="Friends & Family">Friends & Family</option>
              <option value="Recreation">Recreation</option>
              <option value="Occupation">Occupation</option>
              <option value="Geographic">Geographic</option>
              <option value="Same Name">Same Name</option>
            </select>
          </td>
          <td>${contact.notes}</td>
        </tr>`;
      });
      html += '</table><button id="confirmImport">Import All</button>';
      previewDiv.innerHTML = html;

      document.getElementById('confirmImport').addEventListener('click', () => {
        const finalContacts = contacts.map((c, i) => ({
          id: crypto.randomUUID(),
          name: c.name,
          frogs: document.getElementById(`frogs-${i}`).value,
          notes: c.notes,
          status: 'New'
        }));

        AppData.contacts = AppData.contacts.concat(finalContacts);
        AppData.stats.contactsAdded = AppData.contacts.length;
        saveAppData();

        alert(`${finalContacts.length} contacts imported successfully.`);
        previewDiv.innerHTML = '';

        if (window.renderContacts) window.renderContacts();
        if (window.updateTotalContactsCount) window.updateTotalContactsCount();
        if (window.renderFastStartWidget) window.renderFastStartWidget();
      });
    },
    error: (error) => {
      alert('Error parsing CSV: ' + error.message);
    }
  });
}
