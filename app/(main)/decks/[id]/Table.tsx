import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { TableData, FormTypeEnum } from '@/lib/definitions'
import Modal from '@/app/components/Modal'
import { TableRenameCreateForm, TableDeleteForm } from '@/app/components/forms/TableForms'
import menuButton from '../../../../public/three_dots.png'

interface Props {
  table: TableData,
  menuOpen: boolean,
  setMenuOpen: (open: boolean) => void,
}

const Table:React.FC<Props> = ({ table, menuOpen, setMenuOpen }) => {

  const router = useRouter();
  const [menuIconVisible, setMenuIconVisible] = useState<boolean>(false);const [renameModalOpen, setRenameModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  
  const cellStyles = 'border p-1';
  const menuItemStyles = 'p-2 cursor-pointer hover:bg-bg-secondary-hover';
  
  useEffect(() => {
    console.log(menuOpen);
    if (!menuOpen) {
      setMenuIconVisible(false);
    }
  }, [menuOpen]);

  return (
    <>
      {/* table content */}
      <div 
        key={table.id} className='mt-2 grid relative' 
        style={{ gridTemplateColumns: 'max-content'}}
        onMouseEnter={() => setMenuIconVisible(true)}
        onMouseLeave={() => !menuOpen && setMenuIconVisible(false)}
      >

        {/* dropdown menu */}
        <div 
          className={`z-10 shadow-xl rounded-lg absolute left-60 top-5 bg-bg-secondary border border-text-secondary ${!menuOpen && 'hidden'}`}
          onClick={(e) => {e.stopPropagation(); setMenuOpen(false)}}
        >
          <div className={`${menuItemStyles} border-b border-b-text-secondary rounded-t-lg`} onClick={() => setRenameModalOpen(true)}>Rename</div>
          <div className={`${menuItemStyles} border-b border-b-text-secondary`} onClick={() => router.push(`/edit-table/${table.id}/`)}>Edit</div>
          <div className={`${menuItemStyles} rounded-b-lg`} onClick={() => setDeleteModalOpen(true)}>Delete</div>
        </div>

        {/* table content */}
        <div className='flex justify-between'>
          <span className='text-base font-bold'>{table.name}</span>
          <Image
            src={menuButton} height={20} width={20} alt='Three dots menu icon'
            className={`cursor-pointer hover:bg-bg-secondary-hover rounded-lg p-1 w-5 h-5 ${!menuIconVisible && 'hidden'}`}
            onClick={(e) => {e.stopPropagation(); setMenuOpen(!menuOpen)}}
          />
        </div>
        <table>
          <tbody>
            {/* column headers */}
            <tr>
              <td/>
              {table.headers.cols.map((col) =>
                <th className={cellStyles} key={col.id}>{col.text}</th>
              )}
            </tr>
            {/* rows */}
            {table.headers.rows.map((row) =>
              <tr key={row.id}>
                {/* row header */}
                <th className={cellStyles}>{row.text}</th>
                {/* cells */}
                {table.headers.cols.map((col) =>
                  <td className={cellStyles} key={col.id}>
                    {table.items[`${row.id}-${col.id}`]?.text || ''}
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* rename modal */}
      <Modal isOpen={renameModalOpen} close={() => setRenameModalOpen(false)}>
        <TableRenameCreateForm type={FormTypeEnum.EDIT} close={() => setRenameModalOpen(false)} id={table.id} defaultVal={table.name}/>
      </Modal>

      {/* delete modal */}
      <Modal isOpen={deleteModalOpen} close={() => setDeleteModalOpen(false)}>
        <TableDeleteForm close={() => setDeleteModalOpen(false)} id={table.id}/>
      </Modal>
    </>
  )
}

export default Table