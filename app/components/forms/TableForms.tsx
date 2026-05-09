import React, { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { FormTypeEnum } from '@/lib/definitions';
import Button from '../Button';

interface TableRenameCreateProps {
  type: FormTypeEnum,
  close: () => void,
  id?: number,
  deckId?: number,
  defaultVal?: string
}

export const TableRenameCreateForm:React.FC<TableRenameCreateProps> = ({ type, close, id, deckId, defaultVal='' }) => {

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<{newName: string}>({ defaultValues: {newName: defaultVal}});

  useEffect(() => {
    setFocus('newName')
  }, [close]);

  useEffect(() => {
    reset({ newName: defaultVal });
  }, [defaultVal, reset]);

  const handleFormSubmit = async (data: FieldValues) => {
    if (type === FormTypeEnum.CREATE) {
      try {
        //create table
      } catch (e) {
        toast.error('Failed to create table. Please try again');
      }
    }
    else if (type === FormTypeEnum.EDIT && id) {
      try {
        //rename table
      } catch (e) {
        toast.error('Failed to rename table. Please try again');
      }
    } else {
      toast.error('Error: missing ID');
    }
    onClose();
  }

  const onClose = () => {
    clearErrors();
    reset();
    close();
  }

  return (
    <div>
      <h4>{type==FormTypeEnum.EDIT ? 'Rename' : 'Add'} table</h4>
      <form onSubmit={handleSubmit((data) => handleFormSubmit(data))} autoComplete='off'>
        <input {...register('newName', { required: true })} placeholder='New table name' defaultValue={defaultVal}/>
        {errors.newName && <div className='text-red-600'>Please fill out this field</div>}
        <div className='flex mt-3'>
          <Button onClick={onClose} priority='secondary' className='w-full mr-1'>Cancel</Button>
          <Button type='submit' className='w-full ml-1'>{type==FormTypeEnum.EDIT ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </div>
  )
}


interface TableDeleteProps {
  close: () => void, 
  id: number
}

export const TableDeleteForm:React.FC<TableDeleteProps> = ({ close, id }) => {

  const handleDelete = async () => {
    try {
      //delete table
    } catch (e) {
      toast.error('Failed to delete table. Please try again')
    } 
    close();
  }

  return (
    <div>
      Are you sure you would like to delete this table? This action cannot be undone.
        <div className='flex mt-3'>
          <Button onClick={close} priority='secondary' className='w-full mr-1'>Cancel</Button>
          <Button onClick={handleDelete} className='w-full ml-1'>Yes, delete</Button>
        </div>
    </div>
  )
}