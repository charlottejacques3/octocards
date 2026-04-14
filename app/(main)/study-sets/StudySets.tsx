'use client'
import React, { useState, Suspense, use } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Deck, Folder, ObjectEnum } from '@/lib/definitions'
import CreateCard from '@/app/components/cards/CreateCard'
import FolderList from './FolderList'
import DeckList from './DeckList'
import LoadingCard from '@/app/components/cards/LoadingCard'
import NotFound from '@/app/components/NotFound'

interface Props {
  foldersPromise: Promise<Folder[]>,
  decksPromise: Promise<Deck[]>
}

const StudySets:React.FC<Props> = ({ foldersPromise, decksPromise }) => {

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
    <div className='w-full h-screen overflow-y-auto' onClick={closeMenu}>
      <h1>Study Sets</h1>
      <h4 className='mt-5'>Folders</h4>
      <div className='flex flex-wrap'>
        <CreateCard objectToCreate={ObjectEnum.FOLDER}/>
        <ErrorBoundary fallback={<NotFound message='Error loading folders, please try again'/>}>
          <Suspense fallback={<LoadingCard/>}>
            <FolderList
              foldersPromise={foldersPromise}
              menuOpenIndex={menuOpenIndex}
              menuOpenObjectType={menuOpenObjectType}
              openMenu={openMenu}
              closeMenu={closeMenu}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <h4 className='mt-5'>Uncategorized Decks</h4>
      <div className='flex flex-wrap'>
        <CreateCard objectToCreate={ObjectEnum.DECK}/>
        <ErrorBoundary fallback={<NotFound message='Error loading decks, please try again'/>}>
          <Suspense fallback={<LoadingCard/>}>
            <DeckList
              decksPromise={decksPromise}
              menuOpenIndex={menuOpenIndex}
              menuOpenObjectType={menuOpenObjectType}
              openMenu={openMenu}
              closeMenu={closeMenu}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default StudySets