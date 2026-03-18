'use client'
import React, { useState, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  children: ReactNode,
  isOpen: boolean,
  close: () => void,
}

const Modal:React.FC<ModalProps> = ({ children, isOpen, close }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const modal = (
    <div className='z-20 fixed top-0 left-0 w-full h-full bg-black/40' hidden={!isOpen} onClick={() => close()}>
      <div className={`bg-bg fixed w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 h-auto md:max-h-10/12 top-1/2 left-1/2 -translate-1/2 p-5 rounded-xl shadow-xl overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="absolute top-2 right-4 hover:bg-bg-secondary-hover px-2 py-0.5 rounded-4xl cursor-pointer" onClick={() => close()}>X</button>
        {children}
      </div>
    </div>
  )

  return createPortal(modal, document.body);
}

export default Modal;