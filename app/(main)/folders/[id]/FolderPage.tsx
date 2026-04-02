'use client'
import React, { useState } from 'react'
import { Folder, Deck, ObjectEnum } from '@/lib/definitions'
import Button from '@/app/components/Button'
import CreateCard from '@/app/components/cards/CreateCard'
import DeckCard from '@/app/components/cards/DeckCard'

interface Props {
  folder: Folder,
  decks: Deck[],
  allCount: number,
  dueCount: number
}

const FolderPage:React.FC<Props> = ({ folder, decks, allCount, dueCount }) => {
  
  const [menuOpenIndex, setMenuOpenIndex] = useState<number>(-1);

  return (
    <div className='w-full h-screen' onClick={() => setMenuOpenIndex(-1)}>
      <h1>{folder.name}</h1>
      <div className='flex mt-4'>
        <h4>Decks</h4>
        <Button href={`/study/?due=false&folder=${folder.id}`} className='ml-5 mr-3 px-2'>Study All (<span className='font-bold'>{allCount}</span>)</Button>
        <Button href={`/study/?due=true&folder=${folder.id}`} className='px-2'>Study Due (<span className='font-bold'>{dueCount}</span>)</Button>
      </div>
      <div className='flex flex-wrap'>
        <CreateCard objectToCreate={ObjectEnum.DECK} parentId={folder?.id}/>
        {decks.map((deck) => 
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