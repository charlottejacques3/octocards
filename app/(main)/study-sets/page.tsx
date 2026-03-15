import { cookies } from 'next/headers'
import { Folder } from '@/lib/definitions';
import { getFolders } from '@/api/folders'
import StudySets from './StudySets';

const page = async () => {
  const cookieHeader = (await cookies()).toString();
  try {
    const folders:Folder[] = await getFolders(cookieHeader);
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