import * as d3 from 'd3'

export default function DotPlot() {
  let data,
      bin = d3.bin(),
      dimensions,
      side,
      pointsPerDot = 40,
      dotsPerBin = 5,
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
          .attr('class', 'dotplot ' + side),
        (update) => update.call(update => {
          update.selectAll("*").remove()
          update.attr('class', 'dotplot ' + side)
        }),
        (exit) => exit.remove()
      )
    
    const axis = side == 'left' ? d3.axisRight() : d3.axisLeft()
    axis.scale(yScale)
    

    const axis_g = svg.selectAll('.axis')
      .data([null])
      .join('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${side == 'right' ? 25 : width - 25}, 0)`);

    
    axis_g.call(axis)
    const bins = bin(data)


    const dotBins = svg.selectAll('.dotBin')
      .data(bins)
      .join('g')
      .attr('class', 'dotBin')
      
      
      const DOT_R = 5,
            DOT_D = 2 * DOT_R,
            DOT_SEP_X = DOT_D + 3;

      dotBins.each((datum, i, bins) => {
        const BIN_HEIGHT = (yScale(datum.x0) - yScale(datum.x1));

        /**
         * DOT_SEP represents the space between the center of two dots. This is determined by the height of the bin.
         * More specifically: the height of the bin - 2 * dot_r (to create padding so that all dots are within their constraints).
         * We then divide this by for
         */
        const DOT_SEP_Y = (BIN_HEIGHT - (2 * DOT_D)) / dotsPerBin;
    
        const moveDots = (dots) => {
          dots
          .attr('cy', (_,i) => {
            return yScale(datum.x1) + ((i % dotsPerBin) * DOT_SEP_Y) + 2 * DOT_D
        })
        .attr('cx', (_, i) => {
          if(side == 'right') {
            return (Math.floor(i / dotsPerBin) * DOT_SEP_X) + 35 
          } else {
            return (width - 35 - Math.floor(i / dotsPerBin) * DOT_SEP_X)
          }
        })
      }
    
      d3.select(bins.at(i))
      .selectAll('.dot')
      .data(Array(Math.ceil(datum.length / pointsPerDot)))
      .join(
        enter => enter.append('circle')
          .attr('class', 'dot')
          .attr('r', 5)
          .attr('fill', 'skyblue')
          .attr('stroke', 'black')
          .call(moveDots)
        ,
        update => update.call(update => {
          update
          .call(moveDots)
        }),
        exit => exit.remove()
      )
    })
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
  my.pointsPerDot = function(_) {
    return arguments.length ? (pointsPerDot = _, my) : pointsPerDot
  }
  my.y = function(_) {
    return arguments.length ? (y = _, my) : y
  }
  return my
}
