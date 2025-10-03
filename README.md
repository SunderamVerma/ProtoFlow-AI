# Gemini SDLC Assistant (React)

An AI-powered Software Development Life Cycle (SDLC) assistant built with React, Vite, and Tailwind CSS. This application helps automate the software development process from idea to deployment using Google's Gemini AI.

## Features

- **Complete SDLC Workflow**: Guides you through 7 essential steps from getting started to deployment
- **AI-Powered Content Generation**: Uses Google Gemini AI to generate user stories, design docs, code, test cases, and more
- **Interactive Navigation**: Click any step in the sidebar to navigate (only accessible for generated content)
- **Session Persistence**: All content, progress, and workflow state automatically saved in browser session
- **Smart Content Management**: Generated content is preserved and never regenerated unless explicitly requested
- **Live Code Preview**: Real-time preview of generated HTML code
- **Download Capabilities**: Export individual steps or complete workflow packages
- **Feedback System**: Request changes and regenerate content with custom feedback
- **Smart Access Control**: Prevents skipping to ungenerated steps with helpful notifications

## Workflow Steps

1. **Getting Started** - API key input and project description
2. **User Stories** - Generate comprehensive user stories with acceptance criteria
3. **Design Docs** - Create functional and technical design documents
4. **Code Generation** - Generate complete HTML applications with live preview
5. **Code Review** - AI-powered code review and best practices analysis
6. **Test Cases** - Create detailed test cases (unit, integration, e2e)
7. **Deployment Plan** - Step-by-step deployment strategies

## Technologies Used

- **Frontend**: React 19.1.1, Vite 7.1.2
- **Styling**: Tailwind CSS 3.3.6
- **Icons**: Font Awesome 6.4.0
- **Markdown**: Marked.js 12.0.0
- **AI**: Google Gemini 2.5 Flash Preview API

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Google AI API key (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Usage

1. **Enter API Key**: Input your Google AI API key in the initial setup
2. **Describe Project**: Provide a detailed description of your software project
3. **Follow the Workflow**: Navigate through each step, reviewing and approving AI-generated content
4. **Provide Feedback**: Use the feedback system to request changes if needed
5. **Download Results**: Export individual steps or the complete workflow package

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/           # React components
│   ├── ApiInput.jsx     # Initial setup component
│   ├── Balloons.jsx     # Celebration animation
│   ├── CodeGenerationStep.jsx  # Code generation with preview
│   ├── Completion.jsx   # Workflow completion
│   ├── Controls.jsx     # Action buttons and feedback
│   ├── Loader.jsx       # Loading spinner
│   ├── SdlcStep.jsx     # Generic step component
│   └── Sidebar.jsx      # Navigation sidebar
├── utils/               # Utility functions
│   ├── api.js          # API calls and file operations
│   └── constants.js    # Workflow steps and prompt templates
├── App.jsx             # Main application component
├── App.css             # Custom styles and animations
├── index.css           # Tailwind CSS imports
└── main.jsx            # React app entry point
```

## API Integration

This application integrates with Google's Gemini AI API. Each workflow step uses specialized prompts to generate relevant content:

- **User Stories**: Structured stories with Given-When-Then acceptance criteria
- **Design Documents**: Functional and technical specifications
- **Code Generation**: Complete HTML applications with embedded CSS/JS
- **Reviews**: Professional code and security analysis
- **Testing**: Comprehensive test plans and cases
- **Deployment**: Production-ready deployment strategies

## Features

### Download Options
- Individual step results (Markdown or HTML)
- Complete workflow package (JSON format)
- Final workflow with all approved content

### Feedback System
- Request changes for any generated content
- AI incorporates feedback into regenerated content
- Maintain workflow progress while improving specific steps

### Progress Tracking
- Visual progress indicator in sidebar
- Step-by-step navigation with approval system
- Clear indication of completed vs pending steps

### Smart Navigation
- **Clickable Steps**: Navigate directly to any step in the sidebar
- **Access Control**: Only steps with generated content are accessible
- **Visual Indicators**: 
  - ✅ Approved steps
  - 🔒 Locked/inaccessible steps
  - 🔵 Steps with generated content
- **Content Persistence**: All generated content is preserved during navigation
- **Toast Notifications**: Helpful messages for navigation feedback

### Session Management
- **Automatic Persistence**: All data automatically saved to browser session storage
- **Page Refresh Safe**: Work is preserved even after browser refresh or accidental close
- **State Recovery**: Returns to exact step and state when reopening the application
- **Smart Generation**: Never regenerates existing content unless feedback is provided
- **Performance Optimized**: Eliminates unnecessary API calls for existing content

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

This project is open source and available under the [MIT License](LICENSE).+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
