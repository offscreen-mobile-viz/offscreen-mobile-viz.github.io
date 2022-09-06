import { useState, useEffect, Children } from "react"

export function Orientation({ orientation, children, className = '' }) {
  return (
    <div className={`${className} react-orientation react-orientation--${orientation}`}>
      {children}
    </div>
  )
}

window.screen.lockOrientationUniversal = window.screen.lockOrientation ||
window.screen.mozLockOrientation ||
window.screen.msLockOrientation

export function DeviceOrientation({ children, className }) {
  
  const [orientationState, setOrientationState] = useState({
    orientation: null,
    type: null,
    angle: null
  });  
  
  /**
   * we initialize the detected orientation on first render
   */
  useEffect(() => {
    onOrientationChange()
  }, [])

  /**
   * On first render we add an event listener for change in orientation.
   * Each time an orientation change occurs, we update the event listener
   */
  useEffect(() => {
    if ((window.screen.orientation) && ('onchange' in window.screen.orientation)) {
      window.screen.orientation.addEventListener('change', onOrientationChange)
    } else if ('onorientationchange' in window) {
      window.addEventListener('orientationchange', onOrientationChange)
    }
    
    return () => {
      if ((window.screen.orientation) && ('onchange' in window.screen.orientation)) {
        window.screen.orientation.removeEventListener('change', onOrientationChange)
      } else if ('onorientationchange' in window) {
        window.removeEventListener('orientationchange', onOrientationChange)
      }
    }
  }, [orientationState])
       
  function onOrientationChange () {
    var orientation = 'portrait';
    var type = 'primary';
    var angle = 0;
    
    if (window.screen.orientation){
      [orientation, type] = window.screen.orientation.type.split('-');
      angle = window.screen.orientation;
    }

    /* deprecated but necessary for ios compatibility */
    /* see: https://developer.mozilla.org/en-US/docs/Web/API/Window/orientation */
    if (window.orientation){
      angle = window.orientation;
      orientation = Math.abs(angle) === 90 ? 'landscape' : 'portrait';
    }

    setOrientationState({orientation, type, angle})
  }

  return (
    <div className={`${className}`}>
      {Children.map(children, child => {
        const { props } = child
        /* only render if the child orientation prop matched the current orientation */
        if(props.orientation === (orientationState && orientationState.orientation)) {
          return child
        }
      })
      }
    </div>
  )
}