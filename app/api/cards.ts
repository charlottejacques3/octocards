'use server'
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CardSchema, CardOverviewSchema } from "@/lib/definitions";
import { callAPIServer } from "./callAPIServer";


export const getCardOverviews = async (deckId: number) => {
  const CardsSchema = z.array(CardOverviewSchema);
  const res = await callAPIServer(`cards/by-deck/${deckId}`);
  const cards = CardsSchema.parse(await res.json());
  return cards;
}


export const getCardsToStudy = async (due: boolean, category?: string, categoryId?: number) => {
  const url = `cards/to-study/?due=${due}${(category && categoryId) ? `&${category}=${categoryId}` : ''}`;
  const CardsSchema = z.array(CardOverviewSchema);
  const res = await callAPIServer(url);
  return CardsSchema.parse(await res.json());
}


export const createCard = async (q: string, a:string, deckId: number) => {
  const { question, answer, deck } = CardOverviewSchema.omit({ id: true}).parse({
    question: q,
    answer: a,
    deck: deckId
  });
  const res = await callAPIServer(`cards/`, {
    method: 'POST',
    body: JSON.stringify({question, answer, deck}),
  });
  revalidatePath('/');
  return await res.json();
}


export const updateCard = async (idNum: number, q: string, a:string) => {
  const { id, question, answer } = CardOverviewSchema.omit({ deck: true}).parse({
    id: idNum,
    question: q,
    answer: a,
  });
  const res = await callAPIServer(`cards/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({question, answer}),
  });
  revalidatePath('/');
  return await res.json();
}


export const deleteCard = async (id: number) => {
  await callAPIServer(`cards/${id}/`, {
    method: 'DELETE',
  });
  revalidatePath('/');
}


export const studyCard = async (id: number, response: string, lastCard: boolean) => {
  await callAPIServer(`cards/${id}/study-card/${response}/`, {
    method: 'PATCH',
  });
}