 import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css' // Ensure you import the CSS with Tailwind directives

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex space-x-4 mt-8">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="w-24 h-24 hover:scale-110 transition-transform" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="w-24 h-24 hover:scale-110 transition-transform" alt="React logo" />
        </a>
      </div>

      <h1 className="text-3xl font-bold text-red-600 mt-8">Vite + React + Tailwind</h1>

      <div className="card mt-4">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          count is {count}
        </button>
        <p className="mt-2 text-gray-700">
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs mt-8 text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
