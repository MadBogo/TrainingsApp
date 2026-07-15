// jest-axe ships no TypeScript declarations of its own. This must stay a global script file
// (no top-level import/export) — in a module file, `declare module` only augments an
// *existing* module's types rather than creating a brand new one, which silently fails to
// register "jest-axe" at all. The vitest matcher augmentation lives in vitest-matchers.d.ts.
declare module "jest-axe";
