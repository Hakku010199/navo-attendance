import { useState, useEffect, useCallback } from 'react'
import { divisionService } from '../services/divisionService'

export function useDivisions(withCounts = false) {
  const [divisions, setDivisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const data = withCounts
        ? await divisionService.getAll()
        : await divisionService.getAllSimple()
      setDivisions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [withCounts])

  useEffect(() => { fetch() }, [fetch])

  return { divisions, loading, error, refetch: fetch }
}
