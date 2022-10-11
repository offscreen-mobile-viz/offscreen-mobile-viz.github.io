import * as d3 from 'd3'

export default function BarWithContext() {
    let data,       // arrrives in format { x, y, id }
        dispatch,
        y

    const my = (selection) => {
        data = data.filter((_,i) => i < 5000)
        // we scrape the dimensions from the fullscreen comptuted svg dimensions
        const { width, height } = selection.node().getBoundingClientRect()
        const margin = { top: 7, right: 7, bottom: 7, left: 7 }

        const yScale = d3.scaleLinear()
        .domain(y.domain)
        .range(y.range)

        const x = d3.scaleBand()
        .domain(d3.map(data, d => d.x))
        .range([margin.left, width - margin.right]) // with 15px margin
        
        
        const svg = selection.selectAll('.barsWithContext')
        .data([null])
        .join('g')
        .attr('class', 'barsWithContext')
        
        svg.selectAll('.bar')
            .data(data, d => d.id)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.x))
            .attr('y', d => yScale(d.y))
            .attr('width', x.bandwidth())
            .attr('height', d => height - margin.bottom - yScale(d.y))
            .attr('stroke', 'midnightblue')
            .attr('fill', 'steelblue')
            .append('title')
            .text(d => {
                return `Name: ${d.x}\nMPG: ${d.y}`
            })

        // TODO ask about labeling x-axis
        
        const minWidth = 3, maxWidth = 75
        let z = d3.zoom()
            // we want the minumum zoom extent to be a factor such that all bars are at least the minWidht
            .scaleExtent([minWidth / x.bandwidth(), maxWidth / x.bandwidth()])
            
        svg.call(zoom)

        function zoom(svg) {
            const extent = [[margin.left, margin.top], [width - margin.right, height - margin.bottom]];

            z.translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed)

            svg.call(z);

            /**
            * Handles post-zoom necessary side-effects
            */
            function zoomed(event) {
                // update axis
                const [min, max] = [margin.left, width - margin.right]
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
    my.y = function (_) {
        return arguments.length ? (y = _, my) : y;
    }

    return my;
}
