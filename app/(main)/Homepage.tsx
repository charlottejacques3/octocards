'use client'
import React from 'react'
import { DueCount } from '@/lib/definitions'
import Button from '../components/Button'
import StudySection from './StudySection'

interface Props {
  username: string
  totalCount: number
  folderDueCounts: DueCount[]
}

const Homepage:React.FC<Props> = ({ username, totalCount, folderDueCounts }) => {

  return (
    <div className='w-full h-screen'>
      <h1>{username ? `Hello, ${username}!` : 'Welcome back!'}</h1> 
      <div className='flex'>
        <h4 className='mr-4'>You have {totalCount} cards to study today.</h4>
        <Button className='px-3' href='/study/?due=true'>Let's do it!</Button>
      </div>
      {folderDueCounts.map((folder) => <StudySection key={folder.id} element={folder} isFolder/>)}
    </div>
  )
}

export default Homepage