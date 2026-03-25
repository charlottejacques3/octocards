import { Toaster } from 'sonner'
import SideNav from '../components/SideNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex'>
      <SideNav/>
      {children}
      <Toaster richColors/>
      {/* 
      <a target="_blank" href="https://icons8.com/icon/S5biqohaDgd1/menu">Menu</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> 
      <a target="_blank" href="https://icons8.com/icon/60636/back">Back</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
      <a target="_blank" href="https://icons8.com/icon/60671/forward">Forward</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
      <a target="_blank" href="https://icons8.com/icon/102729/ellipsis">three dots</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
      */}
    </div>
  )
}