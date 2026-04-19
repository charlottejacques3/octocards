'use client'
import React, { useState, useMemo } from 'react'
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

  const [addedRowIndexes, setAddedRowIndexes] = useState<number[]>([]);
  const [addedColIndexes, setAddedColIndexes] = useState<number[]>([]);
  const [nextRowIndex, setNextRowIndex] = useState<number>(rows[rows.length-1].index+1);
  const [nextColIndex, setNextColIndex] = useState<number>(cols[cols.length-1].index+1);

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

  const headerDefaultVals:{value: string, id: number}[] = (rows.concat(cols)).map((row) => ({value: row.text, id: row.id}));

  const getFormIndex = (row?: TableHeader, col?: TableHeader) => {
    if (row && col) {
      const currentCell = getCell(row, col);
      return cellDefaultVals.findIndex(cell => cell.id === currentCell.id);
    } 
    const currentCellId = row ? row.id : col ? col.id : -1;
    return headerDefaultVals.findIndex(cell => cell.id === currentCellId);
  }

  const getFormIndexFromNew = (rowId: number, colId: number) => {
    return newFields.findIndex(cell => cell.rowIndex === rowId && cell.colIndex === colId);
  }

  type FormValues = {
    existing: {
      value: string;
      id: number;
    }[];
    existingHeaders: {
      value: string;
      id: number;
    }[];
    new: {
      value: string;
      rowIndex: number;
      colIndex: number;
    }[];
    newRows: {
      value: string;
      index: number;
    }[];
    newCols: {
      value: string;
      index: number;
    }[];
  };

  const { register, control, handleSubmit, reset, trigger, setError } = useForm<FormValues>({
    defaultValues: {
      existing: cellDefaultVals,
      existingHeaders: headerDefaultVals,
    } 
  });

  useFieldArray({
    control,
    name: "existing"
  });

  const { fields: newFields, append: appendFields } = useFieldArray({
    control,
    name: "new",
  });

  useFieldArray({
    control,
    name: "existingHeaders"
  });

  const { fields: newRowFields, append: appendRows } = useFieldArray({
    control,
    name: "newRows",
  });

  const { fields: newColFields, append: appendCols } = useFieldArray({
    control,
    name: "newCols",
  });

  const handleFormSubmit = (data: FieldValues) => {
    console.log(data);
  }

  const addRow = () => {
    appendRows({ value: '', index: nextRowIndex });
    const newCellsInExistingCols = cols.map((col) => ({ value: '', rowIndex: nextRowIndex, colIndex: col.index }));
    const newCellsInNewCols = addedColIndexes.map((col) => ({ value: '', rowIndex: nextRowIndex, colIndex: col }));
    const newCells = [...newCellsInExistingCols, ...newCellsInNewCols];
    appendFields(newCells);
    setAddedRowIndexes(rows => [...rows, nextRowIndex]);
    setNextRowIndex(i => i+1);
  }

  const addCol = () => {
    appendCols({ value: '', index: nextColIndex });
    const newCellsInExistingRows = rows.map((row) => ({ value: '', rowIndex: row.index, colIndex: nextColIndex }));
    const newCellsInNewRows = addedRowIndexes.map((row) => ({ value: '', rowIndex: row, colIndex: nextColIndex }));
    const newCells = [...newCellsInExistingRows, ...newCellsInNewRows];
    appendFields(newCells);
    setAddedColIndexes(cols => [...cols, nextColIndex]);
    setNextColIndex(i => i+1);
  }

  return (
    <div className='w-full h-screen overflow-auto'>
      <h1>Edit {table.name}</h1>
      <form onSubmit={handleSubmit(data => handleFormSubmit(data))}>
        <div>
          <div className='flex'>
            <table className='border'>
              <tbody>

                {/* column headers */}
                <tr>
                  <td/>
                  {cols.map((col) =>
                    <th className='border' key={col.id}>
                      <input {...register(`existingHeaders.${getFormIndex(undefined, col)}.value` as const)}/>
                    </th>
                  )}
                  {newColFields.map((col, index) => 
                      <th key={col.id}><input {...register(`newCols.${index}.value` as const)}/></th>
                    )}
                </tr>

                {/* existing rows */}
                {rows.map((row) =>

                  // row headers
                  <tr key={row.id}>
                    <th className='border'>
                      <input {...register(`existingHeaders.${getFormIndex(row)}.value` as const)}/>
                    </th>

                    {/* cells */}
                    {cols.map((col) =>
                      <td className='border' key={col.id}>
                        {getCell(row, col) && <input {...register(`existing.${getFormIndex(row, col)}.value` as const)}/>}
                      </td>
                    )}

                    {/* added cols */}
                    {newColFields.map((col) => 
                      <td key={col.id}>
                        <input {...register(`new.${getFormIndexFromNew(row.index, col.index)}.value` as const)}/>
                      </td>
                    )}
                  </tr>
                )}

                {/* added rows */}
                {newRowFields.map((row, index) => 
                  <tr key={row.id}>
                    <th><input {...register(`newRows.${index}.value` as const)}/></th>
                    {cols.map((col) => 
                      <td key={col.id}>
                        <input {...register(`new.${getFormIndexFromNew(row.index, col.index)}.value` as const)}/>
                      </td>
                    )}
                    {newColFields.map((col) => 
                      <td key={col.id}>
                        <input {...register(`new.${getFormIndexFromNew(row.index, col.index)}.value` as const)}/>
                      </td>
                    )}
                  </tr>
                )}
              </tbody>
            </table>
            <Button onClick={addCol}>+</Button>
          </div>
          <Button onClick={addRow}>+</Button>
        </div>
        <Button type='submit' className='mt-4'>Done</Button>
      </form>
    </div>
  )
}

export default EditTable