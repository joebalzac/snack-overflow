// Allows side-effect CSS imports (e.g. import './globals.css') without TS errors.
// Next.js handles the actual bundling; TypeScript just needs to know the module exists.
declare module "*.css" {}
