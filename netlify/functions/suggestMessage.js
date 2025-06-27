const fetch = require('node-fetch');

// Import the script library
const { UWScripts } = require('../../scripts.js');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { activity, partnerLevel, notes } = JSON.parse(event.body);

  // Build comprehensive script knowledge base
  const scriptKnowledge = `
UW PARTNER SCRIPTS KNOWLEDGE BASE:

INVITATION SCRIPTS:
${JSON.stringify(UWScripts.invitations, null, 2)}

FOLLOW-UP SCRIPTS:
${JSON.stringify(UWScripts.followUp, null, 2)}

OBJECTION HANDLERS:
${JSON.stringify(UWScripts.objections, null, 2)}

URGENCY SCRIPTS:
${JSON.stringify(UWScripts.urgency, null, 2)}

REFERRAL SCRIPTS:
${JSON.stringify(UWScripts.referrals, null, 2)}

SCRIPT GUIDELINES:
- Always use [Name] placeholder for personalization
- Keep messages friendly and conversational
- New partners focus on practice and training
- Experienced partners focus on benefits and savings
- Adapt tone based on relationship (friend, family, work)
- Include specific timeframes when relevant
- Use emojis sparingly but appropriately
- Always provide a clear call-to-action
`;

  const prompt = `
You are an expert UW partner coach with access to proven scripts and strategies.

SCRIPT KNOWLEDGE BASE:
${scriptKnowledge}

TASK: Generate a personalized message for this specific scenario:
- Activity: ${activity}
- Partner Level: ${partnerLevel}
- Additional Notes: ${notes || 'None provided'}

INSTRUCTIONS:
1. Use the script knowledge base as your foundation
2. Generate a NEW, personalized variation based on the specific context
3. Adapt the tone and approach based on the partner level and activity
4. Make it feel natural and conversational
5. Include [Name] placeholder for personalization
6. Keep it concise (under 150 words)
7. Provide a clear next step or call-to-action

Generate a message that feels authentic and tailored to this specific situation.
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
      max_tokens: 200,
      temperature: 0.8
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