'use client'

import React, { useState, useEffect, useCallback, useMemo, useDebugValue, useRef } from 'react'

/**
 * useDebugValue Hook Example - Custom Hook Debugging
 * 
 * Hook này cho phép you display custom label trong React DevTools.
 * Primarily dành cho custom hook authors để provide debugging information.
 * 
 * Key features:
 * - Only runs trong development mode
 * - Visible in React DevTools
 * - Supports format functions
 * - Helps debug complex custom hooks
 * - No performance impact trong production
 */

// Example 1: Simple useDebugValue
const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState(initialValue)
  
  // Simple debug value
  useDebugValue(count > 5 ? `High: ${count}` : `Normal: ${count}`)
  
  const increment = useCallback(() => setCount(prev => prev + 1), [])
  const decrement = useCallback(() => setCount(prev => prev - 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  
  return { count, increment, decrement, reset }
}

// Example 2: useDebugValue with format function
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  // Debug value với format function để avoid expensive computation
  useDebugValue(isOnline, status => 
    status ? '🟢 Connected' : '🔴 Disconnected'
  )
  
  return isOnline
}

// Example 3: Complex custom hook với multiple debug values
const useApi = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate random error
      if (Math.random() < 0.3) {
        throw new Error('API Error: Failed to fetch data')
      }
      
      const mockData = {
        id: Date.now(),
        message: `Data from ${url}`,
        timestamp: new Date().toISOString()
      } as T
      
      setData(mockData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [url])
  
  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1)
    fetchData()
  }, [fetchData])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  // Complex debug value với detailed information
  useDebugValue({
    url,
    loading,
    error: error ? 'Error' : 'No Error',
    retryCount,
    hasData: !!data
  }, (debug) => 
    `${debug.url} | ${debug.loading ? 'Loading...' : 'Idle'} | ` +
    `Retries: ${debug.retryCount} | ${debug.hasData ? '✓ Data' : '✗ No Data'} | ` +
    `${debug.error}`
  )
  
  return { data, loading, error, retry, refetch: fetchData }
}

// Example 4: useForm với validation debugging
interface FormData {
  name: string
  email: string
  age: number
}

const useForm = (initialData: FormData) => {
  const [values, setValues] = useState(initialData)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    name: false,
    email: false,
    age: false
  })
  
  const validate = useCallback((data: FormData) => {
    const newErrors: Partial<FormData> = {}
    
    if (!data.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (data.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!data.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (data.age < 0 || data.age > 120) {
      newErrors.age = 'Age must be between 0 and 120'
    }
    
    return newErrors
  }, [])
  
  const isValid = useMemo(() => {
    const currentErrors = validate(values)
    return Object.keys(currentErrors).length === 0
  }, [values, validate])
  
  const setValue = useCallback((field: keyof FormData, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Validate on change if field was touched
    if (touched[field]) {
      const newErrors = validate({ ...values, [field]: value })
      setErrors(newErrors)
    }
  }, [values, touched, validate])
  
  const setTouched = useCallback((field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    // Validate when field is touched
    const newErrors = validate(values)
    setErrors(newErrors)
  }, [values, validate])
  
  const reset = useCallback(() => {
    setValues(initialData)
    setErrors({})
    setTouched({ name: false, email: false, age: false })
  }, [initialData])
  
  // Debug information for form state
  useDebugValue({
    isValid,
    errorCount: Object.keys(errors).length,
    touchedFields: Object.entries(touched).filter(([, t]) => t).length,
    values
  }, (debug) => 
    `Form: ${debug.isValid ? '✓ Valid' : '✗ Invalid'} | ` +
    `Errors: ${debug.errorCount} | Touched: ${debug.touchedFields}/3`
  )
  
  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setTouched,
    reset
  }
}

// Example 5: useLocalStorage với debug value
const useLocalStorage = <T,>(key: string, defaultValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })
  
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])
  
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(defaultValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, defaultValue])
  
  // Debug localStorage hook
  useDebugValue({ key, hasValue: storedValue !== defaultValue }, 
    (debug) => `Storage[${debug.key}]: ${debug.hasValue ? 'Custom' : 'Default'}`
  )
  
  return [storedValue, setValue, removeValue] as const
}

// Example 6: useTimer với debug tracking
const useTimer = (initialTime: number = 0) => {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true)
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }
  }, [isRunning])
  
  const pause = useCallback(() => {
    if (isRunning && intervalRef.current) {
      setIsRunning(false)
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isRunning])
  
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setTime(initialTime)
  }, [initialTime])
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  // Timer debug information
  useDebugValue({
    time,
    isRunning,
    formatted: `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`
  }, (debug) => 
    `Timer: ${debug.formatted} ${debug.isRunning ? '▶️' : '⏸️'}`
  )
  
  return { time, isRunning, start, pause, reset }
}

// Demo Components
const CounterDemo = () => {
  const { count, increment, decrement, reset } = useCounter(0)
  
  return (
    <div className="p-4 border border-gray-300 rounded">
      <h4 className="font-medium mb-3">Counter Hook Demo</h4>
      <div className="text-center space-y-3">
        <div className="text-3xl font-bold">{count}</div>
        <div className="flex justify-center gap-2">
          <button onClick={decrement} className="px-3 py-2 bg-red-500 text-white rounded">-</button>
          <button onClick={increment} className="px-3 py-2 bg-blue-500 text-white rounded">+</button>
          <button onClick={reset} className="px-3 py-2 bg-gray-500 text-white rounded">Reset</button>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        Check React DevTools to see debug value: {count > 5 ? `High: ${count}` : `Normal: ${count}`}
      </div>
    </div>
  )
}

const OnlineStatusDemo = () => {
  const isOnline = useOnlineStatus()
  
  return (
    <div className="p-4 border border-gray-300 rounded">
      <h4 className="font-medium mb-3">Online Status Hook Demo</h4>
      <div className={`text-center py-4 rounded ${
        isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        <div className="text-lg font-medium">
          {isOnline ? '🟢 Online' : '🔴 Offline'}
        </div>
        <div className="text-sm mt-1">
          Try disconnecting your internet to test
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        Debug value shows: {isOnline ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
    </div>
  )
}

const ApiDemo = () => {
  const { data, loading, error, retry } = useApi<{
    id: number
    message: string
    timestamp: string
  }>('/api/test')
  
  return (
    <div className="p-4 border border-gray-300 rounded">
      <h4 className="font-medium mb-3">API Hook Demo</h4>
      
      {loading && (
        <div className="text-center py-4">
          <div className="text-blue-600">Loading...</div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-3">
          <div className="font-medium">Error:</div>
          <div className="text-sm">{error}</div>
          <button 
            onClick={retry}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}
      
      {data && (
        <div className="bg-green-100 text-green-800 p-3 rounded">
          <div className="font-medium">Success:</div>
          <div className="text-sm mt-1">
            <div>ID: {data.id}</div>
            <div>Message: {data.message}</div>
            <div>Time: {new Date(data.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        Complex debug info available in React DevTools
      </div>
    </div>
  )
}

const FormDemo = () => {
  const form = useForm({
    name: '',
    email: '',
    age: 0
  })
  
  return (
    <div className="p-4 border border-gray-300 rounded">
      <h4 className="font-medium mb-3">Form Hook Demo</h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input
            type="text"
            value={form.values.name}
            onChange={(e) => form.setValue('name', e.target.value)}
            onBlur={() => form.setTouched('name')}
            className={`w-full px-3 py-2 border rounded ${
              form.errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {form.errors.name && (
            <div className="text-red-600 text-xs mt-1">{form.errors.name}</div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={form.values.email}
            onChange={(e) => form.setValue('email', e.target.value)}
            onBlur={() => form.setTouched('email')}
            className={`w-full px-3 py-2 border rounded ${
              form.errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {form.errors.email && (
            <div className="text-red-600 text-xs mt-1">{form.errors.email}</div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Age:</label>
          <input
            type="number"
            value={form.values.age}
            onChange={(e) => form.setValue('age', Number(e.target.value))}
            onBlur={() => form.setTouched('age')}
            className={`w-full px-3 py-2 border rounded ${
              form.errors.age ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {form.errors.age && (
            <div className="text-red-600 text-xs mt-1">{form.errors.age}</div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={form.reset}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Reset
          </button>
          <div className={`px-4 py-2 rounded ${
            form.isValid ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            {form.isValid ? 'Valid ✓' : 'Invalid ✗'}
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        Form validation debug info in React DevTools
      </div>
    </div>
  )
}

const LocalStorageDemo = () => {
  const [name, setName, removeName] = useLocalStorage('debug-name', 'John Doe')
  const [theme, setTheme, removeTheme] = useLocalStorage('debug-theme', 'light')
  
  return (
    <div className="p-4 border border-gray-300 rounded">
      <h4 className="font-medium mb-3">LocalStorage Hook Demo</h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Name:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
            <button 
              onClick={() => removeName()}
              className="px-3 py-2 bg-red-500 text-white rounded"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Theme:</label>
          <div className="flex gap-2">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
            <button 
              onClick={() => removeTheme()}
              className="px-3 py-2 bg-red-500 text-white rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        LocalStorage debug info shows custom vs default values
      </div>
    </div>
  )
}

const TimerDemo = () => {
  const { time, isRunning, start, pause, reset } = useTimer(0)
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="p-4 border border-gray-300 rounded">
      <h4 className="font-medium mb-3">Timer Hook Demo</h4>
      
      <div className="text-center space-y-3">
        <div className="text-3xl font-mono font-bold">
          {formatTime(time)}
        </div>
        
        <div className="flex justify-center gap-2">
          <button 
            onClick={start}
            disabled={isRunning}
            className={`px-4 py-2 rounded ${
              isRunning 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Start
          </button>
          <button 
            onClick={pause}
            disabled={!isRunning}
            className={`px-4 py-2 rounded ${
              !isRunning 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            Pause
          </button>
          <button 
            onClick={reset}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reset
          </button>
        </div>
        
        <div className={`text-sm ${isRunning ? 'text-green-600' : 'text-gray-500'}`}>
          {isRunning ? '▶️ Running' : '⏸️ Paused'}
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        Timer state với formatted time visible trong React DevTools
      </div>
    </div>
  )
}

const UseDebugValueExample = () => {
  const [activeDemo, setActiveDemo] = useState('counter')
  
  const demos = [
    { id: 'counter', label: 'Counter', icon: '🔢' },
    { id: 'online', label: 'Online Status', icon: '🌐' },
    { id: 'api', label: 'API Hook', icon: '🔄' },
    { id: 'form', label: 'Form Validation', icon: '📝' },
    { id: 'storage', label: 'LocalStorage', icon: '💾' },
    { id: 'timer', label: 'Timer', icon: '⏲️' }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🐛 useDebugValue Hook Example
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hook để display custom labels trong React DevTools. 
          Chỉ chạy trong development mode và giúp debug custom hooks efficiently.
        </p>
      </div>

      {/* DevTools Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          🔍 How to See Debug Values
        </h3>
        <div className="text-sm text-yellow-700 space-y-2">
          <div>1. Open React DevTools (F12 → Components tab)</div>
          <div>2. Select any component below that uses custom hooks</div>
          <div>3. Look for custom hook names với debug values trong sidebar</div>
          <div>4. Debug values only appear in development mode</div>
        </div>
      </div>

      {/* Demo Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {demos.map(demo => (
          <button
            key={demo.id}
            onClick={() => setActiveDemo(demo.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeDemo === demo.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {demo.icon} {demo.label}
          </button>
        ))}
      </div>

      {/* Demo Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeDemo === 'counter' && <CounterDemo />}
        {activeDemo === 'online' && <OnlineStatusDemo />}
        {activeDemo === 'api' && <ApiDemo />}
        {activeDemo === 'form' && <FormDemo />}
        {activeDemo === 'storage' && <LocalStorageDemo />}
        {activeDemo === 'timer' && <TimerDemo />}
      </div>

      {/* Code Examples */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          📝 useDebugValue Examples
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Simple Debug Value:</h4>
            <pre className="text-xs text-gray-700 bg-white p-3 rounded overflow-x-auto">
{`function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  
  // Simple debug value
  useDebugValue(count > 5 ? \`High: \${count}\` : \`Normal: \${count}\`)
  
  return { count, increment: () => setCount(c => c + 1) }
}`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Debug Value với Format Function:</h4>
            <pre className="text-xs text-gray-700 bg-white p-3 rounded overflow-x-auto">
{`function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  
  // Format function chỉ runs khi DevTools is open
  useDebugValue(isOnline, status => 
    status ? '🟢 Connected' : '🔴 Disconnected'
  )
  
  return isOnline
}`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Complex Debug Information:</h4>
            <pre className="text-xs text-gray-700 bg-white p-3 rounded overflow-x-auto">
{`function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Complex debug object
  useDebugValue({
    url,
    loading,
    hasData: !!data,
    error: error ? 'Error' : 'No Error'
  }, (debug) => 
    \`\${debug.url} | \${debug.loading ? 'Loading...' : 'Idle'} | \` +
    \`\${debug.hasData ? '✓ Data' : '✗ No Data'} | \${debug.error}\`
  )
  
  return { data, loading, error }
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">
          💡 Best Practices cho useDebugValue
        </h3>
        <ul className="space-y-2 text-sm text-green-700">
          <li>• <strong>Custom hooks only:</strong> Chỉ use trong custom hooks, không trong components</li>
          <li>• <strong>Development only:</strong> Automatically disabled trong production builds</li>
          <li>• <strong>Format functions:</strong> Use cho expensive debug value computation</li>
          <li>• <strong>Meaningful labels:</strong> Provide clear, useful debug information</li>
          <li>• <strong>Multiple values:</strong> Use objects cho complex debug data</li>
          <li>• <strong>Conditional display:</strong> Show different values based on state</li>
          <li>• <strong>Performance:</strong> Format functions chỉ run khi DevTools is open</li>
          <li>• <strong>Debugging aid:</strong> Helpful cho library authors và complex hooks</li>
        </ul>
      </div>

      {/* Use Cases */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          🎯 Common Use Cases
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">Hook Library Authors:</h4>
            <ul className="space-y-1">
              <li>• State management hooks</li>
              <li>• API request hooks</li>
              <li>• Form validation hooks</li>
              <li>• Timer/interval hooks</li>
              <li>• Storage hooks</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Complex Custom Hooks:</h4>
            <ul className="space-y-1">
              <li>• Multi-step workflows</li>
              <li>• Real-time subscriptions</li>
              <li>• Caching mechanisms</li>
              <li>• Authentication states</li>
              <li>• Feature flags</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">
          ⚠️ Important Notes
        </h3>
        <ul className="space-y-2 text-sm text-orange-700">
          <li>• <strong>Development only:</strong> No performance impact trong production</li>
          <li>• <strong>DevTools required:</strong> Values chỉ visible trong React DevTools</li>
          <li>• <strong>Custom hooks only:</strong> Don't use trong regular components</li>
          <li>• <strong>Format functions:</strong> Use cho expensive computations</li>
          <li>• <strong>No side effects:</strong> Debug values shouldn't affect app logic</li>
          <li>• <strong>Library feature:</strong> Primarily cho hook library authors</li>
        </ul>
      </div>
    </div>
  )
}

export default UseDebugValueExample 