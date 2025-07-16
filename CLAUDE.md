# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### API Development
- `cd api/source && npm start` - Start the API server in development mode  
- `cd api && ./build.sh` - Build API binaries (requires @yao-pkg/pkg and zip/tar)
- `cd test/api && npm test` - Run API tests using Mocha

### Client Development  
- `cd client && ./build.sh` - Build client distribution (requires uglify-js: `npm install -g uglify-js`)
- Client uses ExtJS 3.x framework with custom modules in `client/src/js/SM/`

### Testing
- API tests: `cd test/api && npm test` (uses Mocha with mochawesome reporter)
- Test coverage available in `test/api/coverage/` and `coverage/`
- State testing: `cd test/state && npm test`

### Documentation
- `cd docs && ./build.sh` - Build documentation (requires Python/Sphinx)
- Documentation available at [stig-manager.readthedocs.io](https://stig-manager.readthedocs.io)

## Architecture Overview

### Core Components
- **API Server** (`api/source/`): Express.js REST API with OpenAPI specification
  - Entry point: `api/source/index.js`
  - Controllers: `api/source/controllers/` (Asset, Collection, Metrics, Review, STIG, User)
  - Services: `api/source/service/` (business logic layer)
  - Database migrations: `api/source/service/migrations/`
  - Authentication: JWT with OIDC support

- **Web Client** (`client/src/`): ExtJS 3.x single-page application
  - Entry point: `client/src/index.html` and `client/src/js/init.js`
  - Custom modules: `client/src/js/SM/` (Global, Ajax, State, MainPanel, etc.)
  - OIDC Worker: `client/src/js/oidcWorker.js` for authentication

### Database Layer
- MySQL backend with migrations system
- Schema files in `api/source/service/migrations/sql/`
- Migration handler: `api/source/service/migrations/lib/MigrationHandler.js`

### Key Patterns
- **MVC Architecture**: Controllers handle HTTP, Services contain business logic
- **State Management**: Centralized state in `api/source/utils/state.js` and client-side state
- **Authentication Flow**: OIDC with SharedWorker for token management
- **Error Handling**: Centralized error serialization in `api/source/utils/serializeError.js`

## File Structure Context

### API Structure
```
api/source/
├── index.js              # Main application entry
├── bootstrap/            # App initialization modules
├── controllers/          # HTTP request handlers
├── service/             # Business logic and data access
├── utils/               # Shared utilities (auth, config, logger)
└── specification/       # OpenAPI spec
```

### Client Structure  
```
client/src/
├── js/
│   ├── init.js          # Application bootstrapper
│   ├── SM/              # Custom application modules
│   └── modules/         # npm dependencies
├── ext/                 # ExtJS framework files
└── css/                 # Stylesheets
```

### Testing Structure
```
test/
├── api/                 # API integration and unit tests
├── state/              # State management tests  
└── utils/              # Test utilities
```

## Important Notes

- **Security Focus**: This is a DISA STIG compliance management system - security is paramount
- **Database Migrations**: Always use the migration system for schema changes
- **API Validation**: Uses express-openapi-validator with OpenAPI spec
- **Client Framework**: ExtJS 3.x (legacy but stable) - follow existing patterns
- **Authentication**: OIDC-compliant with JWT tokens and SharedWorker pattern
- **Docker Support**: Official Docker image available at `nuwcdivnpt/stig-manager`