import * as d3 from 'd3'

export default function DotPlot() {
  let data,
      dots = 25

  const my = (selection) => {

  }

  my.data = function(_) {
    return arguments.length ? (data = _, my) : data
  }
  my.dots = function(_) {
    return arguments.length ? (dots = _, my) : dots
  }
  return my
}
