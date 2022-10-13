import * as d3 from 'd3'

export default function Histogram() {
  let data,
      bin = d3.bin(),
      dimensions,
      side,
      y

  const my = (selection) => {

    const { width, height } = dimensions

    const yScale = d3.scaleLinear()
      .domain(y.domain)
      .range(y.range)

    
    const svg = selection.selectAll('g')
      .data([null])
      .join(
        (enter) => enter.append('g')
          .attr('class', 'histogram ' + side),
        (update) => update.call(update => {
          update.selectAll("*").remove()
          update.attr('class', 'histogram ' + side)
        }),
        (exit) => exit.remove()
      )
      .attr('transform', 'translate(' + 0 + ',' + -10 + ')')
    
    const yAxis = side == 'left' ? d3.axisRight() : d3.axisLeft()
    yAxis.scale(yScale)

    const y_axis_g = svg.selectAll('.yAxis')
      .data([null])
      .join('g')
      .attr('class', 'yAxis')
      .attr('transform', `translate(${side == 'right' ? 25 : width - 25}, 0)`);
    
    y_axis_g.call(yAxis)
    const bins = bin(data)

    const xScale = d3.scaleLinear()
      .domain([0, 5000 / 2]) // max is data.length / 2
      .range([0, width - 25])

    // TODO x axis

    const updateBars = bars => {
      bars
        .attr('height', d => yScale(d.x0) - yScale(d.x1))
        .attr('width', d => xScale(d.length))
        .attr('x',d => side == 'right' ? 25 : width - 25 - xScale(d.length))
        .attr('y', d => yScale(d.x1))
    }

    const bars = svg.selectAll('.bar')
      .data(bins)
      .join(
        enter => {
          enter
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', 'skyblue')
            .attr('stroke', 'black')
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
  my.y = function(_) {
    return arguments.length ? (y = _, my) : y
  }
  return my
}
