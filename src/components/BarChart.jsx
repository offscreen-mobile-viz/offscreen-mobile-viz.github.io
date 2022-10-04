import * as d3 from 'd3'

import { useEffect, useRef } from "react"
import BarWithContext from "../charts/BarWithContext"

export default function BarChart({ data, dispatch, y }) {
    const barchart = BarWithContext()
    const barchartRef = useRef(null)

    /**
     * When data changes, we update the chart properties and re-render
     */
    useEffect(() => {
        if (!data || !y)
            return
        
        // update chart's properties
        barchart
            .data(data)
            .dispatch(dispatch)
            .y(y)

        // render the chart
        d3.select(barchartRef.current).call(barchart)
    }, [data, y])

    return (
        <div className='chart'>
            <svg ref={barchartRef} width='100%' height='100%' style={{ display: 'block' }}></svg>
        </div>
    )
}
