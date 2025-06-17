// import.js - Enhanced with preview and column mapping

function handleCSVUpload(file, previewId) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Create column mapping UI
    const previewDiv = document.getElementById(previewId);
    let html = '<div class="column-mapping">';
    html += '<h4>Map CSV Columns</h4>';
    html += '<div class="mapping-grid">';
    
    // Available fields for mapping
    const availableFields = ['name', 'email', 'telephone', 'category', 'notes'];
    
    // Create mapping dropdowns
    headers.forEach((header, index) => {
      html += `
        <div class="mapping-row">
          <label>CSV Column "${header}":</label>
          <select id="map-${index}" class="mapping-select" onchange="updatePreview()">
            <option value="">-- Select Field --</option>
            ${availableFields.map(field => `
              <option value="${field}" ${getDefaultMapping(header, field) ? 'selected' : ''}>
                ${field.charAt(0).toUpperCase() + field.slice(1)}
              </option>
            `).join('')}
          </select>
        </div>
      `;
    });
    
    html += '</div></div>';
    
    // Add preview table
    html += '<div class="preview-section">';
    html += '<h4>Preview Data</h4>';
    html += '<div class="preview-table-container">';
    html += '<table id="previewTable"><thead><tr>';
    html += '<th>Name</th><th>Email</th><th>Telephone</th><th>Category</th><th>Notes</th>';
    html += '</tr></thead><tbody>';
    
    // Show first 5 rows as preview with editable fields
    const previewData = lines.slice(1, 6).map(line => line.split(',').map(f => f.trim()));
    
    previewData.forEach((row, rowIndex) => {
      html += '<tr>';
      // Name field
      html += `<td><input type="text" class="preview-input" id="preview-name-${rowIndex}" value="${row[0]}" required></td>`;
      // Email field
      html += `<td><input type="email" class="preview-input" id="preview-email-${rowIndex}" value="${row[1] || ''}"></td>`;
      // Telephone field
      html += `<td><input type="tel" class="preview-input" id="preview-telephone-${rowIndex}" value="${row[2] || ''}"></td>`;
      // Category field
      html += `<td>
        <select class="preview-input" id="preview-category-${rowIndex}">
          <option value="Friends & Family" ${row[3] === 'Friends & Family' ? 'selected' : ''}>Friends & Family</option>
          <option value="Recreation" ${row[3] === 'Recreation' ? 'selected' : ''}>Recreation</option>
          <option value="Occupation" ${row[3] === 'Occupation' ? 'selected' : ''}>Occupation</option>
          <option value="Geographic" ${row[3] === 'Geographic' ? 'selected' : ''}>Geographic</option>
          <option value="Same Name" ${row[3] === 'Same Name' ? 'selected' : ''}>Same Name</option>
        </select>
      </td>`;
      // Notes field
      html += `<td><input type="text" class="preview-input" id="preview-notes-${rowIndex}" value="${row[4] || ''}"></td>`;
      html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    html += '<p class="preview-note">* You can edit any field before importing. Category defaults to "Friends & Family".</p>';
    
    // Add import actions
    html += '<div class="import-actions">';
    html += '<button id="confirmImport" class="import-button">Import All</button>';
    html += '<button id="cancelImport" class="cancel-button">Cancel</button>';
    html += '</div>';
    
    previewDiv.innerHTML = html;

    // Add import confirmation handler
    document.getElementById('confirmImport').addEventListener('click', () => {
      console.log('Import button clicked');
      
      const mapping = headers.map((_, index) => 
        document.getElementById(`map-${index}`).value
      );
      
      const contacts = lines.slice(1).map((line, index) => {
        const fields = line.split(',').map(f => f.trim());
        const contact = {
          name: document.getElementById(`preview-name-${index}`).value.trim(),
          email: document.getElementById(`preview-email-${index}`).value.trim(),
          telephone: document.getElementById(`preview-telephone-${index}`).value.trim(),
          category: document.getElementById(`preview-category-${index}`).value,
          notes: document.getElementById(`preview-notes-${index}`).value.trim()
        };
        
        // Map CSV fields based on user selection
        fields.forEach((field, fieldIndex) => {
          const mappedField = mapping[fieldIndex];
          if (mappedField && mappedField !== 'name') { // Don't override name as it's required
            contact[mappedField] = field;
          }
        });
        
        return contact;
      }).filter(contact => contact.name); // Only include contacts with names

      if (contacts.length === 0) {
        alert('Please ensure at least one contact has a name');
        return;
      }

      console.log('Contacts to import:', contacts);

      // Save to localStorage
      const existingContacts = JSON.parse(localStorage.getItem('contacts')) || [];
      const updatedContacts = [...existingContacts, ...contacts];
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));

      console.log('Contacts saved to localStorage');

      // Update display
      if (window.renderContacts) window.renderContacts();
      if (window.updateTotalContactsCount) window.updateTotalContactsCount();

      console.log('Display updated');

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'confirmation-message';
      successMessage.textContent = `Successfully imported ${contacts.length} contact${contacts.length === 1 ? '' : 's'}!`;
      document.body.appendChild(successMessage);

      // Clear the preview area
      previewDiv.innerHTML = '';

      // Remove success message after 3 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 3000);

      // Switch to View Contacts tab
      setTimeout(() => {
        switchTab('view');
      }, 100);
    });

    // Add cancel handler
    document.getElementById('cancelImport').addEventListener('click', () => {
      previewDiv.innerHTML = '';
    });
  };
  reader.onerror = function() {
    alert('Error reading file');
  };
  reader.readAsText(file);
}

// Global function to handle import
window.handleImport = function(lines, headers) {
  const mapping = headers.map((_, index) => 
    document.getElementById(`map-${index}`).value
  );
  
  const contacts = lines.slice(1).map((line, index) => {
    const fields = line.split(',').map(f => f.trim());
    const contact = {
      name: document.getElementById(`preview-name-${index}`).value.trim(),
      email: document.getElementById(`preview-email-${index}`).value.trim(),
      telephone: document.getElementById(`preview-telephone-${index}`).value.trim(),
      category: document.getElementById(`preview-category-${index}`).value,
      notes: document.getElementById(`preview-notes-${index}`).value.trim()
    };
    
    // Map CSV fields based on user selection
    fields.forEach((field, fieldIndex) => {
      const mappedField = mapping[fieldIndex];
      if (mappedField && mappedField !== 'name') { // Don't override name as it's required
        contact[mappedField] = field;
      }
    });
    
    return contact;
  }).filter(contact => contact.name); // Only include contacts with names

  if (contacts.length === 0) {
    alert('Please ensure at least one contact has a name');
    return;
  }

  // Save to localStorage
  const existingContacts = JSON.parse(localStorage.getItem('contacts')) || [];
  const updatedContacts = [...existingContacts, ...contacts];
  localStorage.setItem('contacts', JSON.stringify(updatedContacts));

  // Update display
  if (window.renderContacts) window.renderContacts();
  if (window.updateTotalContactsCount) window.updateTotalContactsCount();

  // Show success message
  const successMessage = document.createElement('div');
  successMessage.className = 'confirmation-message';
  successMessage.textContent = `Successfully imported ${contacts.length} contact${contacts.length === 1 ? '' : 's'}!`;
  
  // Add the success message to the form container
  const formContainer = document.getElementById('contactForm');
  if (formContainer) {
    formContainer.appendChild(successMessage);
  }

  // Clear the preview area
  const previewDiv = document.getElementById('previewArea');
  if (previewDiv) {
    previewDiv.innerHTML = '';
  }

  // Remove success message after 3 seconds
  setTimeout(() => {
    if (successMessage && successMessage.parentNode) {
      successMessage.remove();
    }
  }, 3000);

  // Switch to View Contacts tab
  switchTab('view');
};

// Global function to clear preview
window.clearPreview = function() {
  const previewDiv = document.getElementById('previewArea');
  if (previewDiv) {
    previewDiv.innerHTML = '';
  }
};

// Helper function to suggest default mappings based on column headers
function getDefaultMapping(header, field) {
  const headerLower = header.toLowerCase();
  const fieldLower = field.toLowerCase();
  
  // Common variations of field names
  const mappings = {
    name: ['name', 'full name', 'contact name', 'person'],
    email: ['email', 'e-mail', 'email address'],
    telephone: ['phone', 'telephone', 'mobile', 'cell', 'contact number'],
    category: ['category', 'type', 'group'],
    notes: ['notes', 'comment', 'description', 'additional info']
  };
  
  return mappings[field]?.some(variant => headerLower.includes(variant)) || false;
}

function parseCSV(text) {
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const contact = {
      name: values[0] || '',
      email: values[1] || '',
      telephone: values[2] || '',
      category: values[3] || 'Friends & Family',
      notes: values[4] || ''
    };
    return contact;
  }).filter(contact => contact.name); // Only include contacts with names
}
