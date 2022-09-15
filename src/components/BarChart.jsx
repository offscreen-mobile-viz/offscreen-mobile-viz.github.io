import * as d3 from 'd3'

import { useEffect, useRef } from "react"
import BarWithContext from "../charts/BarWithContext"

export default function BarChart({ data, id, accessor, dispatch }) {
    const barchart = BarWithContext()
    const barchartRef = useRef(null)

    /**
     * When data changes, we update the chart properties and re-render
     */
    useEffect(() => {
        if (!data)
            return
        
        // update chart's properties
        barchart
            .data(data.map((d, i) => {
                return {
                    x: id(d),
                    y: accessor(d),
                    // we give unique ids for simple removal and inserstion
                    id: i
                }
            }))
            .dispatch(dispatch)

        // render the chart
        d3.select(barchartRef.current).call(barchart)
    }, [data])

    return (
        <div className='chart'>
            <svg ref={barchartRef} width='100%' height='100%' style={{ display: 'block' }}></svg>
        </div>
    )
}
