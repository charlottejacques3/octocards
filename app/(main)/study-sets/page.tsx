import { Folder } from '@/lib/definitions';
import { getFolders } from '@/app/api/folders'
import StudySets from './StudySets';
import NotFound from '@/app/components/NotFound';

const page = async () => {
  try {
    const folders:Folder[] = await getFolders();
    return (
      <div className='w-full'>
        <StudySets folders={folders}/>
      </div>
    );
  } catch (e) {
    return <NotFound message='Error loading folders, please try again'/>
  }
}

export default page