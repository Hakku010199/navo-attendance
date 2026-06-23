import { MdCheckCircle, MdCancel } from 'react-icons/md'

export default function AttendanceGrid({ students, attendance, onToggle }) {
  if (students.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-gray-500">No students found in this division.</p>
        <p className="text-gray-600 text-sm mt-1">Add students from the Office dashboard.</p>
      </div>
    )
  }

  return (
    <div className="card p-5">
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-10 gap-2.5">
        {students.map(student => {
          const isPresent = attendance[student.id] !== 'absent'
          return (
            <button
              key={student.id}
              onClick={() => onToggle(student.id)}
              title={`${student.name}`}
              className={`
                relative group flex flex-col items-center justify-center
                w-full aspect-square rounded-xl font-mono font-bold text-base
                transition-all duration-150 active:scale-95 focus:outline-none
                focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#26272d]
                ${isPresent
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 focus:ring-green-500'
                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 focus:ring-red-500'
                }
              `}
            >
              <span className="leading-none">{student.roll_number}</span>
              <span className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isPresent
                  ? <MdCheckCircle size={10} className="text-green-400" />
                  : <MdCancel size={10} className="text-red-400" />
                }
              </span>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[#3a3b42]">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-3 h-3 rounded bg-green-500/30 border border-green-500/40" />
          Present
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/40" />
          Absent
        </div>
        <p className="text-xs text-gray-600 ml-auto">Click to toggle</p>
      </div>
    </div>
  )
}
