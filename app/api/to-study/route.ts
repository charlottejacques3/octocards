import { NextResponse } from "next/server";
import { parseUrlParams } from "../helpers";
import { getCardsToStudy } from "../cards";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = parseUrlParams(searchParams.get('due') ?? undefined, searchParams.get('folder') ?? undefined, searchParams.get('deck') ?? undefined);

  const cards = await getCardsToStudy(parsed.due, parsed.category, parsed.categoryId);
  return NextResponse.json(cards);
}