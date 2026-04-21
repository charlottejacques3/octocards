'use client'
import React, { useState, useMemo } from 'react'
import { useForm, useFieldArray, FieldValues } from 'react-hook-form'
import { Table, TableHeader, TableItem } from '@/lib/definitions'
import Button from '@/app/components/Button'
import { bulkCreateCells, bulkUpdateCells } from '@/app/api/tables'

interface Props {
  table: Table,
  headers: {'rows': TableHeader[], 'cols': TableHeader[]},
  cells: Record<string, TableItem>
}

const EditTable:React.FC<Props> = ({ table, headers, cells }) => {

  const [rows, setRows] = useState<TableHeader[]>(headers.rows);
  const [cols, setCols] = useState<TableHeader[]>(headers.cols);
  const [addedRowIndexes, setAddedRowIndexes] = useState<number[]>([]);
  const [addedColIndexes, setAddedColIndexes] = useState<number[]>([]);
  const [nextRowIndex, setNextRowIndex] = useState<number>(headers.rows[headers.rows.length-1].index+1);
  const [nextColIndex, setNextColIndex] = useState<number>(headers.cols[headers.cols.length-1].index+1);

  const getCell = (row:TableHeader, col:TableHeader) => {
    return cells[`${row.id}-${col.id}`];
  }

  const [cellDefaultVals, emptyCells] = useMemo(() => {
    const vals:{value: string, dataId: number}[] = [];
    const empties:{value: string, rowIndex: number, colIndex: number}[] = [];
    headers.rows.forEach((row) => {
      headers.cols.forEach((col) => {
        const cell = getCell(row, col);
        if (cell) {
          vals.push({ value: cell.text, dataId: cell.id });
        } else {
          empties.push({ value: '', rowIndex: row.index, colIndex: col.index })
        }
      });
    });
    return [vals, empties];
  }, []);

  const headerDefaultVals:{value: string, dataId: number}[] = (headers.rows.concat(headers.cols)).map((header) => ({value: header.text, dataId: header.id}));

  const getFormIndex = (row?: TableHeader, col?: TableHeader) => {
    if (row && col) {
      const currentCell = getCell(row, col);
      return existingFields.findIndex(cell => cell.dataId === currentCell.id);
    } 
    const currentCellId = row ? row.id : col ? col.id : -1;
    return existingHeaderFields.findIndex(cell => cell.dataId === currentCellId);
  }

  const getFormIndexFromNew = (rowId: number, colId: number) => {
    return newFields.findIndex(cell => cell.rowIndex === rowId && cell.colIndex === colId);
  }

  type FormValues = {
    existing: {
      value: string;
      dataId: number;
    }[];
    existingHeaders: {
      value: string;
      dataId: number;
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
      new: emptyCells
    } 
  });

  const { fields: existingFields } = useFieldArray({
    control,
    name: "existing"
  });

  const { fields: newFields, append: appendFields } = useFieldArray({
    control,
    name: "new",
  });

  const { fields: existingHeaderFields, remove: removeHeaders } = useFieldArray({
    control,
    name: "existingHeaders"
  });

  const { fields: newRowFields, append: appendRows, remove: removeNewRow } = useFieldArray({
    control,
    name: "newRows",
  });

  const { fields: newColFields, append: appendCols, remove: removeNewCol } = useFieldArray({
    control,
    name: "newCols",
  });

  const handleFormSubmit = (data: FieldValues) => {
    console.log(data);
    bulkUpdateCells(data.existing);
    bulkCreateCells(data.new, table.id);
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

  // just remove the header fields, we can check what is missing from the original 
  // update state to remove the col
  // all the cells are automatically deleted on the backend
  const deleteExistingHeader = (rowToRemove?: TableHeader, colToRemove?: TableHeader) => {
    const index = getFormIndex(rowToRemove, colToRemove);
    removeHeaders(index);
    if (rowToRemove) {
      setRows(rows => rows.filter(row => row.id != rowToRemove.id));
    } else if (colToRemove) {
      setCols(cols => cols.filter(col => col.id != colToRemove.id));
    }
  }

  // don't send any cells without matching headers to the backend
  const deleteNewHeader = (indexToRemove: number, row: boolean=true) => {
    if (row) {
      removeNewRow(indexToRemove);
    } else {
      removeNewCol(indexToRemove);
    }
  }

  return (
    <div className='w-full h-screen overflow-auto'>
      <h1>Edit {table.name}</h1>
      <form onSubmit={handleSubmit(data => handleFormSubmit(data))}>
        <div>
          <div className='flex'>
            <table className='border'>
              <tbody>
                {/* column delete buttons */}
                <tr>
                  <td/>
                  <td/>
                  {cols.map((col) =>
                    <td key={col.id}>
                      <Button onClick={() => deleteExistingHeader(undefined, col)}>Delete</Button>
                    </td>
                  )}
                  {newColFields.map((col, index) => 
                    <td key={col.id}>
                      <Button onClick={() => deleteNewHeader(index, false)}>Delete</Button>
                    </td>
                  )}
                </tr>

                {/* column headers */}
                <tr>
                  <td/>
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
                  <tr key={row.id}>

                    {/* row delete button */}
                    <td>
                      <Button onClick={() => deleteExistingHeader(row)}>Delete</Button>
                    </td>

                    {/* row header */}
                    <th className='border'>
                      <input {...register(`existingHeaders.${getFormIndex(row)}.value` as const)}/>
                    </th>

                    {/* cells */}
                    {cols.map((col) =>
                      <td className='border' key={col.id}>
                        {getCell(row, col) ? 
                          <input {...register(`existing.${getFormIndex(row, col)}.value` as const)}/>
                          : <input {...register(`new.${getFormIndexFromNew(row.index, col.index)}.value` as const)}/>
                        }
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
                    <td>
                      <Button onClick={() => deleteNewHeader(index)}>Delete</Button>
                    </td>
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