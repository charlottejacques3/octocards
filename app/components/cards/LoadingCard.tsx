import React from 'react'

interface Props {
  flashcard?: boolean
}

const LoadingCard:React.FC<Props> = ({ flashcard=false }) => {
  return (
    <div className={`rounded-lg w-64 bg-bg-secondary-hover pulse mt-2 ${flashcard ? 'h-30' : 'h-18'}`}/>
  )
}

export default LoadingCard