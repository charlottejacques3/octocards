import { Folder } from '@/lib/definitions';
import { getFolders } from '@/api/folders'
import StudySets from './StudySets';

const page = async () => {
  try {
    const folders:Folder[] = await getFolders();
    return (
      <div className='w-full'>
        <StudySets folders={folders} error={false}/>
      </div>
    );
  } catch (e) {
    return <StudySets error={true}/>;
  }
}

export default page