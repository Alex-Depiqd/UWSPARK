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
    html += '<p style="color:#888; font-size:0.95em; margin-bottom:0.5em;">Please select which CSV column maps to each field below. All fields must be mapped before importing.</p>';
    html += '<div class="mapping-grid">';
    
    // Available fields for mapping
    const availableFields = ['name', 'email', 'telephone', 'category', 'notes'];
    
    // Create mapping dropdowns
    headers.forEach((header, index) => {
      html += `
        <div class="mapping-row">
          <label>CSV Column "${header}":</label>
          <select id="map-${index}" class="mapping-select">
            <option value="">Select...</option>
            ${availableFields.map(field => `
              <option value="${field}">${field.charAt(0).toUpperCase() + field.slice(1)}</option>
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
    
    // Helper to get value for a field based on mapping
    function getMappedValue(field, row) {
      const colIdx = headers.findIndex((_, idx) => document.getElementById(`map-${idx}`)?.value === field);
      return colIdx !== -1 ? (row[colIdx] || '') : '';
    }

    previewData.forEach((row, rowIndex) => {
      html += '<tr>';
      // Name field
      html += `<td><input type="text" class="preview-input" id="preview-name-${rowIndex}" value="${getMappedValue('name', row)}" required></td>`;
      // Email field
      html += `<td><input type="email" class="preview-input" id="preview-email-${rowIndex}" value="${getMappedValue('email', row)}"></td>`;
      // Telephone field
      html += `<td><input type="tel" class="preview-input" id="preview-telephone-${rowIndex}" value="${getMappedValue('telephone', row)}"></td>`;
      // Category field
      html += `<td>
        <select class="preview-input" id="preview-category-${rowIndex}">
          <option value="Friends & Family" ${getMappedValue('category', row) === 'Friends & Family' ? 'selected' : ''}>Friends & Family</option>
          <option value="Recreation" ${getMappedValue('category', row) === 'Recreation' ? 'selected' : ''}>Recreation</option>
          <option value="Occupation" ${getMappedValue('category', row) === 'Occupation' ? 'selected' : ''}>Occupation</option>
          <option value="Geographic" ${getMappedValue('category', row) === 'Geographic' ? 'selected' : ''}>Geographic</option>
          <option value="Same Name" ${getMappedValue('category', row) === 'Same Name' ? 'selected' : ''}>Same Name</option>
        </select>
      </td>`;
      // Notes field
      html += `<td><input type="text" class="preview-input" id="preview-notes-${rowIndex}" value="${getMappedValue('notes', row)}"></td>`;
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
        // Build contact object using mapping
        const contact = {
          id: Date.now() + index,
          name: '',
          phone: '',
          email: '',
          category: 'Friends & Family',
          notes: '',
          dateAdded: new Date().toISOString(),
          status: 'New',
          activities: []
        };
        mapping.forEach((fieldName, colIdx) => {
          if (!fieldName) return;
          if (fieldName === 'telephone') {
            contact.phone = fields[colIdx] || '';
          } else {
            contact[fieldName] = fields[colIdx] || '';
          }
        });
        // Also get any edits from the preview table
        if (document.getElementById(`preview-name-${index}`)) contact.name = document.getElementById(`preview-name-${index}`).value.trim();
        if (document.getElementById(`preview-email-${index}`)) contact.email = document.getElementById(`preview-email-${index}`).value.trim();
        if (document.getElementById(`preview-telephone-${index}`)) contact.phone = document.getElementById(`preview-telephone-${index}`).value.trim();
        if (document.getElementById(`preview-category-${index}`)) contact.category = document.getElementById(`preview-category-${index}`).value;
        if (document.getElementById(`preview-notes-${index}`)) contact.notes = document.getElementById(`preview-notes-${index}`).value.trim();
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
      if (window.displayContacts) window.displayContacts();
      if (window.updateTotalContactsCount) window.updateTotalContactsCount();
      if (window.updateDashboard) window.updateDashboard();

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

    // After rendering the mapping dropdowns and preview table, add this:
    // Add event listeners for mapping dropdowns to update preview
    headers.forEach((header, index) => {
      const select = document.getElementById(`map-${index}`);
      if (select) {
        select.addEventListener('change', updatePreviewTable);
      }
    });

    function updatePreviewTable() {
      // Get current mapping
      const mapping = headers.map((_, idx) => document.getElementById(`map-${idx}`).value);
      // Update each preview row
      previewData.forEach((row, rowIndex) => {
        // For each field, update the corresponding preview input
        ['name', 'email', 'telephone', 'category', 'notes'].forEach((field, fieldIdx) => {
          // Find which CSV column is mapped to this field
          const colIdx = mapping.findIndex(m => m === field);
          let value = colIdx !== -1 ? (row[colIdx] || '') : '';
          // Update the preview input value
          const inputId = `preview-${field}-${rowIndex}`;
          const input = document.getElementById(inputId);
          if (input) {
            if (field === 'category') {
              input.value = value || 'Friends & Family';
            } else {
              input.value = value;
            }
          }
        });
      });
    }
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
      id: Date.now() + index,
      name: document.getElementById(`preview-name-${index}`).value.trim(),
      phone: document.getElementById(`preview-telephone-${index}`).value.trim(),
      email: document.getElementById(`preview-email-${index}`).value.trim(),
      category: document.getElementById(`preview-category-${index}`).value,
      notes: document.getElementById(`preview-notes-${index}`).value.trim(),
      dateAdded: new Date().toISOString(),
      status: 'New',
      activities: []
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
  if (window.displayContacts) window.displayContacts();
  if (window.updateTotalContactsCount) window.updateTotalContactsCount();
  if (window.updateDashboard) window.updateDashboard();

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
