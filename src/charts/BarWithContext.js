import * as d3 from 'd3'

export default function BarWithContext() {
    let data = [],       // arrrives in format { x, y, id }
        dispatch,
        domain,
        dimensions

    const my = (selection) => {
        // data = data.filter((_,i) => i < 1000)
        // we scrape the dimensions from the fullscreen comptuted svg dimensions
        const { width, height } = dimensions
        const margin = { top: 15, right: 7, bottom: 15, left: 7 }

        const x = d3.scaleBand()
        .domain(d3.map(data, d => d.x))
        .range([margin.left, width - margin.right]) // with 15px margin
        
        const yScale = d3.scaleLinear()
        .domain(domain)
        .range([height - 15, 15])
        
        const svg = selection.selectAll('.barsWithContext')
        .data([null])
        .join('g')
        .attr('class', 'barsWithContext')
        
        svg.selectAll('.bar').remove()
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
            .text(d => `Name: ${d.x}\nMPG: ${d.y}`)

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

                let left = 0, right = data.length;
                let foundLeft = false, foundRight = false
                /**
                 * For each bar we update its new x after the zoom.
                 */
                svg.selectAll(".bar")
                    .attr('x', d => {
                        // calculate the new x value
                        const newX = x(d.x)

                        // if this is the first item onscreen
                        if (!foundLeft && newX >= min) {
                            left = d.id
                            foundLeft = true
                        }
                        // offscreen right
                        else if (!foundRight && newX > max) {
                            right = d.id
                            foundRight = true
                        }
                        
                        return newX
                    })
                    .attr('width', x.bandwidth())
                
                dispatch({ left, right })
            }
        }
    }

    my.data = function (_) {
        return arguments.length ? (data = _, my) : data;
    }
    my.dispatch = function (_) {
        return arguments.length ? (dispatch = _, my) : dispatch;
    }
    my.domain = function (_) {
        return arguments.length ? (domain = _, my) : domain;
    }
    my.dimensions = function (_) {
        return arguments.length ? (dimensions = _, my) : dimensions;
    }

    return my;
}
