import * as d3 from 'd3'
import { useRef, useEffect } from "react"

export default function BarChart({ data, accessor }) {

    const svgRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current)

        const dimensions = {
            width: window.screen.width,
            height: window.screen.height
        }

        svg.attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)

        const bars_g = svg.selectAll('.bars_g')
            .data([null])
            .join('g')
            .attr('class','bars_g')
            .attr('transform', 'translate(50, 50)')

        const chart_dims = {
            width: dimensions.width - 100,
            height: dimensions.height - 50
        }

        const x = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, chart_dims.width])

        const y = d3.scaleLinear()
        .domain(d3.extent(data, accessor))
        .range([0, chart_dims.height])

        bars_g.selectAll('rect')
            .data(data.map(accessor))
            .join(
                (enter) => enter
                    .append('rect')
                    .attr('width', chart_dims.width / data.length)
                    .attr('height', d => y(d))
                    .attr('x',(_,i) => x(i))
                    .attr('y', d => chart_dims.height - y(d))
                    .attr('stroke-width', 3)
                    .attr('stroke', 'black')
                    .attr('fill', 'steelblue'),

                (update) => update.call(update =>
                    update    
                ),
                (remove) => remove.exit()
            )

    }, [data])
    

    return (
        <svg ref={svgRef} style={{display: 'block'}} className='chart'></svg>
    )
}
