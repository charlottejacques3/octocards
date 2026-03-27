'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CardOverview } from '@/lib/definitions'
import { callAPI } from '@/api/helpers'
import { studyCard } from '@/api/cards'
import Button from '@/app/components/Button'

interface Props {
  cards: CardOverview[],
  due: boolean,
}

const StudyPage:React.FC<Props> = ({ cards, due }) => {

  const router = useRouter();
  const [activeCardIndex, setActiveCardIndex] = useState<number>(-1);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const activeCard:CardOverview = cards[activeCardIndex];

  useEffect(() => {
    if (cards.length > 0) {
      setActiveCardIndex(0);
    }
  }, []);

  const onSubmitAnswer = async (response: string) => {
    if (activeCard != null) {
      try {
        await studyCard(activeCard.id, response, activeCardIndex == cards.length-1);
        setActiveCardIndex(i => i+1);

        // re-fetch due cards if reached the end
        toast.message("Let's try again");
        
        // if (activeCardIndex >= cards.length) {
        //   router.refresh();
        // }
      } catch (e) {
        toast.error('Unable to submit response. Please refresh the page and try again');
      }
    } else {
      toast.error('Unable to submit response. Please refresh the page and try again');
    }
  }

  return (
    <div className='w-full h-screen'>
      {(activeCardIndex >= 0 && activeCardIndex < cards.length) ?
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
            <div className='flex flex-col md:flex-row mt-5'>
              <Button onClick={() => onSubmitAnswer('incorrect')} className='w-full mb-3 md:mr-5'>Incorrect</Button>
              <Button onClick={() => onSubmitAnswer('partial')} priority='partially-correct' className='w-full mb-3 md:mr-5'>Partially Correct</Button>
              <Button onClick={() => onSubmitAnswer('correct')} className='w-full mb-3' priority='correct'>Correct</Button>
            </div>
          </div>
        </div>

        : 'You have no more cards to study today! Take a rest!'
      }

    </div>
  )
}

export default StudyPage