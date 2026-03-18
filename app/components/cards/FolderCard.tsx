import React, { useState } from 'react'
import Card from '../Card'
import Modal from '../Modal'
import { FolderUpdateForm } from '../forms/FolderForm'
import { Folder, FormTypeEnum } from '@/lib/definitions'

interface Props {
  folder: Folder,
  menuOpen: boolean,
  setMenuOpen: (open: boolean) => void,
}

const FolderCard:React.FC<Props> = ({ folder, menuOpen, setMenuOpen }) => {

  const [updateModalOpen, setUpdateModelOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModelOpen] = useState<boolean>(false);

  return (
    <>
      <Card 
        content={folder.name} 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen}
        setUpdateModalOpen={setUpdateModelOpen}
        setDeleteModalOpen={setDeleteModelOpen}
      />

      {/* update modal */}
      <Modal isOpen={updateModalOpen} close={() => setUpdateModelOpen(false)}>
        <FolderUpdateForm type={FormTypeEnum.EDIT} close={() => setUpdateModelOpen(false)} id={folder.id}/>
      </Modal>

      {/* delete modal */}
    </>
  )
}

export default FolderCard