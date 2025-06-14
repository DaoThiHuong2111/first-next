'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * UseEffectExample - Component demo useEffect hook
 * 
 * useEffect cho phép thực hiện side effects trong function components.
 * Effect runs sau mỗi render và có thể được control bằng dependency array.
 * 
 * Patterns:
 * 1. Effect without dependencies - runs after every render
 * 2. Effect with empty dependencies [] - runs once after mount  
 * 3. Effect with dependencies [dep] - runs when dependencies change
 * 4. Effect with cleanup - return cleanup function
 */

// Custom hook để fetch data
const useFetch = (url: string) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!url) return
    
    // Set loading state
    setLoading(true)
    setError(null)
    
    // Simulate API call với timeout
    const timeoutId = setTimeout(() => {
      // Simulate random success/error
      if (Math.random() > 0.7) {
        setError('Failed to fetch data')
        setData(null)
      } else {
        setData({
          id: Math.floor(Math.random() * 1000),
          title: `Data from ${url}`,
          timestamp: new Date().toISOString()
        })
      }
      setLoading(false)
    }, 1000 + Math.random() * 2000) // Random delay 1-3s
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
      setLoading(false)
    }
  }, [url]) // Effect chạy khi url thay đổi
  
  return { data, loading, error }
}

const UseEffectExample = () => {
  // States cho các examples
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 }) // Default for SSR
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isOnline, setIsOnline] = useState(true)
  const [fetchUrl, setFetchUrl] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  
  // Refs
  const renderCountRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Custom fetch hook usage
  const { data: fetchedData, loading: fetchLoading, error: fetchError } = useFetch(fetchUrl)
  
  // Helper function để add logs
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`])
  }
  
  // 1. Effect without dependencies - chạy sau mỗi render
  useEffect(() => {
    renderCountRef.current += 1
    addLog(`Component rendered (${renderCountRef.current} times)`)
  }) // Không có dependency array
  
  // 2. Effect với empty dependencies - chỉ chạy once sau mount
  useEffect(() => {
    addLog('Component mounted - effect với []')
    
    // Cleanup function chạy khi component unmount
    return () => {
      addLog('Component will unmount')
    }
  }, []) // Empty dependency array
  
  // 3. Effect với dependencies - chạy khi count thay đổi
  useEffect(() => {
    if (count > 0) {
      addLog(`Count changed to: ${count}`)
    }
  }, [count]) // Chạy khi count thay đổi
  
  // 4. Effect với dependencies - chạy khi name thay đổi
  useEffect(() => {
    if (name) {
      addLog(`Name changed to: "${name}"`)
    }
  }, [name]) // Chạy khi name thay đổi
  
  // 5. Window resize listener
  useEffect(() => {
    const handleResize = () => {
      const newSize = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      setWindowSize(newSize)
      addLog(`Window resized: ${newSize.width}x${newSize.height}`)
    }
    
    // Set initial size
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup - remove listener
    return () => {
      window.removeEventListener('resize', handleResize)
      addLog('Window resize listener removed')
    }
  }, []) // Chỉ setup once
  
  // 6. Mouse position tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    addLog('Mouse tracker started')
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      addLog('Mouse tracker stopped')
    }
  }, [])
  
  // 7. Online/Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      addLog('Browser came online')
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      addLog('Browser went offline')
    }
    
    // Set initial state
    setIsOnline(navigator.onLine)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  // 8. Timer interval effect
  useEffect(() => {
    if (count >= 10) {
      // Start auto-incrementing khi count >= 10
      intervalRef.current = setInterval(() => {
        setCount(prev => prev + 1)
      }, 1000)
      addLog('Auto-increment started')
    } else {
      // Clear interval khi count < 10
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        addLog('Auto-increment stopped')
      }
    }
    
    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [count]) // Chạy khi count thay đổi
  
  // Handlers
  const handleClearLogs = () => {
    setLogs([])
  }
  
  const handleTestFetch = () => {
    const urls = [
      '/api/users',
      '/api/posts', 
      '/api/comments',
      '/api/products'
    ]
    const randomUrl = urls[Math.floor(Math.random() * urls.length)]
    setFetchUrl(randomUrl)
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        ⚡ useEffect Hook Examples
      </h2>
      
      {/* Status Bar */}
      <div className="bg-gray-100 p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <strong>Renders:</strong> {renderCountRef.current}
        </div>
        <div>
          <strong>Online:</strong> {isOnline ? '🟢 Yes' : '🔴 No'}
        </div>
        <div>
          <strong>Window:</strong> {windowSize.width}x{windowSize.height}
        </div>
        <div>
          <strong>Mouse:</strong> ({mousePosition.x}, {mousePosition.y})
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Interactive Examples */}
        <div className="space-y-6">
          {/* Counter Example */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              1. Counter với Auto-increment
            </h3>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {count}
              </div>
              <p className="text-sm text-gray-600">
                {count >= 10 ? 'Auto-incrementing...' : 'Manual mode'}
              </p>
            </div>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setCount(prev => prev + 1)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                +1
              </button>
              <button
                onClick={() => setCount(prev => Math.max(0, prev - 1))}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              >
                -1
              </button>
              <button
                onClick={() => setCount(0)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Reset
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              Count ≥ 10 sẽ tự động tăng mỗi giây
            </p>
          </div>
          
          {/* Name Input Example */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-green-600">
              2. Name Input với Effect
            </h3>
            
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên để trigger effect..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            
            <div className="mt-3 text-sm text-gray-600">
              <strong>Current:</strong> {name || '(empty)'}
            </div>
          </div>
          
          {/* Data Fetching Example */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              3. Data Fetching với Custom Hook
            </h3>
            
            <button
              onClick={handleTestFetch}
              disabled={fetchLoading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors mb-4"
            >
              {fetchLoading ? 'Fetching...' : 'Test Fetch Data'}
            </button>
            
            <div className="space-y-2">
              {fetchLoading && (
                <div className="text-blue-600">⏳ Loading data...</div>
              )}
              
              {fetchError && (
                <div className="text-red-600">❌ Error: {fetchError}</div>
              )}
              
              {fetchedData && (
                <div className="bg-purple-50 p-3 rounded">
                  <h4 className="font-medium text-purple-800">Fetched Data:</h4>
                  <pre className="text-sm text-purple-700 mt-1">
                    {JSON.stringify(fetchedData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Logs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-orange-600">
              Effect Logs
            </h3>
            <button
              onClick={handleClearLogs}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Clear Logs
            </button>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet... Interact with the examples!</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1 whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Notes */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
        <h4 className="font-semibold text-blue-800 mb-3">📝 useEffect Patterns:</h4>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-medium text-blue-700 mb-2">🔄 Dependency Patterns:</h5>
            <ul className="text-blue-600 space-y-1">
              <li>• <strong>No deps:</strong> useEffect(() => {}) - mỗi render</li>
              <li>• <strong>Empty deps:</strong> useEffect(() => {}, []) - mount only</li>
              <li>• <strong>With deps:</strong> useEffect(() => {}, [dep]) - khi dep thay đổi</li>
              <li>• <strong>Multiple deps:</strong> [dep1, dep2] - khi bất kỳ dep nào thay đổi</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-blue-700 mb-2">🧹 Cleanup Patterns:</h5>
            <ul className="text-blue-600 space-y-1">
              <li>• Event listeners → removeEventListener</li>
              <li>• Timers → clearTimeout/clearInterval</li>
              <li>• Subscriptions → unsubscribe</li>
              <li>• Async operations → abort signal</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-200">
          <h5 className="font-medium text-blue-700 mb-2">⚠️ Common Pitfalls:</h5>
          <ul className="text-blue-600 space-y-1 text-sm">
            <li>• Infinite loops - thiếu dependencies hoặc sai dependencies</li>
            <li>• Memory leaks - không cleanup listeners/timers</li>
            <li>• Stale closures - dependencies không được update</li>
            <li>• Race conditions - async effects không được handle đúng</li>
            <li>• Missing dependencies - ESLint exhaustive-deps rule</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UseEffectExample 