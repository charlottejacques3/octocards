'use client'
import React, { useState } from 'react'
import { Deck, Folder, ObjectEnum } from '@/lib/definitions'
import CreateCard from '@/app/components/cards/CreateCard'
import FolderCard from '@/app/components/cards/FolderCard'
import DeckCard from '@/app/components/cards/DeckCard'

interface Props {
  folders: Folder[],
  decks: Deck[]
}

const StudySets:React.FC<Props> = ({ folders, decks }) => {

  const [menuOpenIndex, setMenuOpenIndex] = useState<number>(-1);
  const [menuOpenObjectType, setMenuOpenObjectType] = useState<ObjectEnum | null>(null);

  const closeMenu = () => {
    setMenuOpenIndex(-1);
    setMenuOpenObjectType(null);
  }

  const openMenu = (id: number, objectType: ObjectEnum) => {
    setMenuOpenIndex(id);
    setMenuOpenObjectType(objectType);
  }

  return (
    <div className='w-full h-screen' onClick={closeMenu}>
      <h1>Study Sets</h1>
      <h4 className='mt-5'>Folders</h4>
      <div className='flex flex-wrap'>
        <CreateCard objectToCreate={ObjectEnum.FOLDER}/>
        {folders.map((folder) =>
          <FolderCard
            key={folder.id}
            folder={folder}
            menuOpen = {menuOpenIndex === folder.id && menuOpenObjectType === ObjectEnum.FOLDER}
            setMenuOpen={(open: boolean) => open ? openMenu(folder.id, ObjectEnum.FOLDER) : closeMenu()}
          />
        )}
      </div>
      <h4 className='mt-5'>Uncategorized Decks</h4>
      <div className='flex flex-wrap'>
        <CreateCard objectToCreate={ObjectEnum.DECK}/>
        {decks.map((deck) => 
          <DeckCard
            key={deck.id}
            deck={deck}
            menuOpen = {menuOpenIndex === deck.id && menuOpenObjectType === ObjectEnum.DECK}
            setMenuOpen={(open: boolean) => open ? openMenu(deck.id, ObjectEnum.DECK) : closeMenu()}
          />
        )}
      </div>
    </div>
  )
}

export default StudySets