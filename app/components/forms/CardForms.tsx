import React, { useEffect } from 'react';
import { FieldValues, Form, useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { FormTypeEnum } from '@/lib/definitions';
import Button from '../Button';
import { createCard, updateCard, deleteCard } from '@/api/cards';

interface CardUpdateCreateProps {
  type: FormTypeEnum,
  close: () => void,
  id?: number,
  deckId?: number,
  defaultQ?: string,
  defaultA?: string
}

export const CardUpdateCreateForm:React.FC<CardUpdateCreateProps> = ({ type, close, id, deckId, defaultQ='', defaultA='' }) => {

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<{q: string, a: string}>({ defaultValues: {q: defaultQ, a: defaultA}});

  useEffect(() => {
    setFocus('q')
  }, [close])

  useEffect(() => {
    reset({ q: defaultQ, a: defaultA });
  }, [defaultQ, defaultA, reset])

  const handleFormSubmit = async (data: FieldValues) => {
    if (type === FormTypeEnum.CREATE && deckId) {
      try {
        await createCard(data.q, data.a, deckId);
      } catch (e) {
        toast.error('Failed to create card. Please try again');
      }
    }
    else if (type === FormTypeEnum.EDIT && id) {
      try {
        await updateCard(id, data.q, data.a);
      } catch (e) {
        toast.error('Failed to update card. Please try again');
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
      <h4>{type==FormTypeEnum.EDIT ? 'Edit' : 'Add'} card</h4>
      <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
        <input 
          {...register('q', { required: true })} 
          autoComplete='off' 
          placeholder='Question' 
          defaultValue={defaultQ}
        />
        {errors.q && <div className='text-red-600'>Please enter a question</div>}
        <textarea 
          {...register('a', { required: true })} 
          autoComplete='off' 
          placeholder='Answer' 
          defaultValue={defaultA}
          className='h-24'
        /><br/>
        {errors.a && <div className='text-red-600'>Please enter an answer</div>}
        <div className='flex mt-3'>
          <Button onClick={onClose} priority='secondary' className='w-full mr-1'>Cancel</Button>
          <Button type='submit' className='w-full ml-1'>{type==FormTypeEnum.EDIT ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </div>
  )
}


interface CardDeleteProps {
  close: () => void, 
  id: number
}

export const CardDeleteForm:React.FC<CardDeleteProps> = ({ close, id }) => {

  const handleDelete = async () => {
    try {
      await deleteCard(id);
    } catch (e) {
      toast.error('Failed to delete card. Please try again')
    } 
    close();
  }

  return (
    <div>
      Are you sure you would like to delete this card? This action cannot be undone.
        <div className='flex mt-3'>
          <Button onClick={close} priority='secondary' className='w-full mr-1'>Cancel</Button>
          <Button onClick={handleDelete} className='w-full ml-1'>Yes, delete</Button>
        </div>
    </div>
  )
}