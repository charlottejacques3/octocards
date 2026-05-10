'use client'
import React, { useState } from 'react'
import { Deck, CardOverview, TableData, ObjectEnum, ItemEnum, FormTypeEnum } from '@/lib/definitions'
import Button from '@/app/components/Button'
import Modal from '@/app/components/Modal'
import CreateCard from '@/app/components/cards/CreateCard'
import FlashcardCard from '@/app/components/cards/FlashcardCard'
import Table from './Table'
import { TableRenameCreateForm } from '@/app/components/forms/TableForms'

interface Props {
  deck: Deck
  cards: CardOverview[],
  tables: TableData[],
  allCount: number,
  dueCount: number
}

const DeckPage:React.FC<Props> = ({ deck, cards, tables, allCount, dueCount }) => {
  
  const [menuOpenIndex, setMenuOpenIndex] = useState<number>(-1);
  const [menuOpenObjectType, setMenuOpenObjectType] = useState<ItemEnum | null>(null);
  const [createTableModalOpen, setCreateTableModalOpen] = useState<boolean>(false);

  const closeMenu = () => {
      setMenuOpenIndex(-1);
      setMenuOpenObjectType(null);
    }
  
    const openMenu = (id: number, itemType: ItemEnum) => {
      setMenuOpenIndex(id);
      setMenuOpenObjectType(itemType);
    }

  return (
    <>
      <div className='w-full h-screen overflow-y-auto' onClick={() => setMenuOpenIndex(-1)}>
        <h1>{deck.name}</h1>
        
        {/* cards */}
        <div className='flex mt-4 justify-between'>
          <h4>Cards</h4>
          <div className='mr-10'>
            {allCount > 0 && <Button href={`/study/?due=false&deck=${deck.id}`} className='ml-5 mr-3 px-2'>Study All (<span className='font-bold'>{allCount}</span>)</Button>}
            {dueCount > 0 && <Button href={`/study/?due=true&deck=${deck.id}`} className='px-2'>Study Due (<span className='font-bold'>{dueCount}</span>)</Button>}
          </div>
        </div>
        <div className='flex flex-wrap'>
          <CreateCard objectToCreate={ObjectEnum.CARD} parentId={deck?.id} flashcard/>
          {cards.map((card) => 
            <FlashcardCard
              key={card.id}
              card={card}
              menuOpen = {menuOpenIndex === card.id && menuOpenObjectType === ItemEnum.FLASHCARD}
              setMenuOpen={(open: boolean) => open ? openMenu(card.id, ItemEnum.FLASHCARD) : closeMenu()}
            />
          )}
        </div>

        {/* tables */}
        <div className='flex mt-4'>
          <h4 className='mr-5'>Tables</h4>
          <Button className='px-3' onClick={() => setCreateTableModalOpen(true)}>Create</Button>
        </div>
        {tables.map((table) => 
          <Table 
            key={table.id} 
            table={table} 
            menuOpen={menuOpenIndex === table.id && menuOpenObjectType === ItemEnum.TABLE}
            setMenuOpen={(open: boolean) => open ? openMenu(table.id, ItemEnum.TABLE) : closeMenu()}
          />
        )}
      </div>

      {/* create table modal */}
      <Modal isOpen={createTableModalOpen} close={() => setCreateTableModalOpen(false)}>
        <TableRenameCreateForm type={FormTypeEnum.CREATE} close={() => setCreateTableModalOpen(false)} deckId={deck.id}/>
      </Modal>
    </>
  )
}

export default DeckPage