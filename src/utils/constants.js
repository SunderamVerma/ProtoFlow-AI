/**
 * SDLC Workflow Configuration
 * 
 * Originally started with just 5 steps, but kept expanding as we realized 
 * what a complete software development lifecycle actually needs.
 * 
 * The colors were chosen after many iterations - tried to make each step
 * visually distinct while maintaining a professional palette.
 */

// Complete SDLC workflow steps with visual styling
// Note: Icons use FontAwesome classes - make sure FA is loaded in index.html
export const WORKFLOW_STEPS = [
  { 
    id: "api_input", 
    label: "Getting Started", 
    icon: "fa-key", 
    color: "#6c757d" // Neutral gray for initial setup
  },
  { 
    id: "user_stories", 
    label: "User Stories", 
    icon: "fa-clipboard-list", 
    color: "#4CAF50" // Green for user-focused requirements
  },
  { 
    id: "design_docs", 
    label: "Design Docs", 
    icon: "fa-drafting-compass", 
    color: "#FF9800" // Amber for design and architecture
  },
  { 
    id: "code_generation", 
    label: "Code Generation", 
    icon: "fa-code", 
    color: "#9C27B0" // Purple for the magic of code generation
  },
  { 
    id: "code_review", 
    label: "Code Review", 
    icon: "fa-search-plus", 
    color: "#00BCD4" // Cyan for analysis and review
  },
  { 
    id: "test_cases", 
    label: "Test Cases", 
    icon: "fa-vial", 
    color: "#8BC34A" // Light green for testing
  },
  { 
    id: "deployment", 
    label: "Deployment Plan", 
    icon: "fa-rocket", 
    color: "#E91E63" // Pink for launch excitement
  }
];

/**
 * AI Prompt Templates for Each SDLC Step
 * 
 * These prompts evolved through extensive testing with Gemini.
 * Each one is crafted to get the most useful, detailed output possible.
 * 
 * Key lessons learned:
 * - Being specific about format and sections works better than vague requests
 * - Including examples helps AI understand the expected output quality
 * - Asking for realistic numbers/costs makes outputs more actionable
 */
export const PROMPT_TEMPLATES = {
  // User story generation - refined to follow agile best practices
  "user_stories": "Generate a comprehensive and detailed set of user stories for a project described as: '{prompt}'. For each user story, include a title, user role, goal, and detailed acceptance criteria following the 'Given-When-Then' format. Group stories by epic or feature where applicable.",
  
  // Technical documentation - balances functional and technical requirements
  "design_docs": "Create a functional and technical design document for: '{prompt}'. The functional section should include user flows and detailed feature specifications. The technical section should propose a system architecture, recommend a technology stack, and define the data models with fields and relationships.",
  
  // Code generation - this is the most complex prompt, generates working prototypes
  "code_generation": "Generate a complete, fully functional HTML prototype/application for: '{prompt}'. Create a comprehensive single-file HTML document that includes: 1) **Complete HTML Structure** - All necessary semantic HTML elements, forms, navigation, content sections. 2) **Advanced Styling** - Beautiful responsive design using Tailwind CSS classes (loaded from CDN), custom CSS for animations, gradients, and modern UI patterns. 3) **Functional JavaScript** - Interactive features, form handling, data management, local storage integration, API simulation, dynamic content updates, event handlers, and user interactions. 4) **Modern Features** - Progressive enhancement, accessibility features, responsive design, smooth animations, loading states, error handling. 5) **Working Prototype** - All buttons, forms, navigation, and interactive elements should be fully functional with realistic data and workflows. The application should be production-ready in terms of functionality and user experience. Provide only the raw HTML code without any markdown formatting. Return the complete HTML document starting with <!DOCTYPE html> and ending with </html>.",
  
  // Code review - structured to provide actionable feedback
  "code_review": "Act as a senior software engineer and perform a thorough code review on the generated code for '{prompt}'. Check for code quality, potential bugs, security vulnerabilities, performance issues, and adherence to best practices. Provide the feedback in a structured list with clear explanations and suggestions for improvement.",
  
  // Test case generation - covers different testing levels
  "test_cases": "Create a detailed set of test cases for the project: '{prompt}'. Include a mix of unit tests, integration tests, and end-to-end tests. For each test case, provide a test ID, a description, steps to reproduce, expected results, and define if it's a positive or negative test.",
  
  // Deployment planning - real-world deployment considerations
  "deployment": "Create a detailed, step-by-step deployment plan for the application: '{prompt}'. The plan should cover pre-deployment checks, environment setup, deployment strategy (e.g., blue-green), the deployment process itself, and a comprehensive rollback strategy in case of failure."
};