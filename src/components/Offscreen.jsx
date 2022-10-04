import * as d3 from 'd3'

import { useRef, useState, useEffect } from "react"

import DotPlot from '../charts/DotPlot'

/**
 *  Offscreen displays the affscreen data provided for a given side. 
 *  
 *  side - the side to be displayed 'left' | 'right'
 */
export default function Offscreen({ data, bin, side, dimensions, y, type }) {
  /**
   * chart will hold all possible chart closures based on a specified type.
   * 
   * Usage: chart['dotplot-40'] will render a dotplot with 40 points per dot.
   *        this allows for ease of use to integrate with the type prop. chart[type]
   *        will render the desired type.
   */
  const chart = {
    'dotplot-40': DotPlot(),
    'dotplot-100': DotPlot().pointsPerDot(100),
  }
  const chartRef = useRef(null)

  /**
   * This ensures that the Offscreen component is being provided a valid side prop
   * 
   * side must be 'left' | 'right'
   */
  useEffect(() => {
    if (side != 'left' && side != 'right') {
      throw new Error('invalid side prop.\nUsage \'left\' | \'right\'')
    }
  }, [side])

  /**
   * This useEffect will trigger when data changes.
   * 
   * This should handle re-binning and data manipulation requirements
   */
  useEffect(() => {
    if (!data || !y || !bin || !type)
      return
      
    chart[type]
      .data(Object.values(data))
      .bin(bin)
      .dimensions(dimensions)
      .y(y)
      .side(side)
    d3.select(chartRef.current).call(chart[type])
  }, [data, y, bin, type])


  return (
    <div className={"offscreen" + ` ${side}`}>
      <svg ref={chartRef} width={dimensions.width} height={dimensions.height} />
    </div>
  )
}
