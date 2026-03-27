import React, { ReactNode } from 'react'
import Link from 'next/link';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonPriority = 'primary' | 'secondary' | 'underline' | 'correct' | 'partially-correct';

interface Props {
  children: ReactNode,
  onClick?: () => void,
  className?: string
  type?: ButtonType,
  priority?: ButtonPriority,
  href?: string,
}

const Button:React.FC<Props> = ({ children, onClick, className='', type='button', priority='primary', href }) => {

  const classes = `
    ${className} cursor-pointer rounded-lg p-1
    ${priority === 'primary' && 'bg-button-primary hover:bg-button-primary-hover'}
    ${priority === 'correct' && 'bg-button-correct hover:bg-button-correct-hover'}
    ${priority === 'partially-correct' && 'bg-button-partially-correct hover:bg-button-partially-correct-hover'}
    ${priority === 'secondary' && 'bg-bg-secondary hover:bg-bg-secondary-hover border border-button-primary'}
  `;

  return (
    <>
      {href ? 
        <Link href={href} className={classes}>{children}</Link>
        : <button 
          className={classes} 
          type={type} 
          onClick={onClick ? () => onClick() : () => {}}
        >
          {children}
        </button>
      }
    </>
  )
}

export default Button