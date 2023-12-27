import {useState} from 'react'

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
    </div>
  )

}

export default App