import * as d3 from 'd3'
import useSvg from './useSvg'
import useScale from './useScale'

export default function DotPlot() {
  let data,
    dimensions,
    side,
    pointsPerDot,
    dotsPerBin = 5,
    domain,
    maxBinSize

  const my = (selection) => {

    const { width, height } = dimensions

    // using abstracted getSvg to maintain idempotency
    const svg = useSvg(selection, 'dotplot', side)
    const yScale = useScale(svg, domain, height, width, side)

    // get the min and max of the data
    const [min, max] = getMinMax(data)
    const maxDistance = Math.abs(max - min)
    // opacity scale is a linear scale that maps the distance of a dot from the edge of the screen to an opacity value
    const opacityScale = d3.scaleLinear()
      .domain([0, maxDistance])
      .range([0, 1])

    const dotBins = svg.selectAll('.dotBin')
      .data(data)
      .join('g')
      .attr('class', 'dotBin')

    const DOT_R = 5,
      DOT_D = 2 * DOT_R,
      DOT_SEP_X = DOT_D + 3;
    const maxRows = Math.floor(width / DOT_SEP_X) - 2

    dotsPerBin = Math.max(Math.ceil(maxBinSize / pointsPerDot / maxRows), 5)

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

      // get the opacities for the dots
      let opacities = getOpacityDots(datum, side, pointsPerDot, opacityScale, min, max)

      d3.select(bins.at(i))
        .selectAll('.dot')
        .data(opacities)
        .join(
          enter => enter.append('circle')
          .attr('class', 'dot')
          .attr('r', 5)
          .attr('fill', 'skyblue')
          .attr('fill-opacity', d => d)
          .attr('stroke', 'black')
          .call(moveDots)
          ,
          update => update.call(update => {
            update
              .call(moveDots)
              .attr('fill-opacity', d => d)
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

/**
  * This function takes in a datum and returns an array of objects that represent the opacity of each dot in the bin.
  * The opacity of each dot is determined by the average distance of the dots in the bin offscreen.
  */
function getOpacityDots(data, side, pointsPerDot, opacityScale, min, max) {
  if(data.length == 0) return []
  
  const opacities = []
  opacities.x0 = data.x0
  opacities.x1 = data.x1

  let i = -1,
      bin = 0,
      sum = 0, count = 0,
      n, avg;

  while(++i < data.length) {
    // if this point marks the end of a bin, then we can add the average distance of the dots in the bin to the opacities array
    if(i % pointsPerDot == 0 && i != 0) {
      // get the average distance of the dots in the bins
      avg = sum / count

      // add the average distance to the opacities array (to the end if we are on the right side, to the beginning if we are on the left side)
      if(side == 'right') {
        opacities.push(opacityScale(avg))
      } else {
        opacities.unshift(opacityScale(avg))
      }

      sum = 0
      count = 0
    }
    let dist = Math.abs(data[i].x - (side == 'right' ? min : max))
    sum += dist
    ++count
  }

  // add the last bin
  avg = sum / count
  if(side == 'right') {
    opacities.push(opacityScale(avg))
  } else {
    opacities.unshift(opacityScale(avg))
  }

  return opacities
}

/**
  * gets the min and max of the data.
  * Because the data comes in as bins in which each bin is in ascending order, we can just get the first and last elements of each bin.
  * This is much faster than sorting the data and then getting the min and max.
  */
function getMinMax(data) {
  const mins = data.map(d => d[0])
  .filter(d => d != undefined)
  .map(d => d.x)
  const maxs = data.map(d => d[d.length - 1])
  .filter(d => d != undefined)
  .map(d => d.x)

  return [d3.min(mins), d3.max(maxs)]
}
