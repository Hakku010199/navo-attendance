import { supabase } from '../lib/supabase'

export const attendanceService = {
  async submitAttendance({ date, divisionId, records }) {
    // Create session
    const { data: session, error: sessionError } = await supabase
      .from('attendance_sessions')
      .insert({ attendance_date: date, division_id: divisionId })
      .select()
      .single()
    if (sessionError) throw sessionError

    // Insert attendance records
    const recordsToInsert = records.map(r => ({
      session_id: session.id,
      student_id: r.studentId,
      status: r.status,
    }))

    const { error: recordsError } = await supabase
      .from('attendance_records')
      .insert(recordsToInsert)
    if (recordsError) throw recordsError

    return session
  },

  async getSessionExists({ date, divisionId }) {
    const { data, error } = await supabase
      .from('attendance_sessions')
      .select('id')
      .eq('attendance_date', date)
      .eq('division_id', divisionId)
      .maybeSingle()
    if (error) throw error
    return !!data
  },

  async getDailyAttendance({ date, divisionId }) {
    let query = supabase
      .from('attendance_records')
      .select(`
        id, status,
        students(id, roll_number, name, mobile),
        attendance_sessions!inner(attendance_date, division_id)
      `)
      .eq('attendance_sessions.attendance_date', date)

    if (divisionId) {
      query = query.eq('attendance_sessions.division_id', divisionId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getHistory({ date, divisionId, search }) {
    let query = supabase
      .from('attendance_records')
      .select(`
        id, status,
        students(id, roll_number, name, mobile),
        attendance_sessions!inner(attendance_date, divisions(id, name))
      `)
      .order('attendance_date', { foreignTable: 'attendance_sessions', ascending: false })

    if (date) {
      query = query.eq('attendance_sessions.attendance_date', date)
    }
    if (divisionId) {
      query = query.eq('attendance_sessions.division_id', divisionId)
    }

    const { data, error } = await query
    if (error) throw error

    // Filter by student name search
    if (search) {
      return data.filter(r =>
        r.students?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.students?.roll_number?.toLowerCase().includes(search.toLowerCase())
      )
    }
    return data
  },
}
