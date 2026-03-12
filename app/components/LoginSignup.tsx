'use client'

import React from 'react'
import Link from 'next/link'
import { FieldValues, useForm } from 'react-hook-form'
import { AuthEnum } from '@/lib/definitions'

interface Props {
  type: AuthEnum,
  action: (data: FieldValues) => void,
}

type Inputs = {
  name: string,
  email: string,
  password: string
}

const LoginSignup:React.FC<Props> = ({ type, action }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  return (
    <div className='bg-bg flex flex-col justify-center h-screen sm:-translate-y-10'>
      <div className='bg-bg-secondary lg:w-1/3 sm:w-2/3 w-full sm:h-fit h-full m-auto p-5'>
        <h1 className='mb-10 w-full text-center'>octocards</h1>
        <form onSubmit={handleSubmit((data) => action(data))}>
          {type === AuthEnum.SIGNUP && <>
            <input {...register('name', { required: true })} autoComplete='off' placeholder='First Name'/>
            {errors.name && <span className='text-red-600'>Please fill out this field</span>}
          </>}
          <input {...register('email', { required: true, pattern: /^[A-Za-z0-9]+@[A-Za-z0-9]+.[A-Za-z0-9]+$/i})} autoComplete='off' placeholder='Email'/>
          {errors.email && <span className='text-red-600'>Please enter a valid email</span>}
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