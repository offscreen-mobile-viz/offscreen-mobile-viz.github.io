export default function BarWithContext() {
    let data,
        accessor,
        setLeft,
        setRight;

    const my = (selection) => {

        selection.append('rect')
            .attr('y', 10)
            .attr('x', 10)
            .attr('height', 30)
            .attr('width', 30)

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
