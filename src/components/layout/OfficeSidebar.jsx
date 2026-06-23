import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MdPeople, MdCalendarToday, MdHistory, MdClass,
  MdMenu, MdClose, MdSchool, MdHome
} from 'react-icons/md'

const navItems = [
  { id: 'students', label: 'Students', icon: MdPeople },
  { id: 'daily', label: 'Daily Attendance', icon: MdCalendarToday },
  { id: 'history', label: 'Attendance History', icon: MdHistory },
  { id: 'divisions', label: 'Divisions', icon: MdClass },
]

export default function OfficeSidebar({ activeSection, onSectionChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleNav = (id) => {
    onSectionChange(id)
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#26272d] border-b border-[#3a3b42]">
        <div className="flex items-center gap-2 text-indigo-400">
          <MdSchool size={22} />
          <span className="font-semibold text-gray-100">Office</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-gray-400 hover:bg-[#3a3b42] transition-all"
        >
          {mobileOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full bg-[#26272d] border-r border-[#3a3b42] flex flex-col p-4 gap-1">
            <SidebarContent
              activeSection={activeSection}
              onNav={handleNav}
              navigate={navigate}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-[#26272d] border-r border-[#3a3b42] p-4 gap-1 min-h-screen">
        <SidebarContent
          activeSection={activeSection}
          onNav={handleNav}
          navigate={navigate}
        />
      </aside>
    </>
  )
}

function SidebarContent({ activeSection, onNav, navigate }) {
  return (
    <>
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-3 py-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <MdSchool size={18} className="text-white" />
        </div>
        <div>
          <p className="font-semibold text-gray-100 text-sm leading-tight">School</p>
          <p className="text-gray-500 text-xs">Office Dashboard</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className={`nav-item w-full text-left ${activeSection === id ? 'active' : ''}`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-4 pt-4 border-t border-[#3a3b42]">
        <button
          onClick={() => navigate('/')}
          className="nav-item w-full text-left"
        >
          <MdHome size={18} />
          Attendance Dashboard
        </button>
      </div>
    </>
  )
}
