'use client'
import React, { useState, useEffect } from 'react'
import { CardOverview } from '@/lib/definitions'
import Button from '@/app/components/Button'

interface Props {
  cards: CardOverview[],
  due: boolean,
}

const StudyPage:React.FC<Props> = ({ cards, due }) => {

  const [activeCard, setActiveCard] = useState<CardOverview|undefined>(undefined);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  useEffect(() => {
    if (cards.length > 0) {
      setActiveCard(cards[0]);
    }
  }, []);

  const onSubmitAnswer = (response: string) => {

  }

  return (
    <div className='w-full h-screen'>
      {activeCard ?
        <div className='w-full h-full'>
          <h1>Study {due ? 'Due' : 'All'}</h1>
          <div className='w-full h-full pl-12 pr-24 py-12'>

            {/* card */}
            <div 
              className='w-full h-3/4 bg-bg-secondary hover:bg-bg-secondary-hover rounded-lg flex justify-center items-center cursor-pointer'
              onClick={() => setShowAnswer(ans => !ans)}
            >
              <h1>{showAnswer ? activeCard.answer : activeCard.question}</h1>
            </div>

            {/* correct/incorrect buttons */}
            <div className='flex mt-5'>
              <Button onClick={() => onSubmitAnswer('incorrect')}className='w-full mr-10'>Incorrect</Button>
              <Button className='w-full' priority='correct'>Correct</Button>
            </div>
          </div>
        </div>

        : 'You have no more cards to study today! Take a rest!'
      }

    </div>
  )
}

export default StudyPage