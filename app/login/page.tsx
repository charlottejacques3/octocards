import React from 'react'
import LoginSignup from '../components/LoginSignup'
import { AuthEnum } from '@/lib/definitions'

const page = () => {
  return (
    <LoginSignup type={AuthEnum.LOGIN} action={() => {}}/>
  )
}

export default page