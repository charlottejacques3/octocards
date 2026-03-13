'use client'
import LoginSignup from '../components/LoginSignup'
import { AuthEnum } from '@/lib/definitions'
import { FieldValues } from 'react-hook-form'
import { login } from '@/api/auth'

async function handleLogin(data: FieldValues) {
  console.log(data);
  login(data.username, data.password);
}

const page = () => {
  return (
    <LoginSignup type={AuthEnum.LOGIN} action={handleLogin}/>
  )
}

export default page