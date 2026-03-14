'use client'
import { useState } from 'react'
import LoginSignup from '../components/LoginSignup'
import { AuthEnum } from '@/lib/definitions'
import { FieldValues } from 'react-hook-form'
import { login } from '@/api/auth'

const page = () => {

  const [error, setError] = useState<string>('');

  const handleLogin = async (data: FieldValues) => {
    try {
      await login(data.username, data.password);
    } catch (e) {
      const err = e as Error;
      setError(err.message);
    }
  }

  return (
    <LoginSignup type={AuthEnum.LOGIN} action={handleLogin} error={error}/>
  )
}

export default page