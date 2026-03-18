import React, { ReactNode } from 'react'

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonPriority = 'primary' | 'secondary' | 'underline';

interface Props {
  children: ReactNode,
  onClick?: () => void,
  className?: string
  type?: ButtonType,
  priority?: ButtonPriority
}

const Button:React.FC<Props> = ({ children, onClick, className='', type='button', priority='primary' }) => {
  return (
    <button 
      className={`
        ${className} cursor-pointer rounded-lg p-1
        ${priority === 'primary' && 'bg-button-primary hover:bg-button-primary-hover'}
        ${priority === 'secondary' && 'bg-bg-secondary hover:bg-bg-secondary-hover border border-button-primary'}
      `} 
      type={type} 
      onClick={onClick ? () => onClick() : () => {}}
    >
      {children}
    </button>
  )
}

export default Button