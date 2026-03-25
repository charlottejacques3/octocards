'use client'
import React, { useState } from 'react'
import { DueCount } from '@/lib/definitions'
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
      <h4>You have {totalCount} cards to study today.</h4>
      {folderDueCounts.map((folder) => <StudySection key={folder.id} element={folder} isFolder/>)}
    </div>
  )
}

export default Homepage