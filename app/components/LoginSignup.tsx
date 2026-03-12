import React from 'react'
import { AuthEnum } from '@/lib/definitions'
import Button from './Button'

interface Props {
  type: AuthEnum,
  action: () => void
}

const LoginSignup:React.FC<Props> = ({ type, action }) => {
  return (
    <div className='bg-bg flex flex-col justify-center h-screen -translate-y-10'>
      <div className='bg-bg-secondary w-1/3 m-auto'>
        <h1>octocards</h1>
        <form>
          <input type='text' name='username' placeholder='Username'/><br/>
          <input type='password' name='password' placeholder='Password'/>
          <button className='' type='submit'>{type}</button>
        </form>
      </div>
    </div>
  )
}

export default LoginSignup