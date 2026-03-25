import { cookies } from 'next/headers'
import { me } from '@/api/auth'
import Homepage from './Homepage';

export default async function Home() {

  const cookieHeader = (await cookies()).toString();
  let user;
  try {
    user = await me(cookieHeader);
  } catch (e) {
    user = '';
  }

  try {
    //fetch data
    return (
      <Homepage username={user}/>
    );
  } catch {
    return (
      <Homepage username={user} error/>
    );
  }
}
