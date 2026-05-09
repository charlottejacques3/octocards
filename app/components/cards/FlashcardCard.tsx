import React, { useState } from 'react'
import Card from '../Card'
import Modal from '../Modal'
import { CardUpdateCreateForm, CardDeleteForm } from '../forms/CardForms'
import { CardOverview, FormTypeEnum } from '@/lib/definitions'

interface Props {
  card: CardOverview,
  menuOpen: boolean,
  setMenuOpen: (open: boolean) => void,
}

const FlashcardCard:React.FC<Props> = ({ card, menuOpen, setMenuOpen }) => {

  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  return (
    <>
      <Card 
        content={card.question} 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen}
        setUpdateModalOpen={setUpdateModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        otherSide={card.answer}
        flashcard
      />

      {/* update modal */}
      <Modal isOpen={updateModalOpen} close={() => setUpdateModalOpen(false)}>
        <CardUpdateCreateForm type={FormTypeEnum.EDIT} close={() => setUpdateModalOpen(false)} id={card.id} defaultQ={card.question} defaultA={card.answer}/>
      </Modal>

      {/* delete modal */}
      <Modal isOpen={deleteModalOpen} close={() => setDeleteModalOpen(false)}>
        <CardDeleteForm close={() => setDeleteModalOpen(false)} id={card.id}/>
      </Modal>
    </>
  )
}

export default FlashcardCard