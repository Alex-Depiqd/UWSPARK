const { SPARK_QUOTES } = require('../../quotes.js');
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // 70% chance to pick a real quote, 30% to generate with AI
  const useRealQuote = Math.random() < 0.7;

  if (useRealQuote) {
    const quote = SPARK_QUOTES[Math.floor(Math.random() * SPARK_QUOTES.length)];
    return {
      statusCode: 200,
      body: JSON.stringify({
        text: quote.text,
        author: quote.author
      })
    };
  } else {
    // Generate a new motivational tip in the style of top network marketing leaders
    const prompt = `You are an expert network marketing coach. Generate a short, motivational quote or tip for the day, inspired by the style of Tom 'Big Al' Schreiter, Wes Linden, Stephan Longworth, Steven Critchley, or Rob Sperry. Make it positive, actionable, and relevant to network marketers. Keep it under 30 words.`;
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
        max_tokens: 60,
        temperature: 0.9
      })
    });
    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          text: data.choices[0].message.content.trim(),
          author: 'SPARK Daily Tip (AI)'
        })
      };
    } else {
      // Fallback to a real quote if AI fails
      const quote = SPARK_QUOTES[Math.floor(Math.random() * SPARK_QUOTES.length)];
      return {
        statusCode: 200,
        body: JSON.stringify({
          text: quote.text,
          author: quote.author
        })
      };
    }
  }
}; 