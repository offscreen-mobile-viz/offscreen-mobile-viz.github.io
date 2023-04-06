import * as d3 from 'd3'
import useSvg from './useSvg'
import useScale from './useScale'

export default function BoxPlot() {
  let data,
      bin = d3.bin(),
      dimensions,
      side,
      showOutliers = true,
      domain,
      maxBinSize

  const my = (selection) => {

    const { width, height } = dimensions

    // using abstracted getSvg to maintain idempotency
    const svg = useSvg(selection, 'boxplot', side)
    const yScale = useScale(svg, domain, height, width, side)
    
    const bins = data.map(mapBinWithStats)

    /**
     * Updates the box based on quantile stats passed through data
     * @param {selection} g the group to adjust 
     */
    const updateRect = g => {
      const start = side == 'right' ? 35 : width - 35 - 50
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
      const start = side == 'right' ? 35 : width - 35 - 50
      
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
      const mid = side == 'right' ? 35 + 25 : width - 35 - 25
      
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
      
      const mid = side == 'right' ? 35 + 25 : width - 35 - 25

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

    const lines = svg.selectAll('.line')
    .data(bins)
    .join('line')
    .attr('class', 'line')
    .attr('stroke', 'grey')
    .attr('stroke-width', 1)
    .attr('x1', 0)
    .attr('x2', width-30)
    .attr('y1', d => yScale(d.x0))
    .attr('y2', d => yScale(d.x0))
    .attr('transform', `translate(${side == 'right' ? 30 : 0}, 0)`)

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
  my.domain = function(_) {
    return arguments.length ? (domain = _, my) : domain
  }
  my.maxBinSize = function(_) {
    return arguments.length ? (maxBinSize = _, my) : maxBinSize
  }
  return my
}

/**
 * Adapted from Mike Bostock's https://observablehq.com/@d3/box-plot
 * Mutates the provided bin to append fields for statistical values such as quartiles, range, and a set of outliers.
 * 
 * @param bin the bin to compute statistical values for
 * @returns {object} an object with fields *quartiles*, *range*, and *outliers*. Where
 * *quartiles* is an array of [*q1*, *q2*, *q3*], *range* is a tuple of [*min*, *max*],
 * and *outliers* is an array of individuals that qualify as outliers.
 */
export const mapBinWithStats = bin => {
  const min = d3.min(bin, d => d.y);
  const max = d3.max(bin, d => d.y);
  const q1 = d3.quantile(bin, 0.25, d => d.y);
  const q2 = d3.quantile(bin, 0.50, d => d.y);
  const q3 = d3.quantile(bin, 0.75, d => d.y);
  const iqr = q3 - q1; // interquartile range
  const r0 = Math.max(min, q1 - iqr * 1.5);
  const r1 = Math.min(max, q3 + iqr * 1.5);
  bin.quartiles = [q1, q2, q3];
  bin.range = [r0, r1];
  bin.outliers = bin.filter(d => d.y < r0 || d.y > r1);
  return bin;
}
