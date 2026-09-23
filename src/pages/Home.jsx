import { useMeta } from '../components/Page'
import Hero from '../components/Hero'
import AppGrid from '../components/AppGrid'
import Speed from '../components/Speed'
import ExecutionStack from '../components/ExecutionStack'
import CloudVsDevice from '../components/CloudVsDevice'
import CoDesign from '../components/CoDesign'
import FullStack from '../components/FullStack'
import Closing from '../components/Closing'

/* The original separates every section with an explicit 96px rail that keeps
   the vertical hairlines running between blocks. */
function Gap() {
  return <div className="shell h-24" />
}

export default function Home() {
  useMeta(
    'On-Device AI for Apple Silicon: uzu & Models | Mirai Labs',
    'Mirai Labs builds uzu, a Rust LLM engine for iPhone, iPad and Mac, and 4-bit/8-bit Qwen, LFM and Muse-Glimmer models benchmarked vs MLX and llama.cpp.',
  )
  return (
    <>
      <Hero />
      <Gap />
      <AppGrid />
      <Gap />
      <Speed />
      <Gap />
      <ExecutionStack />
      <Gap />
      <CloudVsDevice />
      <Gap />
      <CoDesign />
      <Gap />
      <FullStack />
      <Gap />
      <Closing />
    </>
  )
}
