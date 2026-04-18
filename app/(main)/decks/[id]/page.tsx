import { Deck, CardOverview } from "@/lib/definitions";
import { getDeck } from "@/app/api/decks";
import { getCardOverviews } from "@/app/api/cards";
import { getCardCounts } from "@/app/api/counts";
import DeckPage from "./DeckPage";
import NotFound from "@/app/components/NotFound";

const page = async ({ params } : { params: Promise<{id: number}> }) => {

  const deckId = (await params).id;
  try {
    const [deck, cards, allCount, dueCount]:[Deck, CardOverview[], number, number] = await Promise.all([
      getDeck(deckId), 
      getCardOverviews(deckId), 
      getCardCounts(false, 'deck', deckId), 
      getCardCounts(true, 'deck', deckId)
    ]);
    return (
      <div className='w-full'>
        <DeckPage deck={deck} cards={cards} allCount={allCount} dueCount={dueCount}/>
      </div>
    );
  } catch (e) {
    return <NotFound message='Error loading data, please try again' fullscreen/>;
  }
}

export default page