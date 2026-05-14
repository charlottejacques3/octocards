'use client'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { ItemsDue, CardOverview, TableDetails } from '@/lib/definitions'
import { studyCard } from '@/app/api/cards'
import Button from '@/app/components/Button'

interface Props {
  items: ItemsDue,
  due: boolean,
  category?: string,
  categoryId?: number
}

const isCardOverview = (item: CardOverview | TableDetails): item is CardOverview => {
  return 'question' in item && 'answer' in item;
}

const StudyPage:React.FC<Props> = ({ items, due, category, categoryId }) => {

  const [cardsToStudy, setCardsToStudy] = useState<(CardOverview|TableDetails)[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(-1);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [activeCard, setActiveCard] = useState<CardOverview|TableDetails|undefined>(undefined);

  const cellStyles = 'border p-1';

  useEffect(() => {
    setCardsToStudy([...items.cards, ...items.tables]);
  }, []);

  useEffect(() => {
    if (cardsToStudy.length > 0) {
      setActiveCardIndex(0);
    } else {
      setActiveCard(undefined);
    }
  }, [cardsToStudy]);

  useEffect(() => {
    if (activeCardIndex >= 0 && activeCardIndex < cardsToStudy.length) {
      setActiveCard(cardsToStudy[activeCardIndex]);
    }
  }, [activeCardIndex]);

  const updateCardStudyAll = (next: boolean) => {
    setShowAnswer(false);
    if (next) {
      if (activeCardIndex >= cardsToStudy.length-1) setActiveCard(undefined);
      else setActiveCardIndex(i => i+1);
    } else if (activeCardIndex > 0) {
      setActiveCardIndex(i => i-1);
    }
  }

  const onSubmitAnswer = async (response: string) => {
    if (activeCard != null) {
      try {
        await studyCard(activeCard.id, response);

        // re-fetch due cards if reached the end
        setShowAnswer(false);
        if (activeCardIndex >= cardsToStudy.length-1) {
          await refetchCards();
        } else {
          setActiveCardIndex(i => i+1);
        }
      } catch (e) {
        toast.error('Unable to submit response. Please refresh the page and try again');
      }
    } else {
      toast.error('Unable to submit response. Please refresh the page and try again');
    }
  }

  const refetchCards = async () => {
    try {
      const url = `api/to-study/?due=${due}${(category && categoryId) ? `&${category}=${categoryId}` : ''}`
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      if (data.cards.length > 0 || data.tables.length) {
        toast.success("Nice job! Let's re-review the questions you got wrong.");
      }
      setCardsToStudy([...data.cards, ...data.tables]);
    } catch (e) {
      toast.error('Something went wrong fetching cards. Please try again.');
    }
  }

  return (
    <div className='w-full h-screen'>
      {activeCard ?
        <div className='w-full h-full'>
          <h1>Study {due ? 'Due' : 'All'}</h1>
          <div className='w-full h-full pl-12 pr-24 py-12'>

            {isCardOverview(activeCard) ?
              //card
              <div 
                className='w-full h-3/4 bg-bg-secondary hover:bg-bg-secondary-hover rounded-lg flex justify-center items-center cursor-pointer'
                onClick={() => setShowAnswer(ans => !ans)}
              >
                <h1>{showAnswer ? activeCard.answer : activeCard.question}</h1>
              </div>
            : //table
              <div className='w-full text-base'>
                <h4>{activeCard.table}</h4>
                <table className='w-full table-fixed'>
                  <tbody>
                    <tr>
                      <td className='w-1/3'/>
                      <th className={cellStyles}>{activeCard.col}</th>
                    </tr>
                    <tr>
                      <th className={`w-2/3 ${cellStyles}`}>{activeCard.row}</th>
                      <td className={cellStyles}>
                      <div>{showAnswer && activeCard.text}</div>
                      <Button priority='underline' onClick={() => setShowAnswer(prev => !prev)}>
                        {showAnswer ? 'Hide': 'Reveal'}
                      </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }

            <div className='flex flex-col md:flex-row mt-5'>
              {due ?
                <>
                  {/* correct/incorrect buttons */}
                  <Button onClick={() => onSubmitAnswer('incorrect')} className='w-full mb-3 md:mr-5'>Incorrect</Button>
                  <Button onClick={() => onSubmitAnswer('partial')} priority='partially-correct' className='w-full mb-3 md:mr-5'>Partially Correct</Button>
                  <Button onClick={() => onSubmitAnswer('correct')} className='w-full mb-3' priority='correct'>Correct</Button>
                </> :
                <>
                  {/* next/previous buttons */}
                  <Button 
                    onClick={() => updateCardStudyAll(false)} priority='secondary' 
                    className={`w-full mb-3 md:mr-5 ${activeCardIndex == 0 && 'bg-bg-secondary-hover text-gray-500'}`} 
                    blocked={activeCardIndex == 0}
                  >Previous</Button>
                  <Button onClick={() => updateCardStudyAll(true)} className='w-full mb-3'>Next</Button>
                </>
              }
            </div>
          </div>
        </div>

        : <div className='flex flex-col h-full items-center justify-center'>
          <h4>You have no more cards to study today! Take a rest!</h4>
          <Button 
            href={`/${category ? (category + 's/' + categoryId) : ''}`}
            className='mt-5 p-3'
          >
            Back to {category ? category : 'home'}
          </Button>
        </div>
      }

    </div>
  )
}

export default StudyPage