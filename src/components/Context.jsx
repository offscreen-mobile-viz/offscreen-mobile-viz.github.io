import * as d3 from 'd3'
import { useRef, useEffect, useState } from 'react'

function Context({ dimensions, data, left, right }) {
  const bins = 400;
  const [n, setN] = useState(1)

  const xScale = useRef(d3.scaleLinear())
  const yScale = useRef(d3.scaleLinear())

  const ref = useRef(null)        // svg
  const dots = useRef(null)       // dots group
  const viewfield = useRef(null)  // viewfield group

  // when data changes, redraw dots
  useEffect(() => {
    let n = data.length / bins;
    setN(n);

    // aggregate data
    let arr = [];
    let i = -1;
    while(++i < data.length) {
      const binIndex = Math.floor(i / n);
      if(!arr[binIndex]) arr[binIndex] = {x: binIndex, y: 0};
      arr[binIndex].y += data[i].y / n; 
    }

    // update scales
    xScale.current.domain(d3.extent(arr, d => d.x))
    yScale.current.domain(d3.extent(arr, d => d.y))

    const moveDots = (dots) => {
      dots
        .attr('cx', d => xScale.current(d.x))
        .attr('cy', d => yScale.current(d.y))
    }

    const selection = d3.select(dots.current)

    selection.selectAll('.dot')
      .data(arr)
      .join(
        enter => enter.append('circle')
        .attr('class', 'dot')
        .attr('r', 2)
        .attr('fill', 'steelblue')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5)
        .call(moveDots),
        update => update.call(update =>
          update.call(moveDots)
        ),
        exit => exit.remove()
      )
  }, [data])

  // when dimensions change, update scales
  useEffect(() => {
    // guard for empty dimensions
    if(!dimensions.width || !dimensions.height) return

    xScale.current.range([0, dimensions.width]);
    yScale.current.range([dimensions.height-22, 22]);

    const svg = d3.select(ref.current)

    svg.attr('width', dimensions.width)
    svg.attr('height', dimensions.height)
  }, [dimensions])

  // update ViewField when left or right changes
  useEffect(() => {
    left /= n
    right /= n

    const selection = d3.select(viewfield.current)
    const svg = d3.select(ref.current)

    // draw viewfield
    selection.selectAll('.viewfield')
      .data([null], _ => null)
      .join(
        enter => enter.append('rect')
        .attr('class', 'viewfield')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('width', xScale.current(right) - xScale.current(left))
        .attr('height', svg.attr('height')-10)
        .attr('x', xScale.current(left))
        .attr('y', 5),
        update => update.call(update => 
          update
          .attr('width', xScale.current(right) - xScale.current(left))
          .attr('x', xScale.current(left))
        ),
        exit => exit.remove()
      )
  }, [left, right, n])

  return (
    <svg ref={ref}>
      <g className="dots" ref={dots}/>
      <g className="viewfield" ref={viewfield}/>
    </svg>
  )
}

export default Context
