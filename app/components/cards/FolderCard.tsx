import React, { useState } from 'react'
import Card from '../Card'
import Modal from '../Modal'
import { FolderUpdateForm } from '../forms/FolderForm'
import { FormTypeEnum } from '@/lib/definitions'

interface Props {
  content: string,
  menuOpen: boolean,
  setMenuOpen: (open: boolean) => void,
}

const FolderCard:React.FC<Props> = ({ content, menuOpen, setMenuOpen }) => {

  const [updateModalOpen, setUpdateModelOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModelOpen] = useState<boolean>(false);

  return (
    <>
      <Card 
        content={content} 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen}
        setUpdateModalOpen={setUpdateModelOpen}
        setDeleteModalOpen={setDeleteModelOpen}
      />

      {/* update modal */}
      <Modal isOpen={updateModalOpen} close={() => setUpdateModelOpen(false)}>
        <FolderUpdateForm type={FormTypeEnum.EDIT} close={() => setUpdateModelOpen(false)}/>
      </Modal>
    </>
  )
}

export default FolderCard