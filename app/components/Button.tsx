import React, { ReactNode } from 'react'

type ButtonType = 'button' | 'submit' | 'reset';

interface Props {
  children: ReactNode,
  onClick?: () => void,
  className?: string
  type?: ButtonType
}

const Button:React.FC<Props> = ({ children, onClick, className='', type='button' }) => {
  return (
    <button 
      className={`${className} bg-button-primary cursor-pointer rounded-lg hover:bg-button-primary-hover p-1`} 
      type={type} 
      onClick={onClick ? () => onClick() : () => {}}
    >
      {children}
    </button>
  )
}

export default Button