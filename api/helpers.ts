import { cookies } from "next/headers";

type APICallOptions = {
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
    throw new Error('Request failed', { cause:res.status });
  }
  return res;
}

export const callAPIServer = async (path: string, options: APICallOptions={}) => {

  const cookieStore = await cookies();
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const cookieHeader = cookieStore.toString();

  return await callAPI(path, {
    header: {
      'cookie': cookieHeader,
      'X-CSRFToken': csrftoken ?? '',
      ...(options.header ?? {})
    },
    ...options
  })
}