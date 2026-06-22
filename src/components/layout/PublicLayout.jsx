import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
