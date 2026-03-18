'use server'
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { FolderSchema } from "@/lib/definitions";
import { callAPIServer } from "./callAPIServer";


export const getFolders = async () => {
  const FoldersSchema = z.array(FolderSchema);
  const res = await callAPIServer('folders/');
  const folders = FoldersSchema.parse(await res.json());
  return folders;
}


export const getFolder = async (id: number) => {
  const res = await callAPIServer(`folders/${id}`);
  const folder = FolderSchema.parse(await res.json());
  return folder;
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