'use server'
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DeckSchema } from "@/lib/definitions";
import { callAPIServer } from "./callAPIServer";


export const getDecks = async (folderId: number) => {
  const DecksSchema = z.array(DeckSchema);
  const res = await callAPIServer(`decks/by-folder/${folderId}`);
  const decks = DecksSchema.parse(await res.json());
  return decks;
}


export const getDeck = async (id: number) => {
  const res = await callAPIServer(`decks/${id}`);
  const folder = DeckSchema.parse(await res.json());
  return folder;
}


export const createDeck = async (newName: string, folderId: number) => {
  const { name, folder } = DeckSchema.omit({ id: true}).parse({
    name: newName,
    folder: folderId
  })
  const res = await callAPIServer(`decks/`, {
    method: 'POST',
    body: JSON.stringify({name, folder}),
  });
  revalidatePath('/');
  return await res.json();
}


export const updateDeck = async (idNum: number, newName: string) => {
  const { id, name } = DeckSchema.omit({ folder: true}).parse({
    id: idNum,
    name: newName,
  })
  const res = await callAPIServer(`decks/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({name}),
  });
  revalidatePath('/');
  return await res.json();
}


export const deleteDeck = async (id: number) => {
  await callAPIServer(`decks/${id}/`, {
    method: 'DELETE',
  });
  revalidatePath('/');
}