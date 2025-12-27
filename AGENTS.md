# AGENTS.md - obelism-react-svg Development Guidelines

## Important Guidelines

- **NEVER interact with git** - Do not use git commands, create commits, push changes, or modify repository state
- Always use absolute file paths, never rely on changing directories
- Run tests and builds before considering work complete

## Build, Lint & Test Commands

- **Build**: `npm run build` - Bundles source via bunchee to dist/
- **Lint**: `npm run lint` - Check code with Biome; use `npm run lint:fix` to auto-fix
- **Format**: `npm run format` - Format code with Biome (tabs, semicolons as needed, trailing commas)
- **Test**: `npm run test` - Run tests in watch mode with Vitest (jsdom environment)
- **Test single**: `npm run test -- --run tests/main.test.tsx` - Run specific test file once
- **Test UI**: `npm run test:ui` - Open interactive Vitest UI

## Code Style & Guidelines

**Imports & Organization**:
- Use ES modules (import/export)
- Biome auto-organizes imports via `organizeImports: "on"`
- Organize by: external packages → relative paths

**Formatting**:
- **Indentation**: Tabs
- **Semicolons**: As needed (not required at end of statements)
- **Trailing commas**: Always include in multi-line structures
- **Line length**: Follow Biome defaults

**Types & TypeScript**:
- Strict mode enabled (`strict: true`)
- Require return types on functions and exports
- No unused locals/parameters (`noUnusedLocals/Parameters: true`)
- Target: ES2018, JSX: react
- Full type safety required

**React Conventions**:
- Components use JSX with React 19
- Hooks: `useContext`, `useEffect` supported
- Functional components only
- Export components to enable type inference for consumers

**Error Handling**:
- Throw meaningful errors with context
- Use try-catch for async fetch operations in hooks
- Validate SVG map configuration at setup time

**Naming Conventions**:
- Components: PascalCase (`SvgProvider`, `Svg`)
- Functions: camelCase (`setupReactSvg`, `formatSvgPath`)
- Types/Interfaces: PascalCase
- Constants: camelCase or UPPER_SNAKE_CASE for magic strings
- Files: kebab-case (`svgGenerator.tsx`, `useSvgLoaded.ts`)

**Project Structure**:
- `/src` - Source code (generators, functions, config, types)
- `/dist` - Build output (excluded from version control)
- `/example` - Next.js demo app
- `/tests` - Vitest test files
