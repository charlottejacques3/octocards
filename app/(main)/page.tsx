import { cookies } from 'next/headers'
import { DueCount } from '@/lib/definitions';
import { me } from '@/app/api/auth'
import { getCardCounts, getAllFolderDueCounts, getUncategorizedDeckDueCounts } from '@/app/api/counts';
import Homepage from './Homepage';
import NotFound from '../components/NotFound';

export default async function Home() {

  const cookieHeader = (await cookies()).toString();
  let user;
  try {
    user = await me(cookieHeader);
  } catch (e) {
    user = '';
  }

  try {
    const totalCount:number = await getCardCounts(true);
    const folderDueCounts:DueCount[] = await getAllFolderDueCounts();
    const uncategorizedDeckDueCounts:DueCount[] = await getUncategorizedDeckDueCounts();
    return (
      <Homepage username={user} totalCount={totalCount} folderDueCounts={folderDueCounts} uncategorizedDeckDueCounts={uncategorizedDeckDueCounts}/>
    );
  } catch (e) {
    console.log(e);
    return (
      <NotFound/>
    );
  }
}
