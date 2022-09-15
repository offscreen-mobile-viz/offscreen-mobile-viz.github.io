import * as d3 from 'd3'

export default function BarWithContext() {
    let data,       // arrrives in format { x, y, id }
        dispatch;

    const my = (selection) => {

        data = data.filter((d, i) => i < 1000)

        // we scrape the dimensions from the fullscreen comptuted svg dimensions
        const { width, height } = selection.node().getBoundingClientRect()
        const margin = { top: 7, right: 7, bottom: 7, left: 7 }

        const x = d3.scaleBand()
            .domain(d3.map(data, d => d.x))
            .range([margin.left, width - margin.right]) // with 15px margin

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.y)])
            .range([height - margin.bottom, margin.top]) // with 15px margin

        const svg = selection.selectAll('.barsWithContext')
            .data([null])
            .join('g')
            .attr('class', 'barsWithContext')

        svg.selectAll('.bar')
            .data(data, d => d.id)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.x))
            .attr('y', d => y(d.y))
            .attr('width', x.bandwidth())
            .attr('height', d => height - margin.bottom - y(d.y))
            .attr('fill', 'steelblue')

        svg.call(zoom)

        function zoom(svg) {
            const extent = [[margin.left, margin.top], [width - margin.right, height - margin.bottom]];

            svg.call(d3.zoom()
                .scaleExtent([1, 50])
                .translateExtent(extent)
                .extent(extent)
                .on("zoom", zoomed));

            /**
            * Handles post-zoom necessary side-effects
            */
            function zoomed(event) {
                // update axis
                const [min, max] = [7, width - 7]
                x.range([min, max].map(d => event.transform.applyX(d)));

                // to track the items to insert to offscreen left and right respectively
                let l = {},
                    r = {},
                    lRmv = {},
                    rRmv = {};

                /**
                 * For each bar we update its new x after the zoom.
                 */
                svg.selectAll(".bar")
                    .attr('x', d => {
                        // calculate the new x value
                        const newX = x(d.x)

                        // here we instantiate dispatch action objects for more concise code below
                        const rmvLeft = { id: 'left', type: 'remove', payload: { [d.id]: d } }
                        const rmvRight = { id: 'right', type: 'remove', payload: { [d.id]: d } }

                        // offscreen left
                        if (newX < min) {
                            // append this element to the left object
                            l[d.id] = d
                            // remove it from the right
                            rRmv[d.id] = d
                        }
                        // offscreen right
                        else if (newX > max) {
                            // append this element to the right object
                            r[d.id] = d
                            // remove it from the left
                            lRmv[d.id] = d
                        }
                        // on screen
                        else {
                            // therefore we must delete this item from the left and right offscreen objects (if it exists)
                            lRmv[d.id] = d
                            rRmv[d.id] = d
                        }
                        return newX
                    })
                    .attr('width', x.bandwidth())

                dispatch({ id: 'left', type: 'add', payload: l })
                dispatch({ id: 'right', type: 'add', payload: r })
                dispatch({ id: 'left', type: 'remove', payload: lRmv })
                dispatch({ id: 'right', type: 'remove', payload: rRmv })
            }


        }
    }

    my.data = function (_) {
        return arguments.length ? (data = _, my) : data;
    }
    my.dispatch = function (_) {
        return arguments.length ? (dispatch = _, my) : dispatch;
    }

    return my;
}
