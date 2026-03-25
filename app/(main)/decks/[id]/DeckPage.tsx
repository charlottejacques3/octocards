'use client'
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Deck, CardOverview, ObjectEnum } from '@/lib/definitions'
import CreateCard from '@/app/components/cards/CreateCard'
import FlashcardCard from '@/app/components/cards/FlashcardCard'

interface Props {
  deck?: Deck
  cards?: CardOverview[]
  error?: boolean
}

const DeckPage:React.FC<Props> = ({ deck, cards, error }) => {
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (error && !toastShownRef.current) {
      toast.error('Failed to load data');
      toastShownRef.current = true;
    } else if (!error) {
      toastShownRef.current = false;
    }
  }, [error]);
  
  const [menuOpenIndex, setMenuOpenIndex] = useState<number>(-1);

  return (
    <div className='w-full h-screen' onClick={() => setMenuOpenIndex(-1)}>
      <h1>{deck ? deck.name : 'Deck not found'}</h1>
      <h4>Cards</h4>
      <div className='flex flex-wrap'>
        <CreateCard objectToCreate={ObjectEnum.CARD} parentId={deck?.id}/>
        {cards && cards.map((card) => 
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