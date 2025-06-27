const fetch = require('node-fetch');

// Import the script library
const { UWScripts } = require('../../scripts.js');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { metrics, partnerType } = JSON.parse(event.body);

  // Build comprehensive coaching knowledge base
  const coachingKnowledge = `
UW PARTNER COACHING KNOWLEDGE BASE:

AVAILABLE SCRIPTS AND STRATEGIES:
${JSON.stringify(UWScripts, null, 2)}

COACHING PRINCIPLES:
- New partners need confidence-building and practice opportunities
- Experienced partners need momentum and advanced strategies
- Focus on the next logical step in the sales funnel
- Address specific bottlenecks with targeted advice
- Provide actionable, specific guidance
- Include motivational elements
- Suggest relevant scripts for the situation
`;

  const prompt = `
You are an expert UW partner coach with deep knowledge of proven strategies and scripts.

COACHING KNOWLEDGE BASE:
${coachingKnowledge}

PARTNER SITUATION:
- Invitations sent: ${metrics.invitesCount || 0}
- Appointments set: ${metrics.appointmentsSetCount || 0}
- Appointments sat: ${metrics.appointmentsSatCount || 0}
- Customers signed: ${metrics.customersSignedCount || 0}
- Partners signed: ${metrics.partnersSignedCount || 0}
- Partner type: ${partnerType}

TASK: Provide today's most important focus and actionable advice.

INSTRUCTIONS:
1. Analyze the metrics to identify the biggest bottleneck or opportunity
2. Provide specific, actionable advice for today
3. Suggest relevant scripts or approaches from the knowledge base
4. Include motivational encouragement
5. Keep it concise but comprehensive (150-200 words)
6. Make it feel personal and tailored to their situation
7. Provide a clear next step or action plan

Focus on the most impactful action they can take today to move their business forward.
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
      max_tokens: 250,
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