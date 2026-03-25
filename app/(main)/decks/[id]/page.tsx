import { Deck, CardOverview } from "@/lib/definitions";
import { getDeck } from "@/api/decks";
import { getCardOverviews } from "@/api/cards";
import DeckPage from "./DeckPage";

const page = async ({ params } : { params: Promise<{id: number}> }) => {

  const deckId = (await params).id;
  try {
    const deck:Deck = await getDeck(deckId);
    const cards:CardOverview[] = await getCardOverviews(deckId);
    return (
      <div className='w-full'>
        <DeckPage deck={deck} cards={cards} error={false}/>
      </div>
    );
  } catch (e) {
    return <DeckPage error={true}/>;
  }
}

export default page