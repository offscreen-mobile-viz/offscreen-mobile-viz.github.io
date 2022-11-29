import './app.scss'

import Panels from './components/Panels'
import { ChartType } from './components/Offscreen'
import { useState, useEffect } from 'react'
import { Orientation, DeviceOrientation } from './utils/screen-orientation/ScreenOrientation'

import * as d3 from 'd3'

export const Datasets = {
  CARS: 'cars',
  DIAMONDS: 'diamonds',
};

/*
const Accessors = {
  [Datasets.CARS]: { 
    x: d => d['Identification.ID'], 
    y: d => +d[Fields[Datasets.CARS]]
  },
  [Datasets.DIAMONDS]: { 
    x: d => d['id'], 
    y: d => +d[Fields[Datasets.CARS]]
  },
}

const Fields = {
  [Datasets.CARS]: 'Engine Information.Engine Statistics.Horsepower',
  //[Datasets.CARS]: 'Fuel Information.City mpg',
  [Datasets.DIAMONDS]: 'price',
}
*/

const Fields = {
  [Datasets.CARS]: {
    x: 'Identification.ID',
    default: 'Engine Information.Engine Statistics.Horsepower',
    fields: []
  }, 
  [Datasets.DIAMONDS]: {
    x: 'id',
    default: 'price',
    fields: []
  }, 
}

function App() {
  const [datasets, setDatasets] = useState()
  const [dataset, setDataset] = useState(Datasets.CARS)
  const [field, setField] = useState('Engine Information.Engine Statistics.Horsepower')
  const [chart, setChart] = useState(ChartType.DOTPLOT40)
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetch() {
      const datasets = {}
      for(let dataset of Object.values(Datasets)) {
        let data = await d3.csv(`/data/${dataset}.csv`)

        // Only keep columns that have numerical contents
        Fields[dataset].fields = data.columns.filter(f => +data[0][f])

        datasets[dataset] = d3.shuffle(data)
      }
      // set populated data
      setDatasets(datasets)
    }

    fetch()
  }, [])

  useEffect(() => {
    if( !datasets || !dataset || !field) {
      return
    }

    const { x } = Fields[dataset]
    setData(
      datasets[dataset].map((d, i) => {
        return {
          x: d[x],
          y: +d[field],
          id: i
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
            <select name="chart selector" onChange={handleChartChange}>
              <option value={ChartType.DOTPLOT40}>DotPlot 40</option>
              <option value={ChartType.DOTPLOT100}>DotPlot 100</option>
              <option value={ChartType.HISTOGRAM}>Histogram</option>
              <option value={ChartType.BOXPLOT}>Box Plot</option>
              <option value={ChartType.VIOLINPLOT}>Violin Plot</option>
            </select>
            <select name="data selector" onChange={handleDataChange}>
              <option value={Datasets.CARS}>Cars</option>
              <option value={Datasets.DIAMONDS}>Diamonds</option>
            </select>
            <select name="field selector" value={field} onChange={handleFieldChange}>
              {Fields[dataset].fields && Fields[dataset].fields.map((f, i) => {
                return <option key={i} value={f} >{f}</option>
              })}
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
