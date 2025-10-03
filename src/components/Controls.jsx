import React, { useState } from 'react';

function Controls({ onApprove, onSubmitFeedback, onDownloadStep }) {
  const [feedbackText, setFeedbackText] = useState('');
  const [warning, setWarning] = useState(false);

  const handleFeedbackSubmit = () => {
    if (feedbackText) {
      onSubmitFeedback(feedbackText);
      setWarning(false);
      setFeedbackText('');
    } else {
      setWarning(true);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center space-x-4">
        <button onClick={onApprove} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
          ✅ Approve & Continue
        </button>
        <button onClick={onDownloadStep} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
          📥 Download this Step
        </button>
      </div>
      <details className="mt-4 bg-white rounded-lg border border-gray-200">
        <summary className="p-4 cursor-pointer font-semibold text-gray-700">📝 Request Changes</summary>
        <div className="p-4 border-t border-gray-200">
          <textarea 
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md h-24" 
            placeholder="Provide feedback for regeneration..."
          ></textarea>
          <button onClick={handleFeedbackSubmit} className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            🔄 Submit Feedback
          </button>
          {warning && <p className="text-red-500 text-sm mt-1">Please enter feedback before submitting.</p>}
        </div>
      </details>
    </div>
  );
}

export default Controls;