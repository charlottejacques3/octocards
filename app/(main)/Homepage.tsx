'use client'
import React, { use, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { DueCount } from '@/lib/definitions'
import Button from '../components/Button'
import StudySection from './StudySection'
import NotFound from '../components/NotFound'

interface Props {
  username: string,
  promises: Promise<[number, DueCount[], DueCount[]]>
}

const Homepage:React.FC<Props> = ({ username, promises }) => {

  return (
    <div className='w-full h-screen overflow-y-auto'>
      <h1>{username ? `Hello, ${username}!` : 'Welcome back!'}</h1> 
      <ErrorBoundary fallback={<NotFound/>}>
        <Suspense fallback={<p>Loading...</p>}>
          <StudyInfo promises={promises}/>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}


interface StudyInfoProps {
  promises: Promise<[number, DueCount[], DueCount[]]>
}

const StudyInfo:React.FC<StudyInfoProps> = ({ promises }) => {
   const [totalCount, folderDueCounts, uncategorizedDeckDueCounts] = use(promises);

   return (
    <div>
      <div className='flex'>
        <h4>You have {totalCount} card{totalCount != 1 && 's'} to study today.</h4>
        {totalCount > 0 ?
          <Button className='px-3 ml-4' href='/study/?due=true'>Let's do it!</Button>
          : <h4 className='ml-1'>Take a break!</h4>
        }
      </div>
      {folderDueCounts.map((folder) => <StudySection key={folder.id} element={folder} isFolder/>)}
      {uncategorizedDeckDueCounts.map((deck) => <StudySection key={deck.id} element={deck} isUncategorizedDeck/>)}
    </div>
   )
}

export default Homepage