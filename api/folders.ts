import { callAPI } from "./helpers";

export const getFolders = async (cookie: string) => {
  try {
    const res = await callAPI('folders/', {
      header: {'cookie': cookie}
    });
    return await res.json();
  } catch (e) {
    console.error('Error fetching courses');
    throw new Error('Failed to fetch courses');
  }
}

