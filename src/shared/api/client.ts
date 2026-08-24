/**
 * Minimal fetch wrapper for the mocked /api/* endpoints.
 * There is no backend, so this stays deliberately thin — no generated
 * OpenAPI client, no auth headers, no retries beyond what react-query does.
 */

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const entries = Object.entries(params ?? {}).filter(([, v]) => v !== undefined) as [
    string,
    string | number,
  ][];
  const query = entries.length > 0
    ? `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()}`
    : '';

  const res = await fetch(`${path}${query}`);
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
