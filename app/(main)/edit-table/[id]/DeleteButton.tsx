import React, { useState } from 'react'
import Image from 'next/image'
import deleteButton from '../../../../public/delete.png';
import deleteButtonHover from '../../../../public/delete_hover.png';

interface Props {
  onClick: () => void,
  disabled: boolean
}

const DeleteButton:React.FC<Props> = ({ onClick, disabled }) => {

  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <div className='flex justify-center m-1'>
      <Image
        src={(hovering && !disabled) ? deleteButtonHover : deleteButton} width={20} height={20} alt='Delete button'
        onClick={() => {!disabled && onClick()}}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`w-4 h-4 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      />
    </div>
  )
}

export default DeleteButton