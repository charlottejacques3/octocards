export type APICallOptions = {
  method?: string,
  body?: string,
  header?: {}
}

export const callAPI = async (path: string, options: APICallOptions={}) => {
  const res = await fetch(`https://octocards.vercel.app/api/${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://octocards.vercel.app/',
      ...(options.header ?? {})
    },
    ...options
  });
  if (!res.ok) {
    const text = await res.text();
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