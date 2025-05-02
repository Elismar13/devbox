import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import JsonFormatter from '../pages/JsonFormatter'
import Base64 from '../pages/Base64'
import Timestamp from '../pages/Timestamp'
import Uuid from '../pages/Uuid'
import RegexTester from '../pages/RegexTester'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/json-formatter" element={<JsonFormatter />} />
      <Route path="/base64" element={<Base64 />} />
      <Route path="/timestamp" element={<Timestamp />} />
      <Route path="/uuid" element={<Uuid />} />
      <Route path="/regex-tester" element={<RegexTester />} />
    </Routes>
  )
}
