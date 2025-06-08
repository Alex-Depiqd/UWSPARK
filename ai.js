// Confirm script loaded
console.log("ai.js loaded ✅");

const suggestButton = document.getElementById("suggestAIMessage");

if (suggestButton) {
  suggestButton.addEventListener("click", async () => {
    const action = document.getElementById("outreachType")?.value;
    const note = document.getElementById("outreachNote")?.value.trim();

    if (!action) {
      alert("Please select an action.");
      return;
    }

    // Lock the button during generation
    suggestButton.disabled = true;
    suggestButton.textContent = "Generating...";

    let apiKey = localStorage.getItem("openai_api_key");
    if (!apiKey) {
      apiKey = window.prompt("Enter your OpenAI API key:");
      if (!apiKey) {
        alert("API key is required.");
        suggestButton.disabled = false;
        suggestButton.textContent = "💡 Suggest Message";
        return;
      }
      localStorage.setItem("openai_api_key", apiKey);
    }

    const messagePrompt = `You're a friendly, professional Utility Warehouse partner. Generate an outreach message to a contact based on this action: "${action}". Notes: "${note}". Keep it concise, friendly, and natural.`;

    const aiBox = document.getElementById("aiMessageBox");
    const aiContent = document.getElementById("aiMessageContent");

    if (!aiBox || !aiContent) {
      console.error("AI message display elements not found.");
      suggestButton.disabled = false;
      suggestButton.textContent = "💡 Suggest Message";
      return;
    }

    aiBox.style.display = "block";
    aiContent.textContent = "Generating message...";

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: messagePrompt }],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      const data = await response.json();
      console.log("Raw OpenAI response:", data);

      if (data.choices && data.choices.length > 0) {
        const message = data.choices[0].message.content.trim();
        aiContent.textContent = message;
      } else if (data.error) {
        if (data.error.message.includes("rate limit")) {
          aiContent.textContent = "⏳ Too many requests. Please wait a moment and try again.";
        } else {
          aiContent.textContent = `⚠️ Error: ${data.error.message}`;
        }
      } else {
        aiContent.textContent = "⚠️ No message returned. Please try again.";
      }
    } catch (error) {
      console.error("OpenAI Error:", error);
      aiContent.textContent = "❌ There was an error generating the message.";
    } finally {
      // Re-enable the button
      suggestButton.disabled = false;
      suggestButton.textContent = "💡 Suggest Message";
    }
  });
} else {
  console.warn("❌ 'suggestAIMessage' button not found in DOM.");
}
