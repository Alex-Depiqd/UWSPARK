// ai.js (version 1.2) with conditional messaging and UI integration

function generateSuggestedMessage(contact, appointmentsSat) {
  const baseNote = contact.notes?.trim()
    ? `Based on this note: "${contact.notes.trim()}"
\n`
    : "";

  if (appointmentsSat < 6) {
    // Training phase script
    return (
      baseNote +
      `Hey ${contact.name}, I hope you're well! I'm just getting started with something new and part of my training is to speak to as many people as I can in my first few weeks.

It may benefit you or it may not, but that doesn't matter as I just need some help to practice.

Would you be open to taking a look at a quick 10-minute overview to help me out? There’s no pressure at all and I’d really appreciate it.`
    );
  } else {
    // Experienced partner script
    return (
      baseNote +
      `Hey ${contact.name}, hope you're doing well! I just wanted to reach out and ask a quick favour — I’ve started something new and I think it could potentially help you or someone you know.

Would you be open to taking a look at a short overview? It's just 10 minutes and no pressure at all if it’s not a fit.`
    );
  }
}

// Hook for the outreach UI to call when a contact is selected
window.generateSuggestedMessage = generateSuggestedMessage;

// Handles showing the generated message when user views a contact in the outreach tab
window.showSuggestedMessageForContact = function (contact, appointmentsSat) {
  const messageBox = document.getElementById("aiMessageBox");
  const messageContent = document.getElementById("aiMessageContent");
  if (!messageBox || !messageContent) return;

  const generated = generateSuggestedMessage(contact, appointmentsSat);
  messageContent.textContent = generated;
  messageBox.style.display = "block";
};

// Copy-to-clipboard logic for the button
window.addEventListener("DOMContentLoaded", () => {
  const copyBtn = document.getElementById("copyAIMessageBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const text = document.getElementById("aiMessageContent").textContent;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => (copyBtn.textContent = "📋 Copy Message"), 2000);
      });
    });
  }
});
