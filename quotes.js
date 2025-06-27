// SPARK Quote Library
// Real quotes from top network marketing leaders and sample motivational tips

const SPARK_QUOTES = [
  {
    text: "The fortune is in the follow-up.",
    author: "Tom 'Big Al' Schreiter"
  },
  {
    text: "You don't have to get it right, you just have to get it going.",
    author: "Tom 'Big Al' Schreiter"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Wes Linden"
  },
  {
    text: "Success in network marketing is not about selling, it's about helping others solve their problems.",
    author: "Rob Sperry"
  },
  {
    text: "Don't promise marriage on a first date. Build trust, take the next small step.",
    author: "Steven Critchley"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Stephan Longworth"
  },
  // Sample motivational tips (AI can generate more in this style)
  {
    text: "Consistency is queen. Show up every day, even when you don't feel like it.",
    author: "SPARK Daily Tip"
  },
  {
    text: "Celebrate small wins. Every conversation, every follow-up, every new customer counts!",
    author: "SPARK Daily Tip"
  },
  {
    text: "Progress over perfection. Take messy action and learn as you go.",
    author: "SPARK Daily Tip"
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SPARK_QUOTES };
} else {
  window.SPARK_QUOTES = SPARK_QUOTES;
} 