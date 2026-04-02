'use client'
import React, { useState } from 'react'
import { Deck, CardOverview, ObjectEnum } from '@/lib/definitions'
import Button from '@/app/components/Button'
import CreateCard from '@/app/components/cards/CreateCard'
import FlashcardCard from '@/app/components/cards/FlashcardCard'

interface Props {
  deck: Deck
  cards: CardOverview[],
  allCount: number,
  dueCount: number
}

const DeckPage:React.FC<Props> = ({ deck, cards, allCount, dueCount }) => {
  
  const [menuOpenIndex, setMenuOpenIndex] = useState<number>(-1);

  return (
    <div className='w-full h-screen' onClick={() => setMenuOpenIndex(-1)}>
      <h1>{deck.name}</h1>
      <div className='flex mt-4'>
        <h4>Cards</h4>
        <Button href={`/study/?due=false&deck=${deck.id}`} className='ml-5 mr-3'>Study All (<span className='font-bold'>{allCount}</span>)</Button>
        <Button href={`/study/?due=true&deck=${deck.id}`}>Study Due (<span className='font-bold'>{dueCount}</span>)</Button>
      </div>
      <div className='flex flex-wrap'>
        <CreateCard objectToCreate={ObjectEnum.CARD} parentId={deck?.id}/>
        {cards.map((card) => 
          <FlashcardCard
            key={card.id}
            card={card}
            menuOpen = {menuOpenIndex === card.id}
            setMenuOpen={(open: boolean) => open ? setMenuOpenIndex(card.id) : setMenuOpenIndex(-1)}
          />
        )}
      </div>
    </div>
  )
}

export default DeckPage