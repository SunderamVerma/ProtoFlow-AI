import React from 'react';

/**
 * Sidebar Navigation Component
 * 
 * This component evolved significantly from a simple step list to a full navigation system.
 * Key features added over time:
 * - Progress tracking with visual indicators
 * - Smart step accessibility logic (can't jump ahead until content is generated)
 * - Status icons showing approved/loading/locked states
 * - Download functionality for completed workflows
 * 
 * The logic around step accessibility was the trickiest part to get right.
 */
function Sidebar({ 
  steps, 
  currentStep, 
  approved, 
  generatedContent, 
  isLoading, 
  onDownloadWorkflow, 
  onNavigateToStep, 
  onShowMessage
}) {
  // Calculate progress metrics
  const approvedCount = Object.values(approved).filter(Boolean).length;
  const totalSteps = steps.length - 1; // Exclude api_input from total count
  const progress = totalSteps > 0 ? (approvedCount / totalSteps) * 100 : 0;

  // Helper functions for step navigation logic
  const getStepIndex = (stepId) => {
    return steps.findIndex(step => step.id === stepId);
  };

  const getCurrentStepIndex = () => {
    return getStepIndex(currentStep);
  };

  // Determine if a step can be navigated to
  // Business rule: Users can only access steps that have content or are in the normal flow
  const isStepAccessible = (step) => {
    // Always allow access to getting started page
    if (step.id === 'api_input') return true;
    
    const stepIndex = getStepIndex(step.id);
    const currentIndex = getCurrentStepIndex();
    
    // Allow access to:
    // 1. Current step (even if it's still loading)
    // 2. Any previous step that has content (for review/editing)
    // 3. Steps that have been approved (completed steps)
    return (
      step.id === currentStep ||                    // Current active step
      stepIndex < currentIndex ||                   // Previous steps in workflow
      generatedContent[step.id] ||                  // Has generated content
      approved[step.id]                             // User has approved this step
    );
  };

  // Handle step navigation with validation
  const handleStepClick = (step) => {
    if (step.id === 'api_input') {
      // Always allow going back to start
      onNavigateToStep(step.id);
      return;
    }
    
    if (isStepAccessible(step)) {
      console.log(`🧭 Navigating to step: ${step.label}`);
      onNavigateToStep(step.id);
    } else {
      // Show user-friendly error for inaccessible steps
      const message = `🔒 "${step.label}" isn't available yet. Please complete the previous steps first.`;
      console.warn(message);
      if (onShowMessage) {
        onShowMessage(message, 'warning');
      }
    }
  };

  return (
    <aside className="w-1/4 bg-white border-r border-gray-200 p-6 flex flex-col h-full fixed">
      <div className="flex-grow overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-2">✨ ProtoFlow-AI SDLC Assistant</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">Your AI-powered project partner</p>
        <div className="space-y-1">
          {steps.map(step => {
            const isCurrent = step.id === currentStep;
            const isAccessible = isStepAccessible(step);
            const hasContent = generatedContent[step.id];
            const isApproved = approved[step.id];
            const isCurrentAndLoading = isCurrent && isLoading;
            const stepIndex = getStepIndex(step.id);
            const currentIndex = getCurrentStepIndex();
            const isPreviousStep = stepIndex < currentIndex && stepIndex !== 0; // Not including api_input
            
            // Determine the status icon
            let statusIcon = '';
            if (isApproved) {
              statusIcon = '✅';
            } else if (isCurrentAndLoading) {
              statusIcon = '⏳';
            } else if (hasContent && !isApproved && step.id !== 'api_input') {
              statusIcon = '🔵';
            } else if (!isAccessible && step.id !== 'api_input') {
              statusIcon = '🔒';
            }
            
            return (
              <div 
                key={step.id} 
                onClick={() => handleStepClick(step)}
                className={`step-item ${isAccessible ? 'accessible' : 'locked'} flex items-center p-3 my-1 rounded-lg cursor-pointer relative ${
                  isCurrent 
                    ? isCurrentAndLoading 
                      ? 'bg-yellow-100 font-bold border-l-4 border-yellow-500 animate-pulse' 
                      : 'bg-blue-100 font-bold border-l-4 border-blue-500'
                    : isAccessible 
                      ? isPreviousStep && hasContent
                        ? 'hover:bg-green-50'
                        : 'hover:bg-gray-100'
                      : 'hover:bg-red-50 opacity-60'
                }`}
                title={
                  isCurrentAndLoading
                    ? `${step.label} - Currently generating content...`
                    : !isAccessible && step.id !== 'api_input' 
                      ? `Cannot navigate to "${step.label}" yet. This is a future step.`
                      : hasContent 
                        ? `Navigate to ${step.label} (Content available)`
                        : step.id === 'api_input' 
                          ? 'Go to Getting Started'
                          : isPreviousStep
                            ? `${step.label} - Previous step (accessible)`
                            : `${step.label} - No content generated yet`
                }
              >
                <i className={`fas ${step.icon} w-8 text-center text-lg`} style={{ color: step.color }}></i>
                <span className={`ml-3 flex-1 ${isAccessible ? 'text-gray-700' : 'text-gray-400'}`}>
                  {step.label}
                </span>
                {statusIcon && (
                  <span className="ml-2 text-sm" title={
                    isApproved ? 'Approved' :
                    isCurrentAndLoading ? 'Generating...' :
                    hasContent ? 'Content available' :
                    'Locked'
                  }>
                    {statusIcon}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-shrink-0">
        <hr className="my-4" />
        <p className="text-sm text-gray-600 mb-2">Progress: {approvedCount}/{totalSteps} approved</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        {currentStep !== 'api_input' && (
          <button onClick={() => onDownloadWorkflow(false)} className="mt-4 w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            📦 Download Full Workflow
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;