import * as d3 from 'd3'
import getSvg from './getSvg'
import { mapBinWithStats } from './BoxPlot'

export default function ViolinPlot() {
  let data,
      bin = d3.bin(),
      dimensions,
      side,
      showOutliers = true,
      y

  const my = (selection) => {

    const { width, height } = dimensions

    const yScale = d3.scaleLinear()
      .domain(y.domain)
      .range(y.range)

    // using abstracted getSvg to maintain idempotency
    const svg = getSvg(selection, 'violin', side)
    
    const yAxis = side == 'left' ? d3.axisRight() : d3.axisLeft()
    yAxis.scale(yScale)

    const y_axis_g = svg.selectAll('.yAxis')
      .data([null])
      .join('g')
      .attr('class', 'yAxis')
      .attr('transform', `translate(${side == 'right' ? 25 : width - 25}, 0)`);
    
    y_axis_g.call(yAxis)
    const bins = bin(data).map(mapBinWithStats)

    /**
     * Updates the box based on quantile stats passed through data
     * @param {selection} g the group to adjust 
     */
    const updateRect = g => {
      const start = side == 'right' ? 30 : width - 30 - 50
      g.select('rect')
      .each((d, i, nodes) => {
        const [q1, _, q3] = d.quartiles

        d3.select(nodes[i])
        .attr('width', 50)
        .attr('height', yScale(q1) - yScale(q3))
        .attr('x', start)
        .attr('y', yScale(q3))
      })
    }

    /**
     * Updates the median line based on quantile stats passed through data
     * @param {selection} g the group to adjust
     */
    const updateMed = g => {
      const start = side == 'right' ? 30 : width - 30 - 50
      
      g.select('line.med')
      .attr('x1', start)
      .attr('y1', d => yScale(d.quartiles[1]))
      .attr('x2', start + 50)
      .attr('y2', d => yScale(d.quartiles[1]))
    }


    /**
     * Updates the whisker lines based on quantile stats passed through data
     * @param {selection} g the group to adjust 
     */
    const updateWhiskers = g => {
      const mid = side == 'right' ? 30 + 25 : width - 30 - 25
      
      g.select('.whisker.top')
      .attr('x1', mid)
      .attr('y1', d => yScale(d.range[0]))
      .attr('x2', mid)
      .attr('y2', d => yScale(d.quartiles[0]))

      g.select('.whisker.bottom')
      .attr('x1', mid)
      .attr('y1', d => yScale(d.range[1]))
      .attr('x2', mid)
      .attr('y2', d => yScale(d.quartiles[2]))
    }

    /**
     * Updates the outlier dots based on outliers passed through data
     * @param {selection} g the group to adjust 
     */
    const drawOutliers = g => {
      // if we shouldn't display outliers then skip this function
      if(!showOutliers) return
      
      const mid = side == 'right' ? 30 + 25 : width - 30 - 25

      g.each((d, i, gs) => {
        const outliers = d.outliers
        let cg = d3.select(gs[i])

        cg.selectAll('.dot')
        .data(outliers)
        .join('circle')
        .attr('class', 'dot')
        .attr('fill', 'black')
        .attr('opacity', 0.2)
        .attr('cx', _ => mid + (Math.random() * 8) - 4)
        .attr('cy', d => yScale(d.y))
        .attr('r', 3)
      }) 
    }

    /**
     * Updates the title to display a bin's range, quartiles, and outliers.
     * @param {selection} g 
     */
    const updateTitle = g => {
      g.select('title')
      .text(d => `Range: ${d.range}
Quartiles: ${d.quartiles}
Outliers: ${d.outliers.length > 0 ? d.outliers.map(d => d.y) : 'none'}`
      )
    }
    /**
     * each box shall contain 4 elements: a rect (to demonstrate q1 and q3), a horizontal line (to show min), 
     * and two whiskers.
     */
    const boxes = svg.selectAll('.box')
    .data(bins.filter(d => d.length > 0))
    .join(
      enter => {
        const g = enter.append('g')
        .attr('class', 'box')
      
        // add a box for q1-q3
        g.append('rect')
        .attr('fill', 'skyblue')

        // add median line
        g.append('line')
        .attr('class', 'med')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)

        // add whiskers
        g.append('line')
        .attr('class', 'whisker top')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        g.append('line')
        .attr('class', 'whisker bottom')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)

        g.append('title')
        
        g.call(updateRect)
        .call(updateMed)
        .call(updateWhiskers)
        .call(drawOutliers)
        .call(updateTitle)
      
        g.append('title')
        .text(d => d.x)
      },
      update => update.call(update => {
        update.selectAll('g')
        .call(updateRect)
        .call(updateMed)
        .call(updateWhiskers)
        .call(drawOutliers)
        .call(updateTitle)
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
  my.showOutliers = function(_) {
    return arguments.length ? (showOutliers = _, my) : showOutliers
  }
  my.y = function(_) {
    return arguments.length ? (y = _, my) : y
  }
  return my
}