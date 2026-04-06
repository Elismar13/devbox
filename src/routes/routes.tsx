import { Route, Routes } from 'react-router-dom'
import JsonFormatter from '../pages/JsonFormatter'
import Base64 from '../pages/Base64Tool'
import Timestamp from '../pages/TimestampTool'
import RegexTester from '../pages/RegexTester'
import QrCodeTool from '../pages/QrCodeTool'
import Uuid from '../pages/Uuid'
import Home from '../pages/Home'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/json-formatter" element={<JsonFormatter />} />
      <Route path="/base64" element={<Base64 />} />
      <Route path="/timestamp" element={<Timestamp />} />
      <Route path="/regex-tester" element={<RegexTester />} />
      <Route path="/qr-code" element={<QrCodeTool />} />
      <Route path="/uuid" element={<Uuid />} />
    </Routes>
  )
}
