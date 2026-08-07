export async function fetchJson<T>(input: string) {
  const response = await fetch(input, {
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
