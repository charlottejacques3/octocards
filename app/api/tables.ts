'use server'
import { z } from "zod"
import { TableSchema, TableHeaderSchema, TableItemSchema, TableItem } from "@/lib/definitions"
import { callAPIServer } from "./callAPIServer"


export const getTable = async (id: number) => {
  const res = await callAPIServer(`tables/${id}`);
  const table = TableSchema.parse(await res.json());
  return table;
}


export const getTableHeaders = async (tableId: number) => {
  const TableHeadersSchema = z.array(TableHeaderSchema);
  const res = await callAPIServer(`table-headers/by-table/${tableId}`);
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
  const res = await callAPIServer(`table-items/by-table/${tableId}`);
  const tableItems = TableItemsSchema.parse(await res.json());

  return tableItems;
}