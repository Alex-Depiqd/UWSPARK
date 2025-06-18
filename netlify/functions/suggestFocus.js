const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { metrics, partnerType } = JSON.parse(event.body);

  // Build a prompt for OpenAI
  const prompt = `
You are an expert UW partner coach. Here are the user's activity metrics:
Invitations sent: ${metrics.invitesCount || 0}
Appointments set: ${metrics.appointmentsSetCount || 0}
Appointments sat: ${metrics.appointmentsSatCount || 0}
Customers signed: ${metrics.customersSignedCount || 0}
Partners signed: ${metrics.partnersSignedCount || 0}
Partner type: ${partnerType}

Based on these metrics, what is the most important focus for today for a UW partner? 
- If you see a bottleneck (e.g., lots of invites but no appointments, or appointments but no customers), offer a practical tip or question to help them improve.
- Suggest a specific action and a motivational nudge.
- Keep it concise and actionable.
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
      body: JSON.stringify({ focus: data.choices[0].message.content.trim() })
    };
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: data.error?.message || 'Unknown error' })
    };
  }
};