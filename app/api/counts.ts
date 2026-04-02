'use server'
import { callAPIServer } from "./callAPIServer"


export const getCardCounts = async (due: boolean, category?: string, categoryId?: number) => {
  const url = `cards/count/?due=${due}${(category && categoryId) ? `&${category}=${categoryId}` : ''}`;
  const res = await callAPIServer(url);
  const data = await res.json();
  if (data.count != undefined) {
    return data.count;
  } else {
    throw new Error('Count not found');
  }
}


export const getAllFolderDueCounts = async () => {
  const res = await callAPIServer('folders/due-count/');
  const data = await res.json();
  return data;
}