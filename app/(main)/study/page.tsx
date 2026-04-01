import { getCardsToStudy } from "@/app/api/cards";
import { parseUrlParams } from "@/app/api/helpers";
import { CardOverview } from "@/lib/definitions";
import StudyPage from "./StudyPage";
import NotFound from "@/app/components/NotFound";

const page = async ({ searchParams } : { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {

  // parse url parameters
  const params = await searchParams;
  const parsed = parseUrlParams(params.due, params.folder, params.deck);

  try {
    const cards:CardOverview[] = await getCardsToStudy(parsed.due, parsed.category, parsed.categoryId);
    console.log(cards);
    return <StudyPage cards={cards} due={parsed.due} category={parsed.category} categoryId={parsed.categoryId}/>
  } catch (e) {
    return <NotFound message="Cards not found"/>
  }
}

export default page