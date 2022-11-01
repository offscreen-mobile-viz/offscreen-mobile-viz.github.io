import './app.scss'

import Panels from './components/Panels'
import { ChartType } from './components/Offscreen'
import { useState, useEffect } from 'react'
import { Orientation, DeviceOrientation } from './utils/screen-orientation/ScreenOrientation'

import * as d3 from 'd3'

export const Datasets = {
  CARS: 'cars',
};

const Accessors = {
  [Datasets.CARS]: { x: d => d['Identification.ID'], y: d => +d['Fuel Information.City mpg']}
}

function App() {
  const [data, setData] = useState([])
  const [datasets, setDatasets] = useState()
  const [dataset, setDataset] = useState(Datasets.CARS)
  const [chart, setChart] = useState(ChartType.DOTPLOT40)

  useEffect(() => {
    async function fetch() {
      const datasets = {}
      for(let dataset of Object.values(Datasets)) {
        const { x, y } = Accessors[dataset]
        datasets[dataset] = await d3.csv(`/data/${dataset}.csv`, (d, i) => {
          return { x: x(d), y: y(d), id: i, side: 'middle' }
        })
      }
      // set populated data
      setDatasets(datasets)
      // default to Cars first
      setData(datasets[dataset])
    }
    
    fetch()
  }, [])

  const handleChartChange = e => {
    const chart = e.target.value
    setChart(chart)
  }
  const handleDataChange = e => {
    const dataset = e.target.value
    setData(datasets[dataset])
  }

  return (
    <DeviceOrientation>
      <Orientation orientation='landscape'>
        <div>
          <div className='topbar'>
            <select name="chart selector" onChange={handleChartChange}>
              <option value={ChartType.DOTPLOT40}>DotPlot 40</option>
              <option value={ChartType.DOTPLOT100}>DotPlot 100</option>
              <option value={ChartType.HISTOGRAM}>Histogram</option>
              <option value={ChartType.BOXPLOT}>Box Plot</option>
              <option value={ChartType.VIOLINPLOT}>Violin Plot</option>
            </select>
            <select name="data selector" onChange={handleDataChange}>
              <option value={Datasets.CARS}>Cars</option>
            </select>
          </div>
          <Panels data={data} chart={chart}/>
        </div>
      </Orientation>

      <Orientation orientation='portrait'>
        <div>
          <p>Please rotate your device</p>
        </div>
      </Orientation>
    </DeviceOrientation>
  )
}

export default App
