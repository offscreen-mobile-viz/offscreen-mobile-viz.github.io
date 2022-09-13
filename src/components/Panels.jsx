import BarChart from './BarChart'
import Offscreen from './Offscreen'

import { useState } from 'react'

import './panels.scss'

export default function Panels({ data }) {
  const [left, setLeft] = useState([])
  const [right, setRight] = useState([])

  return (
    <div className='panels' >
      <Offscreen data={left} side='left' />
      <BarChart data={data} accessor={d => +d['Fuel Information.City mpg']} setLeft={setLeft} setRight={setRight} />
      <Offscreen data={right} side='right' />
    </div>
  )
}
