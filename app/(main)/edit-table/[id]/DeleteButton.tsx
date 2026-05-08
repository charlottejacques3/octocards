import React, { useState } from 'react'
import Image from 'next/image'
import deleteButton from '../../../../public/delete.png';
import deleteButtonHover from '../../../../public/delete_hover.png';

interface Props {
  onClick: () => void
}

const DeleteButton:React.FC<Props> = ({ onClick }) => {

  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <div className='flex justify-center m-1'>
      <Image
        src={hovering ? deleteButtonHover : deleteButton} width={20} height={20} alt='Delete button'
        onClick={onClick}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className='cursor-pointer w-4 h-4'
      />
    </div>
  )
}

export default DeleteButton