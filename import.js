// import.js - Enhanced with preview and categorisation before import

function handleCSVUpload(file, previewDivId) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const contents = e.target.result;
    const lines = contents.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    const contacts = lines.slice(1).map(line => {
      const fields = line.split(',');
      return {
        name: fields[0]?.trim() || '',
        frogs: 'Friends & Family', // default FROGS category, editable in preview
        notes: fields[1]?.trim() || ''
      };
    });

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
  };
  reader.onerror = function () {
    alert('Error reading file');
  };
  reader.readAsText(file);
}
