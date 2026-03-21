/** Get attribute from model or plain row */
export function attr(obj: unknown, key: string): unknown {
  if (!obj) return undefined;
  const r = obj as Record<string, unknown>;
  return typeof r["getAttribute"] === "function" ? (r["getAttribute"] as (k: string) => unknown)(key) : r[key];
}
