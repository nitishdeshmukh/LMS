import React from 'react'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import CertificateManagement from '../components/CertificateManagement'

function Certificate() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <CertificateManagement />
        </main>
      </div>
    </div>
  )
}

export default Certificate