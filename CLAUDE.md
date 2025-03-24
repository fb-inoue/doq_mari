# CLAUDE.md - Guidelines for Dr. Mari React Game

## Build/Run Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Code Style Guidelines

### React Patterns
- Use functional components with hooks
- Use TypeScript for type safety
- Use React hooks (useState, useEffect, useCallback) appropriately
- Keep components focused on a single responsibility

### TypeScript
- Define interfaces for component props and state
- Define types for game objects and state
- Use proper type annotations for functions and variables

### JavaScript
- Use ES6+ features (arrow functions, destructuring, etc.)
- Use camelCase for variables and methods
- Use PascalCase for component names and classes
- Group related code in separate files and directories

### Project Structure
- `/src/components` - React components
- `/src/gameLogic` - Game logic classes
- `/public/img` - Game images

### Game Logic
- Maintain separation between game logic and UI components
- Handle game state updates properly
- Properly clean up timers and event listeners