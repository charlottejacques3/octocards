'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useMediaQuery } from 'react-responsive'
import Button from './Button'
import { logout } from '../api/logout'
import backButton from '../../public/back.png'
import menuButton from '../../public/menu.png'

const SideNav = () => {
  
  const largeScreen = useMediaQuery({ query: '(min-width:640px)'})
  const [expanded, setExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setExpanded(largeScreen);
    setLoading(false);
  }, [largeScreen]);

  const routes = [
    { text: 'Home', href: '/' },
    { text: 'Study Sets', href: '/study-sets' }
  ]

  return (
    <>
      {(expanded || loading) && 
        <div className={`
          ${loading && 'hidden sm:block'} 
          bg-bg-secondary p-5 z-20  
          fixed w-full h-full
          sm:static sm:w-64 sm:h-fit sm:m-5 sm:rounded-lg
        `}>
          <Image 
            src={backButton} width={20} height={20} alt='Menu close icon' 
            onClick={() => setExpanded(false)}
            className='cursor-pointer float-right w-5 h-5'
          />
          {routes.map((route) => 
            <div key={route.text} className='mb-2' onClick={() => !largeScreen && setExpanded(false)}>
              <Button href={route.href} priority='underline'>{route.text}</Button>
            </div>
          )}
          <Button priority='underline' onClick={() => logout()}>Log Out</Button>
        </div>
      } {(!expanded || loading) && 
        <Image 
          src={menuButton} width={20} height={20} alt='Menu icon' 
          onClick={() => setExpanded(true)}
          className={`${loading && 'block sm:hidden'} cursor-pointer m-5 w-5 h-5`}
        />
      }
    </>
  )
}

export default SideNav