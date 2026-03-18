'use server'
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { FolderSchema } from "@/lib/definitions";
import { callAPIServer } from "./callAPIServer";


export const getFolders = async () => {
  const res = await callAPIServer('folders/');
  return await res.json();
}


export const createFolder = async (newName: string) => {
  const { name } = FolderSchema.omit({ id: true}).parse({
    name: newName
  })
  const res = await callAPIServer(`folders/`, {
    method: 'POST',
    body: JSON.stringify({name}),
  });
  revalidatePath('/');
  return await res.json();
}


export const updateFolder = async (idNum: number, newName: string) => {
  const { id, name } = FolderSchema.parse({
    id: idNum,
    name: newName
  })
  const res = await callAPIServer(`folders/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({name}),
  });
  revalidatePath('/');
  return await res.json();
}


export const deleteFolder = async (id: number) => {
  await callAPIServer(`folders/${id}/`, {
    method: 'DELETE',
  });
  revalidatePath('/');
}