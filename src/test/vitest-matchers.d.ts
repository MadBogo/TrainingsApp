// Augments vitest's Assertion type with the jest-axe custom matcher registered in
// src/test/setup.ts via `expect.extend(toHaveNoViolations)`. Must be a module (the
// top-level export{}) for `declare module "vitest"` to augment rather than replace it.
export {};

interface AxeMatchers<R = unknown> {
  toHaveNoViolations(): R;
}

declare module "vitest" {
  interface Assertion<T = unknown> extends AxeMatchers<T> {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
