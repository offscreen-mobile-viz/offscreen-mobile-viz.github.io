import * as d3 from 'd3'
import { useRef, useEffect } from 'react'
import ContextChart from '../charts/Context.js'

function Context({ dimensions, data, left, right }) {
  const ref = useRef(null)
  const context = useRef(null)

  useEffect(() => {
    context.current = ContextChart().bins(1000)
  }, [])

  useEffect(() => {
    if(!dimensions || !context.current) return

    context.current.dimensions(dimensions)
  }, [dimensions])

  useEffect(() => {
    if(!data || !context.current) return

    const svg = d3.select(ref.current)
    svg.call(context.current.drawDots, data)
  }, [data])

  useEffect(() => {
    if(!context.current) return

    const svg = d3.select(ref.current)
    svg.call(context.current.drawViewField, left, right)
  }, [left, right])


  return (
    <svg width={dimensions.width} height={dimensions.height} ref={ref} />
  )
}

export default Context
