import * as d3 from 'd3'

export default function BarWithContext() {
    let data = [],       // arrrives in format { x, y }
        dispatch,
        domain,
        dimensions

    const my = (selection) => {
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
        
        const drawBars = data => {
            svg.selectAll('.bar')
                .data(data, d => d.x)
                .join('rect')
                .attr('class', 'bar')
                .attr('stroke', 'midnightblue')
                .attr('fill', 'steelblue')
                .attr('x', d => x(d.x))
                .attr('y', d => yScale(d.y))
                .attr('width', x.bandwidth())
                .attr('height', d => height - margin.bottom - yScale(d.y))
                .append('title')
                .text(d => d.y)
        }

        const minWidth = 3, maxWidth = 75
        const scaleExtent = [minWidth / x.bandwidth(), maxWidth / x.bandwidth()] 
        const transform = d3.zoomIdentity.translate((-margin.left) * scaleExtent[0] + 7, 0).scale(scaleExtent[0])
        let z = d3.zoom()
            // we want the minumum zoom extent to be a factor such that all bars are at least the minWidht
            .scaleExtent(scaleExtent)
        
        drawBars(data)
        svg.call(zoom)
        
        function zoom(svg) {
            const extent = [[margin.left, margin.top], [width - margin.right, height - margin.bottom]];

            z.translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed)
            
            svg.call(z)
            svg.call(z.transform, transform)
            zoomed({ transform })

            /**
            * Handles post-zoom necessary side-effects
            */
            function zoomed({ transform }) {
                // update axis
                const [min, max] = [margin.left, width - margin.right]
                x.range([min, max].map(d => transform.applyX(d)));

                const left = firstIndexGreaterThan(data, min, d => x(d.x))
                const right = firstIndexGreaterThan(data, max, d => x(d.x))
                
                /* 
                 * Buffer shall be the number of extra bars to draw offscreen to allow for seemless scrolling 
                 * 
                 * Note that buffer is for now 1/4th of what is to be rendered on screen 
                 * (therefore on scroll there will be at least a quarter of the page rendered out of bounds)
                 */
                const buffer = Math.ceil((right - left) / 4)

                // draw bars based on newData
                drawBars(data.slice(
                    // from (left - buffer) or zero if left < buffer
                    Math.max(left - buffer, 0), 
                    // from (right + buffer) or just to end if right + buffer > data.length
                    Math.min(right + buffer, data.length)
                ))
                
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

/**
 * Executes a binary search to return the first index where 
 * accessor(data[index]) > target (ie. the first element outside of a supplied bound).
 * 
 * This allows for efficient and useful 'Sliding Window problem' application for offscreen data calculation
 * 
 * @param {*} data the array to search through
 * @param {*} target the value to search for
 * @param {*} accessor the function to retrieve value to compare to target
 */
function firstIndexGreaterThan(data, target, accessor) {
    let l = 0, r = data.length;
    while(l < r) {
        const m = Math.floor((l + r) / 2)

        if(accessor(data[m]) < target) {
            l = m + 1
        } else {
            r = m
        }
    }
    
    return r
}
