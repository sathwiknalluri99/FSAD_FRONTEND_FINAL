# ERP Management System - Frontend

A modern React-based frontend for the ERP Management System built with Vite.

## Features

- **Modern UI**: Clean and responsive user interface
- **Component-based Architecture**: Modular React components
- **Fast Development**: Vite for lightning-fast development and building
- **Routing**: Client-side routing with React Router
- **API Integration**: Axios for backend communication

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS** - Styling

## Prerequisites

- **Node.js** 18+ and npm
- **Backend Server** running (see ERP-Backend README)

## Installation

1. **Navigate to the frontend directory:**
```bash
cd ERP-Frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
ERP-Frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ConfirmationDialog.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Login.jsx
│   │   ├── MainContent.jsx
│   │   ├── Pages/       # Page components
│   │   └── Sidebar.jsx
│   ├── services/        # API services
│   ├── App.css          # Main styles
│   ├── App.jsx          # Main app component
│   ├── index.css        # Global styles
│   └── main.jsx         # App entry point
├── package.json
├── vite.config.js       # Vite configuration
└── README.md
```

## API Configuration

The frontend is configured to communicate with the backend API. Make sure the backend server is running on the configured port (default: 3000).

## Development

### Adding New Components

1. Create component files in `src/components/`
2. Import and use them in appropriate pages
3. Follow the existing naming conventions

### API Integration

Use the services in `src/services/` for API calls. Add new API endpoints as needed.

### Styling

- Global styles in `src/index.css`
- Component-specific styles in respective CSS files
- Use CSS modules or styled-components for scoped styling

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change the port in `vite.config.js` if 5173 is in use
2. **API connection issues**: Ensure backend is running and CORS is configured
3. **Build errors**: Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Contributing

1. Follow the existing code style
2. Test your changes thoroughly
3. Update documentation as needed
4. Create meaningful commit messages
