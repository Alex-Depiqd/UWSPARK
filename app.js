// ai.js – AI-powered message suggestion using training phase logic and personal notes

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

    const appointmentsSat = AppData?.stats?.appointmentsSat || 0;
    const inTrainingPhase = appointmentsSat <= 6;

    const messagePrompt = `
You are a Utility Warehouse partner preparing to send an outreach message.

Start with a brief, friendly rapport-building comment based on this note:
"${note}"

Then follow with a message suited to your experience level.

${inTrainingPhase
      ? `You are in your training phase (less than or equal to 6 appointments sat).
Use this structure:
"Hey [Name], hope you’re well! I’ve just started a new business and I’m in my training phase. I need to complete 6 practice appointments, and I’d really appreciate your support. Would you mind if I practised on you by showing you a short presentation with my mentor?

It may benefit you or it may not — that doesn’t matter. I just really need some help to practice.

When would work best — Monday or Tuesday? Daytime or evening?"
`
      : `You are no longer in your training phase. You are confident, experienced, and inviting someone to see what you do.
Use a friendly, upbeat tone and base it on this format:
"Hey [Name], I’ve just come off training and thought of you. Would love to show you what I’ve been working on — it might help you or someone you know. Could I pinch 30 mins sometime this week?"`
    }

Keep the tone natural, warm, and suitable for WhatsApp or text. Don’t be robotic — make it sound like a real person.`;

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

        const copyBtn = document.getElementById("copyAIMessageBtn");
        if (copyBtn) {
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(message).then(() => {
              copyBtn.textContent = "✅ Copied!";
              setTimeout(() => {
                copyBtn.textContent = "📋 Copy Message";
              }, 2000);
            });
          };
        }
      } else if (data.error) {
        aiContent.textContent = `⚠️ Error: ${data.error.message}`;
      } else {
        aiContent.textContent = "⚠️ No message returned. Please try again.";
      }
    } catch (error) {
      console.error("OpenAI Error:", error);
      aiContent.textContent = "❌ There was an error generating the message.";
    } finally {
      suggestButton.disabled = false;
      suggestButton.textContent = "💡 Suggest Message";
    }
  });
} else {
  console.warn("❌ 'suggestAIMessage' button not found in DOM.");
}
