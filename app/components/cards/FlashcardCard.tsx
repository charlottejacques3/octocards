import React, { useState, useEffect } from 'react'
import Card from '../Card'
import Modal from '../Modal'
import { CardUpdateCreateForm, CardDeleteForm } from '../forms/CardForms'
import { CardOverview, FormTypeEnum } from '@/lib/definitions'

interface Props {
  card: CardOverview,
  menuOpen: boolean,
  setMenuOpen: (open: boolean) => void,
}

const DeckCard:React.FC<Props> = ({ card, menuOpen, setMenuOpen }) => {

  const [updateModalOpen, setUpdateModelOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModelOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log('card changed', card);
  }, [card]);

  return (
    <>
      <Card 
        content={card.question} 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen}
        setUpdateModalOpen={setUpdateModelOpen}
        setDeleteModalOpen={setDeleteModelOpen}
        otherSide={card.answer}
        flashcard
      />

      {/* update modal */}
      <Modal isOpen={updateModalOpen} close={() => setUpdateModelOpen(false)}>
        <CardUpdateCreateForm type={FormTypeEnum.EDIT} close={() => setUpdateModelOpen(false)} id={card.id} defaultQ={card.question} defaultA={card.answer}/>
      </Modal>

      {/* delete modal */}
      <Modal isOpen={deleteModalOpen} close={() => setDeleteModelOpen(false)}>
        <CardDeleteForm close={() => setDeleteModelOpen(false)} id={card.id}/>
      </Modal>
    </>
  )
}

export default DeckCard