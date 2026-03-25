import React from 'react'

interface Props {
  message?: string
}

const NotFound:React.FC<Props> = ({ message }) => {
  return (
    <div className='w-full h-screen flex justify-center items-center text-red-600'>
      <h4>{message ? message : 'Error loading data, please try again'}</h4>
    </div>
  )
}

export default NotFound