'use client'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Folder } from '@/lib/definitions'
import Card from '@/app/components/Card'
import FolderCard from '@/app/components/cards/FolderCard'

interface Props {
  folders?: Folder[]
  error?: boolean
}

const StudySets:React.FC<Props> = ({ folders, error }) => {

  useEffect(() => {
    if (error) {
      toast.error('Failed to load data');
    }
  }, [error]);

  const [menuOpenIndex, setMenuOpenIndex] = useState<number>(-1);

  return (
    <div className='w-full h-screen' onClick={() => setMenuOpenIndex(-1)}>
      <h1>Study Sets</h1>
      <h4>Folders</h4>
      <div className='flex'>
        {folders && folders.map((folder) =>
          <FolderCard
            key={folder.id}
            folder={folder}
            menuOpen = {menuOpenIndex == folder.id}
            setMenuOpen={(open: boolean) => open ? setMenuOpenIndex(folder.id) : setMenuOpenIndex(-1)}
          />
        )}
      </div>
      <h4>Uncategorized Decks</h4>
    </div>
  )
}

export default StudySets