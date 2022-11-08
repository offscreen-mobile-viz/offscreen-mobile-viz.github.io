import * as d3 from 'd3'
import getSvg from './getSvg'

export default function Histogram() {
  let data,
      dimensions,
      side,
      domain,
      maxBinSize

  const my = (selection) => {

    const { width, height } = dimensions

    const yScale = d3.scaleLinear()
      .domain(domain)
      .range([height - 15, 15])

    // using abstracted getSvg to maintain idempotency
    const svg = getSvg(selection, 'histogram', side)
      .style('position', 'relative')
    
    const yAxis = side == 'left' ? d3.axisRight() : d3.axisLeft()
    yAxis.scale(yScale)

    const y_axis_g = svg.selectAll('.yAxis')
      .data([null])
      .join('g')
      .attr('class', 'yAxis')
      .attr('transform', `translate(${side == 'right' ? 25 : width - 25}, 0)`);
    
    y_axis_g.call(yAxis)

    const xScale = d3.scaleLinear()
      .domain([0, maxBinSize]) // max is data.length / 2
      .range([0, width - 50])

    // TODO x axis
    
    const click = e => {
      const bar = d3.select(e.target)

    }

    const updateBars = bars => {
      bars
        .attr('height', d => yScale(d.x0) - yScale(d.x1))
        .attr('width', d => xScale(d.length))
        .attr('x',d => side == 'right' ? 25 : width - 25 - xScale(d.length))
        .attr('y', d => yScale(d.x1))
    }

    const bars = svg.selectAll('.bar')
      .data(data)
      .join(
        enter => {
          enter
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', 'skyblue')
            .attr('stroke', 'black')
            .on('click', click)
            .call(updateBars)
        },
        update => update.call(update => {
          update
            .call(updateBars)
        }),
        exit => exit.remove()
      )
  }

  my.data = function(_) {
    return arguments.length ? (data = _, my) : data
  }
  my.bin = function(_) {
    return arguments.length ? (bin = _, my) : bin
  }
  my.dimensions = function(_) {
    return arguments.length ? (dimensions = _, my) : dimensions
  }
  my.side = function(_) {
    return arguments.length ? (side = _, my) : side
  }
  my.domain = function(_) {
    return arguments.length ? (domain = _, my) : domain
  }
  my.maxBinSize = function(_) {
    return arguments.length ? (maxBinSize = _, my) : maxBinSize
  }
  return my
}
