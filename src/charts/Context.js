import * as d3 from 'd3'

export default function Context() {
  let drawDots = ()=>{},
      drawViewField = ()=>{},
      data = [],
      xScale = d3.scaleLinear(),
      yScale = d3.scaleLinear(),
      dimensions = {width: 0, height: 0},
      n = 1,
      bins;

  const my = (selection) => {
  };

  my.drawDots = () => {
    const moveDots = (dots) => {
      dots
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
    }

    return (selection) => {
      selection.selectAll('.dot')
        .data(data)
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
    }
  }

  my.drawViewField = (left, right) => {
    left /= n;
    right /= n;
    return (selection) => {
      // draw viewfield
      selection.selectAll('.viewfield')
        .data([null])
        .join(
          enter => enter.append('rect')
            .attr('class', 'viewfield')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('width', xScale(right) - xScale(left))
            .attr('height', dimensions.height-10)
            .attr('x', xScale(left))
            .attr('y', 5),
          update => update.call(update =>
            update
              .attr('width', xScale(right) - xScale(left))
              .attr('x', xScale(left))
          ),
          exit => exit.remove()
        )
    }
  }

  // getter/setters
  my.data = function(_) {
    if(!arguments.length) return data;

    // update data
    data = _;
    n = data.length / bins;

    let arr = [];
    let i = -1;
    while(++i < data.length) {
      const binIndex = Math.floor(i / n);
      if(!arr[binIndex]) arr[binIndex] = {x: binIndex, y: 0};
      arr[binIndex].y += data[i].y / n; 
    }
    data = arr;

    // update scales
    xScale.domain(d3.extent(data, d => d.x))
    yScale.domain(d3.extent(data, d => d.y))

    return my;
  }
  my.dimensions = function(_) {
    if(!arguments.length) return dimensions;

    // update dimensions
    dimensions = _;
    // update scales
    dimensions.width && xScale.range([0, dimensions.width]);
    dimensions.height && yScale.range([dimensions.height-22, 22]);

    return my;
  }
  my.bins = function(_) {
    return arguments.length ? (bins = _, my) : bins;
  }

  return my;
}
