import {useState} from 'react'
import OcrUploader from './components/OcrUploader'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>Hello World</h1>
      <p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
        <span>
          {count}
        </span>
      </p>
      <OcrUploader />
    </div>
  )

}

export default App