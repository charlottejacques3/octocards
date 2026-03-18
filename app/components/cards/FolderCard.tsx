import React, { useState } from 'react'
import Card from '../Card'
import Modal from '../Modal'
import { FolderUpdateForm, FolderDeleteForm } from '../forms/FolderForm'
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
        <FolderUpdateForm type={FormTypeEnum.EDIT} close={() => setUpdateModelOpen(false)} id={folder.id} defaultVal={folder.name}/>
      </Modal>

      {/* delete modal */}
      <Modal isOpen={deleteModalOpen} close={() => setDeleteModelOpen(false)}>
        <FolderDeleteForm close={() => setDeleteModelOpen(false)} id={folder.id}/>
      </Modal>
    </>
  )
}

export default FolderCard