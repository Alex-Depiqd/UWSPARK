const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { activity, partnerLevel, notes } = JSON.parse(event.body);

  // Example scripts (expand later)
  const scriptExamples = `
- New partner invite: "Hi [Name], I’m just starting out and need to complete some training appointments. Would you be willing to let me practice on you for 10–15 mins? No pressure—just need someone lovely and smiley!"
- Experienced partner invite: "Hi [Name], I help people reduce their household bills or earn extra income. Would you be open to a quick chat to see if it could help you or someone you know?"
`;

  const prompt = `
You are a UW partner coach. Here are some example scripts:
${scriptExamples}
Now, generate a message for this scenario:
- Activity: ${activity}
- Partner Level: ${partnerLevel}
- Notes: ${notes}
Make it concise, friendly, and natural.
`;

  const apiKey = process.env.OPENAI_API_KEY;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 120,
      temperature: 0.7
    })
  });

  const data = await response.json();

  if (data.choices && data.choices.length > 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: data.choices[0].message.content.trim() })
    };
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: data.error?.message || 'Unknown error' })
    };
  }
};