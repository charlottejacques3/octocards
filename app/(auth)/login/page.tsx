'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginSignup from '../../components/LoginSignup'
import { AuthEnum } from '@/lib/definitions'
import { FieldValues } from 'react-hook-form'
import { login } from '@/app/api/auth'

const page = () => {

  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLogin = async (data: FieldValues) => {
    setIsSubmitting(true);
    try {
      await login(data.username, data.password);
      router.push('/');
    } catch (e) {
      const err = e as Error;
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LoginSignup type={AuthEnum.LOGIN} action={handleLogin} submitting={isSubmitting} error={error}/>
  )
}

export default page