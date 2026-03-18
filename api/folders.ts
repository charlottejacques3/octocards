'use server'
import { cookies } from "next/headers";
import { callAPI } from "./helpers";
import { revalidatePath } from "next/cache";

const cookieStore = await cookies();
const csrftoken = cookieStore.get("csrftoken")?.value;
const cookieHeader = cookieStore.toString();


export const getFolders = async () => {
  try {
    const res = await callAPI('folders/', {
      header: {'cookie': cookieHeader}
    });
    return await res.json();
  } catch (e) {
    console.error('Error fetching folders');
    throw new Error('Failed to fetch folders');
  }
}


export const updateFolder = async (id: number, newName: string) => {
  try {
    const res = await callAPI(`folders/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({name: newName}),
      header: {
        'cookie': cookieHeader,
        'X-CSRFToken': csrftoken ?? '',
      }
    });
    revalidatePath('/');
    return await res.json();
  } catch (e) {
    console.error('Error updating folder');
    throw new Error('Failed to update folder');
  }
}