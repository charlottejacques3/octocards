import React, { ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  children: ReactNode,
  href: string
}
const ExternalLink:React.FC<Props> = ({ children, href }) => {
  return <Link href={href} target='_blank' className='underline'>{children}</Link>
}

const page = () => {
  return (
    <div className='w-full h-screen overflow-y-auto'>
      <h1>About</h1>
      Hi, I'm Charlotte! I built Octocards because I wanted to create a simple, user-friendly study app using spaced repetition. See more of my projects on <ExternalLink href='https://github.com/charlottejacques3'>GitHub</ExternalLink> or my <ExternalLink href='https://charlottejacques.vercel.app/'>personal website</ExternalLink>!

      <h4 className='mt-2'>How To Use The App</h4>
      On the Study Sets page, create folders or decks. Within the decks, you can create flashcards to help review your material. The app uses a spaced repetition algorithm to optimize your learning, so that you can be reminded of the content just in time before you forget it. On the homepage, you can study all your flashcards that are due today, or you can review individual decks or folders. If you want to go through all the content in a particular folder or deck, you can also do that by navigating to its page.

      <h4 className='mt-2'>Icons</h4>
      All the icons used in this app are from Icons8.<br/>
      <ExternalLink href="https://icons8.com/icon/S5biqohaDgd1/menu">Menu</ExternalLink> icon by <ExternalLink href="https://icons8.com">Icons8</ExternalLink><br/>
      <ExternalLink href="https://icons8.com/icon/60636/back">Back</ExternalLink> icon by <ExternalLink href="https://icons8.com">Icons8</ExternalLink><br/>
      <ExternalLink href="https://icons8.com/icon/60671/forward">Forward</ExternalLink> icon by <ExternalLink href="https://icons8.com">Icons8</ExternalLink><br/>
      <ExternalLink href="https://icons8.com/icon/102729/ellipsis">Three dots</ExternalLink> icon by <ExternalLink href="https://icons8.com">Icons8</ExternalLink>
      <ExternalLink href="https://icons8.com/icon/MHELKlQKXqut/delete">Delete</ExternalLink> icon by <ExternalLink href="https://icons8.com">Icons8</ExternalLink>
    </div>
  )
}

export default page