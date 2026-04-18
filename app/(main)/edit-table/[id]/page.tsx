import React from 'react'
import { Table, TableHeader, TableItem } from '@/lib/definitions'
import { getTable, getTableCells, getTableHeaders } from '@/app/api/tables'
import EditTable from './EditTable'
import NotFound from '@/app/components/NotFound'

const page = async ({ params } : { params: Promise<{id: number}> }) => {

  const tableId = (await params).id;
  ;
  try {
    const [table, headers, cells]:[Table, {'rows': TableHeader[], 'cols': TableHeader[]}, Record<string, TableItem>] = await Promise.all([
      getTable(tableId), 
      getTableHeaders(tableId),
      getTableCells(tableId)
    ]);
    return (
      <div className='w-full'>
        <EditTable table={table} headers={headers} cells={cells}/>
      </div>
    );
  } catch (e) {
    return <NotFound message='Error loading data, please try again' fullscreen/>;
  }
}

export default page