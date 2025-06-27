// UW SPARK Script Library
// Organized by activity type, partner level, and context

const UWScripts = {
  // INVITATION SCRIPTS
  invitations: {
    new: {
      friends: [
        "Hi [Name]! I'm just starting out with UW and need to complete some training appointments. Would you be willing to let me practice on you for 10-15 mins? No pressure—just need someone lovely and smiley!",
        "Hey [Name]! I've just joined UW and I'm looking for a few friendly faces to help me practice my presentation. Would you be up for a quick chat? Promise it's painless! 😊",
        "Hi [Name]! I'm doing some training with UW and need to practice with real people. You're always so supportive - would you mind being my guinea pig for 15 minutes?"
      ],
      family: [
        "Hi [Name]! I've just started with UW and I'm really excited about it. Would you be willing to let me practice my presentation on you? I'd love your honest feedback!",
        "Hey [Name]! I'm training with UW and need to practice with family first. Can I run through my presentation with you? It's only 10-15 minutes and I'd really value your input.",
        "Hi [Name]! I'm learning the ropes with UW and need some practice. Would you mind being my first 'customer'? No pressure to buy anything - just helping me get confident!"
      ],
      work: [
        "Hi [Name]! I've just started with UW and I'm looking for some practice. Would you be open to a quick chat about how I could potentially help you or someone you know save money?",
        "Hey [Name]! I'm training with UW and need to practice my approach. Would you mind if I ran through a quick presentation with you? It's about saving money on bills.",
        "Hi [Name]! I've joined UW and I'm looking for some feedback on my presentation. Would you be willing to give me 15 minutes of your time? I think you might find it interesting too!"
      ],
      general: [
        "Hi [Name]! I'm just starting out with UW and need to complete some training appointments. Would you be willing to let me practice on you for 10-15 mins? No pressure—just need someone lovely and smiley!",
        "Hey [Name]! I've just joined UW and I'm looking for a few friendly faces to help me practice my presentation. Would you be up for a quick chat? Promise it's painless! 😊"
      ]
    },
    experienced: {
      friends: [
        "Hi [Name]! I help people reduce their household bills or earn extra income. Would you be open to a quick chat to see if it could help you or someone you know?",
        "Hey [Name]! I've been helping people save money on their bills and earn extra income. Would you be interested in hearing about it? I think it could really benefit you!",
        "Hi [Name]! I'm working with UW and helping people save money on their bills. Would you be open to a quick conversation? I'd love to see if I can help you too!"
      ],
      family: [
        "Hi [Name]! I've been helping people save money on their household bills. Would you be interested in seeing if I could help you too? It's a quick chat and could save you money!",
        "Hey [Name]! I'm working with UW and helping people reduce their bills. Would you mind if I showed you how it works? I think you'd really benefit from it!",
        "Hi [Name]! I've been helping family members save money on their bills. Would you be open to a quick presentation? I'd love to help you too!"
      ],
      work: [
        "Hi [Name]! I help people reduce their household bills and earn extra income. Would you be interested in a quick chat? I think it could really help you or someone you know.",
        "Hey [Name]! I'm working with UW and helping people save money on their bills. Would you be open to a brief conversation? It's a great opportunity for extra income too!",
        "Hi [Name]! I've been helping people save money on their household bills. Would you be interested in hearing about it? It's a quick chat and could really benefit you!"
      ],
      general: [
        "Hi [Name]! I help people reduce their household bills or earn extra income. Would you be open to a quick chat to see if it could help you or someone you know?",
        "Hey [Name]! I've been helping people save money on their bills and earn extra income. Would you be interested in hearing about it? I think it could really benefit you!"
      ],
      // Social media outreach scripts
      socialMedia: [
        "Hi! You've probably seen from my posts that I'm running mini bill reviews - as the price rises keep hitting homes 😣 It takes 15 minutes and my average saving is about £500 a year for most households. Can I see what I can shave off your utilities 💷 Hope you're all well, [Partner Name] xxx"
      ]
    }
  },

  // FOLLOW-UP SCRIPTS
  followUp: {
    new: {
      afterInvite: [
        "Hi [Name]! Just following up on my message about practicing my UW presentation. Would you be free this week for a quick 15-minute chat? No pressure at all!",
        "Hey [Name]! Hope you're well! Just checking if you'd still be up for helping me practice my UW presentation? It's really helping me build confidence!",
        "Hi [Name]! Just a gentle reminder about my UW practice session. Would you be available this week? I'd really appreciate your help!"
      ],
      afterAppointment: [
        "Hi [Name]! Thanks so much for your time today. I really appreciated your feedback on my presentation. Would you mind if I followed up in a few days?",
        "Hey [Name]! Thank you for helping me practice today. Your feedback was really valuable. Would you be open to me checking in next week?",
        "Hi [Name]! Thanks for your time today. I'm learning so much from these practice sessions. Would you mind if I touched base again soon?"
      ]
    },
    experienced: {
      afterInvite: [
        "Hi [Name]! Just following up on my message about saving money on your bills. Would you be free this week for a quick chat? I think you'd really benefit from it!",
        "Hey [Name]! Hope you're well! Just checking if you'd still be interested in hearing about how I can help you save money on your bills?",
        "Hi [Name]! Just a quick follow-up about saving money on your household bills. Would you be available this week for a brief conversation?"
      ],
      afterAppointment: [
        "Hi [Name]! Thanks for your time today. I hope you found the information useful. Would you like me to follow up with any specific details?",
        "Hey [Name]! Thank you for meeting with me today. I really enjoyed our conversation. Would you be open to me checking in next week?",
        "Hi [Name]! Thanks for your time today. I think we covered some great ground. Would you mind if I touched base again soon?"
      ]
    }
  },

  // OBJECTION HANDLERS
  objections: {
    "I'm not interested": [
      "No problem at all! I completely understand. Would you mind if I asked what specifically puts you off? It helps me understand better.",
      "That's totally fine! I appreciate your honesty. Would you be open to me checking in again in a few months? Things change and you never know!",
      "No worries at all! I respect that. Would you mind if I asked if you know anyone else who might be interested in saving money on their bills?"
    ],
    "I'm too busy": [
      "I completely understand - everyone's busy! It's literally just 10-15 minutes. Would you be free this evening or over the weekend?",
      "I totally get it - life is hectic! What if I made it super quick? Just 10 minutes and I promise to get straight to the point.",
      "I understand you're busy! What if I came to you? I can meet you wherever is convenient - even just a quick coffee!"
    ],
    "I don't have money": [
      "I completely understand that concern! The great thing is, this is actually about saving you money, not spending it. Would you like to see how?",
      "That's exactly why I'm reaching out! This is about reducing your bills, not adding to them. Would you be interested in seeing how much you could save?",
      "I totally get that! But what if I could show you how to actually save money on your current bills? No upfront costs at all."
    ],
    "I'll think about it": [
      "Of course! Take your time. Would you mind if I checked in with you in a few days? Sometimes it helps to have a gentle reminder.",
      "Absolutely! I appreciate you considering it. Would you be open to me following up next week? I can answer any questions you might have.",
      "No problem at all! I completely understand wanting to think it over. Would you mind if I touched base in a few days?"
    ]
  },

  // URGENCY SCRIPTS
  urgency: {
    new: [
      "Hi [Name]! I'm doing some urgent training this week and really need to complete a few practice sessions. Would you be able to help me out? It's just 10 minutes!",
      "Hey [Name]! I'm on a tight deadline with my UW training and need some practice. Would you be free today or tomorrow for a quick chat?",
      "Hi [Name]! I'm racing against the clock with my training and need some friendly faces to practice with. Would you be up for helping me out?"
    ],
    experienced: [
      "Hi [Name]! There's a special offer ending this week that could save you money. Would you be free for a quick chat today or tomorrow?",
      "Hey [Name]! I've got some time-sensitive information that could really help you save money. Would you be available for a brief conversation this week?",
      "Hi [Name]! There's an opportunity this week that I think would really benefit you. Would you be free for a quick chat?"
    ]
  },

  // REFERRAL SCRIPTS
  referrals: {
    new: [
      "Hi [Name]! Thanks for your help with my practice session. Do you know anyone else who might be willing to help me practice? I'm really trying to build my confidence!",
      "Hey [Name]! I really appreciated your time today. Would you mind if I asked if you know anyone else who might be open to helping me practice?",
      "Hi [Name]! Thanks for being so supportive! Do you know anyone else who might be interested in helping me with my UW training?"
    ],
    experienced: [
      "Hi [Name]! Thanks for your time today. Do you know anyone else who might be interested in saving money on their bills? I'd love to help them too!",
      "Hey [Name]! I really enjoyed our conversation today. Would you mind if I asked if you know anyone else who might benefit from what I do?",
      "Hi [Name]! Thanks for meeting with me! Do you know anyone else who might be interested in saving money on their household bills?"
    ],
    // Referral messages for introducing others to UW partners
    introducingPartner: [
      "Just wondering if you're concerned about your energy bills with all the uncertainty at the moment? If so a lovely local lady called Naomi was referred to us by a friend, she offers a personal service, where she does an MOT on your bills, from energy to WiFi to mobiles etc, she ensures people aren't paying more than they need to and the company she works for are under the Government price cap on energy and welcoming new customer services, she's saved us over £ a year with some fab benefits. I've passed your number to her so when she calls you'll know who she is! Hear her out, she's worth seeing, especially at this time, and there's absolutely no obligation"
    ]
  }
};

// Helper function to get a random script from a category
function getRandomScript(category, subcategory, context = 'general') {
  const scripts = UWScripts[category]?.[subcategory]?.[context] || 
                  UWScripts[category]?.[subcategory]?.general ||
                  UWScripts[category]?.[subcategory] ||
                  [];
  
  if (scripts.length === 0) return null;
  return scripts[Math.floor(Math.random() * scripts.length)];
}

// Helper function to get all scripts for a category
function getAllScripts(category, subcategory, context = 'general') {
  return UWScripts[category]?.[subcategory]?.[context] || 
         UWScripts[category]?.[subcategory]?.general ||
         UWScripts[category]?.[subcategory] ||
         [];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UWScripts, getRandomScript, getAllScripts };
} else {
  window.UWScripts = UWScripts;
  window.getRandomScript = getRandomScript;
  window.getAllScripts = getAllScripts;
} 