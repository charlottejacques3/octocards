import { cookies } from 'next/headers'
import { Folder } from '@/lib/definitions';
import { getFolders } from '@/api/folders'

const page = async () => {
  const cookieHeader = (await cookies()).toString();
  const folders:Folder[] = await getFolders(cookieHeader);

  return (
    <div>
      <h1>Study Sets</h1>
      <h4>Folders</h4>
      {folders.map((folder) => <div key={folder.id}>{folder.name}</div>)}
      <h4>Decks</h4>
    </div>
  )
}

export default page