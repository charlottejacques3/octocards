import React, { useState } from 'react'
import { ObjectEnum, FormTypeEnum } from '@/lib/definitions'
import { FolderUpdateCreateForm } from '../forms/FolderForms'
import { DeckUpdateCreateForm } from '../forms/DeckForms'
import { CardUpdateCreateForm } from '../forms/CardForms'
import Modal from '../Modal'

interface Props {
  objectToCreate: ObjectEnum,
  parentId?: number,
}

const CreateCard:React.FC<Props> = ({ objectToCreate, parentId }) => {

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const createModal = () => {
    switch (objectToCreate) {
      case ObjectEnum.FOLDER: 
        return <FolderUpdateCreateForm type={FormTypeEnum.CREATE} close={() => setCreateModalOpen(false)}/>;
      case ObjectEnum.DECK:
        return <DeckUpdateCreateForm type={FormTypeEnum.CREATE} close={() => setCreateModalOpen(false)} folderId={parentId}/>
      case ObjectEnum.CARD:
        return <CardUpdateCreateForm type={FormTypeEnum.CREATE} close={() => setCreateModalOpen(false)} deckId={parentId}/>
      default:
        return <p>Error, please refresh the page</p>
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