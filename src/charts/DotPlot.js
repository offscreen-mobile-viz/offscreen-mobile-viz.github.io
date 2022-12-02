import * as d3 from 'd3'
import useSvg from './useSvg'
import useScale from './useScale'

export default function DotPlot() {
  let data,
      dimensions,
      side,
      pointsPerDot = 40,
      dotsPerBin = 5,
      domain,
      maxBinSize

  const my = (selection) => {

    const { width, height } = dimensions

    // using abstracted getSvg to maintain idempotency
    const svg = useSvg(selection, 'dotplot', side)
    const yScale = useScale(svg, domain, height, width, side)
    
    // TODO add consideration and scaling for max bins
    const dotBins = svg.selectAll('.dotBin')
      .data(data)
      .join('g')
      .attr('class', 'dotBin')
      
      const DOT_R = 5,
            DOT_D = 2 * DOT_R,
            DOT_SEP_X = DOT_D + 3;
      const maxRows = Math.floor(width / DOT_SEP_X) - 2
      dotsPerBin = Math.max(Math.ceil(maxBinSize / pointsPerDot/ maxRows), 5)

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
            return (Math.floor(i / dotsPerBin) * DOT_SEP_X) + 40 
          } else {
            return (width - 40 - Math.floor(i / dotsPerBin) * DOT_SEP_X)
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
  my.side = function(_) {
    return arguments.length ? (side = _, my) : side
  }
  my.dimensions = function(_) {
    return arguments.length ? (dimensions = _, my) : dimensions
  }
  my.pointsPerDot = function(_) {
    return arguments.length ? (pointsPerDot = _, my) : pointsPerDot
  }
  my.domain = function(_) {
    return arguments.length ? (domain = _, my) : domain
  }
  my.maxBinSize = function(_) {
    return arguments.length ? (maxBinSize = _, my) : maxBinSize
  }
  return my
}
