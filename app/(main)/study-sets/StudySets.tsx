'use client'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Folder } from '@/lib/definitions'
import Card from '@/app/components/Card'

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

  const folderUpdateForm = (
    <form>update</form>
  );

  return (
    <div className='w-full h-screen' onClick={() => setMenuOpenIndex(-1)}>
      <h1>Study Sets</h1>
      <h4>Folders</h4>
      <div className='flex'>
        {folders && folders.map((folder) =>
          <Card
            key={folder.id}
            content={folder.name}
            menuOpen = {menuOpenIndex == folder.id}
            setMenuOpen={(open: boolean) => open ? setMenuOpenIndex(folder.id) : setMenuOpenIndex(-1)}
            onConfirmDelete={() => {}}
            confirmDeleteMsg='Are you sure you would like to delete this folder? This will delete all decks and cards contained in this folder. This action cannot be undone.'
            updateFormContent={folderUpdateForm}
            updateHeader='Update Folder'
            href=''
          />
        )}
      </div>
      <h4>Decks</h4>
    </div>
  )
}

export default StudySets