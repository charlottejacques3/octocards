import { cookies } from 'next/headers'
import { Folder } from '@/lib/definitions';
import { getFolders } from '@/api/folders'
import StudySets from './StudySets';

const page = async () => {
  try {
    const folders:Folder[] = await getFolders();
    return (
      <div className='w-full'>
        <StudySets folders={folders}/>
      </div>
    );
  } catch (e) {
    return <StudySets error/>;
  }
}

export default page