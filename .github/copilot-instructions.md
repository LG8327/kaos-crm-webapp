<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# KAOS CRM Web Application - Copilot Instructions

This is a Next.js TypeScript web application for the KAOS CRM system, designed to complement the existing iOS app with web-based territory management and lead tracking capabilities.

## Project Context
- **Framework**: Next.js 15 with App Router, TypeScript, and Tailwind CSS
- **Purpose**: Web version of KAOS CRM for territory management, lead tracking, and sales analytics
- **Related**: Shares business logic concepts with the iOS Swift app located at `/Users/lukasgreen/Desktop/kaosFinal`

## Code Generation Guidelines

### Architecture Patterns
- Use Next.js App Router for routing and layouts
- Implement server components by default, client components when needed
- Follow TypeScript strict mode practices
- Use Tailwind CSS for styling with custom design system

### Component Structure
- Create reusable UI components in `src/components/`
- Use proper TypeScript interfaces for props and data structures
- Implement proper error boundaries and loading states
- Follow React best practices for state management

### Shared Business Logic Concepts
When creating features, reference the iOS app structure:
- **Territory Management**: Geographic boundaries, territory assignments
- **Lead Management**: Lead tracking, contact information, activities
- **User Management**: Authentication, roles, permissions
- **Analytics**: Performance metrics, reporting, dashboards

### Database Integration
- Plan for Supabase integration (web client)
- Create TypeScript interfaces that match the iOS Core Data models
- Implement proper error handling for API calls
- Use React Query or SWR for data fetching and caching

### Styling Guidelines
- Use the custom Tailwind configuration with primary/secondary color scheme
- Implement responsive design for mobile, tablet, and desktop
- Create consistent spacing and typography using Tailwind utilities
- Use custom CSS classes for complex components

### File Organization
```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
├── lib/             # Utility functions and configurations
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
└── styles/          # Global styles and Tailwind config
```

### Best Practices
- Always use TypeScript interfaces for data structures
- Implement proper loading and error states
- Use semantic HTML elements for accessibility
- Add proper meta tags for SEO
- Implement proper form validation
- Use environment variables for configuration
- Add proper error logging and monitoring

### Testing Considerations
- Write components that are easily testable
- Use proper data attributes for testing
- Implement proper error boundaries
- Consider accessibility in component design

When generating code, prioritize:
1. **Type Safety**: Use proper TypeScript types
2. **Performance**: Optimize for web performance
3. **Accessibility**: Follow WCAG guidelines
4. **Maintainability**: Write clean, documented code
5. **Consistency**: Follow established patterns
