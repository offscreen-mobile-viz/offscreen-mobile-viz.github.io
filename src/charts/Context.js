import * as d3 from 'd3'

export default function Context() {
  let data,
      dimensions,
      bins = 1000,
      n,
      left,
      right

    const my = (selection) => {
      if(!data || !dimensions || !bins) return;

      const { width, height } = dimensions

      const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.x))
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.y))
        .range([height-22, 22]);

      const moveDots = (dots) => {
        dots
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
      }

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

      // draw viewfield
      selection.selectAll('.viewfield')
      .data([null])
      .join(
        enter => enter.append('rect')
        .attr('class', 'viewfield')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('width', xScale(right) - xScale(left))
        .attr('height', height-10)
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

  my.data = function(_) {
    if(arguments.length) {
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
      return my;
    }

    return data
  }
  my.dimensions = function(_) {
    return arguments.length ? (dimensions = _, my) : dimensions
  }
  my.bins = function(_) {
    return arguments.length ? (bins = _, my) : bins
  }
  my.left = function(_) {
    return arguments.length ? (left = _/n, my) : left
  }
  my.right = function(_) {
    return arguments.length ? (right = _/n, my) : right
  }

  return my;
}
