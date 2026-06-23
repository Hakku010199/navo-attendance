import { supabase } from '../lib/supabase'

export const studentService = {
  async getAll({ divisionId, search } = {}) {
    let query = supabase
      .from('students')
      .select('*, divisions(id, name)')
      .order('roll_number')

    if (divisionId) {
      query = query.eq('division_id', divisionId)
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,roll_number.ilike.%${search}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getByDivision(divisionId) {
    const { data, error } = await supabase
      .from('students')
      .select('id, roll_number, name, mobile')
      .eq('division_id', divisionId)
      .order('roll_number')
    if (error) throw error
    return data
  },

  async create({ roll_number, name, mobile, division_id }) {
    const { data, error } = await supabase
      .from('students')
      .insert({ roll_number: roll_number.trim(), name: name.trim(), mobile: mobile.trim(), division_id })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, { roll_number, name, mobile, division_id }) {
    const { data, error } = await supabase
      .from('students')
      .update({ roll_number: roll_number.trim(), name: name.trim(), mobile: mobile.trim(), division_id })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
