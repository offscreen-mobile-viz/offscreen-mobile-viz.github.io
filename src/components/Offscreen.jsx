import * as d3 from 'd3'

import { useRef, useEffect } from "react"

import BoxPlot from '../charts/BoxPlot';
import Control from '../charts/Control';
import DotPlot from '../charts/DotPlot'
import Histogram from '../charts/Histogram';
import ViolinPlot from '../charts/ViolinPlot';

import './offscreen.scss';

/**
 * enum to discretize ChartTypes
 */
export const ChartType = {
  /**
   * DOTPLOT40 - a DotPlot chart with 40 points per dot
   */
  DOTPLOT40: 'dotplot-40',
  
  /**
   * DOTPLOT100 - a DotPlot chart with 100 points per dot
   */
  DOTPLOT100: 'dotplot-100',

  /**
  * DOTPLOT_N - a DotPlot chart with n points per dot
  */
  DOTPLOT_N: 'dotplot-n',
  
  /**
   * HISTOGRAM - a Histogram
   */
  HISTOGRAM: 'histogram',

  /**
   * BOXPLOT - a bin based BoxPlot 
   */
  BOXPLOT: 'boxplot',

  /**
   * VIOLINPLOT - a bin based ViolinPlot
   */
  VIOLINPLOT: 'violinplot',

  /**
   *  CONTROL - no offscreen chart
   */
  CONTROL: 'control',
};

/**
 *  Offscreen displays the affscreen data provided for a given side. 
 *  
 *  side - the side to be displayed 'left' | 'right'
 */
export default function Offscreen({ data, side, type, dimensions, domain, maxBinSize, n }) {
  /**
   * chart will hold all possible chart closures based on a specified type.
   * 
   * Usage: chart[ChartType.DOTPLOT40] will render a dotplot with 40 points per dot.
   *        this allows for ease of use to integrate with the type prop. 
   * 
   * chart[type] will return the desired type of chart.
   */
  const Chart = {
    [ChartType.DOTPLOT40]: DotPlot().pointsPerDot(40),
    [ChartType.DOTPLOT100]: DotPlot().pointsPerDot(100),
    [ChartType.DOTPLOT_N]: DotPlot().pointsPerDot(n),
    [ChartType.DOTPLOT]: DotPlot().pointsPerDot(100),
    [ChartType.HISTOGRAM]: Histogram(),
    [ChartType.BOXPLOT]: BoxPlot(),
    [ChartType.VIOLINPLOT]: ViolinPlot(),
    [ChartType.CONTROL]: Control(),
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
    if (!data || !type) {
      return
    }
      
    Chart[type]
      .data(data)
      .side(side)
      .dimensions(dimensions)
      .domain(domain)
      .maxBinSize(maxBinSize)

    if (type === ChartType.DOTPLOT_N) {
      Chart[type].pointsPerDot(n)
    }

    d3.select(chartRef.current).call(Chart[type])
  }, [data, type, n])


  return (
    <div className={"offscreen" + ` ${side}`}>
      <svg ref={chartRef} width={dimensions.width} height={dimensions.height} />
    </div>
  )
}
