'use client'

import { useState, useDeferredValue, useMemo, Suspense, memo } from 'react'

/**
 * useDeferredValue Hook Example - React Concurrent Features
 * 
 * Hook này defer updating non-critical parts của UI và let other parts update first.
 * Rất hữu ích cho:
 * - Deferred search updates
 * - Non-critical UI optimizations  
 * - Smooth typing experience
 * - Background data processing
 * - Stale content handling
 */

interface Product {
  id: number
  name: string
  category: string
  price: number
  description: string
  rating: number
  tags: string[]
}

interface Task {
  id: number
  title: string
  priority: 'low' | 'medium' | 'high'
  category: string
  completed: boolean
}

// Generate large datasets for demo
const generateProducts = (count: number): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Food']
  const tags = ['popular', 'new', 'sale', 'trending', 'premium', 'budget', 'featured', 'bestseller']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1} - ${categories[i % categories.length]}`,
    category: categories[i % categories.length],
    price: Math.floor(Math.random() * 1000) + 10,
    description: `High-quality ${categories[i % categories.length].toLowerCase()} product with excellent features and great value for money. Perfect for everyday use.`,
    rating: Math.floor(Math.random() * 5) + 1,
    tags: tags.slice(0, Math.floor(Math.random() * 4) + 1)
  }))
}

const generateTasks = (count: number): Task[] => {
  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Projects']
  const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Task ${i + 1}: ${categories[i % categories.length]} related activity`,
    priority: priorities[i % priorities.length],
    category: categories[i % categories.length],
    completed: Math.random() > 0.7
  }))
}

// Expensive filtering component
const ExpensiveProductList = memo(({ 
  products, 
  searchTerm, 
  isStale 
}: { 
  products: Product[]
  searchTerm: string
  isStale: boolean
}) => {
  // Simulate expensive filtering operation
  const filteredProducts = useMemo(() => {
    console.log('🔍 Filtering products...', searchTerm)
    
    if (!searchTerm) return products.slice(0, 50)
    
    // Simulate expensive search
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [products, searchTerm])

  return (
    <div 
      className="space-y-3"
      style={{
        opacity: isStale ? 0.5 : 1,
        transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
      }}
    >
      <div className="text-sm text-gray-600 mb-4">
        Found {filteredProducts.length} products
        {isStale && <span className="ml-2 text-orange-600">⏳ Updating...</span>}
      </div>
      
      {filteredProducts.slice(0, 10).map(product => (
        <div key={product.id} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">{product.category}</span>
                <span className="text-yellow-500">{'⭐'.repeat(product.rating)}</span>
              </div>
              <div className="flex gap-1 mt-2">
                {product.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">${product.price}</div>
            </div>
          </div>
        </div>
      ))}
      
      {filteredProducts.length > 10 && (
        <div className="text-center text-sm text-gray-500">
          ... and {filteredProducts.length - 10} more products
        </div>
      )}
    </div>
  )
})

ExpensiveProductList.displayName = 'ExpensiveProductList'

// Slow list component for demonstration
const SlowTaskList = memo(({ 
  tasks, 
  filterText 
}: { 
  tasks: Task[]
  filterText: string
}) => {
  // Simulate slow filtering
  const filteredTasks = useMemo(() => {
    console.log('📋 Processing tasks...', filterText)
    
    // Add artificial delay to demonstrate slowness
    let startTime = performance.now()
    while (performance.now() - startTime < 50) {
      // Busy wait to simulate slow operation
    }
    
    if (!filterText) return tasks.slice(0, 20)
    
    return tasks.filter(task =>
      task.title.toLowerCase().includes(filterText.toLowerCase()) ||
      task.category.toLowerCase().includes(filterText.toLowerCase())
    )
  }, [tasks, filterText])

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600 mb-3">
        Showing {filteredTasks.length} tasks
      </div>
      
      {filteredTasks.slice(0, 15).map(task => (
        <div key={task.id} className={`p-3 border rounded-lg ${task.completed ? 'opacity-50' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                className="rounded"
              />
              <div>
                <div className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </div>
                <div className="text-sm text-gray-500">{task.category}</div>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
})

SlowTaskList.displayName = 'SlowTaskList'

const UseDeferredValueExample = () => {
  // Data
  const [products] = useState(() => generateProducts(3000))
  const [tasks] = useState(() => generateTasks(1000))
  
  // Search states
  const [productSearch, setProductSearch] = useState('')
  const [taskFilter, setTaskFilter] = useState('')
  const [liveSearch, setLiveSearch] = useState('')
  
  // Deferred values
  const deferredProductSearch = useDeferredValue(productSearch)
  const deferredTaskFilter = useDeferredValue(taskFilter)
  const deferredLiveSearch = useDeferredValue(liveSearch)
  
  // Stale content detection
  const isProductSearchStale = productSearch !== deferredProductSearch
  const isTaskFilterStale = taskFilter !== deferredTaskFilter
  const isLiveSearchStale = liveSearch !== deferredLiveSearch

  // Performance tracking
  const [renderCount, setRenderCount] = useState(0)
  const [keystrokeCount, setKeystrokeCount] = useState(0)
  
  // Track renders
  React.useEffect(() => {
    setRenderCount(prev => prev + 1)
  })

  // Live search results (expensive operation)
  const liveSearchResults = useMemo(() => {
    if (!deferredLiveSearch) return []
    
    console.log('🔍 Live search processing...', deferredLiveSearch)
    
    // Combine products and tasks for live search
    const productResults = products
      .filter(p => p.name.toLowerCase().includes(deferredLiveSearch.toLowerCase()))
      .slice(0, 5)
      .map(p => ({ ...p, type: 'product' as const }))
    
    const taskResults = tasks
      .filter(t => t.title.toLowerCase().includes(deferredLiveSearch.toLowerCase()))
      .slice(0, 5)
      .map(t => ({ ...t, type: 'task' as const }))
    
    return [...productResults, ...taskResults]
  }, [products, tasks, deferredLiveSearch])

  const handleProductSearch = (value: string) => {
    setProductSearch(value)
    setKeystrokeCount(prev => prev + 1)
  }

  const handleTaskFilter = (value: string) => {
    setTaskFilter(value)
    setKeystrokeCount(prev => prev + 1)
  }

  const handleLiveSearch = (value: string) => {
    setLiveSearch(value)
    setKeystrokeCount(prev => prev + 1)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ⏳ useDeferredValue Hook Example
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hook để defer updating non-critical parts của UI và let other parts update first. 
          Essential cho smooth typing experience và responsive interfaces.
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">
          📊 Performance Metrics
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <div className="text-2xl font-bold text-blue-800">{renderCount}</div>
            <div className="text-sm text-blue-600">Component Renders</div>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <div className="text-2xl font-bold text-green-800">{keystrokeCount}</div>
            <div className="text-sm text-green-600">Total Keystrokes</div>
          </div>
          <div className="bg-orange-100 p-4 rounded">
            <div className="text-2xl font-bold text-orange-800">
              {[isProductSearchStale, isTaskFilterStale, isLiveSearchStale].filter(Boolean).length}
            </div>
            <div className="text-sm text-orange-600">Stale Queries</div>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <div className="text-2xl font-bold text-purple-800">{products.length + tasks.length}</div>
            <div className="text-sm text-purple-600">Total Items</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-sm text-blue-700">
            💡 useDeferredValue allows input to stay responsive while expensive operations happen in background.
          </p>
        </div>
      </div>

      {/* Product Search Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🛍️ Product Search (useDeferredValue + Stale Content)
        </h3>
        
        <div className="mb-4">
          <input
            type="text"
            value={productSearch}
            onChange={(e) => handleProductSearch(e.target.value)}
            placeholder="Search products... (type quickly to see deferred updates)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            Immediate value: "{productSearch}" | Deferred value: "{deferredProductSearch}"
            {isProductSearchStale && <span className="text-orange-600 ml-2">⏳ Deferring update...</span>}
          </div>
        </div>

        <ExpensiveProductList
          products={products}
          searchTerm={deferredProductSearch}
          isStale={isProductSearchStale}
        />
        
        <div className="mt-4 p-3 bg-green-50 rounded">
          <p className="text-sm text-green-700">
            ✅ <strong>Benefits:</strong> Input stays responsive, expensive filtering is deferred, 
            stale content is visually indicated với opacity change.
          </p>
        </div>
      </div>

      {/* Task Filter Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          📋 Task Management (Deferred Filtering)
        </h3>
        
        <div className="mb-4">
          <input
            type="text"
            value={taskFilter}
            onChange={(e) => handleTaskFilter(e.target.value)}
            placeholder="Filter tasks... (deferred processing)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            Filter: "{taskFilter}" | Processing: "{deferredTaskFilter}"
            {isTaskFilterStale && <span className="text-orange-600 ml-2">⏳ Processing...</span>}
          </div>
        </div>

        <SlowTaskList tasks={tasks} filterText={deferredTaskFilter} />
        
        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <p className="text-sm text-yellow-700">
            ⚡ <strong>Performance:</strong> The slow task filtering doesn't block typing. 
            useDeferredValue ensures smooth user interaction.
          </p>
        </div>
      </div>

      {/* Live Search Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🔍 Live Search (Multi-source Search)
        </h3>
        
        <div className="mb-4">
          <input
            type="text"
            value={liveSearch}
            onChange={(e) => handleLiveSearch(e.target.value)}
            placeholder="Search across products and tasks..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            Query: "{liveSearch}" | Searching: "{deferredLiveSearch}"
            {isLiveSearchStale && <span className="text-orange-600 ml-2">⏳ Searching...</span>}
          </div>
        </div>

        {deferredLiveSearch && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">
              Search Results ({liveSearchResults.length} found):
            </div>
            
            {liveSearchResults.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No results found for "{deferredLiveSearch}"
              </div>
            ) : (
              liveSearchResults.map((result, index) => (
                <div key={`${result.type}-${result.id}`} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {result.type === 'product' ? result.name : result.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.type === 'product' 
                          ? `Product • ${result.category} • $${result.price}`
                          : `Task • ${result.category} • ${result.priority} priority`
                        }
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {result.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        <div className="mt-4 p-3 bg-purple-50 rounded">
          <p className="text-sm text-purple-700">
            🚀 <strong>Live Search:</strong> Searches across multiple data sources without blocking the UI. 
            Results update smoothly với useDeferredValue.
          </p>
        </div>
      </div>

      {/* Comparison Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          ⚖️ Performance Comparison
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-800 mb-3">✅ WITH useDeferredValue:</h4>
            <div className="space-y-2 text-sm text-green-700">
              <div>• Input remains responsive during typing</div>
              <div>• Expensive operations don't block UI</div>
              <div>• Smooth user experience</div>
              <div>• Automatic stale content detection</div>
              <div>• Better perceived performance</div>
            </div>
            
            <div className="mt-4 p-3 bg-green-100 rounded">
              <div className="text-sm font-medium text-green-800">Current Status:</div>
              <div className="text-xs text-green-600 mt-1">
                ✓ All search inputs use useDeferredValue<br/>
                ✓ Smooth typing experience<br/>
                ✓ Non-blocking expensive operations
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-red-800 mb-3">❌ WITHOUT useDeferredValue:</h4>
            <div className="space-y-2 text-sm text-red-700">
              <div>• Input becomes laggy during typing</div>
              <div>• UI freezes during expensive operations</div>
              <div>• Poor user experience</div>
              <div>• No differentiation between urgent/non-urgent updates</div>
              <div>• Janky interactions</div>
            </div>
            
            <div className="mt-4 p-3 bg-red-100 rounded">
              <div className="text-sm font-medium text-red-800">Problems without deferring:</div>
              <div className="text-xs text-red-600 mt-1">
                ❌ Immediate expensive re-renders<br/>
                ❌ Blocked user interactions<br/>
                ❌ No priority-based updates
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          📝 Code Examples
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Basic Usage:</h4>
            <pre className="text-xs text-gray-700 bg-white p-3 rounded overflow-x-auto">
{`import { useState, useDeferredValue } from 'react'

function SearchComponent() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  
  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ExpensiveResults query={deferredQuery} />
    </>
  )
}`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Stale Content Detection:</h4>
            <pre className="text-xs text-gray-700 bg-white p-3 rounded overflow-x-auto">
{`function SearchWithStaleIndicator() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery
  
  return (
    <div style={{
      opacity: isStale ? 0.5 : 1,
      transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
    }}>
      <Results query={deferredQuery} />
    </div>
  )
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">
          💡 Best Practices cho useDeferredValue
        </h3>
        <ul className="space-y-2 text-sm text-green-700">
          <li>• <strong>Search input:</strong> Perfect cho search inputs với expensive filtering</li>
          <li>• <strong>Large lists:</strong> Defer updates cho large list rendering</li>
          <li>• <strong>Non-critical updates:</strong> Use cho updates không affect user interaction</li>
          <li>• <strong>Stale content:</strong> Detect và indicate stale content với isStale check</li>
          <li>• <strong>Combine với Suspense:</strong> Works well với Suspense boundaries</li>
          <li>• <strong>Don't overuse:</strong> Chỉ dùng cho truly expensive operations</li>
          <li>• <strong>User feedback:</strong> Always provide visual feedback cho deferred states</li>
          <li>• <strong>Testing:</strong> Test trên slow devices để verify benefits</li>
        </ul>
      </div>
    </div>
  )
}

export default UseDeferredValueExample 