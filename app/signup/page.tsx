'use client'
import LoginSignup from '../components/LoginSignup'
import { AuthEnum } from '@/lib/definitions'
import { FieldValues } from 'react-hook-form'
import { signup } from '@/api/auth'

async function handleSignup(data: FieldValues) {
  console.log(data);
  signup(data.name, data.username, data.password);
}

const page = () => {
  return (
    <LoginSignup type={AuthEnum.SIGNUP} action={handleSignup}/>
  )
}

export default page