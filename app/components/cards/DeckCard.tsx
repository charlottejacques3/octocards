import React, { useState } from 'react'
import Card from '../Card'
import Modal from '../Modal'
import { DeckUpdateCreateForm, DeckDeleteForm } from '../forms/DeckForms'
import { Deck, FormTypeEnum } from '@/lib/definitions'

interface Props {
  deck: Deck,
  menuOpen: boolean,
  setMenuOpen: (open: boolean) => void,
}

const DeckCard:React.FC<Props> = ({ deck, menuOpen, setMenuOpen }) => {

  const [updateModalOpen, setUpdateModelOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModelOpen] = useState<boolean>(false);

  return (
    <>
      <Card 
        content={deck.name} 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen}
        setUpdateModalOpen={setUpdateModelOpen}
        setDeleteModalOpen={setDeleteModelOpen}
        href={`decks/${deck.id}/`}
      />

      {/* update modal */}
      <Modal isOpen={updateModalOpen} close={() => setUpdateModelOpen(false)}>
        <DeckUpdateCreateForm type={FormTypeEnum.EDIT} close={() => setUpdateModelOpen(false)} id={deck.id} defaultVal={deck.name}/>
      </Modal>

      {/* delete modal */}
      <Modal isOpen={deleteModalOpen} close={() => setDeleteModelOpen(false)}>
        <DeckDeleteForm close={() => setDeleteModelOpen(false)} id={deck.id}/>
      </Modal>
    </>
  )
}

export default DeckCard