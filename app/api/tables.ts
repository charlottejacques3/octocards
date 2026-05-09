'use server'
import { z, ZodError } from "zod"
import { TableSchema, TableHeaderSchema, TableItemSchema, TableDataSchema } from "@/lib/definitions"
import { callAPIServer } from "./callAPIServer"
import { table } from "console"


export const getTable = async (id: number) => {
  const res = await callAPIServer(`tables/${id}`);
  const table = TableSchema.parse(await res.json());
  return table;
}


export const getTableHeaders = async (tableId: number) => {
  const TableHeadersSchema = z.array(TableHeaderSchema);
  const res = await callAPIServer(`table-headers/by-table/${tableId}/`);
  const data = await res.json();
  if (data.rows && data.cols) {
    return {
      'rows': TableHeadersSchema.parse(data.rows),
      'cols': TableHeadersSchema.parse(data.cols)
    };
  }
  throw new Error('Missing table header data');
}


export const getTableCells = async (tableId: number) => {
  const TableItemsSchema = z.record(z.string(), TableItemSchema)
  const res = await callAPIServer(`table-items/by-table/${tableId}/`);
  const tableItems = TableItemsSchema.parse(await res.json());
  return tableItems;
}


export const getTableDataByDeck = async (deckId: number) => {
  const AllTablesSchema = z.array(TableDataSchema);
  const res = await callAPIServer(`tables/by-deck/${deckId}/`);
  const tableData = AllTablesSchema.parse(await res.json());
  return tableData;
}


export const bulkUpdateHeaders = async (existingHeaders: {value: string, dataId: number}[]) => {
  const updateList = existingHeaders.map((cell) => ({id: cell.dataId, text: cell.value}));
  if (updateList.length > 0) { 
    await callAPIServer('table-headers/bulk-update/', {
      method: 'PATCH',
      body: JSON.stringify(updateList),
    });
  }
}


export const bulkCreateHeaders = async (newRows: {value: string, index: number}[], newCols: {value: string, index: number}[], tableId: number) => {
  const rows = newRows.map((row) => ({...row, type: 'ROW'}));
  const cols = newCols.map((col) => ({...col, type: 'COL'}));
  const createList = [...rows, ...cols];
  if (createList.length > 0) {
    await callAPIServer(`table-headers/bulk-create/${tableId}/`, {
      method: 'POST',
      body: JSON.stringify(createList),
    });
  }
}


export const bulkDeleteHeaders = async (currentHeaders: {value: string, dataId: number}[], previousHeaders: {value: string, id: number}[]) => {
  const headersToDelete = previousHeaders.filter((prev) => !currentHeaders.some((curr) => curr.dataId === prev.id));
  if (headersToDelete.length > 0) {
    await callAPIServer(`table-headers/bulk-delete/`, {
      method: 'DELETE',
      body: JSON.stringify(headersToDelete),
    });
  }
}


export const bulkUpdateCells = async (existingCells: {value: string, dataId: number}[]) => {
  const updateList = existingCells.map((cell) => ({id: cell.dataId, text: cell.value}));
  if (updateList.length > 0) {
    await callAPIServer('table-items/bulk-update/', {
      method: 'PATCH',
      body: JSON.stringify(updateList),
    });
  }
}


export const bulkCreateCells = async (newCells: {value: string, rowIndex: number, colIndex: number}[], tableId: number) => {
  const createList = newCells.filter((cell) => cell.value).map((cell) => ({text: cell.value, row: cell.rowIndex, col: cell.colIndex}));
  if (createList.length > 0) {
    await callAPIServer(`table-items/bulk-create/${tableId}/`, {
      method: 'POST',
      body: JSON.stringify(createList),
    });
  }
}