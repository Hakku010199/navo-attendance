import { useState, useRef } from 'react'

export default function AttendanceGrid({ students, attendance, onToggle }) {
  const [pressedStudent, setPressedStudent] = useState(null)
  const [visibleTooltip, setVisibleTooltip] = useState(null)
  const timeoutRef = useRef({})
  const hideTimeoutRef = useRef({})

  if (students.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-gray-500">No students found in this division.</p>
        <p className="text-gray-600 text-sm mt-1">Add students from the Office dashboard.</p>
      </div>
    )
  }

  const handleMouseDown = (studentId) => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current[studentId]) {
      clearTimeout(hideTimeoutRef.current[studentId])
      delete hideTimeoutRef.current[studentId]
    }
    
    const timer = setTimeout(() => {
      setPressedStudent(studentId)
      setVisibleTooltip(studentId)
    }, 200)
    timeoutRef.current[studentId] = timer
  }

  const handleMouseUp = (studentId) => {
    clearTimeout(timeoutRef.current[studentId])
    
    // Delay hiding the tooltip by 300ms to allow reading
    hideTimeoutRef.current[studentId] = setTimeout(() => {
      setVisibleTooltip(null)
      setPressedStudent(null)
      delete hideTimeoutRef.current[studentId]
    }, 300)
  }

  return (
    <div className="card p-5">
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-10 gap-2.5">
        {students.map(student => {
          const isPresent = attendance[student.id] !== 'absent'
          return (
            <div key={student.id} className="relative">
              {/* Tooltip - stays visible while holding and delays hiding */}
              {visibleTooltip === student.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-10 whitespace-nowrap pointer-events-none transition-opacity duration-200">
                  <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-gray-700">
                    {student.name}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}

              <button
                onMouseDown={() => handleMouseDown(student.id)}
                onMouseUp={() => handleMouseUp(student.id)}
                onMouseLeave={() => handleMouseUp(student.id)}
                onTouchStart={() => handleMouseDown(student.id)}
                onTouchEnd={() => handleMouseUp(student.id)}
                onClick={() => onToggle(student.id)}
                title={`${student.name} - ${student.roll_number}`}
                className={`
                  relative flex flex-col items-center justify-center
                  w-full aspect-square rounded-xl font-mono font-bold text-base
                  transition-colors duration-150 focus:outline-none
                  ${isPresent
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                  }
                `}
              >
                <span className="leading-none">{student.roll_number}</span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
