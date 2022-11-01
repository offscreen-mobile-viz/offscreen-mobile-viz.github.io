import './panels.scss'

import * as d3 from 'd3'

import Offscreen from './Offscreen'
import BarWithContext from '../charts/BarWithContext'

import { useRef, useState, useEffect } from 'react'
import BarChart from './BarChart'
import { schemeDark2 } from 'd3'


export default function Panels({ data, chart }) {
  let { width, height } = d3.select('body').node().getBoundingClientRect()
  height -= 70
  const offscreenDimensions = { width: width * 0.15, height } 
  const barChartDimensions = { width: width - (2 * offscreenDimensions.width), height }

  const barchartRef = useRef()
  const barchart = BarWithContext()
    .dispatch(dispatch)
    .dimensions(barChartDimensions)

  const [domain, setDomain] = useState([0, 1])

  const bin = d3.bin()
    .thresholds(8)
    .value(d => d.y)
  const [maxBinSize, setMaxBinSize] = useState(0)

  const [left, setLeft] = useState([])
  const [right, setRight] = useState([])

  useEffect(() => {
    if(!data || data.length == 0) {
      return
    }

    barchart.data(data)
    updateDomain()
  }, [data])

  useEffect(() => {
    updateMaxBin()
  }, [left, right])
  
  /**
   * updates the domain of the y-axis 
   * then propogates to dependencies
   */
  function updateDomain() {
    const domain = [0, d3.max(data, d => d.y)] 
    
    bin.domain(domain)
    barchart.domain(domain)

    setDomain(domain)
    renderBarChart()
  }

  function dispatch({ left, right }) {
    setLeft(bin(data.slice(0, left)))
    setRight(bin(data.slice(right)))
  }

  function updateMaxBin() {
    setMaxBinSize(
      Math.max(
        d3.max(left, d => d.length),
        d3.max(right, d => d.length)
      )
    )
  }

  /**
   * calls the BarChart function on the svg selection
   */
  function renderBarChart() {
    d3.select(barchartRef.current).call(barchart)
  }

  return (
    <div className='panels' >
      <Offscreen
        data={left}
        side='left'
        type={chart}
        dimensions={offscreenDimensions}
        domain={domain}
        maxBinSize={maxBinSize}
      />
      <svg ref={barchartRef} width={barChartDimensions.width} height={barChartDimensions.height} />
      <Offscreen
        data={right}
        side='right'
        type={chart}
        dimensions={offscreenDimensions}
        domain={domain}
        maxBinSize={maxBinSize}
      />
    </div>
  )
}
