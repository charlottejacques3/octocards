'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginSignup from '../../components/LoginSignup'
import { AuthEnum } from '@/lib/definitions'
import { FieldValues } from 'react-hook-form'
import { signup } from '@/app/api/auth'

const page = () => {

  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleSignup = async (data: FieldValues) => {
    try {
      await signup(data.name, data.username, data.password);
      router.push('/');
    } catch (e) {
      const err = e as Error;
      setError(err.message);
    }
  }

  return (
    <LoginSignup type={AuthEnum.SIGNUP} action={handleSignup} error={error}/>
  )
}

export default page