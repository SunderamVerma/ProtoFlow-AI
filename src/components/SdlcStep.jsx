import React from 'react';
import Loader from './Loader';
import Controls from './Controls';

/**
 * Individual SDLC Step Component
 * 
 * This component handles the display of each workflow step's content.
 * Originally was much simpler, but evolved to handle loading states,
 * content rendering, and user interactions properly.
 * 
 * The dangerouslySetInnerHTML is needed because Gemini returns HTML content,
 * but we validate the content source so it's safe in this context.
 */
function SdlcStep({ stepInfo, content, isLoading, onApprove, onSubmitFeedback, onDownloadStep }) {
  // Don't render anything if we don't have step info
  if (!stepInfo) {
    console.warn('⚠️ SdlcStep rendered without stepInfo');
    return null;
  }

  return (
    <div className="workflow-step-container">
      {/* Step Header with Icon and Title */}
      <div className="flex items-center mb-6">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
          style={{ backgroundColor: stepInfo.color + '20', color: stepInfo.color }}
        >
          <i className={`fas ${stepInfo.icon} text-xl`}></i>
        </div>
        <h1 className="text-4xl font-bold text-gray-800">{stepInfo.label}</h1>
      </div>

      {/* Main Content Area */}
      <div className="bg-white p-8 rounded-xl shadow-md min-h-[400px] border border-gray-100">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader message={`🤖 ProtoFlow-AI is crafting your ${stepInfo.label.toLowerCase()}...`} />
          </div>
        ) : content ? (
          <div className="prose max-w-none prose-headings:text-gray-800 prose-p:text-gray-700" 
               dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <i className={`fas ${stepInfo.icon} text-6xl mb-4 opacity-20`}></i>
            <p className="text-lg">No content generated yet for this step.</p>
            <p className="text-sm">This usually means we're waiting for the previous step to be approved.</p>
          </div>
        )}
      </div>

      {/* Step Controls - only show when content is loaded */}
      {!isLoading && content && (
        <div className="mt-6">
          <Controls 
            stepInfo={stepInfo}
            onApprove={onApprove}
            onSubmitFeedback={onSubmitFeedback}
            onDownloadStep={onDownloadStep}
          />
        </div>
      )}
    </div>
  );
}

export default SdlcStep;