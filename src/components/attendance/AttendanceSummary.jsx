import { MdPeople, MdCheckCircle, MdCancel } from 'react-icons/md'

export default function AttendanceSummary({ total, present, absent }) {
  const pct = total > 0 ? Math.round((present / total) * 100) : 0

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="card p-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#2e3038] text-gray-400">
        
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-gray-100">{total}</p>
        </div>
      </div>
      <div className="card p-4 flex items-center gap-3 bg-green-500/5 border-green-500/20">
        <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
         
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Present</p>
          <p className="text-2xl font-bold text-green-400">{present}</p>
        </div>
      </div>
      <div className="card p-4 flex items-center gap-3 bg-red-500/5 border-red-500/20">
        <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
         
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Absent</p>
          <p className="text-2xl font-bold text-red-400">{absent}</p>
        </div>
      </div>
    </div>
  )
}
