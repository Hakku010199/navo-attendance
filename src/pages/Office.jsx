import { useState } from 'react'
import OfficeSidebar from '../components/layout/OfficeSidebar'
import StudentsSection from '../components/students/StudentsSection'
import DailyAttendanceSection from '../components/attendance/DailyAttendanceSection'
import AttendanceHistorySection from '../components/attendance/AttendanceHistorySection'
import DivisionsSection from '../components/divisions/DivisionsSection'

const SECTIONS = {
  students: StudentsSection,
  daily: DailyAttendanceSection,
  history: AttendanceHistorySection,
  divisions: DivisionsSection,
}

export default function Office() {
  const [activeSection, setActiveSection] = useState('students')
  const ActiveComponent = SECTIONS[activeSection]

  return (
    <div className="min-h-screen bg-[#1e1f24] flex flex-col lg:flex-row">
      <OfficeSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-5 lg:p-8 overflow-auto">
        <ActiveComponent />
      </main>
    </div>
  )
}
