'use client'
import { use } from 'react'
import { Folder, ObjectEnum } from '@/lib/definitions'
import FolderCard from '@/app/components/cards/FolderCard'

interface Props {
  foldersPromise: Promise<Folder[]>
  menuOpenIndex: number
  menuOpenObjectType: ObjectEnum | null
  openMenu: (id: number, objectType: ObjectEnum) => void
  closeMenu: () => void
}

const FolderList: React.FC<Props> = ({ foldersPromise, menuOpenIndex, menuOpenObjectType, openMenu, closeMenu }) => {
  const folders = use(foldersPromise);

  return (
    <>
      {folders.map((folder) =>
        <FolderCard
          key={folder.id}
          folder={folder}
          menuOpen={menuOpenIndex === folder.id && menuOpenObjectType === ObjectEnum.FOLDER}
          setMenuOpen={(open: boolean) => open ? openMenu(folder.id, ObjectEnum.FOLDER) : closeMenu()}
        />
      )}
    </>
  )
}

export default FolderList;