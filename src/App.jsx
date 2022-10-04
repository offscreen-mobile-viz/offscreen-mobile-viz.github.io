import './app.css'

import Panels from './components/Panels'
import { useState, useEffect } from 'react'
import { Orientation, DeviceOrientation } from './utils/screen-orientation/ScreenOrientation'

import * as d3 from 'd3'

function App() {
  const [data, setData] = useState(null)
  /**
   * Here we parse the CSV files from /public/
   */
  useEffect(() => {
    async function fetch() {
      let data = await d3.csv('/data/cars.csv')
      setData(data)
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
