'use client'

import React, { useSyncExternalStore, useState, useEffect, useCallback } from 'react'

/**
 * useSyncExternalStore Hook Example - External Store Subscription
 * 
 * Hook này cho phép React components subscribe to external mutable stores.
 * Thay thế cho manual useState/useEffect patterns với better performance và consistency.
 * 
 * Essential cho:
 * - Global state management
 * - Browser APIs (localStorage, sessionStorage)
 * - Third-party libraries
 * - Custom external stores
 * - Network status
 * - Real-time subscriptions
 */

// Example 1: Online Status Store
const createOnlineStore = () => {
  return {
    getSnapshot: () => navigator.onLine,
    getServerSnapshot: () => true, // Server-side always returns true
    subscribe: (callback: () => void) => {
      window.addEventListener('online', callback)
      window.addEventListener('offline', callback)
      return () => {
        window.removeEventListener('online', callback)
        window.removeEventListener('offline', callback)
      }
    }
  }
}

const onlineStore = createOnlineStore()

// Custom hook for online status
const useOnlineStatus = () => {
  return useSyncExternalStore(
    onlineStore.subscribe,
    onlineStore.getSnapshot,
    onlineStore.getServerSnapshot
  )
}

// Example 2: LocalStorage Store
const createLocalStorageStore = (key: string) => {
  return {
    getSnapshot: () => {
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    getServerSnapshot: () => null, // Server doesn't have localStorage
    subscribe: (callback: () => void) => {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
          callback()
        }
      }
      
      // Listen for storage events from other tabs
      window.addEventListener('storage', handleStorageChange)
      
      // Custom event for same-tab updates
      window.addEventListener(`localStorage:${key}`, callback)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener(`localStorage:${key}`, callback)
      }
    },
    setValue: (value: string | null) => {
      try {
        if (value === null) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, value)
        }
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new CustomEvent(`localStorage:${key}`))
      } catch (error) {
        console.error('Failed to update localStorage:', error)
      }
    }
  }
}

// Custom hook for localStorage
const useLocalStorage = (key: string, defaultValue: string = '') => {
  const store = React.useMemo(() => createLocalStorageStore(key), [key])
  
  const value = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  )
  
  const setValue = useCallback((newValue: string | null) => {
    store.setValue(newValue)
  }, [store])
  
  return [value || defaultValue, setValue] as const
}

// Example 3: Custom Counter Store
class CounterStore {
  private value = 0
  private listeners = new Set<() => void>()
  
  getSnapshot = () => {
    return this.value
  }
  
  getServerSnapshot = () => {
    return 0 // Default server value
  }
  
  subscribe = (callback: () => void) => {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }
  
  increment = () => {
    this.value += 1
    this.notifyListeners()
  }
  
  decrement = () => {
    this.value -= 1
    this.notifyListeners()
  }
  
  reset = () => {
    this.value = 0
    this.notifyListeners()
  }
  
  setValue = (newValue: number) => {
    this.value = newValue
    this.notifyListeners()
  }
  
  private notifyListeners = () => {
    this.listeners.forEach(callback => callback())
  }
}

const counterStore = new CounterStore()

// Custom hook for counter store
const useCounterStore = () => {
  const count = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getSnapshot,
    counterStore.getServerSnapshot
  )
  
  return {
    count,
    increment: counterStore.increment,
    decrement: counterStore.decrement,
    reset: counterStore.reset,
    setValue: counterStore.setValue
  }
}

// Example 4: Window Size Store
const createWindowSizeStore = () => {
  return {
    getSnapshot: () => {
      if (typeof window === 'undefined') {
        return { width: 0, height: 0 }
      }
      return {
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
    getServerSnapshot: () => ({ width: 0, height: 0 }),
    subscribe: (callback: () => void) => {
      if (typeof window === 'undefined') {
        return () => {}
      }
      
      const handleResize = () => {
        callback()
      }
      
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }
}

const windowSizeStore = createWindowSizeStore()

const useWindowSize = () => {
  return useSyncExternalStore(
    windowSizeStore.subscribe,
    windowSizeStore.getSnapshot,
    windowSizeStore.getServerSnapshot
  )
}

// Example 5: Shopping Cart Store
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

class ShoppingCartStore {
  private items: CartItem[] = []
  private listeners = new Set<() => void>()
  
  getSnapshot = () => {
    return {
      items: [...this.items],
      total: this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      count: this.items.reduce((sum, item) => sum + item.quantity, 0)
    }
  }
  
  getServerSnapshot = () => {
    return { items: [], total: 0, count: 0 }
  }
  
  subscribe = (callback: () => void) => {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }
  
  addItem = (item: Omit<CartItem, 'quantity'>) => {
    const existingIndex = this.items.findIndex(i => i.id === item.id)
    
    if (existingIndex >= 0) {
      this.items[existingIndex].quantity += 1
    } else {
      this.items.push({ ...item, quantity: 1 })
    }
    
    this.notifyListeners()
  }
  
  removeItem = (id: string) => {
    this.items = this.items.filter(item => item.id !== id)
    this.notifyListeners()
  }
  
  updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      this.removeItem(id)
      return
    }
    
    const item = this.items.find(i => i.id === id)
    if (item) {
      item.quantity = quantity
      this.notifyListeners()
    }
  }
  
  clear = () => {
    this.items = []
    this.notifyListeners()
  }
  
  private notifyListeners = () => {
    this.listeners.forEach(callback => callback())
  }
}

const cartStore = new ShoppingCartStore()

const useShoppingCart = () => {
  const cart = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  )
  
  return {
    ...cart,
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    clear: cartStore.clear
  }
}

// Components using the stores
const OnlineStatusIndicator = () => {
  const isOnline = useOnlineStatus()
  
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded ${
      isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-3 h-3 rounded-full ${
        isOnline ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <span className="text-sm font-medium">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  )
}

const LocalStorageDemo = () => {
  const [name, setName] = useLocalStorage('user-name', '')
  const [preferences, setPreferences] = useLocalStorage('user-preferences', '{}')
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  
  const handlePreferenceChange = (key: string, value: string) => {
    try {
      const prefs = JSON.parse(preferences)
      prefs[key] = value
      setPreferences(JSON.stringify(prefs))
    } catch {
      setPreferences(JSON.stringify({ [key]: value }))
    }
  }
  
  const parsedPreferences = React.useMemo(() => {
    try {
      return JSON.parse(preferences)
    } catch {
      return {}
    }
  }, [preferences])
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Name (localStorage):</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name..."
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <p className="text-xs text-gray-500 mt-1">
          This value is synced across tabs via useSyncExternalStore
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Theme Preference:</label>
        <select
          value={parsedPreferences.theme || 'light'}
          onChange={(e) => handlePreferenceChange('theme', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      
      <div className="p-3 bg-gray-50 rounded">
        <p className="text-sm font-medium">Current Values:</p>
        <p className="text-xs text-gray-600">Name: {name || 'Not set'}</p>
        <p className="text-xs text-gray-600">Theme: {parsedPreferences.theme || 'light'}</p>
      </div>
    </div>
  )
}

const CounterDemo = () => {
  const { count, increment, decrement, reset, setValue } = useCounterStore()
  
  return (
    <div className="text-center space-y-4">
      <div className="text-4xl font-bold text-gray-800">{count}</div>
      
      <div className="flex justify-center gap-2">
        <button
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -1
        </button>
        <button
          onClick={increment}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          +1
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
      
      <div>
        <input
          type="number"
          value={count}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
        />
        <p className="text-xs text-gray-500 mt-1">Direct value input</p>
      </div>
    </div>
  )
}

const WindowSizeDisplay = () => {
  const { width, height } = useWindowSize()
  
  return (
    <div className="text-center space-y-2">
      <div className="text-lg font-semibold">Window Size:</div>
      <div className="text-2xl font-bold text-blue-600">
        {width} × {height}
      </div>
      <p className="text-sm text-gray-500">
        Resize your window to see real-time updates
      </p>
    </div>
  )
}

const ShoppingCartDemo = () => {
  const { items, total, count, addItem, removeItem, updateQuantity, clear } = useShoppingCart()
  
  const sampleProducts = [
    { id: '1', name: 'Laptop', price: 999 },
    { id: '2', name: 'Mouse', price: 25 },
    { id: '3', name: 'Keyboard', price: 75 },
    { id: '4', name: 'Monitor', price: 299 }
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Shopping Cart ({count} items)</h4>
        <div className="text-lg font-bold text-green-600">${total.toFixed(2)}</div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {sampleProducts.map(product => (
          <button
            key={product.id}
            onClick={() => addItem(product)}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
          >
            Add {product.name}<br/>
            <span className="text-green-600">${product.price}</span>
          </button>
        ))}
      </div>
      
      {items.length > 0 && (
        <div className="border border-gray-200 rounded p-4">
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-2">${item.price} each</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <button
              onClick={clear}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Cart
            </button>
            <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Performance comparison component
const PerformanceComparison = () => {
  const [manualOnline, setManualOnline] = useState(navigator.onLine)
  const syncOnline = useOnlineStatus()
  const [renderCount, setRenderCount] = useState(0)
  
  // Manual implementation (less efficient)
  useEffect(() => {
    const handleOnline = () => setManualOnline(true)
    const handleOffline = () => setManualOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  useEffect(() => {
    setRenderCount(prev => prev + 1)
  })
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium text-green-800 mb-3">✅ WITH useSyncExternalStore:</h4>
        <div className="space-y-2 text-sm">
          <div className={`px-3 py-2 rounded ${
            syncOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            Status: {syncOnline ? 'Online' : 'Offline'}
          </div>
          <div className="text-xs text-gray-600">
            • Tearing prevention<br/>
            • Consistent across React versions<br/>
            • Optimized for concurrent features<br/>
            • Better performance
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-orange-800 mb-3">⚠️ Manual useState/useEffect:</h4>
        <div className="space-y-2 text-sm">
          <div className={`px-3 py-2 rounded ${
            manualOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            Status: {manualOnline ? 'Online' : 'Offline'}
          </div>
          <div className="text-xs text-gray-600">
            • Potential tearing issues<br/>
            • Race conditions possible<br/>
            • Not optimized for concurrent mode<br/>
            • More boilerplate code
          </div>
        </div>
      </div>
      
      <div className="md:col-span-2 p-3 bg-blue-50 rounded">
        <p className="text-sm text-blue-700">
          📊 Component rendered {renderCount} times. useSyncExternalStore provides better consistency và performance.
        </p>
      </div>
    </div>
  )
}

const UseSyncExternalStoreExample = () => {
  const [activeTab, setActiveTab] = useState('online')
  
  const tabs = [
    { id: 'online', label: 'Online Status', icon: '🌐' },
    { id: 'localStorage', label: 'LocalStorage', icon: '💾' },
    { id: 'counter', label: 'Counter Store', icon: '🔢' },
    { id: 'windowSize', label: 'Window Size', icon: '📏' },
    { id: 'cart', label: 'Shopping Cart', icon: '🛒' }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🔄 useSyncExternalStore Hook Example
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hook để subscribe React components to external mutable stores. 
          Thay thế manual useState/useEffect patterns với better performance và tearing prevention.
        </p>
      </div>

      {/* Online Status Always Visible */}
      <div className="flex justify-center">
        <OnlineStatusIndicator />
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'online' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">🌐 Online Status Monitoring</h3>
            <div className="text-center">
              <OnlineStatusIndicator />
              <p className="text-sm text-gray-500 mt-3">
                Try disconnecting your internet connection để test real-time updates.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">How it works:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Subscribes to 'online' và 'offline' events</div>
                <div>• Uses navigator.onLine for current status</div>
                <div>• Provides server-side snapshot (always true)</div>
                <div>• Automatically updates all subscribed components</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'localStorage' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">💾 LocalStorage Synchronization</h3>
            <LocalStorageDemo />
            
            <div className="p-4 bg-blue-50 rounded">
              <h4 className="font-medium mb-2">Features:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Syncs across multiple tabs/windows</div>
                <div>• Handles localStorage events automatically</div>
                <div>• Server-safe (returns null on server)</div>
                <div>• Custom events for same-tab updates</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'counter' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">🔢 External Counter Store</h3>
            <CounterDemo />
            
            <div className="p-4 bg-green-50 rounded">
              <h4 className="font-medium mb-2">Store Features:</h4>
              <div className="text-sm text-green-700 space-y-1">
                <div>• Class-based external store</div>
                <div>• Multiple subscription management</div>
                <div>• Immediate updates to all subscribers</div>
                <div>• Server-side rendering support</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'windowSize' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">📏 Window Size Tracking</h3>
            <WindowSizeDisplay />
            
            <div className="p-4 bg-purple-50 rounded">
              <h4 className="font-medium mb-2">Implementation:</h4>
              <div className="text-sm text-purple-700 space-y-1">
                <div>• Tracks window.innerWidth và innerHeight</div>
                <div>• Subscribes to 'resize' events</div>
                <div>• Responsive design support</div>
                <div>• SSR-safe with default values</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'cart' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">🛒 Shopping Cart Store</h3>
            <ShoppingCartDemo />
            
            <div className="p-4 bg-orange-50 rounded">
              <h4 className="font-medium mb-2">Advanced Features:</h4>
              <div className="text-sm text-orange-700 space-y-1">
                <div>• Complex state management with multiple actions</div>
                <div>• Computed values (total, count) in snapshot</div>
                <div>• Immutable updates with efficient re-renders</div>
                <div>• Real-time updates across all cart components</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-6">⚖️ Performance Comparison</h3>
        <PerformanceComparison />
      </div>

      {/* Code Examples */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          📝 Code Examples
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Basic Store Implementation:</h4>
            <pre className="text-xs text-gray-700 bg-white p-3 rounded overflow-x-auto">
{`const createStore = () => ({
  getSnapshot: () => getCurrentState(),
  getServerSnapshot: () => getServerState(),
  subscribe: (callback) => {
    // Add listener
    addListener(callback)
    
    // Return unsubscribe function
    return () => removeListener(callback)
  }
})

const useStore = () => {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  )
}`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Custom Hook Pattern:</h4>
            <pre className="text-xs text-gray-700 bg-white p-3 rounded overflow-x-auto">
{`const useOnlineStatus = () => {
  return useSyncExternalStore(
    // Subscribe function
    (callback) => {
      window.addEventListener('online', callback)
      window.addEventListener('offline', callback)
      return () => {
        window.removeEventListener('online', callback)
        window.removeEventListener('offline', callback)
      }
    },
    // Client snapshot
    () => navigator.onLine,
    // Server snapshot
    () => true
  )
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">
          💡 Best Practices cho useSyncExternalStore
        </h3>
        <ul className="space-y-2 text-sm text-green-700">
          <li>• <strong>External stores:</strong> Ideal cho global state libraries</li>
          <li>• <strong>Browser APIs:</strong> Perfect cho localStorage, sessionStorage, etc.</li>
          <li>• <strong>Subscribe stability:</strong> Use stable functions để avoid re-subscriptions</li>
          <li>• <strong>Server snapshots:</strong> Always provide getServerSnapshot cho SSR</li>
          <li>• <strong>Immutable snapshots:</strong> Return new objects/arrays khi state changes</li>
          <li>• <strong>Error handling:</strong> Wrap external API calls trong try-catch</li>
          <li>• <strong>Memory leaks:</strong> Always return cleanup function from subscribe</li>
          <li>• <strong>Performance:</strong> Minimize snapshot computation complexity</li>
        </ul>
      </div>

      {/* Common Use Cases */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          🎯 Common Use Cases
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">Built-in Browser APIs:</h4>
            <ul className="space-y-1">
              <li>• navigator.onLine (network status)</li>
              <li>• localStorage/sessionStorage</li>
              <li>• window.matchMedia (media queries)</li>
              <li>• document.visibilityState</li>
              <li>• geolocation API</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">External Libraries:</h4>
            <ul className="space-y-1">
              <li>• Redux stores</li>
              <li>• MobX observables</li>
              <li>• Custom event emitters</li>
              <li>• WebSocket connections</li>
              <li>• Third-party state management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UseSyncExternalStoreExample 