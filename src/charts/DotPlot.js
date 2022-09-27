import * as d3 from 'd3'

export default function DotPlot() {
  let data,
      side,
      dots = 25,
      y

  const my = (selection) => {

    console.log(side + '\t' + data.map(d => d.id))

    const svg = selection.selectAll('.dotPlot')
      .data([null])
      .join('g')
      .attr('class', 'dotPlot ' + side)

    const dots = svg.selectAll('.dot')
      .data(data, d => d.id)
      .join(
        (enter) => enter.append('circle')
          .attr('class', 'dot')
          .attr('cx', 20)
          .attr('cy', d => 10 + d.y)
          .attr('r', 10)
          .attr('fill', 'steelblue'),
        (update) => update.call(update => {
          update.attr('fill', 'green')
        }),
        (exit) => exit.remove()
      )
  }

  my.data = function(_) {
    return arguments.length ? (data = _, my) : data
  }
  my.side = function(_) {
    return arguments.length ? (side = _, my) : side
  }
  my.dots = function(_) {
    return arguments.length ? (dots = _, my) : dots
  }
  my.y = function(_) {
    return arguments.length ? (y = _, my) : y
  }
  return my
}
