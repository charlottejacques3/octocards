import { Deck, Folder } from '@/lib/definitions';
import { getFolders } from '@/app/api/folders'
import StudySets from './StudySets';
import { getDecks } from '@/app/api/decks';

const page = async () => {
  const folders:Promise<Folder[]> = getFolders();
  const uncategorizedDecks:Promise<Deck[]> = getDecks();
  return (
    <div className='w-full'>
      <StudySets foldersPromise={folders} decksPromise={uncategorizedDecks}/>
    </div>
  );
}

export default page