// helpers.js
exports.detectLanguage = (text) => {
    return /[\u0590-\u05FF]/.test(text) ? 'he' : 'en';
  };
  
  exports.checkEmergency = (message) => {
    const emergencyKeywords = {
      'suicide': 3,
      'kill myself': 3,
      // autres mots-clés...
    };
    
    let weight = 0;
    Object.entries(emergencyKeywords).forEach(([keyword, value]) => {
      if (message.toLowerCase().includes(keyword)) weight += value;
    });
    
    return weight >= 3;
  };
  
  exports.detectRole = (message) => {
    const roles = {
      stress: ['stressed', 'overwhelmed'],
      depression: ['hopeless', 'sad'],
      // autres catégories...
    };
    
    for (const [role, keywords] of Object.entries(roles)) {
      if (keywords.some(word => message.toLowerCase().includes(word))) {
        return role;
      }
    }
    return null;
  };