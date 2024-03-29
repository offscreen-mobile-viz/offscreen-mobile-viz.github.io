import './panels.scss'

import * as d3 from 'd3'

import Offscreen from './Offscreen'
import Context from './Context'
import BarWithContext from '../charts/BarWithContext'

import { useRef, useState, useEffect } from 'react'


export default function Panels({ data, chart, dimensions, n }) {
  let { width, height } = dimensions
  // knock off 70px to account for topbox (or 0 if results in a negative height)
  // then another 70 for the context chart
  height = Math.max(height - 140, 0)

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

  const [leftBound, setLeftBound] = useState(0)
  const [rightBound, setRightBound] = useState(0)

  /**
   * When the dataset changes, set the barchart's data, update the yScale domain, 
   * then trigger a re-render for offscreen components by updating left and right
   */
  useEffect(() => {
    if(!data || data.length == 0) {
      return
    }

    barchart.data(data)
    updateDomain()
  }, [data])

  /**
   * updates the domain of the y-axis 
   * then propogates to dependencies
   */
  function updateDomain() {
    /**
     * this *nices* the domain for all consumers downstream (ensures nice bin and y-scale domain.)
     */
    const domain = d3.scaleLinear().domain([0, d3.max(data, d => d.y)]).nice(8).domain()
    
    bin.domain(domain)
    barchart.domain(domain)

    setDomain(domain)
    
    // render BarChart
    d3.select(barchartRef.current).call(barchart)
  }

  /**
   * Dispatches offscreen data change. Slices data from beginning to left 
   * then again from right to end. Then bins this slice and updates left and right.
   * 
   * @param left - last index of left slice (left shall be elems data[i] -> data[left])
   * @param right - first index right slice (right shall be elems data[right] -> data[end])
   */
  function dispatch({ left, right }) {
    if(left == undefined || right == undefined) {
      return
    } 
    
    setLeftBound(left)
    setRightBound(right)

    let l = bin(data.slice(0, left))
    let r = bin(data.slice(right))

    setLeft(l)
    setRight(r)
    updateMaxBin(l, r)
  }

  /**
   * Sets maxBinSize to be the max length of left and right bins.
   */
  function updateMaxBin(left, right) {
    setMaxBinSize(
      Math.max(
        d3.max(left, d => d.length),
        d3.max(right, d => d.length)
      )
    )
  }

  return (
    <div className='wrapper'>
      <Context data={data} dimensions={{ width: barChartDimensions.width, height: 90 }} left={leftBound} right={rightBound} />
      <div className='panels'>
        <Offscreen
          data={left}
          side='left'
          type={chart}
          dimensions={offscreenDimensions}
          domain={domain}
          maxBinSize={maxBinSize}
          n={n}
        />
        <svg ref={barchartRef} width={barChartDimensions.width} height={barChartDimensions.height} />
        <Offscreen
          data={right}
          side='right'
          type={chart}
          dimensions={offscreenDimensions}
          domain={domain}
          maxBinSize={maxBinSize}
          n={n}
        />
      </div>
    </div>
  )
}
