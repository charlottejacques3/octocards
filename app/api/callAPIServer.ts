'use server'
import { cookies } from "next/headers"
import { APICallOptions, callAPI } from "./helpers"

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