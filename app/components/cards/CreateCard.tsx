import React, { useState } from 'react'
import { ObjectEnum, FormTypeEnum } from '@/lib/definitions'
import { FolderUpdateCreateForm } from '../forms/FolderForms'
import Modal from '../Modal'

interface Props {
  objectToCreate: ObjectEnum
}

const CreateCard:React.FC<Props> = ({ objectToCreate }) => {

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const createModal = () => {
    switch (objectToCreate) {
      case ObjectEnum.FOLDER: 
        return <FolderUpdateCreateForm type={FormTypeEnum.CREATE} close={() => setCreateModalOpen(false)}/>;
    }
  }

  return (
    <>
      <div className='bg-bg-secondary rounded-lg mr-4 mt-2 w-64 cursor-pointer hover:bg-bg-secondary-hover' onClick={() => setCreateModalOpen(true)}>
        <h1 className='text-center'>+</h1>
      </div>

      {/* create modal */}
      <Modal isOpen={createModalOpen} close={() => setCreateModalOpen(false)}>{createModal()}</Modal>
    </>
  )
}

export default CreateCard