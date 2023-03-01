import './app.scss'

import Panels from './components/Panels'
import { ChartType } from './components/Offscreen'
import { useState, useEffect } from 'react'
import { Orientation, DeviceOrientation } from './utils/screenOrientation/ScreenOrientation'

import * as d3 from 'd3'
import generateUserStudy from './utils/userStudy/generateUserStudy'

export const Datasets = {
  CARS: 'cars',
  WEATHER: 'weather',
  DIAMONDS: 'diamonds',
  RANDOM: 'random',
};

export const Fields = {
  [Datasets.CARS]: {
    default: 'mpg-city',
    fields: ['mpg-city', 'mpg-highway', 'horsepower', 'torque'],
  }, 
  [Datasets.WEATHER]: {
    default: 'avg-temp',
    fields: ['avg-temp', 'max-temp', 'min-temp', 'wind-speed'],
  }, 
  [Datasets.DIAMONDS]: {
    default: 'price',
    fields: ['price', 'carat'],
  }, 
  [Datasets.RANDOM]: {
    default: 'x',
    fields: ['x', 'y'],
  },
}

function App() {
  const [datasets, setDatasets] = useState()
  const [dataset, setDataset] = useState(Datasets.CARS)
  const [field, setField] = useState('mpg-city')
  const [chart, setChart] = useState(ChartType.DOTPLOT40)
  const [data, setData] = useState([])
  const [n, setN] = useState(40)

  useEffect(() => {
    async function fetch() {
      const datasets = {}
      for(let dataset of Object.values(Datasets)) {
        let data = await d3.csv(`/data/${dataset}.csv`)

        datasets[dataset] = data
      }
      // set populated data
      setDatasets(datasets)
    }

    fetch()
  }, [])

  // triggered when a dropdown changes that requires a data-change side-effect
  useEffect(() => {
    if( !datasets || !dataset || !field) {
      return
    }

    setData(
      datasets[dataset].map(d => {
        return {
          x: +d['index'],
          y: +d[field],
        }
      })
    )
  }, [datasets, dataset, field])

  const handleChartChange = e => {
    const chart = e.target.value
    setChart(chart)
  }

  const handleDataChange = e => {
    const dataset = e.target.value
    setDataset(dataset)
    setField(Fields[dataset].default)
  }

  const handleFieldChange = e => {
    const field = e.target.value
    setField(field)
  }

  return (
    <DeviceOrientation>
      <Orientation orientation='landscape'>
        <div>
          <div className='topbar'>
            {/* slider for dotplot-n, and a label for it */}
            {chart === ChartType.DOTPLOT_N &&
                <>
                  <label htmlFor="myRange" style={{width: '60px', textAlign: 'right'}}>n: {n}</label>
                  <input type="range" min="10" max="250" step="10" value={n} className="slider" id="myRange" onChange={e => setN(e.target.value)}/>
                </>
            }
            {/* selector for chart type */}
            <select name="chart selector" onChange={handleChartChange}>
              <option value={ChartType.DOTPLOT40}>DotPlot 40</option>
              <option value={ChartType.DOTPLOT100}>DotPlot 100</option>
              <option value={ChartType.DOTPLOT_N}>DotPlot n</option>
              <option value={ChartType.HISTOGRAM}>Histogram</option>
              <option value={ChartType.BOXPLOT}>Box Plot</option>
              <option value={ChartType.VIOLINPLOT}>Violin Plot</option>
              <option value={ChartType.CONTROL}>Control</option>
            </select>
            {/* selector for dataset */}
            <select name="data selector" onChange={handleDataChange}>
              {Object.values(Datasets).map((dataset, i) => {
                return <option key={i} value={dataset}>{dataset}</option>
              })}
            </select>
            <select name="field selector" value={field} onChange={handleFieldChange}>
              {Fields[dataset].fields && Fields[dataset].fields.map((f, i) => {
                return <option key={i} value={f} >{f}</option>
              })}
            </select>
          </div>
          <Panels data={data} chart={chart} n={n}/>
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
