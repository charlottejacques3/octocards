import React from 'react'
import LoginSignup from '../components/LoginSignup'
import { AuthEnum } from '@/lib/definitions'
import { FieldValues } from 'react-hook-form'

async function handleSignup(data: FieldValues) {
  'use server'
  console.log(data);
}

const page = () => {
  return (
    <LoginSignup type={AuthEnum.SIGNUP} action={handleSignup}/>
  )
}

export default page