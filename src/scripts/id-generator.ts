const counter: Record<string, number> = {};

export function getUniqueId(base: string): string {
  if (!counter[base]) counter[base] = 0;

  counter[base]++;

  return `${base}-${counter[base]}`;
}
