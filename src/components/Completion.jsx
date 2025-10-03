import React from 'react';

function Completion({ onNewProject, onDownloadWorkflow }) {
  return (
    <div className="text-center bg-white p-12 rounded-xl shadow-lg">
        <h1 className="text-5xl font-bold text-green-500">🎉 SDLC Workflow Completed! 🎉</h1>
        <p className="mt-4 text-xl text-gray-600">All steps have been approved. Your project is ready for the next phase.</p>
        <div className="mt-8 flex flex-col items-center space-y-4">
          <button onClick={() => onDownloadWorkflow(true)} className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
            📦 Download Final Workflow Package
          </button>
          <button onClick={onNewProject} className="w-full max-w-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors text-lg">
            🔄 Start a New Project
          </button>
        </div>
      </div>
  );
}

export default Completion;