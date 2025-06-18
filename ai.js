// Confirm script loaded
console.log("ai.js loaded ✅");

const suggestButton = document.getElementById("suggestAIMessage");

if (suggestButton) {
  suggestButton.addEventListener("click", async () => {
    const activity = document.getElementById("activityType")?.value;
    const notes = document.getElementById("activityNote")?.value.trim();
    const partnerLevel = localStorage.getItem('partnerType') === 'new' ? 'New' : 'Experienced';

    if (!activity) {
      alert("Please select an action.");
      return;
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
        body: JSON.stringify({ activity, partnerLevel, notes })
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
