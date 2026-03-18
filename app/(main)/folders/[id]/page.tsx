import { Folder, Deck } from "@/lib/definitions";
import { getFolder } from "@/api/folders";
import { getDecks } from "@/api/decks";
import FolderPage from "./FolderPage";

const page = async ({ params } : { params: Promise<{id: number}> }) => {

  const folderId = (await params).id;
  try {
    const decks:Deck[] = await getDecks(folderId);
    const folder:Folder = await getFolder(folderId);
    return (
      <div className='w-full'>
        <FolderPage folder={folder} decks={decks} error={false}/>
      </div>
    );
  } catch (e) {
    return <FolderPage error={true}/>;
  }
}

export default page