import { supabase } from '../lib/supabase'

export const divisionService = {
  async getAll() {
    const { data, error } = await supabase
      .from('divisions')
      .select('*, students(count)')
      .order('name')
    if (error) throw error
    return data
  },

  async getAllSimple() {
    const { data, error } = await supabase
      .from('divisions')
      .select('id, name')
      .order('name')
    if (error) throw error
    return data
  },

  async create(name) {
    const { data, error } = await supabase
      .from('divisions')
      .insert({ name: name.trim() })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, name) {
    const { data, error } = await supabase
      .from('divisions')
      .update({ name: name.trim() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    // Check if students are assigned
    const { count, error: countError } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('division_id', id)
    if (countError) throw countError
    if (count > 0) {
      throw new Error('Cannot delete division because students are assigned to this division.')
    }
    const { error } = await supabase
      .from('divisions')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
}
