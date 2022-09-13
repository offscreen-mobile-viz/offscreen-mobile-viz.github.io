import * as d3 from 'd3'

export default function BarWithContext() {
    let data,
        accessor,   // the accessor function to get desired measure (eg. d => d.getThisAttribite)
        setLeft,
        setRight;

    const my = (selection) => {

        // we scrape the dimensions from the fullscreen comptuted svg dimensions
        const { width, height } = selection.node().getBoundingClientRect()

        const bins = d3.bin()(data.map(accessor))

        const x = d3.scaleLinear()
        .domain([d3.min(bins, d => d.x0), d3.max(bins, d => d.x1)])
        .range([30, width - 15]) // with 15px margin
        
        const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height - 15, 30]) // with 15px margin

        const svg = selection.selectAll('.barsWithContext')
            .data([null])
            .join('g')
            .attr('class', 'barsWithContext')

        svg.selectAll('.bar')
        .data(bins)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.x0))
        .attr('y', d => y(d.length))
        .attr('width', d => x(d.x1) - x(d.x0) - 2)
        .attr('height', d => height - 15 - y(d.length))
        .attr('fill', 'steelblue')

        /**
         * Handles post-zoom necessary side-effects
         */
        const zoomed = () => {
            // update axis
            // update left and right
            // setLeft(newLeft)
            // setRight(newRight)
        }
    }

    my.data = function (_) {
        return arguments.length ? (data = _, my) : data;
    }
    my.accessor = function (_) {
        return arguments.length ? (accessor = _, my) : accessor;
    }
    my.setLeft = function (_) {
        return arguments.length ? (setLeft = _, my) : setLeft;
    }
    my.setRight = function (_) {
        return arguments.length ? (setRight = _, my) : setRight;
    }

    return my;
}
