import { getCardsToStudy } from "@/api/cards";
import { CardOverview } from "@/lib/definitions";
import StudyPage from "./StudyPage";
import NotFound from "@/app/components/NotFound";

const page = async ({ searchParams } : { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {

  // parse url parameters
  const params = await searchParams;
  const due = params.due === 'true';
  let category;
  let categoryId;
  if (params.folder) {
    category = 'folder';
    categoryId = Number(params.folder);
  } else if (params.deck) {
    category = 'deck';
    categoryId = Number(params.deck);
  }

  try {
    const cards:CardOverview[] = await getCardsToStudy(due, category, categoryId);
    return <StudyPage cards={cards} due={due}/>
  } catch (e) {
    return <NotFound message="Cards not found"/>
  }
}

export default page