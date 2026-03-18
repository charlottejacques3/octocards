'use client'
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Folder, Deck, ObjectEnum } from '@/lib/definitions'
import CreateCard from '@/app/components/cards/CreateCard'
import DeckCard from '@/app/components/cards/DeckCard'

interface Props {
  folder?: Folder,
  decks?: Deck[]
  error?: boolean
}

const FolderPage:React.FC<Props> = ({ folder, decks, error }) => {
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (error && !toastShownRef.current) {
      console.log('toast error');
      toast.error('Failed to load data');
      toastShownRef.current = true;
    } else if (!error) {
      toastShownRef.current = false;
    }
  }, [error]);
  
  const [menuOpenIndex, setMenuOpenIndex] = useState<number>(-1);

  return (
    <div className='w-full h-full'>
      <h1>{folder ? folder.name : 'Folder not found'}</h1>
      <h4>Decks</h4>
      <div className='flex flex-wrap'>
        <CreateCard objectToCreate={ObjectEnum.DECK} parentId={folder?.id}/>
        {decks && decks.map((deck) => 
          <DeckCard
            key={deck.id}
            deck={deck}
            menuOpen = {menuOpenIndex === deck.id}
            setMenuOpen={(open: boolean) => open ? setMenuOpenIndex(deck.id) : setMenuOpenIndex(-1)}
          />
        )}
      </div>
    </div>
  )
}

export default FolderPage