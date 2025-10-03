import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Loader from './Loader';
import Controls from './Controls';

function CodeGenerationStep({ stepInfo, content, isLoading, onApprove, onSubmitFeedback, onDownloadStep, onUpdateContent }) {
  const [editableCode, setEditableCode] = useState(content || '');
  const [previewCode, setPreviewCode] = useState(content || ''); // Separate state for preview
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const iframeRef = useRef(null);
  const editorRef = useRef(null);

  // Update editable code when content changes
  useEffect(() => {
    if (content) {
      setEditableCode(content);
      setPreviewCode(content);
    }
  }, [content]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleCodeChange = (value) => {
    setEditableCode(value || '');
  };

  const handleRunCode = () => {
    // Update preview code with current editable code
    setPreviewCode(editableCode);
    
    // Force iframe refresh by updating key
    setPreviewKey(prev => prev + 1);
    
    // Update the content in parent component if callback is provided
    if (onUpdateContent) {
      onUpdateContent(editableCode);
    }
  };

  const handleFullPagePreview = () => {
    if (!previewCode) return;
    
    // Create a new window for full-page preview
    const previewWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
    if (previewWindow) {
      // Write the current preview HTML content to the new window
      previewWindow.document.write(previewCode);
      previewWindow.document.close();
      
      // Set window title
      previewWindow.document.title = 'Live Preview - Full Page';
      
      // Focus the new window
      previewWindow.focus();
    } else {
      // Fallback: Show modal overlay if popup was blocked
      setShowFullPreview(true);
    }
  };

  const closeFullPreview = () => {
    setShowFullPreview(false);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{stepInfo.label}</h1>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
        {/* Left Panel: Code Editor */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-semibold text-gray-700">Code Editor</h2>
            <div className="flex gap-2">
              <button
                onClick={handleRunCode}
                disabled={!editableCode || isLoading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                title="Run code and update preview"
              >
                <i className="fas fa-play"></i>
                Run
              </button>
            </div>
          </div>
          <div className="bg-gray-800 text-white rounded-xl shadow-md flex-grow flex flex-col overflow-hidden min-h-0">
            {isLoading ? (
              <div className="p-4 flex-grow flex items-center justify-center">
                <Loader message="ProtoFlow-AI is generating code..." />
              </div>
            ) : (
              <div className="flex-grow min-h-0">
                <Editor
                  height="100%"
                  defaultLanguage="html"
                  language="html"
                  value={editableCode}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    tabSize: 2,
                    lineNumbers: 'on',
                    folding: true,
                    bracketPairColorization: { enabled: true },
                    suggest: {
                      showKeywords: true,
                      showSnippets: true,
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {/* Right Panel: Live Preview Canvas */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex justify-between items-center mb-3 flex-shrink-0">
            <h2 className="text-2xl font-semibold text-gray-700">Live Preview</h2>
            {!isLoading && previewCode && (
              <button
                onClick={handleFullPagePreview}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                title="Open preview in full page"
              >
                <i className="fas fa-external-link-alt"></i>
                Full Screen
              </button>
            )}
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl shadow-md flex-grow overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader message="Preparing preview..." />
              </div>
            ) : previewCode ? (
              <iframe
                key={previewKey}
                ref={iframeRef}
                srcDoc={previewCode}
                className="w-full h-full border-0"
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <i className="fas fa-eye text-4xl mb-4"></i>
                <p className="text-lg">Preview will appear here</p>
                <p className="text-sm">Edit code above, then click <strong>Run</strong> to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {!isLoading && previewCode && (
         <Controls 
          onApprove={onApprove}
          onSubmitFeedback={onSubmitFeedback}
          onDownloadStep={onDownloadStep}
        />
      )}

      {/* Full-page preview modal overlay (fallback for blocked popups) */}
      {showFullPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Full Page Preview</h3>
              <button
                onClick={closeFullPreview}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                title="Close preview"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-4">
              <iframe 
                srcDoc={previewCode || ''} 
                className="w-full h-full border border-gray-300 rounded" 
                title="Full Page Live Preview"
                sandbox="allow-scripts allow-same-origin allow-forms"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeGenerationStep;