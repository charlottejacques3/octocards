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
    </div>
  )
}