import * as d3 from 'd3'
import useSvg from './useSvg'
import useScale from './useScale'

export default function Histogram() {
  let data,
      dimensions,
      side,
      domain, 
      maxBinSize

  const my = (selection) => {
    const { width, height } = dimensions

    // using abstracted getSvg to maintain idempotency
    const svg = useSvg(selection, 'histogram', side)
      .style('position', 'relative')
    const yScale = useScale(svg, domain, height, width, side)
    
    const xScale = d3.scaleLinear()
      .domain([0, maxBinSize]) // max is data.length / 2
      .range([0, width - 50])

    const click = (_, d) => {
      d3.selectAll('.tip')
      .attr('visibility', 'hidden')

      svg.select(`#tip-${d.id}`)
      .attr('visibility', 'visible')
    }

    const updateBars = bars => {
      bars
        .attr('height', d => yScale(d.x0) - yScale(d.x1))
        .attr('width', d => xScale(d.length))
        .attr('x',d => side == 'right' ? 30 : width - 30 - xScale(d.length))
        .attr('y', d => yScale(d.x1))
    }

    const updateTips = bars => {
      bars.each((d, i, _) => {
        const barWidth = xScale(d.length);
        const textWidth = Math.ceil(Math.log10(d.length)) * 16 + 20 // for 10px padding
        const tooShort = barWidth <= textWidth
        let textAnchor = side === 'left' ? 'start' : 'end';

        const y = yScale(d.x1) + 10
        let x;

        if(side === "left") {
          x = tooShort ? (width - barWidth - 30) / 2 : width - barWidth - 20;
        } else {
          x = tooShort ? barWidth + 30 + (width - barWidth - 30) / 2 : barWidth + 20;
        }

        svg.selectAll(`#tip-${d.id}`)
          .data([d])
          .join('text')
          .attr('class', 'tip')
          .attr('id', `tip-${d.id}`)
          .attr('text-anchor', tooShort ? 'middle' : textAnchor)
          .attr('x', x)
          .attr('y', y)
          .attr('dominant-baseline', 'hanging')
          .attr('visibility', 'hidden')
          .text(d.length)
      })
    }

    let i = -1
    svg.selectAll('.bar')
      .data(data, d => d.id || (d.id = ++i))
      .join(
        enter => {
          enter
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', 'skyblue')
            .attr('stroke', 'black')
            .call(updateBars)
            .call(updateTips)
            .on('click', click)
        },
        update => update.call(update => {
          update
            .call(updateBars)
            .call(updateTips)
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

  return my;
}
