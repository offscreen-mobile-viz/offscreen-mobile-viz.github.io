import * as d3 from 'd3'
import useSvg from './useSvg'
import useScale from './useScale'

export default function ViolinPlot() {
  let data,
      dimensions,
      side,
      domain, 
      maxBinSize

  const my = (selection) => {

    const { width, height } = dimensions

    // using abstracted getSvg to maintain idempotency
    const svg = useSvg(selection, 'violinplot', side)
    const yScale = useScale(svg, domain, height, width, side)

    const xScale = d3.scaleLinear()
    // the largest violin plot should be 1/2 the width of the chart
    .domain([0, maxBinSize])
    .range([0, width - 15])

    const line = d3.area()
    .curve(d3.curveBasis)
    .y(d => yScale(d.x0))
    .x0(d => xScale(d.length))
    .x1(d => -xScale(d.length))
  
    /**
     * Calculates a violin for the provided group. Constructs a line generator 
     * based on given bin using d3.bin.
     * 
     * @param {selection} g the group to create a violin plot for
     */
    const drawViolin = violin => {
      violin.datum(d => { 
        return d3.bin()
        .thresholds(10)
        .value(d => d.y)
        .domain([d.x0, d.x1])(d)
      })
      .attr('d', line)
    }
    
    const violins = svg.selectAll('violin')
    .data(data.filter(d => d.length > 0))
    .join(
      enter => {
        enter.append('path')
        .attr('class', 'violin')
        .attr('transform', `translate(${width / 2}, 0)`)
        .attr('fill', 'skyblue')
        .attr('stroke', 'black')
        .call(drawViolin)
      },
      update => update.call(update => {
        update
        .call(drawViolin)
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
