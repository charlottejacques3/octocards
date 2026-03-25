'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const SideNav = () => {
  
  const [expanded, setExpanded] = useState<boolean>(true);
  const routes = [
    { text: 'Home', href: '/' },
    { text: 'Study Sets', href: '/study-sets' },
    { text: 'Account', href: '/account' }
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
              <Link href={route.href} className='hover:underline'>{route.text}</Link>
            </div>
          )}
        </div>
      : <Image 
          src='menu.png' width={20} height={20} alt='Menu icon' 
          onClick={() => setExpanded(true)}
          className='cursor-pointer m-5 w-5 h-5'
        />}
    </>
  )
}

export default SideNav