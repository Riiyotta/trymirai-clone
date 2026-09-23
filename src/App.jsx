import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import LocalModels from './pages/LocalModels'
import InferenceRuntime from './pages/InferenceRuntime'
import ConversionToolkit from './pages/ConversionToolkit'
import Metrics from './pages/Metrics'
import ChatForMac from './pages/ChatForMac'
import AboutUs from './pages/AboutUs'
import Careers from './pages/Careers'
import Interested from './pages/Interested'
import { BlogIndex, BlogPost } from './pages/Blog'
import { PrivacyPolicy, TermsOfUse } from './pages/Legal'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/local-models" element={<LocalModels />} />
        <Route path="/inference-runtime" element={<InferenceRuntime />} />
        <Route path="/conversion-optimization-toolkit" element={<ConversionToolkit />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/chat-for-mac" element={<ChatForMac />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/i-am-interested" element={<Interested />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
