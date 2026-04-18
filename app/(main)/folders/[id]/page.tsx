import { Folder, Deck } from "@/lib/definitions";
import { getFolder } from "@/app/api/folders";
import { getDecks } from "@/app/api/decks";
import { getCardCounts } from "@/app/api/counts";
import FolderPage from "./FolderPage";
import NotFound from "@/app/components/NotFound";

const page = async ({ params } : { params: Promise<{id: number}> }) => {

  const folderId = (await params).id;
  try {
    const [decks, folder, allCount, dueCount]:[Deck[], Folder, number, number] = await Promise.all([
      getDecks(folderId), 
      getFolder(folderId), 
      getCardCounts(false, 'folder', folderId), 
      getCardCounts(true, 'folder', folderId)
    ]);
    return (
      <div className='w-full'>
        <FolderPage folder={folder} decks={decks} allCount={allCount} dueCount={dueCount}/>
      </div>
    );
  } catch (e) {
    console.log(e);
    return <NotFound message='Error loading data, please try again' fullscreen/>;
  }
}

export default page