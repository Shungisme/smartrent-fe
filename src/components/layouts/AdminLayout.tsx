import React from 'react'
import AdminSidebar from '@/components/organisms/adminSidebar'
import AdminHeader from '@/components/organisms/adminHeader'

type AdminLayoutProps = {
  children: React.ReactNode
  activeItem?: string
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeItem }) => {
  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Fixed Sidebar */}
      <div className='fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200'>
        <AdminSidebar activeItem={activeItem} />
      </div>

      {/* Main Content Area */}
      <div className='flex-1 ml-64'>
        <AdminHeader />
        <main className='p-6'>{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
