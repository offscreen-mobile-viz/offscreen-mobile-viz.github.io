import * as d3 from 'd3'

export default function Context() {
  let dimensions = {width: 0, height: 0},
      bins,
      n,
      xScale = d3.scaleLinear(),
      yScale = d3.scaleLinear();

  const my = (selection) => {
  };

  my.drawDots = (selection, data) => {
    xScale.domain([0, bins]);
    yScale.domain(d3.extent(data, d => d.y));
    n = data.length/bins;

    drawDotsOnSelection(selection, data, n, dimensions, xScale, yScale);
  }

  my.drawViewField = (selection, left, right) => {
    drawViewFieldOnSelection(selection, left, right, n, xScale, yScale, dimensions.height);
  }

  // getter/setters
  my.dimensions = function(_) {
    if(!arguments.length) return dimensions;

    if(dimensions.width > 0 || dimensions.height > 0) return my;

    dimensions = _;

    console.log('setting dimensions');
    xScale.range([0, dimensions.width])
    yScale.range([dimensions.height-22, 22])

    return my;
  }
  my.bins = function(_) {
    return arguments.length ? (bins = _, my) : bins;
  }

  return my;
}

function drawDotsOnSelection(selection, data, n, dimensions, xScale, yScale) {
    let arr = [];
    let i = -1;
    while(++i < data.length) {
      const binIndex = Math.floor(i / n);
      if(!arr[binIndex]) arr[binIndex] = {x: binIndex, y: 0};
      arr[binIndex].y += data[i].y / n; 
    }

    // update scales
    selection.selectAll('.dot')
      .data(arr, d => d.x)
      .join(
        enter => enter.append('circle')
        .attr('class', 'dot') .attr('r', 2)
        .attr('fill', 'steelblue')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5)
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y)),
        update => update,
        exit => exit.remove()
      )
}

function drawViewFieldOnSelection(selection, left, right, n, xScale, yScale, height) {
    left /= n;
    right /= n;

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
