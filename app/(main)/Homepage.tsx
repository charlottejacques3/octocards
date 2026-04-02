'use client'
import React from 'react'
import { DueCount } from '@/lib/definitions'
import Button from '../components/Button'
import StudySection from './StudySection'

interface Props {
  username: string
  totalCount: number
  folderDueCounts: DueCount[],
  uncategorizedDeckDueCounts: DueCount[]
}

const Homepage:React.FC<Props> = ({ username, totalCount, folderDueCounts, uncategorizedDeckDueCounts }) => {

  return (
    <div className='w-full h-screen'>
      <h1>{username ? `Hello, ${username}!` : 'Welcome back!'}</h1> 
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