import './app.css'
import { Orientation, DeviceOrientation } from './screen-orientation/ScreenOrientation'

function App() {
  return (
    <DeviceOrientation>
      <Orientation orientation='landscape'>
        <div>
          <p>You are in landscape</p>
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
