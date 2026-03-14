import { cookies } from 'next/headers'
import { me } from '@/api/auth'

export default async function Home() {

  const cookieHeader = (await cookies()).toString();
  let user;
  try {
    user = await me(cookieHeader);
  } catch (e) {
    user = '';
  }

  return (
    <>
      {user ? `Hello, ${user}!` : 'Welcome back!'}
    </>
  );
}
