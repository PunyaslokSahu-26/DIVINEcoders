import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EmployeePerformanceDashboard from './Components/Employee'
import Navbar from './Components/Navbar'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex">
  <div className="bg-gray-900 text-white h-screen w-64">
    <Navbar />  
  </div>
  <div className="flex-1 p-6">
    <EmployeePerformanceDashboard />
  </div>
</div>

      
    </>
  )
}

export default App
