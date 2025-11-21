import React from 'react'
import StudentsPage from '../components/StudentsPage'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'

function Student() {
  return (
     <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        
        {/* <main className="flex-1 overflow-y-auto">
          <StudentsPage />
        </main> */}
      </div>
    </div>
  )
}

export default Student