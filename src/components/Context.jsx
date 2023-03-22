import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import ContextChart from '../charts/Context.js'

function Context({ dimensions, data, left, right }) {
  const ref = useRef(null)
  const context = ContextChart().bins(1000)
  
  useEffect(() => {
    if(!data || data.length == 0 || !dimensions) {
      return
    }

    const svg = d3.select(ref.current)

    // update context
    context
      .dimensions(dimensions)
      .data(data)
      .left(left)
      .right(right)

    // render context
    svg.call(context)
  }, [data, dimensions, left, right])

  return (
    <svg width={dimensions.width} height={dimensions.height} ref={ref} />
  )
}

export default Context
