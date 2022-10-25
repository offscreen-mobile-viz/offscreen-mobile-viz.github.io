/**
 * To preserve idempotency, this function returns a group updated to the selection.
 * It adds a g with the specified name and side in the form: 'name side'. If a group
 * already exists, it removes its children and updates its name.
 * 
 * @param {d3.Selection} selection 
 * @param {string} name 
 * @param {string} side 
 * @returns 
 */
export default function getSvg(selection, name, side) {
    return selection.selectAll('g')
      .data([null])
      .join(
        (enter) => enter.append('g')
          .attr('class', `${name} ${side}`),
        (update) => update.call(update => {
          update.selectAll("*").remove()
          update.attr('class', `${name} ${side}`)
        }),
        (exit) => exit.remove()
      )
}