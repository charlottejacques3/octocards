import React from 'react'
import { Table, TableHeader, TableItem } from '@/lib/definitions'

interface Props {
  table: Table,
  headers: {'rows': TableHeader[], 'cols': TableHeader[]},
  cells: Record<string, TableItem>
}

const EditTable:React.FC<Props> = ({ table, headers, cells }) => {

  const rows = headers.rows;
  const cols = headers.cols;

  return (
    <div className='w-full h-screen overflow-y-auto'>
      <h1>Edit {table.name}</h1>
      <table className='border'>
        <tbody>
          <tr>
            <td/>
            {cols.map((col) => <th className='border' key={col.id}>{col.text}</th>)}
          </tr>
          {rows.map((row) => <tr key={row.id}>
            <th className='border'>{row.text}</th>
            {cols.map((col) => <td className='border' key={col.id}>
              {cells[`${row.id}-${col.id}`] && cells[`${row.id}-${col.id}`].text}
            </td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}

export default EditTable