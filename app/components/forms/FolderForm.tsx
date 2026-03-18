import React from 'react';
import { FieldValues, useForm } from 'react-hook-form'
import { FormTypeEnum } from '@/lib/definitions';
import Button from '../Button';

interface Props {
  type: FormTypeEnum,
  close: () => void
}

export const FolderUpdateForm:React.FC<Props> = ({ type, close }) => {

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<{newName: string}>();

  const handleFormSubmit = (data: FieldValues) => {
    console.log('form submitted', data.newName);
  }

  const onClose = () => {
    clearErrors();
    close();
  }

  return (
    <div>
      <h4>Edit Folder</h4>
      <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
        <input {...register('newName', { required: true })} autoComplete='off' placeholder='New folder name'/>
          {errors.newName && <div className='text-red-600'>Please fill out this field</div>}
          <Button onClick={onClose}>Cancel</Button>
          <Button type='submit' className='mt-2'>Update</Button>
      </form>
    </div>
  )
}