import { Folder, Deck } from "@/lib/definitions";
import { getFolder } from "@/api/folders";
import { getDecks } from "@/api/decks";
import FolderPage from "./FolderPage";
import NotFound from "@/app/components/NotFound";

const page = async ({ params } : { params: Promise<{id: number}> }) => {

  const folderId = (await params).id;
  try {
    const decks:Deck[] = await getDecks(folderId);
    const folder:Folder = await getFolder(folderId);
    return (
      <div className='w-full'>
        <FolderPage folder={folder} decks={decks}/>
      </div>
    );
  } catch (e) {
    return <NotFound message='Error loading data, please try again'/>;
  }
}

export default page