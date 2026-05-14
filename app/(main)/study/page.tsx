import { getCardsToStudy } from "@/app/api/studying";
import { parseUrlParams } from "@/app/api/helpers";
import { ItemsDue } from "@/lib/definitions";
import StudyPage from "./StudyPage";
import NotFound from "@/app/components/NotFound";

const page = async ({ searchParams } : { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {

  // parse url parameters
  const params = await searchParams;
  const parsed = parseUrlParams(params.due, params.folder, params.deck);

  try {
    const cards:ItemsDue = await getCardsToStudy(parsed.due, parsed.category, parsed.categoryId);
    return <StudyPage items={cards} due={parsed.due} category={parsed.category} categoryId={parsed.categoryId}/>
  } catch (e) {
    console.log(e);
    return <NotFound message="Cards not found"/>
  }
}

export default page