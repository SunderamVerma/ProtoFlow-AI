import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import './App.css';

// Core UI Components
import Sidebar from './components/Sidebar';
import ApiInput from './components/ApiInput';
import SdlcStep from './components/SdlcStep';
import CodeGenerationStep from './components/CodeGenerationStep';
import Completion from './components/Completion';
import Toast from './components/Toast';

// Utility imports
import { WORKFLOW_STEPS, PROMPT_TEMPLATES } from './utils/constants';
import { generateWithGemini, getDownloadFilename, downloadFile } from './utils/api';
import { sessionStorage } from './utils/sessionStorage';

function App() {
  // Main application state - persisted across sessions for better UX
  const [apiKey, setApiKey] = useState(() => sessionStorage.getApiKey());
  const [projectPrompt, setProjectPrompt] = useState(() => sessionStorage.getProjectPrompt());
  const [currentStep, setCurrentStep] = useState(() => sessionStorage.getCurrentStep());
  const [approved, setApproved] = useState(() => sessionStorage.getApprovedStates());
  const [feedback, setFeedback] = useState(() => sessionStorage.getFeedbackStates());
  const [generatedContent, setGeneratedContent] = useState(() => sessionStorage.getGeneratedContent());
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Additional UI state
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Main content generation effect - handles AI generation workflow
  useEffect(() => {
    const generateContent = async () => {
      const stepId = currentStep;
      console.log(`🔍 useEffect triggered for step: ${stepId}`);
      console.log(`📊 Current state:`, {
        stepId,
        isLoading,
        hasApiKey: !!apiKey,
        hasProjectPrompt: !!projectPrompt,
        hasCurrentContent: !!(generatedContent[stepId] && generatedContent[stepId].trim().length > 0),
        hasFeedback: !!feedback[stepId]
      });
      
      // Skip generation for special steps
      if (stepId === 'api_input' || stepId === 'completion') {
        console.log(`⏭️ Skipping special step: ${stepId}`);
        return;
      }
      
      if (isLoading) {
        console.log(`⏳ Already loading, skipping...`);
        return;
      }

      if (!apiKey) {
        console.log(`❌ No API key available`);
        return;
      }

      if (!projectPrompt) {
        console.log(`❌ No project prompt available`);
        return;
      }

      // Check if we already have content (avoid unnecessary API calls)
      const hasStoredContent = sessionStorage.hasContentForStep(stepId);
      const hasCurrentContent = generatedContent[stepId] && generatedContent[stepId].trim().length > 0;
      
      console.log(`📋 Content check:`, {
        hasStoredContent,
        hasCurrentContent,
        shouldRegenerateWithFeedback: !!feedback[stepId]
      });
      
      // Only generate if we don't have content or need to regenerate based on feedback
      const shouldGenerate = (!hasStoredContent && !hasCurrentContent) || feedback[stepId];
      
      if (!shouldGenerate) {
        console.log(`✅ Content already exists for ${stepId}, skipping generation`);
        return;
      }

      console.log(`🚀 Starting content generation for: ${stepId}`);
      setIsLoading(true);
      
      try {
        const promptTemplate = PROMPT_TEMPLATES[stepId];
        console.log(`📝 Found prompt template for ${stepId}:`, !!promptTemplate);
        
        let content = '';
        if (promptTemplate) {
          let prompt = promptTemplate.replace('{prompt}', projectPrompt);
          if (feedback[stepId]) {
            console.log(`💬 Adding feedback to prompt:`, feedback[stepId].substring(0, 100) + '...');
            prompt += `\n\nPlease incorporate this feedback: ${feedback[stepId]}`;
            setFeedback(prev => {
              const newFeedback = { ...prev, [stepId]: null };
              sessionStorage.saveFeedbackStates(newFeedback);
              return newFeedback;
            });
          }
          
          console.log(`🤖 Calling ProtoFlow-AI API for ${stepId}...`);
          content = await generateWithGemini(prompt, WORKFLOW_STEPS.find(s => s.id === stepId).label, apiKey);
          console.log(`✅ Generated content length:`, content.length, 'characters');
          console.log(`📄 Content preview:`, content.substring(0, 200) + '...');
          
        } else if (stepId === 'code_review') {
          // Get the generated code from the code_generation step
          const generatedCode = generatedContent['code_generation'];
          if (!generatedCode || generatedCode.trim().length === 0) {
            content = `⚠️ No code available for review. Please generate code in the "Code Generation" step first.`;
          } else {
            // Create a prompt that includes the actual generated code for review
            const codeReviewPrompt = `Act as a senior software engineer and perform a thorough code review on the following generated code:

PROJECT CONTEXT: ${projectPrompt}

GENERATED CODE TO REVIEW:
\`\`\`html
${generatedCode}
\`\`\`

Please provide a comprehensive code review covering:
1. **Code Quality**: Structure, readability, maintainability
2. **Security**: Potential vulnerabilities and security best practices
3. **Performance**: Optimization opportunities and performance considerations
4. **Best Practices**: Adherence to modern web development standards
5. **Functionality**: Logic review and potential bugs
6. **Accessibility**: WCAG compliance and accessibility improvements
7. **Recommendations**: Specific suggestions for improvement

Format your response with clear sections and actionable feedback.`;

            console.log(`🔍 Performing code review for generated code...`);
            content = await generateWithGemini(codeReviewPrompt, 'Code Review', apiKey);
          }
        }
      
        // Save to both local state and session storage
        if (content && content.trim().length > 0) {
          console.log(`💾 Saving generated content for ${stepId}`);
          setGeneratedContent(prev => {
            const newContent = { ...prev, [stepId]: content };
            sessionStorage.saveGeneratedContent(stepId, content);
            return newContent;
          });
          console.log(`✅ Content successfully saved for ${stepId}`);
        } else {
          console.log(`⚠️ Generated content is empty for ${stepId}`);
        }
      
      } catch (error) {
        console.error(`❌ Error generating content for ${stepId}:`, error);
        console.error(`🔍 Error details:`, {
          message: error.message,
          stack: error.stack,
          stepId,
          hasApiKey: !!apiKey,
          hasProjectPrompt: !!projectPrompt
        });
        
        // Show user-friendly error message
        setToast({
          message: `Failed to generate content for ${stepId}. Please check your API key and try again. Error: ${error.message}`,
          type: 'error'
        });
      } finally {
        console.log(`🏁 Finished generation attempt for ${stepId}`);
        setIsLoading(false);
      }
    };

    generateContent();
  }, [currentStep, projectPrompt, feedback, generatedContent, apiKey, isLoading]);

  // Handle project start - called when user provides API key and project description  
  const handleStartWorkflow = (key, prompt) => {
    // Store everything we need for the workflow
    setApiKey(key);
    setProjectPrompt(prompt);
    setCurrentStep('user_stories'); // Start with user stories generation
    
    // Persist to session storage for page refresh scenarios
    sessionStorage.saveApiKey(key);
    sessionStorage.saveProjectPrompt(prompt);
    sessionStorage.saveCurrentStep('user_stories');
    
    console.log('🚀 Starting SDLC workflow for:', prompt.substring(0, 50) + '...'); // Log for development
  };

  // Handle step approval - user confirms the generated content looks good
  const handleApprove = (stepId) => {
    // Mark this step as approved
    const newApproved = { ...approved, [stepId]: true };
    setApproved(newApproved);
    sessionStorage.saveApprovedStates(newApproved);
    
    // Figure out what's next in our workflow
    const currentIndex = WORKFLOW_STEPS.findIndex(s => s.id === stepId);
    let nextStep;
    if (currentIndex < WORKFLOW_STEPS.length - 1) {
      nextStep = WORKFLOW_STEPS[currentIndex + 1].id;
    } else {
      nextStep = 'completion'; // We're done!
    }
    
    setCurrentStep(nextStep);
    sessionStorage.saveCurrentStep(nextStep);
    
    // Show success feedback to user
    setToast({
      message: `✅ ${WORKFLOW_STEPS.find(s => s.id === stepId)?.label} approved!`,
      type: 'success'
    });
  };

  // Handle user feedback - when they want to refine/improve generated content
  const handleSubmitFeedback = (stepId, feedbackText) => {
    if (!feedbackText.trim()) return; // Don't process empty feedback
    
    // Reset this step to regenerate with feedback
    const newFeedback = { ...feedback, [stepId]: feedbackText };
    const newApproved = { ...approved, [stepId]: false }; // Mark as unapproved
    const newGeneratedContent = { ...generatedContent, [stepId]: null }; // Clear content
    
    // Update all the states
    setFeedback(newFeedback);
    setApproved(newApproved);
    setGeneratedContent(newGeneratedContent);
    
    // Persist changes to session storage
    sessionStorage.saveFeedbackStates(newFeedback);
    sessionStorage.saveApprovedStates(newApproved);
    
    // Clean up the stored content for this step since we'll regenerate
    window.sessionStorage.removeItem('sdlc_generated_content');
    const allContent = sessionStorage.getGeneratedContent();
    delete allContent[stepId];
    window.sessionStorage.setItem('sdlc_generated_content', JSON.stringify(allContent));
    
    console.log(`📝 Processing feedback for ${stepId}:`, feedbackText.substring(0, 100) + '...');
    
    // Show feedback received confirmation
    setToast({
      message: `📝 Feedback received! Regenerating content...`,
      type: 'info'
    });
  };

  const handleNewProject = () => {
    setProjectPrompt('');
    setCurrentStep('api_input');
    setApproved({});
    setFeedback({});
    setGeneratedContent({});
    
    // Clear all session storage data
    sessionStorage.clearAll();
  };

  const handleNavigateToStep = (stepId) => {
    // Allow navigation to any step that has content or is the starting step
    if (stepId === 'api_input' || generatedContent[stepId] || approved[stepId]) {
      setCurrentStep(stepId);
      sessionStorage.saveCurrentStep(stepId);
      
      // Show success message when navigating to a step with content
      if (stepId !== 'api_input' && generatedContent[stepId]) {
        const stepInfo = WORKFLOW_STEPS.find(s => s.id === stepId);
        showMessage(`Navigated to ${stepInfo?.label || stepId}`, 'success');
      }
    }
  };

  const showMessage = (message, type = 'error') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleDownloadStep = (stepId) => {
    const content = generatedContent[stepId];
    const isCode = stepId === 'code_generation';
    const mimeType = isCode ? 'text/html' : 'text/markdown';
    const fileExtension = isCode ? '.html' : '.md';
    downloadFile(content, mimeType, `${getDownloadFilename(stepId, projectPrompt)}${fileExtension}`);
  };

  const handleDownloadWorkflow = (isFinal = false) => {
    const workflowData = {
      project: projectPrompt,
      download_date: new Date().toISOString(),
      steps: {}
    };
    WORKFLOW_STEPS.forEach(step => {
      if (generatedContent[step.id]) {
        workflowData.steps[step.id] = {
          label: step.label,
          content: generatedContent[step.id],
          is_approved: approved[step.id] || false
        };
      }
    });
    const content = JSON.stringify(workflowData, null, 2);
    downloadFile(content, 'application/json', `${getDownloadFilename(isFinal ? 'final_workflow' : 'full_workflow', projectPrompt)}.json`);
  };

  const handleToggleDemo = () => {
    setIsDemoMode(!isDemoMode);
    showMessage(`Demo mode ${!isDemoMode ? 'enabled' : 'disabled'}`, 'success');
  };

  const renderMainContent = () => {
    const stepInfo = WORKFLOW_STEPS.find(s => s.id === currentStep);
    
    switch (currentStep) {
      case 'api_input':
        return <ApiInput onStartWorkflow={handleStartWorkflow} initialApiKey={apiKey} initialProjectPrompt={projectPrompt} />;
      case 'completion':
        return <Completion onNewProject={handleNewProject} onDownloadWorkflow={handleDownloadWorkflow} />;
      case 'code_generation':
        return <CodeGenerationStep
          stepInfo={stepInfo}
          content={generatedContent[currentStep]}
          isLoading={isLoading}
          onApprove={() => handleApprove(currentStep)}
          onSubmitFeedback={(feedback) => handleSubmitFeedback(currentStep, feedback)}
          onDownloadStep={() => handleDownloadStep(currentStep)}
          onUpdateContent={(newCode) => {
            setGeneratedContent(prev => {
              const updated = { ...prev, [currentStep]: newCode };
              sessionStorage.saveGeneratedContent(updated);
              return updated;
            });
          }}
        />;
      default:
        if (!stepInfo) return null; // Should not happen
        return <SdlcStep
          stepInfo={stepInfo}
          content={generatedContent[currentStep] ? marked.parse(generatedContent[currentStep]) : ''}
          isLoading={isLoading}
          onApprove={() => handleApprove(currentStep)}
          onSubmitFeedback={(feedback) => handleSubmitFeedback(currentStep, feedback)}
          onDownloadStep={() => handleDownloadStep(currentStep)}
        />;
    }
  };

  return (
    <div id="app" className="flex h-screen">
      <Sidebar
        steps={WORKFLOW_STEPS}
        currentStep={currentStep}
        approved={approved}
        generatedContent={generatedContent}
        isLoading={isLoading}
        onDownloadWorkflow={handleDownloadWorkflow}
        onNavigateToStep={handleNavigateToStep}
        onShowMessage={showMessage}
      />
      <main className="w-3/4 ml-[25%] p-8 overflow-y-auto h-full">
        {renderMainContent()}
      </main>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}
    </div>
  );
}

export default App;
