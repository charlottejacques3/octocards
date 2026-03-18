'use client'
import React, { useState, useEffect, ReactNode } from 'react'
import Image from 'next/image'
import Modal from './Modal'

interface Props {
  content: string,
  menuOpen: boolean,
  setMenuOpen: (open: boolean) => void,
  setUpdateModalOpen: (open: boolean) => void,
  setDeleteModalOpen: (open: boolean) => void,
  short?: boolean,
  otherSide?: string,
  href?: string,
}

const Card:React.FC<Props> = ({ content, menuOpen, setMenuOpen, setUpdateModalOpen, setDeleteModalOpen, short=true, otherSide, href }) => {

  const [menuIconVisible, setMenuIconVisible] = useState<boolean>(false);
  // const [updateModalOpen, setUpdateModelOpen] = useState<boolean>(false);
  // const [deleteModalOpen, setDeleteModelOpen] = useState<boolean>(false);

  const menuItemStyles = 'p-2 cursor-pointer hover:bg-bg-secondary-hover';

  useEffect(() => {
    if (!menuOpen) {
      setMenuIconVisible(false);
    }
  }, [menuOpen]);

  return (
    <>
    <div 
      className='bg-bg-secondary rounded-lg mr-4 mt-2 w-64 relative' 
      onMouseEnter={() => setMenuIconVisible(true)}
      onMouseLeave={() => !menuOpen && setMenuIconVisible(false)}
      onClick={(e) => e.stopPropagation()}
    >

      {/* dropdown menu */}
      <div className={`z-10 shadow-xl absolute left-60 rounded-lg top-3 bg-bg-secondary border border-text-secondary ${!menuOpen && 'hidden'}`}>
        <div className={`${menuItemStyles} border-b border-b-text-secondary`} onClick={() => {setUpdateModalOpen(true); setMenuOpen(false)}}>Edit</div>
        <div className={menuItemStyles} onClick={() => {setDeleteModalOpen(true); setMenuOpen(false)}}>Delete</div>
      </div>

      {/* card content */}
      <div className='m-5'>
        <Image
          src='/three_dots.png' height={12} width={12} alt='Three dots menu icon'
          className={`cursor-pointer float-right w-3 h-3 ${!menuIconVisible && 'hidden'}`}
          onClick={() => setMenuOpen(!menuOpen)}
        />
        <div className='h-full w-full bg-'>
          <h4>{content}</h4>
        </div>
      </div>
    </div>

    
    </>
  )
}

export default Card