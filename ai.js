// Confirm script loaded
console.log("ai.js loaded ✅");

const suggestButton = document.getElementById("suggestAIMessage");

if (suggestButton) {
  suggestButton.addEventListener("click", async () => {
    const activity = document.getElementById("activityType")?.value;
    const notes = document.getElementById("activityNote")?.value.trim();
    const contactName = document.getElementById("activityContact")?.value?.trim();
    const partnerLevel = localStorage.getItem('partnerType') === 'new' ? 'New' : 'Experienced';

    if (!activity) {
      alert("Please select an action.");
      return;
    }

    // Get contact information if available
    let contactInfo = null;
    if (contactName) {
      try {
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contactInfo = contacts.find(c => c.name === contactName);
      } catch (error) {
        console.warn('Error getting contact info:', error);
      }
    }

    suggestButton.disabled = true;
    suggestButton.textContent = "Generating...";

    const aiBox = document.getElementById("aiMessageBox");
    const aiContent = document.getElementById("aiMessageContent");

    if (!aiBox || !aiContent) {
      suggestButton.disabled = false;
      suggestButton.textContent = "💡 Suggest Message";
      return;
    }

    aiBox.style.display = "block";
    aiContent.textContent = "Generating message...";

    try {
      const response = await fetch("/.netlify/functions/suggestMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          activity, 
          partnerLevel, 
          notes,
          contactInfo: contactInfo ? {
            name: contactInfo.name,
            firstName: contactInfo.name.split(' ')[0], // Extract first name
            category: contactInfo.category,
            notes: contactInfo.notes,
            history: contactInfo.history || []
          } : null
        })
      });
      const data = await response.json();
      if (data.message) {
        aiContent.textContent = data.message;
      } else if (data.error) {
        aiContent.textContent = `⚠️ Error: ${data.error}`;
      } else {
        aiContent.textContent = "⚠️ No message returned. Please try again.";
      }
    } catch (error) {
      aiContent.textContent = "❌ There was an error generating the message.";
    } finally {
      suggestButton.disabled = false;
      suggestButton.textContent = "💡 Suggest Message";
    }
  });
} else {
  console.warn("❌ 'suggestAIMessage' button not found in DOM.");
}

// Copy button logic for AI message
const copyBtn = document.getElementById('copyAIMessageBtn');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const aiContent = document.getElementById('aiMessageContent');
    if (aiContent && aiContent.textContent.trim()) {
      navigator.clipboard.writeText(aiContent.textContent.trim());
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 1500);
    }
  });
}
