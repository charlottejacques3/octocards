'use client'
import { use } from 'react'
import { Deck, ObjectEnum } from '@/lib/definitions'
import DeckCard from '@/app/components/cards/DeckCard'

interface Props {
  decksPromise: Promise<Deck[]>
  menuOpenIndex: number
  menuOpenObjectType: ObjectEnum | null
  openMenu: (id: number, objectType: ObjectEnum) => void
  closeMenu: () => void
}

const DeckList: React.FC<Props> = ({ decksPromise, menuOpenIndex, menuOpenObjectType, openMenu, closeMenu }) => {
 const decks = use(decksPromise);

  return (
    <>
      {decks.map((deck) =>
        <DeckCard
          key={deck.id}
          deck={deck}
          menuOpen={menuOpenIndex === deck.id && menuOpenObjectType === ObjectEnum.DECK}
          setMenuOpen={(open: boolean) => open ? openMenu(deck.id, ObjectEnum.DECK) : closeMenu()}
        />
      )}
    </>
  )
}

export default DeckList;