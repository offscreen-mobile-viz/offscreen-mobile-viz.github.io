import useSvg from './useSvg'
import useScale from './useScale'

export default function Control() {
  let data,
      dimensions,
      side,
      domain, 
      maxBinSize

  const my = (selection) => {
    const { width, height } = dimensions

    // using abstracted getSvg to maintain idempotency
    const svg = useSvg(selection, 'histogram', side)
    const _ = useScale(svg, domain, height, width, side)
  }

  my.data = function(_) {
    return arguments.length ? (data = _, my) : data
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
