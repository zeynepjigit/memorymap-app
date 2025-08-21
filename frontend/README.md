# MemoryMap Frontend

React.js frontend for the MemoryMap AI-powered diary application.

## Features

- User authentication and registration
- Diary entry creation and management
- Interactive map visualization with Leaflet.js
- AI-generated visual gallery
- Personal development coaching interface
- Responsive design for web and mobile

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production

- `npm eject` - Ejects from Create React App (one-way operation)

## Technology Stack

- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Leaflet.js** - Interactive maps
- **Axios** - HTTP client for API calls
- **CSS Modules** - Component-scoped styling

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API services
├── utils/         # Helper utilities

└── App.js         # Main application component
```

## API Integration

The frontend communicates with the FastAPI backend running on `http://localhost:8000`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request 