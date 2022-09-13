import * as d3 from 'd3'

import { useEffect, useRef } from "react"
import BarWithContext from "../charts/BarWithContext"

export default function BarChart({ data, accessor, setLeft, setRight }) {
    const barchart = BarWithContext()
    const barchartRef = useRef(null)

    useEffect(() => {
        if (!data)
            return

        // update chart's properties
        barchart
            .data(data)
            .accessor(accessor)
            .setLeft(setLeft)
            .setRight(setRight)

        // render the chart
        d3.select(barchartRef.current).call(barchart)
    }, [data])

    return (
        <div className='chart'>
            <svg ref={barchartRef} width='100%' height='100%' style={{ display: 'block' }}></svg>
        </div>
    )
}
