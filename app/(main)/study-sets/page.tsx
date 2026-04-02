import { Deck, Folder } from '@/lib/definitions';
import { getFolders } from '@/app/api/folders'
import StudySets from './StudySets';
import NotFound from '@/app/components/NotFound';
import { getDecks } from '@/app/api/decks';

const page = async () => {
  try {
    const folders:Folder[] = await getFolders();
    const uncategorizedDecks:Deck[] = await getDecks();
    return (
      <div className='w-full'>
        <StudySets folders={folders} decks={uncategorizedDecks}/>
      </div>
    );
  } catch (e) {
    console.log(e);
    return <NotFound message='Error loading folders, please try again'/>
  }
}

export default page