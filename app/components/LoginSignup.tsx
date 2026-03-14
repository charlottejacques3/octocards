import React from 'react'
import Link from 'next/link'
import { FieldValues, useForm } from 'react-hook-form'
import { AuthEnum } from '@/lib/definitions'

interface Props {
  type: AuthEnum,
  action: (data: FieldValues) => void,
  error?: string
}

type Inputs = {
  name: string,
  username: string,
  password: string
}

const LoginSignup:React.FC<Props> = ({ type, action, error='' }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  return (
    <div className='bg-bg flex flex-col justify-center h-screen sm:-translate-y-10'>
      <div className='bg-bg-secondary lg:w-1/3 sm:w-2/3 w-full sm:h-fit h-full m-auto p-5 rounded-lg'>
        <h1 className='mb-10 w-full text-center'>octocards</h1>
        <form onSubmit={handleSubmit((data) => action(data))}>
          {error && <div className='bg-red-200 text-red-600 p-1 rounded-lg'>{error}</div>}
          {type === AuthEnum.SIGNUP && <>
            <input {...register('name', { required: true })} autoComplete='off' placeholder='First Name'/>
            {errors.name && <span className='text-red-600'>Please fill out this field</span>}
          </>}
          <input {...register('username', { required: true })} autoComplete='off' placeholder='Username'/>
          {errors.username && <span className='text-red-600'>Please enter a valid username</span>}
          <input {...register('password', { required: true, minLength: 6 })} type='password' autoComplete='off' placeholder='Password'/>
          {errors.password && <span className='text-red-600'>Please enter a passcode of at least 6 characters in length</span>}
          <button className='w-full mt-3 mb-5' type='submit'><h4>{type}</h4></button>
        </form>
        <p className='text-xs'>
          {type === AuthEnum.LOGIN ?
            <>Don't have an account? <Link href='/signup' className='underline hover:font-semibold'>Sign Up</Link></>
            : <>Already have an account? <Link href='/login' className='underline hover:font-semibold'>Log In</Link></>
          }
        </p>
      </div>
    </div>
  )
}

export default LoginSignup