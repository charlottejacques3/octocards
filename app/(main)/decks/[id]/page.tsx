import { Deck, CardOverview } from "@/lib/definitions";
import { getDeck } from "@/app/api/decks";
import { getCardOverviews } from "@/app/api/cards";
import DeckPage from "./DeckPage";
import NotFound from "@/app/components/NotFound";

const page = async ({ params } : { params: Promise<{id: number}> }) => {

  const deckId = (await params).id;
  try {
    const deck:Deck = await getDeck(deckId);
    const cards:CardOverview[] = await getCardOverviews(deckId);
    return (
      <div className='w-full'>
        <DeckPage deck={deck} cards={cards}/>
      </div>
    );
  } catch (e) {
    return <NotFound message='Error loading data, please try again'/>;
  }
}

export default page