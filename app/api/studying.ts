import { callAPIServer } from "./callAPIServer";
import { ItemsDueSchema } from "@/lib/definitions";

export const getCardsToStudy = async (due: boolean, category?: string, categoryId?: number) => {
  const url = `items/to-study/?due=${due}${(category && categoryId) ? `&${category}=${categoryId}` : ''}`;
  const res = await callAPIServer(url);
  return ItemsDueSchema.parse(await res.json());
}