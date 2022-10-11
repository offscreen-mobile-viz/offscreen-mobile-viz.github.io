import './app.css'

import Panels from './components/Panels'
import { useReducer, useEffect } from 'react'
import { Orientation, DeviceOrientation } from './utils/screen-orientation/ScreenOrientation'

import * as d3 from 'd3'

export const Datasets = {
  CARS: 'cars',
};

function App() {
  const id = d => d['Identification.ID']
  const accessor = d => +d['Fuel Information.City mpg']

  /**
   * This reducer function is used to populate the set of datasets. 
   * 
   * A dispatch action object should take the following form:
   * { dataset: [...someArray] }
   */
  const [data, dispatch] = useReducer((state, action) => {
    return {
      ...state, 
      [action.dataset]: action.payload
    }
  }, {})

  const dataMap = (d, i) => {
    return {
      x: id(d),
      y: accessor(d),
      // we give unique ids for simple removal and inserstion
      id: i
    }
  }

  /**
   * Here we parse the CSV files from /public/
   */
  useEffect(() => {
    async function fetch() {
      const cars = await d3.csv('/data/cars.csv')

      dispatch({
        dataset: Datasets.CARS,
        payload: cars.map(dataMap),
      })
    }

    fetch()
  }, [])

  return (
    <DeviceOrientation>
      <Orientation orientation='landscape'>
        <Panels data={data} />
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
