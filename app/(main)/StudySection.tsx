import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { DueCount } from '@/lib/definitions'
import { callAPI } from '@/api/helpers'

interface Props {
  element: DueCount,
  isFolder: boolean
}

const StudySection:React.FC<Props> = ({ element, isFolder }) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [decks, setDecks] = useState<DueCount[]>([]);

  useEffect(() => {

    const fetchDecks = async () => {
      try {
        const res = await callAPI(`decks/due-count/${element.id}/`);
        setDecks(await res.json());
      } catch (e) {
        toast.error('Failed to fetch decks');
      }
    }

    if (isOpen && decks.length === 0) {
      fetchDecks();
    }
  }, [isOpen]);

  return (
    <>
      <div className={`bg-bg-secondary hover:bg-bg-secondary-hover rounded-lg flex justify-between mr-10 my-2 py-1 px-2 ${!isFolder && 'ml-6'}`}>
        <div className='flex items-center'>
          {isFolder && 
            <Image 
              src='forward.png' width={20} height={20} alt='Folder toggle open icon'
              onClick={() => setIsOpen(open => !open)}
              className={`cursor-pointer w-4 h-4 mr-1 ${isOpen && 'rotate-90'}`}
            />
          }
          {element.name}
          <span className='ml-2 font-bold'>{element.card_count}</span>
        </div>
        <Link href='' className='hover:underline'>Study</Link>
      </div>
      {(isOpen && isFolder) && decks.map((deck) => <StudySection key={deck.id} element={deck} isFolder={false}/>)}
    </>
  )
}

export default StudySection