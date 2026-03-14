import React from 'react'
import Link from 'next/link'

interface Props {
  text: string,
  href: string
}

const LinkButton:React.FC<Props> = ({ text, href }) => {
  return (
    <Link className='underline hover:font-semibold' href={href}>{text}</Link>
  )
}

export default LinkButton