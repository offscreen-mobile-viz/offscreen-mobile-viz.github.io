import * as d3 from 'd3'

import BarChart from './BarChart'
import Offscreen from './Offscreen'

import { useState, useEffect, useReducer } from 'react'

import './panels.scss'

export default function Panels({ data }) {
  const [state, dispatch] = useReducer(reducer, { 
    left: {},
    right: {},
    scale: d3.scaleLinear(), 
    data: undefined,
    bin: undefined,
  })
  const [chartType, setChartType] = useState('dotplot-40')
  const id = d => d['Identification.ID']
  const accessor = d => +d['Fuel Information.City mpg']
  let { width, height } = d3.select('body').node().getBoundingClientRect()
  height -= 70

  useEffect(() => {
    if(data == null)
      return

    dispatch({
      type: 'set-data',
      payload: 
        data.map((d, i) => {
          return {
              x: id(d),
              y: accessor(d),
              // we give unique ids for simple removal and inserstion
              id: i
          }
        })
    })
  }, [data])


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
        const att = action.type.split('-')[1];  
        return {
          ...state, [att]: action.payload
        }
      default:
        throw new Error("Incorrect dispatch usage. action.type must be 'add' | 'remove | 'set-scale' | 'set-data | 'set-bin'")
    }
  }

  return (
    <>
      <div className='header'>
        <select name="chart selector" onChange={(event) => setChartType(event.target.value)}>
          <option value="dotplot-40">DotPlot 40</option>
          <option value="dotplot-100">DotPlot 100</option>
        </select>
      </div>
      <div className='panels' >
        <Offscreen 
          data={state.left} 
          bin={state.bin}
          side='left' 
          y={state.scale}
          dimensions={{
            width: width * 0.2,
            height: height
          }}
          type={chartType}
        />
        <BarChart 
          data={state.data} 
          dispatch={dispatch}
          y={state.scale}
        />
        <Offscreen
          data={state.right}
          bin={state.bin}
          side='right'
          y={state.scale}
          dimensions={{
            width: width * 0.2,
            height: height
          }}
          type={chartType}
        />
      </div>
    </>
  )
}
