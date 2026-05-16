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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSignup = async (data: FieldValues) => {
    setIsSubmitting(true);
    try {
      await signup(data.name, data.username, data.password);
      router.push('/');
    } catch (e) {
      const err = e as Error;
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LoginSignup type={AuthEnum.SIGNUP} action={handleSignup} submitting={isSubmitting} error={error}/>
  )
}

export default page