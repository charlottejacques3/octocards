import { cookies } from 'next/headers'
import { DueCount } from '@/lib/definitions';
import { me } from '@/app/api/auth'
import { getCardCounts, getAllFolderDueCounts, getUncategorizedDeckDueCounts } from '@/app/api/counts';
import Homepage from './Homepage';

export default async function Home() {

  const cookieHeader = (await cookies()).toString();
  let user;
  try {
    user = await me(cookieHeader);
  } catch (e) {
    user = '';
  }

  const promises:Promise<[number, DueCount[], DueCount[]]> = Promise.all([getCardCounts(true), getAllFolderDueCounts(), getUncategorizedDeckDueCounts()]);

  return (
    <Homepage username={user} promises={promises}/>
  );
}
