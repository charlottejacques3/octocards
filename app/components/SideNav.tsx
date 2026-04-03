'use client'
import { useState } from 'react'
import Image from 'next/image'
import Button from './Button'
import { logout } from '../api/logout'

const SideNav = () => {
  
  const [expanded, setExpanded] = useState<boolean>(true);
  const routes = [
    { text: 'Home', href: '/' },
    { text: 'Study Sets', href: '/study-sets' }
  ]

  return (
    <>
      {expanded ? 
        <div className='bg-bg-secondary m-5 p-5 w-64 rounded-lg h-fit'>
          <Image 
            src='/back.png' width={20} height={20} alt='Menu close icon' 
            onClick={() => setExpanded(false)}
            className='cursor-pointer float-right w-5 h-5'
          />
          {routes.map((route) => 
            <div key={route.text} className='mb-2'>
              <Button href={route.href} priority='underline'>{route.text}</Button>
            </div>
          )}
          <Button priority='underline' onClick={() => logout()}>Log Out</Button>
        </div>
      : <Image 
          src='/menu.png' width={20} height={20} alt='Menu icon' 
          onClick={() => setExpanded(true)}
          className='cursor-pointer m-5 w-5 h-5'
        />}
    </>
  )
}

export default SideNav