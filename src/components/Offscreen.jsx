import { useState, useEffect } from "react"
/**
 *  Offscreen displays the affscreen data provided for a given side. 
 *  
 *  side - the side to be displayed 'left' | 'right'
 */
export default function Offscreen({ data, side }) {
  const [count, setCount] = useState(0)

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
    // for now
    if (data)
      setCount(data.length)

    // TODO - update re-binning logic based on offscreen context strategy
  }, [data])


  return (
    <div className={"offscreen" + ` ${side}`}>
      {`there are ${count} things offscreen on the ${side}`}
    </div>
  )
}
