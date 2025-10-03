export async function generateWithGemini(prompt, stepLabel, apiKey) {
  console.log(`🤖 Starting Gemini API call for: ${stepLabel}`);
  console.log(`🔑 API key length: ${apiKey ? apiKey.length : 0}`);
  
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API key is required but not provided');
  }
  
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const systemPrompt = `You are an expert assistant specialized in the Software Development Life Cycle. Your task is to provide a detailed, professional, and well-structured output for the '${stepLabel}' phase. The response should be in Markdown format, unless the step is 'Code Generation', in which case you should provide only the raw HTML code without any markdown code blocks, backticks, or formatting markers.`;
  const fullPrompt = `${systemPrompt}\n\nProject Context:\n${prompt}\n\nRequest:\n${prompt}`;

  console.log(`📝 Prompt length: ${fullPrompt.length} characters`);
  console.log(`🎯 Step label: ${stepLabel}`);

  const payload = { contents: [{ parts: [{ text: fullPrompt }] }] };

  try {
    console.log(`🌐 Making API request to Gemini...`);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    console.log(`📡 API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorBody = await response.json();
      console.error(`❌ API Error Response:`, errorBody);
      throw new Error(`API Error: ${response.status} - ${errorBody?.error?.message || 'Unknown error'}`);
    }
    
    const result = await response.json();
    console.log(`✅ API response received, processing...`);
    
    if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0]) {
      console.error(`❌ Unexpected API response structure:`, result);
      throw new Error('Invalid response structure from Gemini API');
    }
    
    let content = result.candidates[0].content.parts[0].text;
    console.log(`📄 Raw content length: ${content.length}`);
    
    // Clean up code blocks for Code Generation step
    if (stepLabel === 'Code Generation') {
      console.log(`🧹 Cleaning code blocks for Code Generation step...`);
      content = content.replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
      content = content.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
      console.log(`✅ Cleaned content length: ${content.length}`);
    }
    
    return content;
  } catch (error) {
    console.error("❌ API call failed:", error);
    console.error("🔍 Error stack:", error.stack);
    return `Error: Could not generate content. Please check your API key and network connection. Details: ${error.message}`;
  }
}

export function getDownloadFilename(prefix, projectPrompt) {
  const projectName = (projectPrompt ? projectPrompt.substring(0, 20).replace(/\s/g, '_') : 'project');
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}_${projectName}_${dateStr}`;
}

export function downloadFile(content, mimeType, fileName) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}