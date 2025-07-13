# Contributing to Web3Store

Thank you for your interest in contributing to Web3Store! This guide will help you get started with contributing to our decentralized app store platform.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Contributing Guidelines](#contributing-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Issue Guidelines](#issue-guidelines)
7. [Coding Standards](#coding-standards)
8. [Testing Guidelines](#testing-guidelines)
9. [Documentation](#documentation)
10. [Community](#community)

## Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at [conduct@web3store.com](mailto:conduct@web3store.com).

## Getting Started

### Ways to Contribute

- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit bug fixes or new features
- **Documentation**: Improve our documentation
- **Testing**: Help test new features and bug fixes
- **Design**: Contribute to UI/UX improvements
- **Translation**: Help translate the platform

### Before You Start

1. **Check Existing Issues**: Look for existing issues or discussions
2. **Read Documentation**: Familiarize yourself with the project
3. **Join Community**: Connect with other contributors
4. **Start Small**: Begin with small contributions to get familiar

## Development Setup

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Git**: Latest version
- **Encore CLI**: Latest version
- **PostgreSQL**: Version 14 or higher (for local development)

### Local Setup

1. **Fork the Repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/your-username/web3store.git
   cd web3store
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your local configuration
   nano .env
   ```

4. **Start Development Server**
   ```bash
   # Start the backend
   encore run
   
   # In another terminal, start the frontend
   cd frontend
   npm run dev
   ```

5. **Verify Setup**
   ```bash
   # Check backend
   curl http://localhost:4000/health
   
   # Check frontend
   open http://localhost:3000
   ```

### Development Environment

#### Database Setup
```bash
# Create local database
createdb web3store_dev

# Run migrations
encore migrate

# Seed with sample data (optional)
npm run seed
```

#### Environment Variables
```bash
# Required for local development
DATABASE_URL=postgresql://localhost:5432/web3store_dev
JWT_SECRET=your-local-jwt-secret
FRONTEND_URL=http://localhost:3000

# Optional for full functionality
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Contributing Guidelines

### Types of Contributions

#### Bug Fixes
- Fix existing functionality that isn't working correctly
- Include tests to prevent regression
- Update documentation if needed

#### New Features
- Add new functionality to the platform
- Follow existing patterns and conventions
- Include comprehensive tests
- Update documentation

#### Improvements
- Enhance existing features
- Optimize performance
- Improve user experience
- Refactor code for better maintainability

### Contribution Workflow

1. **Create an Issue**: Discuss your idea before starting work
2. **Fork and Branch**: Create a feature branch from `main`
3. **Develop**: Write code following our standards
4. **Test**: Ensure all tests pass
5. **Document**: Update relevant documentation
6. **Submit**: Create a pull request

### Branch Naming

Use descriptive branch names that indicate the type of change:

```bash
# Feature branches
feature/user-profile-settings
feature/web3-wallet-integration

# Bug fix branches
fix/login-redirect-issue
fix/app-download-error

# Documentation branches
docs/api-documentation-update
docs/contributing-guide-improvements

# Refactoring branches
refactor/auth-service-cleanup
refactor/database-query-optimization
```

## Pull Request Process

### Before Submitting

1. **Update Your Branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run Tests**
   ```bash
   npm test
   npm run test:e2e
   npm run lint
   npm run type-check
   ```

3. **Update Documentation**
   - Update README if needed
   - Add/update API documentation
   - Update user guides if applicable

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: Team members review your code
3. **Feedback**: Address any feedback or requested changes
4. **Approval**: Get approval from maintainers
5. **Merge**: Your PR will be merged into main

### Review Criteria

- **Functionality**: Does the code work as intended?
- **Code Quality**: Is the code clean, readable, and maintainable?
- **Testing**: Are there adequate tests?
- **Documentation**: Is documentation updated?
- **Performance**: Does it impact performance?
- **Security**: Are there any security concerns?

## Issue Guidelines

### Reporting Bugs

Use the bug report template:

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional Context**
Add any other context about the problem here.
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested
- `wontfix`: This will not be worked on

## Coding Standards

### TypeScript Guidelines

#### General Principles
- Use TypeScript for all new code
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Use enums for constants
- Follow functional programming principles where possible

#### Code Style
```typescript
// Use PascalCase for types and interfaces
interface UserProfile {
  id: number;
  username: string;
  email: string;
}

// Use camelCase for variables and functions
const getUserProfile = async (userId: number): Promise<UserProfile> => {
  // Implementation
};

// Use UPPER_SNAKE_CASE for constants
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB

// Use descriptive names
const isUserAuthenticated = (user: User): boolean => {
  return user.token !== null && user.tokenExpiry > new Date();
};
```

### React Guidelines

#### Component Structure
```typescript
// Use functional components with hooks
import { useState, useEffect } from 'react';

interface AppCardProps {
  app: App;
  onDownload?: (appId: number) => void;
}

export function AppCard({ app, onDownload }: AppCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await onDownload?.(app.id);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="app-card">
      {/* Component JSX */}
    </div>
  );
}
```

#### Hooks Guidelines
```typescript
// Custom hooks should start with 'use'
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hook implementation
  
  return { user, isLoading, login, logout };
}

// Use useCallback for event handlers
const handleSubmit = useCallback(async (data: FormData) => {
  // Handle form submission
}, [dependency]);

// Use useMemo for expensive calculations
const filteredApps = useMemo(() => {
  return apps.filter(app => app.category === selectedCategory);
}, [apps, selectedCategory]);
```

### Backend Guidelines

#### API Design
```typescript
// Use descriptive endpoint names
export const getUserProfile = api<GetUserProfileRequest, UserProfile>(
  { expose: true, method: 'GET', path: '/users/:userId/profile' },
  async ({ userId }) => {
    // Implementation
  }
);

// Use proper HTTP status codes
export const createApp = api<CreateAppRequest, CreateAppResponse>(
  { expose: true, method: 'POST', path: '/apps' },
  async (request) => {
    try {
      const app = await createAppInDatabase(request);
      return app; // 200 OK
    } catch (error) {
      if (error instanceof ValidationError) {
        throw APIError.invalidArgument(error.message); // 400 Bad Request
      }
      throw APIError.internal('Failed to create app'); // 500 Internal Server Error
    }
  }
);
```

#### Database Guidelines
```typescript
// Use parameterized queries
const user = await db.queryRow<User>`
  SELECT * FROM users WHERE id = ${userId}
`;

// Use transactions for multiple operations
await db.begin(async (tx) => {
  await tx.exec`INSERT INTO users (email, username) VALUES (${email}, ${username})`;
  await tx.exec`INSERT INTO user_profiles (user_id) VALUES (${userId})`;
});

// Use proper error handling
try {
  const result = await db.queryRow`SELECT * FROM apps WHERE id = ${appId}`;
  if (!result) {
    throw APIError.notFound('App not found');
  }
  return result;
} catch (error) {
  logger.error('Database query failed', error);
  throw APIError.internal('Database error');
}
```

### CSS/Styling Guidelines

#### Tailwind CSS
```typescript
// Use semantic class names
<div className="bg-card text-card-foreground rounded-lg border shadow-sm">
  <div className="p-6">
    <h3 className="text-lg font-semibold mb-2">App Name</h3>
    <p className="text-muted-foreground">App description</p>
  </div>
</div>

// Use responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>

// Use consistent spacing
<div className="space-y-4">
  <div className="space-y-2">
    <label className="text-sm font-medium">Label</label>
    <input className="w-full px-3 py-2 border rounded-md" />
  </div>
</div>
```

## Testing Guidelines

### Testing Strategy

#### Unit Tests
- Test individual functions and components
- Mock external dependencies
- Focus on business logic
- Aim for high code coverage

#### Integration Tests
- Test API endpoints
- Test database interactions
- Test service integrations
- Use test databases

#### End-to-End Tests
- Test complete user workflows
- Test critical user journeys
- Use realistic test data
- Run in CI/CD pipeline

### Testing Examples

#### Frontend Testing
```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { AppCard } from './AppCard';

describe('AppCard', () => {
  const mockApp = {
    id: 1,
    name: 'Test App',
    description: 'Test description',
    // ... other properties
  };

  it('renders app information correctly', () => {
    render(<AppCard app={mockApp} />);
    
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('calls onDownload when download button is clicked', () => {
    const mockOnDownload = jest.fn();
    render(<AppCard app={mockApp} onDownload={mockOnDownload} />);
    
    fireEvent.click(screen.getByText('Download'));
    
    expect(mockOnDownload).toHaveBeenCalledWith(1);
  });
});
```

#### Backend Testing
```typescript
// API endpoint testing
import { describe, it, expect } from 'vitest';
import { testClient } from './test-utils';

describe('Apps API', () => {
  it('should list apps', async () => {
    const response = await testClient.apps.listApps({});
    
    expect(response.apps).toBeInstanceOf(Array);
    expect(response.total).toBeGreaterThanOrEqual(0);
  });

  it('should create app with valid data', async () => {
    const appData = {
      name: 'Test App',
      description: 'Test description',
      category_id: 1,
      version: '1.0.0',
    };

    const response = await testClient.apps.createApp(appData);
    
    expect(response.id).toBeDefined();
    expect(response.name).toBe('Test App');
  });

  it('should return 400 for invalid app data', async () => {
    const invalidData = {
      name: '', // Invalid: empty name
      description: 'Test',
    };

    await expect(
      testClient.apps.createApp(invalidData)
    ).rejects.toThrow('invalid_argument');
  });
});
```

### Test Configuration

#### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

#### Test Setup
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
```

## Documentation

### Documentation Standards

#### Code Documentation
```typescript
/**
 * Retrieves user profile information
 * @param userId - The unique identifier for the user
 * @returns Promise resolving to user profile data
 * @throws {APIError} When user is not found or access is denied
 */
export async function getUserProfile(userId: number): Promise<UserProfile> {
  // Implementation
}

/**
 * App card component for displaying app information
 * @param app - The app data to display
 * @param onDownload - Optional callback when download button is clicked
 */
export function AppCard({ app, onDownload }: AppCardProps) {
  // Component implementation
}
```

#### API Documentation
```typescript
// Use JSDoc comments for API endpoints
/**
 * @api {get} /apps/:slug Get App Details
 * @apiName GetApp
 * @apiGroup Apps
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} slug App slug identifier
 * 
 * @apiSuccess {Object} app App details
 * @apiSuccess {Number} app.id App ID
 * @apiSuccess {String} app.name App name
 * @apiSuccess {String} app.description App description
 * 
 * @apiError {Object} 404 App not found
 * @apiError {Object} 500 Internal server error
 */
export const getApp = api<GetAppParams, App>(
  { expose: true, method: 'GET', path: '/apps/:slug' },
  async ({ slug }) => {
    // Implementation
  }
);
```

### Documentation Types

#### README Files
- Project overview and setup instructions
- Quick start guide
- Basic usage examples
- Links to detailed documentation

#### API Documentation
- Endpoint descriptions
- Request/response schemas
- Error codes and messages
- Usage examples

#### User Guides
- Step-by-step tutorials
- Feature explanations
- Troubleshooting guides
- Best practices

#### Developer Guides
- Architecture overview
- Development setup
- Contribution guidelines
- Deployment instructions

## Community

### Communication Channels

#### GitHub
- **Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Pull Requests**: Code contributions

#### Discord
- **General**: General discussion
- **Development**: Technical discussions
- **Help**: Get help from the community

#### Social Media
- **Twitter**: [@Web3Store](https://twitter.com/web3store)
- **LinkedIn**: [Web3Store](https://linkedin.com/company/web3store)

### Community Guidelines

#### Be Respectful
- Treat all community members with respect
- Be patient with newcomers
- Provide constructive feedback
- Help others learn and grow

#### Be Collaborative
- Share knowledge and resources
- Work together on solutions
- Credit others for their contributions
- Build on each other's ideas

#### Be Professional
- Use appropriate language
- Stay on topic in discussions
- Respect different opinions and approaches
- Focus on the project's goals

### Getting Help

#### Before Asking for Help
1. **Search Documentation**: Check existing docs
2. **Search Issues**: Look for similar problems
3. **Try Debugging**: Attempt to solve it yourself
4. **Prepare Details**: Gather relevant information

#### When Asking for Help
- **Be Specific**: Describe the exact problem
- **Provide Context**: Share relevant code and environment details
- **Show Effort**: Explain what you've already tried
- **Be Patient**: Wait for responses and follow up appropriately

### Recognition

#### Contributors
We recognize contributors in several ways:
- **Contributors List**: Listed in README and documentation
- **Release Notes**: Mentioned in release announcements
- **Social Media**: Highlighted on our social channels
- **Swag**: Occasional contributor swag for significant contributions

#### Maintainers
Active contributors may be invited to become maintainers with additional responsibilities:
- **Code Review**: Review pull requests
- **Issue Triage**: Help organize and prioritize issues
- **Community Support**: Help answer questions and guide new contributors
- **Project Direction**: Participate in project planning and decisions

---

Thank you for contributing to Web3Store! Your contributions help make the decentralized app ecosystem more accessible and user-friendly for everyone.

For questions about contributing, reach out to us at [contributors@web3store.com](mailto:contributors@web3store.com) or join our [Discord community](https://discord.gg/web3store).
