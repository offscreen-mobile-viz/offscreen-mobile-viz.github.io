import './app.css'
import BarChart from './components/BarChart'
import { Orientation, DeviceOrientation } from './utils/screen-orientation/ScreenOrientation'

function App() {
  return (
    <DeviceOrientation>
      <Orientation orientation='landscape'>
        <BarChart data={[1,2,3,4,5]}/>
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
