export type PickRequired<T extends Record<string, any>, K extends keyof T> = {
  [P in K]-?: T[P];
} & Omit<T, K>;
