'use client'
import React, { useState } from 'react'
import { Deck, CardOverview, ObjectEnum } from '@/lib/definitions'
import CreateCard from '@/app/components/cards/CreateCard'
import FlashcardCard from '@/app/components/cards/FlashcardCard'

interface Props {
  deck: Deck
  cards: CardOverview[]
}

const DeckPage:React.FC<Props> = ({ deck, cards }) => {
  
  const [menuOpenIndex, setMenuOpenIndex] = useState<number>(-1);

  return (
    <div className='w-full h-screen' onClick={() => setMenuOpenIndex(-1)}>
      <h1>{deck.name}</h1>
      <h4>Cards</h4>
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