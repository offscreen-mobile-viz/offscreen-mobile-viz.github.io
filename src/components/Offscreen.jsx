import { useState, useEffect } from "react"
import DotPlot from '../charts/DotPlot'
/**
 *  Offscreen displays the affscreen data provided for a given side. 
 *  
 *  side - the side to be displayed 'left' | 'right'
 */
export default function Offscreen({ data, side, id }) {
  const chart = DotPlot()
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
    if (!data)
      return

    // TODO - update re-binning logic based on offscreen context strategy
    console.log(chart.dots())
  }, [data])


  return (
    <div className={"offscreen" + ` ${side}`}>
      <svg/>
    </div>
  )
}
