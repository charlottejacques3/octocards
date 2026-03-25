'use client'
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'

interface Props {
  username: string,
  error?: boolean
}

const Homepage:React.FC<Props> = ({ username, error }) => {

  const toastShownRef = useRef(false);

  useEffect(() => {
    if (error && !toastShownRef.current) {
      toast.error('Failed to load data');
      toastShownRef.current = true;
    } else if (!error) {
      toastShownRef.current = false;
    }
  }, [error]);

  return (
    <div className='w-full h-screen'>
      <h1>{username ? `Hello, ${username}!` : 'Welcome back!'}</h1> 
      <h4>You have </h4>
    </div>
  )
}

export default Homepage