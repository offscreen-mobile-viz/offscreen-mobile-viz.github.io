import * as d3 from 'd3'

export default function useScale(svg, domain, height, width, side) {
    const yScale = d3.scaleLinear()
    .domain(domain)
    .range([height - 15, 15])

    const yAxis = side == 'left' ? d3.axisRight() : d3.axisLeft()
    yAxis.scale(yScale)
    .tickFormat(d3.format('.2s'))
    .ticks(8)

    const y_axis_g = svg.selectAll('.yAxis')
      .data([null])
      .join('g')
      .attr('class', 'yAxis')
      .attr('transform', `translate(${side == 'right' ? 30 : width - 30}, 0)`);
    
      y_axis_g.call(yAxis)
    
    return yScale
}