'use client'
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Folder, ObjectEnum } from '@/lib/definitions'
import CreateCard from '@/app/components/cards/CreateCard'
import FolderCard from '@/app/components/cards/FolderCard'

interface Props {
  folders?: Folder[]
  error?: boolean
}

const StudySets:React.FC<Props> = ({ folders, error }) => {
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (error && !toastShownRef.current) {
      console.log('toast error');
      toast.error('Failed to load data');
      toastShownRef.current = true;
    } else if (!error) {
      toastShownRef.current = false;
    }
  }, [error]);

  const [menuOpenIndex, setMenuOpenIndex] = useState<number>(-1);

  return (
    <div className='w-full h-screen' onClick={() => setMenuOpenIndex(-1)}>
      <h1>Study Sets</h1>
      <h4>Folders</h4>
      <div className='flex flex-wrap'>
        <CreateCard objectToCreate={ObjectEnum.FOLDER}/>
        {folders && folders.map((folder) =>
          <FolderCard
            key={folder.id}
            folder={folder}
            menuOpen = {menuOpenIndex === folder.id}
            setMenuOpen={(open: boolean) => open ? setMenuOpenIndex(folder.id) : setMenuOpenIndex(-1)}
          />
        )}
      </div>
      <h4>Uncategorized Decks</h4>
    </div>
  )
}

export default StudySets