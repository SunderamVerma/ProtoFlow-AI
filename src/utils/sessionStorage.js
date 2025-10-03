/**
 * Session Storage utilities for SDLC workflow persistence
 * 
 * Originally started with just saving project data, but evolved as we discovered
 * users kept losing their progress when refreshing the page during long workflows.
 * 
 * This utility now handles all workflow state to provide a seamless experience.
 * Added proper error handling after encountering storage quota issues in testing.
 */

// Storage keys - using prefixed keys to avoid conflicts with other apps
const SESSION_KEYS = {
  GENERATED_CONTENT: 'sdlc_generated_content',    // All AI-generated content by step
  APPROVED_STATES: 'sdlc_approved_states',        // Which steps user approved
  FEEDBACK_STATES: 'sdlc_feedback_states',        // User feedback for regeneration
  PROJECT_PROMPT: 'sdlc_project_prompt',          // Original project description  
  API_KEY: 'sdlc_api_key',                        // Google AI API key (session only)
  CURRENT_STEP: 'sdlc_current_step'               // Current workflow position
};

// Helper to check storage availability (learned this the hard way in incognito mode)
const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    window.sessionStorage.setItem(testKey, 'test');
    window.sessionStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('💾 Session storage is not available:', error.message);
    return false;
  }
};

export const sessionStorage = {
  // Save generated content for a specific workflow step
  saveGeneratedContent: (stepId, content) => {
    if (!isStorageAvailable()) return;
    
    try {
      const existingContent = sessionStorage.getGeneratedContent();
      const updatedContent = { ...existingContent, [stepId]: content };
      window.sessionStorage.setItem(SESSION_KEYS.GENERATED_CONTENT, JSON.stringify(updatedContent));
      console.log(`💾 Saved content for step: ${stepId} (${content.length} chars)`);
    } catch (error) {
      console.error('❌ Failed to save generated content:', error);
      // Don't throw - let the app continue without persistence
    }
  },

  // Get all generated content from storage
  getGeneratedContent: () => {
    if (!isStorageAvailable()) return {};
    
    try {
      const content = window.sessionStorage.getItem(SESSION_KEYS.GENERATED_CONTENT);
      const parsed = content ? JSON.parse(content) : {};
      console.log(`📖 Loaded content for ${Object.keys(parsed).length} steps`);
      return parsed;
    } catch (error) {
      console.error('❌ Failed to load generated content, returning empty object:', error);
      return {};
    }
  },

  // Save which steps the user has approved
  saveApprovedStates: (approvedStates) => {
    if (!isStorageAvailable()) return;
    
    try {
      window.sessionStorage.setItem(SESSION_KEYS.APPROVED_STATES, JSON.stringify(approvedStates));
      const approvedCount = Object.values(approvedStates).filter(Boolean).length;
      console.log(`✅ Saved approval states: ${approvedCount} steps approved`);
    } catch (error) {
      console.error('❌ Failed to save approved states:', error);
    }
  },

  // Get approved states (which steps user confirmed)
  getApprovedStates: () => {
    if (!isStorageAvailable()) return {};
    
    try {
      const states = window.sessionStorage.getItem(SESSION_KEYS.APPROVED_STATES);
      return states ? JSON.parse(states) : {};
    } catch (error) {
      console.error('❌ Failed to load approved states:', error);
      return {};
    }
  },

  // Save user feedback for content regeneration
  saveFeedbackStates: (feedbackStates) => {
    if (!isStorageAvailable()) return;
    
    try {
      window.sessionStorage.setItem(SESSION_KEYS.FEEDBACK_STATES, JSON.stringify(feedbackStates));
      const feedbackCount = Object.values(feedbackStates).filter(Boolean).length;
      console.log(`📝 Saved feedback for ${feedbackCount} steps`);
    } catch (error) {
      console.error('❌ Failed to save feedback states:', error);
    }
  },

  // Get user feedback states  
  getFeedbackStates: () => {
    if (!isStorageAvailable()) return {};
    
    try {
      const states = window.sessionStorage.getItem(SESSION_KEYS.FEEDBACK_STATES);
      return states ? JSON.parse(states) : {};
    } catch (error) {
      console.error('❌ Failed to load feedback states:', error);
      return {};
    }
  },

  // Save the original project description
  saveProjectPrompt: (prompt) => {
    if (!isStorageAvailable()) return;
    
    try {
      window.sessionStorage.setItem(SESSION_KEYS.PROJECT_PROMPT, prompt);
      console.log(`📋 Saved project prompt: "${prompt.substring(0, 50)}..."`);
    } catch (error) {
      console.error('❌ Failed to save project prompt:', error);
    }
  },

  // Get the saved project description
  getProjectPrompt: () => {
    if (!isStorageAvailable()) return '';
    
    try {
      const prompt = window.sessionStorage.getItem(SESSION_KEYS.PROJECT_PROMPT) || '';
      return prompt;
    } catch (error) {
      console.error('❌ Failed to load project prompt:', error);
      return '';
    }
  },

  // Save API key (only in session storage for security - never localStorage)
  saveApiKey: (apiKey) => {
    if (!isStorageAvailable()) return;
    
    try {
      window.sessionStorage.setItem(SESSION_KEYS.API_KEY, apiKey);
      console.log('🔑 API key saved to session storage (secure)');
    } catch (error) {
      console.error('❌ Failed to save API key:', error);
    }
  },

  // Get the stored API key
  getApiKey: () => {
    if (!isStorageAvailable()) return '';
    
    try {
      return window.sessionStorage.getItem(SESSION_KEYS.API_KEY) || '';
    } catch (error) {
      console.error('❌ Failed to load API key:', error);
      return '';
    }
  },

  // Save current workflow step position
  saveCurrentStep: (step) => {
    if (!isStorageAvailable()) return;
    
    try {
      window.sessionStorage.setItem(SESSION_KEYS.CURRENT_STEP, step);
      console.log(`🎯 Current step saved: ${step}`);
    } catch (error) {
      console.error('❌ Failed to save current step:', error);
    }
  },

  // Get current workflow position (defaults to api_input for new users)
  getCurrentStep: () => {
    if (!isStorageAvailable()) return 'api_input';
    
    try {
      return window.sessionStorage.getItem(SESSION_KEYS.CURRENT_STEP) || 'api_input';
    } catch (error) {
      console.error('❌ Failed to load current step, defaulting to api_input:', error);
      return 'api_input';
    }
  },

  // Nuclear option - clear everything and start fresh
  clearAll: () => {
    if (!isStorageAvailable()) return;
    
    try {
      Object.values(SESSION_KEYS).forEach(key => {
        window.sessionStorage.removeItem(key);
      });
      console.log('🧹 Cleared all SDLC session data');
    } catch (error) {
      console.error('❌ Failed to clear session storage:', error);
    }
  },

  // Utility to check if we have content for a step (avoids unnecessary API calls)
  hasContentForStep: (stepId) => {
    const content = sessionStorage.getGeneratedContent();
    const hasContent = content[stepId] && content[stepId].trim().length > 0;
    if (hasContent) {
      console.log(`✅ Found existing content for step: ${stepId}`);
    }
    return hasContent;
  }
};