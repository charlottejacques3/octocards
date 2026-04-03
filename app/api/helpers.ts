export type APICallOptions = {
  method?: string,
  body?: string,
  header?: {}
}

export const callAPI = async (path: string, options: APICallOptions={}) => {
  const res = await fetch(`http://localhost:8000/${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.header ?? {})
    },
    ...options
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`, { cause: res.status });
  }
  return res;
}


export const parseUrlParams = (dueStr?: string, folder?: string, deck?: string) => {
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