export type APICallOptions = {
  method?: string,
  body?: string,
  header?: {}
}

export const callAPI = async (path: string, options: APICallOptions={}) => {

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

  const res = await fetch(`${baseUrl}api-proxy/${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Referer': baseUrl,
      ...(options.header ?? {})
    },
    ...options
  });
  if (!res.ok) {
    const text = await res.text();
    console.log('error:', text);
    throw new Error(`API error: ${text}`, { cause: res.status });
  }
  return res;
}


export const parseUrlParams = (dueStr?: string|string[], folder?: string|string[], deck?: string|string[]) => {
  const due = dueStr === 'true';
  let category;
  let categoryId;
  if (folder) {
    category = 'folder';
    categoryId = Number(folder);
  } else if (deck) {
    category = 'deck';
    categoryId = Number(deck);
  }
  return {
    due,
    category,
    categoryId
  }
}