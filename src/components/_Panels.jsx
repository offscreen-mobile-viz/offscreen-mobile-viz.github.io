import * as d3 from 'd3'

import BarChart from './BarChart'
import Offscreen from './Offscreen'

import { Datasets } from '../App'
import { ChartType } from './Offscreen'
import { useState, useEffect, useReducer } from 'react'

import './panels.scss'

export default function Panels({ data }) {
  /**
   * Reducer function for offscreen data state
   * @param {*} state in the format { left: {[id]: d}, right: {[id]: d}} }
   * @param {*} action in the format which takes some id ('left' or 'right'), 
   * a type ('remove' or 'add'), and a payload which provides a dictionary of all items to add OR a single item to remove
   */
  function reducer(state, action) {
    switch(action.type) {
      case 'add':
        return {
          ...state,
          // we add 
          [action.id]: { ...state[action.id], ...action.payload }
        }
      case 'remove':
        // for each id in the provided payload, remove from state
        Object.keys(action.payload).forEach(key => {
          delete state[action.id][key]
        })
        return state
      case 'set-scale':
      case 'set-data':
      case 'set-bin':
        // att - attribute encoded in the action.type. eg. set-scale yields att == scale.
        const att = action.type.slice(4);  
        return {
          ...state, [att]: action.payload
        }
      default:
        throw new Error("Incorrect dispatch usage. action.type must be 'add' | 'remove | 'set-scale' | 'set-data | 'set-bin'")
    }
  }

  /**
   * state - the state of our data. In the form:{
   *  left - offscreen data on the left
   *  right - offscreen data on the right
   *  scale - the scale that is shared between the charts
   *  data - the central data
   *  bin - the d3.bin constructor
   * }
   */
  const [state, dispatch] = useReducer(reducer, { 
    left: {},
    right: {},
    scale: d3.scaleLinear(), 
    data: undefined,
    bin: undefined,
  })

  /**
   * chartType - the offscreen visualization technique
   */
  const [chartType, setChartType] = useState(ChartType.DOTPLOT40)
  /**
   * datset - the name of the selected dataset
   */ 
  const [dataset, setDataset] = useState(Datasets.CARS)

  /**
   * From a selector change event, 
   * change the underlying data to the selected dataset
   */
  const handleDataChange = (event) => {
    const newDataset = event.target.value
    setDataset(newDataset)
  }

  let { width, height } = d3.select('body').node().getBoundingClientRect()
  height -= 70
  const offscreenDimensions = {
    width: width * 0.15,
    height: height
  } 
  const barChartDimensions = {
    width: width - (2 * offscreenDimensions.width),
    height: height
  }

  /**
   * When either the provided data changes or the selected dataset changes, update state.data
   */
  useEffect(() => {
    if(!data || !dataset || !data[dataset])
      return

    dispatch({
      type: 'set-data',
      payload: 
        data[dataset]
    })
  }, [data, dataset])

  /**
   * When state.data changes, update d3-dependents. Eg. recalculate yScale and bins.
   */
  useEffect(() => {
    if(state.data == undefined)
      return

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(state.data, d => d.y)])
      .range([height - 15, 15]) // with 15px margin
    
    dispatch({ 
      type: 'set-scale', 
      payload: {
        domain: yScale.domain(),
        range: yScale.range()
      }
    })
    
    const bin = d3.bin()
    .domain(yScale.domain())
    .thresholds(8)
    .value(d => d.y)

    dispatch({
      type: 'set-bin',
      payload: bin
    })

  }, [state.data])

  return (
    <div className='panels' >
      <Offscreen 
        data={state.left} 
        bin={state.bin}
        side='left' 
        y={state.scale}
        dimensions={offscreenDimensions}
        type={chartType}
      />
      <BarChart 
        data={state.data} 
        dispatch={dispatch}
        dimensions={barChartDimensions}
        y={state.scale}
      />
      <Offscreen
        data={state.right}
        bin={state.bin}
        side='right'
        y={state.scale}
        dimensions={offscreenDimensions}
        type={chartType}
      />
    </div>
  )
}
