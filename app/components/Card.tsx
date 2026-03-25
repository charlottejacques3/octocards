'use client'
import React, { useState, useEffect, useEffectEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Props {
  content: string,
  menuOpen: boolean,
  setMenuOpen: (open: boolean) => void,
  setUpdateModalOpen: (open: boolean) => void,
  setDeleteModalOpen: (open: boolean) => void,
  flashcard?: boolean,
  otherSide?: string,
  href?: string,
}

const Card:React.FC<Props> = ({ content, menuOpen, setMenuOpen, setUpdateModalOpen, setDeleteModalOpen, flashcard=false, otherSide, href }) => {

  const router = useRouter();
  const [menuIconVisible, setMenuIconVisible] = useState<boolean>(false);
  const [cardContent, setCardContent] = useState<string>(content);

  const menuItemStyles = 'p-2 cursor-pointer hover:bg-bg-secondary-hover';

  useEffect(() => {
    setCardContent(content);
  }, [content]);

  useEffect(() => {
    if (!menuOpen) {
      setMenuIconVisible(false);
    }
  }, [menuOpen]);

  const onClickCard = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (href) {
      router.push(`../${href}`);
    } else if (otherSide) {
      if (cardContent === content) {
        setCardContent(otherSide);
      } else {
        setCardContent(content);
      }
    }
  }

  return (
    <>
    <div 
      className={`bg-bg-secondary rounded-lg mr-4 mt-2 w-64 relative cursor-pointer ${flashcard ? 'h-30 px-2' : 'p-5'}`} 
      onMouseEnter={() => setMenuIconVisible(true)}
      onMouseLeave={() => !menuOpen && setMenuIconVisible(false)}
      onClick={onClickCard}
    >

      {/* dropdown menu */}
      <div 
        className={`z-10 shadow-xl absolute left-60 rounded-lg top-3 bg-bg-secondary border border-text-secondary ${!menuOpen && 'hidden'}`}
        onClick={(e) => {e.stopPropagation(); setMenuOpen(false)}}
      >
        <div className={`${menuItemStyles} border-b border-b-text-secondary`} onClick={() => setUpdateModalOpen(true)}>Edit</div>
        <div className={menuItemStyles} onClick={() => setDeleteModalOpen(true)}>Delete</div>
      </div>

      {/* card content */}
      <div className='h-full overflow-y-auto'>
        <Image
          src='/three_dots.png' height={12} width={12} alt='Three dots menu icon'
          className={`cursor-pointer absolute right-5 top-5 w-3 h-3 ${!menuIconVisible && 'hidden'}`}
          onClick={(e) => {e.stopPropagation(); setMenuOpen(!menuOpen)}}
        />
        <div className={`h-full w-full flex items-center wrap-break-word ${flashcard ? 'text-base justify-center' : 'text-lg'}`}>
          {cardContent}
        </div>
      </div>
    </div>

    
    </>
  )
}

export default Card