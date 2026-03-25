import React, { useEffect } from 'react';
import { FieldValues, Form, useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { FormTypeEnum } from '@/lib/definitions';
import { createDeck, updateDeck, deleteDeck } from '@/api/decks';
import Button from '../Button';

interface DeckUpdateCreateProps {
  type: FormTypeEnum,
  close: () => void,
  id?: number,
  folderId?: number,
  defaultVal?: string
}

export const DeckUpdateCreateForm:React.FC<DeckUpdateCreateProps> = ({ type, close, id, folderId, defaultVal='' }) => {

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
    if (type === FormTypeEnum.CREATE && folderId) {
      try {
        await createDeck(data.newName, folderId);
      } catch (e) {
        toast.error('Failed to create deck. Please try again');
      }
    }
    else if (type === FormTypeEnum.EDIT && id) {
      try {
        await updateDeck(id, data.newName);
      } catch (e) {
        toast.error('Failed to update deck. Please try again');
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
      <h4>{type==FormTypeEnum.EDIT ? 'Edit' : 'Add'} deck</h4>
      <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
        <input {...register('newName', { required: true })} autoComplete='off' placeholder='New deck name' defaultValue={defaultVal}/>
        {errors.newName && <div className='text-red-600'>Please fill out this field</div>}
        <div className='flex mt-3'>
          <Button onClick={onClose} priority='secondary' className='w-full mr-1'>Cancel</Button>
          <Button type='submit' className='w-full ml-1'>{type==FormTypeEnum.EDIT ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </div>
  )
}


interface DeckDeleteProps {
  close: () => void, 
  id: number
}

export const DeckDeleteForm:React.FC<DeckDeleteProps> = ({ close, id }) => {

  const handleDelete = async () => {
    try {
      await deleteDeck(id);
    } catch (e) {
      toast.error('Failed to delete deck. Please try again')
    } 
    close();
  }

  return (
    <div>
      Are you sure you would like to delete this deck? This will delete all cards contained in this deck. This action cannot be undone.
        <div className='flex mt-3'>
          <Button onClick={close} priority='secondary' className='w-full mr-1'>Cancel</Button>
          <Button onClick={handleDelete} className='w-full ml-1'>Yes, delete</Button>
        </div>
    </div>
  )
}