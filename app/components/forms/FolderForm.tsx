import React from 'react';
import { FieldValues, useForm } from 'react-hook-form'
import { FormTypeEnum } from '@/lib/definitions';
import { updateFolder } from '@/api/folders';
import Button from '../Button';
import { toast } from 'sonner';

interface FolderUpdateProps {
  type: FormTypeEnum,
  close: () => void
  id?: number
}

export const FolderUpdateForm:React.FC<FolderUpdateProps> = ({ type, close, id }) => {

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<{newName: string}>();

  const handleFormSubmit = (data: FieldValues) => {
    console.log('form submitted', data.newName, id);
    if (id) {
      updateFolder(id, data.newName);
    } else {
      toast.error('Error: missing folder ID');
    }
    close();
  }

  const onClose = () => {
    clearErrors();
    reset();
    close();
  }

  return (
    <div>
      <h4>Edit Folder</h4>
      <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
        <input {...register('newName', { required: true })} autoComplete='off' placeholder='New folder name'/>
        {errors.newName && <div className='text-red-600'>Please fill out this field</div>}
        <div className='flex mt-3'>
          <Button onClick={onClose} priority='secondary' className='w-full mr-1'>Cancel</Button>
          <Button type='submit' className='w-full ml-1'>Update</Button>
        </div>
      </form>
    </div>
  )
}


interface FolderDeleteProps {
  close: () => void, 
  id: number
}

export const FolderDeleteForm:React.FC<FolderDeleteProps> = ({ close, id }) => {

  // const handleDelete=> {
  //   console.log('form submitted', data.newName);
  // }

  return (
    <div>
      <h4>Delete Folder</h4>
      Are you sure you would like to delete this folder? This will delete all decks and cards contained in this folder. This action cannot be undone.
        <div className='flex mt-3'>
          <Button onClick={close} priority='secondary' className='w-full mr-1'>Cancel</Button>
          <Button type='submit' className='w-full ml-1'>Update</Button>
        </div>
    </div>
  )
}