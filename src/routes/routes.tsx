import { Route, Routes } from 'react-router-dom'
import JsonFormatter from '../pages/JsonFormatter'
import Base64 from '../pages/Base64Tool'
import Timestamp from '../pages/TimestampTool'
import RegexTester from '../pages/RegexTester'

export default function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      {/* <Route path="/json-formatter" element={<JsonFormatter />} /> */}
      <Route path="/" element={<JsonFormatter />} />
      <Route path="/base64" element={<Base64 />} />
      <Route path="/timestamp" element={<Timestamp />} />
      {/* <Route path="/uuid" element={<Uuid />} /> */}
      <Route path="/regex-tester" element={<RegexTester />} />
    </Routes>
  )
}
