import { Component, useState } from 'react'
import './App.css'

class DigitalClock extends Component {
  constructor(props) {
    super(props)
    this.state = { time: new Date() }
    this.timerId = null
    console.log('[Clock] constructor: component instance created')
  }

  componentDidMount() {
    console.log('[Clock] componentDidMount: starting one-second timer')
    this.timerId = window.setInterval(() => {
      this.setState({ time: new Date() })
    }, 1000)
  }

  componentDidUpdate() {
    console.log('[Clock] componentDidUpdate: clock time refreshed')
  }

  componentWillUnmount() {
    console.log('[Clock] componentWillUnmount: clearing timer')
    window.clearInterval(this.timerId)
  }

  render() {
    console.log('[Clock] render: drawing current time')
    const time = this.state.time

    return (
      <div className="clock-face" aria-live="off" aria-label={`Current time ${time.toLocaleTimeString()}`}>
        <span className="clock-date">
          {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
        <time className="clock-time" dateTime={time.toISOString()}>
          {time.toLocaleTimeString(undefined, { hour12: false })}
        </time>
        <span className="clock-zone">LOCAL TIME <span aria-hidden="true">/</span> LIVE</span>
      </div>
    )
  }
}

function App() {
  const [isClockVisible, setIsClockVisible] = useState(true)

  return (
    <main className="clock-page">
      <header className="masthead">
        <a className="monogram" href="#top" aria-label="Still Time home">ST<span>.</span></a>
        <span className="masthead-label">TIME, IN ITS OWN MOMENT</span>
        <span className="masthead-index">FIELD NOTE 01</span>
      </header>

      <section className="clock-intro" id="top">
        <p className="eyebrow"><span /> A STUDY IN COMPONENT LIFECYCLE</p>
        <h1>Still<br /><em>time.</em></h1>
        <p className="intro-note">A small clock with a life of its own.</p>
      </section>

      <section className="clock-panel" aria-label="Digital clock demonstration">
        <div className="panel-topline">
          <span>THE PRESENT MOMENT</span>
          <span className="status"><span /> {isClockVisible ? 'RUNNING' : 'PAUSED'}</span>
        </div>
        <div className="clock-stage">
          {isClockVisible ? <DigitalClock /> : <p className="clock-hidden">The clock is resting.</p>}
        </div>
        <div className="panel-controls">
          <p>{isClockVisible ? 'A new second, every second.' : 'Its timer has been cleared.'}</p>
          <button
            className="toggle-button"
            type="button"
            onClick={() => setIsClockVisible((visible) => !visible)}
          >
            <span className="toggle-icon" aria-hidden="true">{isClockVisible ? '−' : '+'}</span>
            {isClockVisible ? 'Hide clock' : 'Show clock'}
          </button>
        </div>
      </section>

      <footer className="page-footer">
        <span>MOUNT / UPDATE / UNMOUNT</span>
        <span>WATCH THE CONSOLE <span aria-hidden="true">↗</span></span>
      </footer>
    </main>
  )
}

export default App
