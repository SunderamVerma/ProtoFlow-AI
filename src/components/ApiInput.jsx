import React, { useState } from 'react';

/**
 * Initial project setup component - where users enter their API key and project description
 * Originally started as a simple form, evolved to include better validation and UX improvements
 */
function ApiInput({ onStartWorkflow, initialApiKey, initialProjectPrompt }) {
  // Form state management
  const [key, setKey] = useState(initialApiKey || '');
  const [prompt, setPrompt] = useState(initialProjectPrompt || '');
  const [warning, setWarning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation and submission handler
  const handleSubmit = async () => {
    // Reset any previous warnings
    setWarning('');
    setIsSubmitting(true);

    try {
      // Validate API key - learned this needs to be more specific after user feedback
      if (!key.trim()) {
        setWarning('🔑 Please enter your Google AI API key to continue.');
        return;
      }
      
      // Basic API key format validation (added after encountering format issues)
      if (key.length < 20) {
        setWarning('⚠️ API key seems too short. Please check your Google AI Studio key.');
        return;
      }

      // Validate project description
      if (!prompt.trim()) {
        setWarning('📝 Please describe your project so we can generate the right SDLC workflow.');
        return;
      }

      // Make sure the description is substantial enough for good AI generation
      if (prompt.trim().length < 10) {
        setWarning('💡 Please provide a more detailed project description (at least 10 characters).');
        return;
      }

      console.log('✅ Starting workflow with project:', prompt.substring(0, 50) + '...');
      
      // All good! Start the workflow
      onStartWorkflow(key, prompt);
      
    } catch (error) {
      console.error('❌ Error during form submission:', error);
      setWarning('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key in textarea (UX improvement added later)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to the AI-Powered SDLC Assistant</h1>
      <p className="mt-2 text-gray-600">
        Transform your project ideas into complete development workflows using Google Gemini AI. 
        From user stories to deployment guides - all generated just for you!
      </p>
      
      <div className="mt-8 p-6 border rounded-lg bg-gray-50">
        {/* API Key Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">🔑 Step 1: Your API Key</h2>
          <p className="text-sm text-gray-600 mb-3">
            Get your free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
          </p>
          <input 
            type="password" 
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
            placeholder="Paste your Google AI API key here..."
            disabled={isSubmitting}
          />
        </div>
        
        {/* Project Description Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">📝 Step 2: Describe Your Project</h2>
          <p className="text-sm text-gray-600 mb-3">
            The more detail you provide, the better your SDLC workflow will be! Include features, target users, and tech preferences.
          </p>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-3 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none" 
            placeholder="Example: 'A mobile-responsive e-commerce platform for selling custom-designed t-shirts with real-time 3D preview, user accounts, payment integration, and admin dashboard. Target audience: small businesses and individual designers.'"
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">💡 Pro tip: Press Ctrl+Enter to submit</p>
        </div>
        
        {/* Submit Button */}
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !key.trim() || !prompt.trim()}
          className={`w-full font-bold py-3 px-4 rounded-lg transition-all text-lg ${
            isSubmitting || !key.trim() || !prompt.trim()
              ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
              : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
          }`}
        >
          {isSubmitting ? '� Starting Your Workflow...' : '🚀 Generate My SDLC Workflow'}
        </button>
        
        {/* Warning/Error Display */}
        {warning && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">{warning}</p>
          </div>
        )}
        
        {/* Help Text */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          🔒 Your API key is stored locally and never shared. This tool works entirely in your browser.
        </div>
      </div>
    </div>
  );
}

export default ApiInput;