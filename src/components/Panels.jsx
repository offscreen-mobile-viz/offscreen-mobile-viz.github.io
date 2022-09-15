import BarChart from './BarChart'
import Offscreen from './Offscreen'

import { useReducer } from 'react'

import './panels.scss'

export default function Panels({ data }) {
  const [state, dispatch] = useReducer(reducer, { left: {}, right: {} })

  /**
   * Reducer function for offscreen data state
   * @param {*} state in the format { left: {[id]: d}, right: {[id]: d} }
   * @param {*} action in the format which takes some id ('left' or 'right'), 
   * a type ('remove' or 'add'), and a payload which provides a dictionary of all items to add OR a single item to remove
   */
  function reducer(state, action) {

    if(action.type == 'add') {
      return {
        ...state,
        // we add 
        [action.id]: { ...state[action.id], ...action.payload }
      }
    }

    if(action.type == 'remove') {
      // for each id in the provided payload, remove from state
      Object.keys(action.payload).forEach(key => {
        delete state[action.id][key]
      })
      return state
    }

    // otherwise, incorrect developer usage
    throw new Error("Incorrect dispatch usage. action.type must be \'add\' | \'remove\'")
  }

  return (
    <div className='panels' >
      <Offscreen data={state.left} side='left' />
      <BarChart 
        data={data} 
        id={d => d['Identification.ID']} 
        accessor={d => +d['Fuel Information.City mpg']} 
        dispatch={dispatch}
      />
      <Offscreen data={state.right} side='right' />
    </div>
  )
}
