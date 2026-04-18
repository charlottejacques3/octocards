'use client'
import React, { useMemo } from 'react'
import { useForm, useFieldArray, FieldValues } from 'react-hook-form'
import { Table, TableHeader, TableItem } from '@/lib/definitions'
import Button from '@/app/components/Button'

interface Props {
  table: Table,
  headers: {'rows': TableHeader[], 'cols': TableHeader[]},
  cells: Record<string, TableItem>
}

const EditTable:React.FC<Props> = ({ table, headers, cells }) => {

  const rows = headers.rows;
  const cols = headers.cols;

  const getCell = (row:TableHeader, col:TableHeader) => {
    return cells[`${row.id}-${col.id}`];
  }

  const cellDefaultVals = useMemo(() => {
    const vals:{value: string, id: number}[] = [];
    rows.forEach((row) => {
      cols.forEach((col) => {
        const cell = getCell(row, col);
        if (cell) {
          vals.push({ value: cell.text, id: cell.id });
        }
      });
    });
    return vals;
  }, []);

  const getFormIndex = (row: TableHeader, col: TableHeader) => {
    const currentCell = getCell(row, col);
    return cellDefaultVals.findIndex(cell => cell.id === currentCell.id)
  }

  const { register, control, handleSubmit, reset, trigger, setError } = useForm({
    defaultValues: {
      existing: cellDefaultVals
    } 
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "existing"
  });

  const handleFormSubmit = (data: FieldValues) => {
    console.log(data);
  }

  return (
    <div className='w-full h-screen overflow-y-auto'>
      <h1>Edit {table.name}</h1>
      <form onSubmit={handleSubmit(data => handleFormSubmit(data))}>
        <table className='border'>
          <tbody>
            <tr>
              <td/>
              {cols.map((col) => <th className='border' key={col.id}>{col.text}</th>)}
            </tr>
            {rows.map((row) =>
              <tr key={row.id}>
                <th className='border'>{row.text}</th>
                {cols.map((col) =>
                  <td className='border' key={col.id}>
                    {getCell(row, col) && <input {...register(`existing.${getFormIndex(row, col)}.value` as const)}/>}
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
        <Button type='submit'>Done</Button>
      </form>
    </div>
  )
}

export default EditTable