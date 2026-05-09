'use client'
import React, { useState, useMemo } from 'react'
import { useForm, useFieldArray, FieldValues } from 'react-hook-form'
import styled from 'styled-components'
import { Table, TableHeader, TableItem } from '@/lib/definitions'
import Button from '@/app/components/Button'
import DeleteButton from './DeleteButton'
import { bulkCreateCells, bulkCreateHeaders, bulkDeleteHeaders, bulkUpdateCells, bulkUpdateHeaders } from '@/app/api/tables'
import { Erica_One } from 'next/font/google'
import { error } from 'console'

interface Props {
  table: Table,
  headers: {'rows': TableHeader[], 'cols': TableHeader[]},
  cells: Record<string, TableItem>
}

const StyleWrapper = styled.div`
  input {
    border: none;
  }

  th {
    border-width: 1px;
  }
`;

const EditTable:React.FC<Props> = ({ table, headers, cells }) => {

  const [rows, setRows] = useState<TableHeader[]>(headers.rows);
  const [cols, setCols] = useState<TableHeader[]>(headers.cols);
  const [addedRowIndexes, setAddedRowIndexes] = useState<number[]>([]);
  const [addedColIndexes, setAddedColIndexes] = useState<number[]>([]);
  const [nextRowIndex, setNextRowIndex] = useState<number>(headers.rows[headers.rows.length-1].index+1); //need to fix this for size 0!! actually should always have at least 1 row and col so maybe not
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
      text: string;
      index: number;
    }[];
    newCols: {
      text: string;
      index: number;
    }[];
  };

  const { register, control, handleSubmit, setError, formState: { errors, isValid, isSubmitted }, } = useForm<FormValues>({
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
    name: "existingHeaders",
  });

  const { fields: newRowFields, append: appendRows, remove: removeNewRow } = useFieldArray({
    control,
    name: "newRows",
  });

  const { fields: newColFields, append: appendCols, remove: removeNewCol } = useFieldArray({
    control,
    name: "newCols",
  });

  const handleFormSubmit = async (data: FieldValues) => {
    console.log(data);
    await bulkCreateHeaders(data.newRows, data.newCols, table.id);
    await Promise.all([
      bulkUpdateHeaders(data.existingHeaders),
      bulkUpdateCells(data.existing),
      bulkCreateCells(data.new, table.id),
      bulkDeleteHeaders(data.existingHeaders, [...headers.rows, ...headers.cols].map((header) => ({value: header.text, id: header.id})))
    ]);
  }

  const addRow = () => {
    appendRows({ text: '', index: nextRowIndex });
    const newCellsInExistingCols = cols.map((col) => ({ value: '', rowIndex: nextRowIndex, colIndex: col.index }));
    const newCellsInNewCols = addedColIndexes.map((col) => ({ value: '', rowIndex: nextRowIndex, colIndex: col }));
    const newCells = [...newCellsInExistingCols, ...newCellsInNewCols];
    appendFields(newCells);
    setAddedRowIndexes(rows => [...rows, nextRowIndex]);
    setNextRowIndex(i => i+1);
  }

  const addCol = () => {
    appendCols({ text: '', index: nextColIndex });
    const newCellsInExistingRows = rows.map((row) => ({ value: '', rowIndex: row.index, colIndex: nextColIndex }));
    const newCellsInNewRows = addedRowIndexes.map((row) => ({ value: '', rowIndex: row, colIndex: nextColIndex }));
    const newCells = [...newCellsInExistingRows, ...newCellsInNewRows];
    appendFields(newCells);
    setAddedColIndexes(cols => [...cols, nextColIndex]);
    setNextColIndex(i => i+1);
  }

  const deleteExistingHeader = (rowToRemove?: TableHeader, colToRemove?: TableHeader) => {
    const index = getFormIndex(rowToRemove, colToRemove);
    removeHeaders(index);
    if (rowToRemove) {
      setRows(rows => rows.filter(row => row.id != rowToRemove.id));
    } else if (colToRemove) {
      setCols(cols => cols.filter(col => col.id != colToRemove.id));
    }
  }

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
      <form onSubmit={handleSubmit(data => handleFormSubmit(data))} autoComplete='off'>
        <StyleWrapper>
          <div className='grid' style={{ gridTemplateColumns: 'max-content'}}>
            <div className='flex'>
              <table>
                <tbody>
                  {/* column delete buttons */}
                  <tr>
                    <td/>
                    <td/>
                    {cols.map((col) =>
                      <td key={col.id}>
                          <DeleteButton onClick={() => deleteExistingHeader(undefined, col)} disabled={cols.length + addedColIndexes.length <= 1}/>
                      </td>
                    )}
                    {newColFields.map((col, index) =>
                      <td key={col.id}>
                        <DeleteButton onClick={() => deleteNewHeader(index, false)} disabled={cols.length + addedColIndexes.length <= 1}/>
                      </td>
                    )}
                  </tr>
                  {/* column headers */}
                  <tr>
                    <td/>
                    <td/>
                    {cols.map((col) =>
                      <th key={col.id} className={errors.existingHeaders?.[getFormIndex(undefined, col)]?.value && 'border-red-600 bg-red-200'}>
                        <input {...register(`existingHeaders.${getFormIndex(undefined, col)}.value` as const, { required: true })}/>
                      </th>
                    )}
                    {newColFields.map((col, index) =>
                      <th key={col.id} className={errors.newCols?.[index]?.text && 'border-red-600 bg-red-200'}>
                        <input {...register(`newCols.${index}.text` as const, { required: true })}/>
                      </th>
                    )}
                  </tr>
                  {/* existing rows */}
                  {rows.map((row) =>
                    <tr key={row.id}>
                      {/* row delete button */}
                      <td>
                        <DeleteButton onClick={() => deleteExistingHeader(row)} disabled={rows.length + addedRowIndexes.length <= 1}/>
                      </td>
                      {/* row header */}
                      <th className={errors.existingHeaders?.[getFormIndex(row)]?.value && 'border-red-600 bg-red-200'}>
                        <input {...register(`existingHeaders.${getFormIndex(row)}.value` as const, { required: true })}/>
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
                        <td className='border' key={col.id}>
                          <input {...register(`new.${getFormIndexFromNew(row.index, col.index)}.value` as const)}/>
                        </td>
                      )}
                    </tr>
                  )}
                  {/* added rows */}
                  {newRowFields.map((row, index) =>
                    <tr key={row.id}>
                      <td>
                        <DeleteButton onClick={() => deleteNewHeader(index)} disabled={rows.length + addedRowIndexes.length <=1}/>
                      </td>
                      <th className={errors.newRows?.[index]?.text && 'border-red-600 bg-red-200'}>
                        <input {...register(`newRows.${index}.text` as const, { required: true })}/>
                      </th>
                      {cols.map((col) =>
                        <td className='border' key={col.id}>
                          <input {...register(`new.${getFormIndexFromNew(row.index, col.index)}.value` as const)}/>
                        </td>
                      )}
                      {newColFields.map((col) =>
                        <td className='border' key={col.id}>
                          <input {...register(`new.${getFormIndexFromNew(row.index, col.index)}.value` as const)}/>
                        </td>
                      )}
                    </tr>
                  )}
                </tbody>
              </table>
              <Button onClick={addCol} className='mt-6 w-6'>+</Button>
            </div>
            <Button onClick={addRow} className='max-w-full mx-6'>+</Button>
          </div>
          {(!isValid && isSubmitted) && <span className='text-red-600'>Please fill out all table headers.</span>}
        </StyleWrapper>
        <Button type='submit' className='mt-4' onClick={() => console.log(errors)}>Done</Button>
      </form>
    </div>
  )
}

export default EditTable