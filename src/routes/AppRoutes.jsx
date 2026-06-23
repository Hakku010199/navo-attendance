import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Office from '../pages/Office'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/office" element={<Office />} />
    </Routes>
  )
}
