'use client'

import { useState, useTransition, useDeferredValue, useMemo, startTransition } from 'react'

/**
 * useTransition Hook Example - React Concurrent Features
 * 
 * Hook này mark state updates as transitions (non-urgent) để keep UI responsive.
 * Rất hữu ích cho:
 * - Non-blocking UI updates
 * - Large data processing
 * - Search và filtering operations
 * - Background data fetching
 * - Smooth user interactions
 */

interface Product {
  id: number
  name: string
  category: string
  price: number
  description: string
  rating: number
  inStock: boolean
}

interface User {
  id: number
  name: string
  email: string
  role: string
  department: string
  avatar: string
}

// Generate large dataset
const generateProducts = (count: number): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Food']
  const names = ['Pro', 'Max', 'Ultra', 'Premium', 'Basic', 'Standard', 'Deluxe', 'Essential']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${names[i % names.length]} ${categories[i % categories.length]} ${i + 1}`,
    category: categories[i % categories.length],
    price: Math.floor(Math.random() * 1000) + 10,
    description: `This is a high-quality ${categories[i % categories.length].toLowerCase()} product with excellent features and great value for money.`,
    rating: Math.floor(Math.random() * 5) + 1,
    inStock: Math.random() > 0.2
  }))
}

const generateUsers = (count: number): User[] => {
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack']
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations']
  const roles = ['Manager', 'Developer', 'Designer', 'Analyst', 'Coordinator']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${names[i % names.length]} ${i + 1}`,
    email: `${names[i % names.length].toLowerCase()}${i + 1}@company.com`,
    role: roles[i % roles.length],
    department: departments[i % departments.length],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`
  }))
}

const UseTransitionExample = () => {
  // Large datasets
  const [products] = useState(() => generateProducts(5000))
  const [users] = useState(() => generateUsers(2000))
  
  // Search states
  const [productSearch, setProductSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  
  // Transition states
  const [isPending, startTransition] = useTransition()
  const [isFilterPending, startFilterTransition] = useTransition()
  const [isUserSearchPending, startUserTransition] = useTransition()
  
  // UI states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name')
  
  // Counter for demonstrating blocking vs non-blocking updates
  const [urgentCounter, setUrgentCounter] = useState(0)
  const [transitionCounter, setTransitionCounter] = useState(0)
  
  // Heavy computation simulation
  const [heavyTaskResult, setHeavyTaskResult] = useState<number | null>(null)
  const [isComputingHeavyTask, setIsComputingHeavyTask] = useState(false)

  // Deferred values
  const deferredProductSearch = useDeferredValue(productSearch)
  const deferredUserSearch = useDeferredValue(userSearch)

  /**
   * 1. Product filtering với useTransition
   */
  const filteredProducts = useMemo(() => {
    console.log('🔍 Filtering products...', { 
      search: deferredProductSearch, 
      category: categoryFilter, 
      priceRange 
    })
    
    // Simulate expensive filtering operation
    let filtered = products
    
    if (deferredProductSearch) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(deferredProductSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(deferredProductSearch.toLowerCase())
      )
    }
    
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }
    
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    )
    
    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'rating':
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })
    
    return filtered
  }, [products, deferredProductSearch, categoryFilter, priceRange, sortBy])

  /**
   * 2. User search với useTransition
   */
  const filteredUsers = useMemo(() => {
    console.log('👥 Searching users...', deferredUserSearch)
    
    if (!deferredUserSearch) return users.slice(0, 50) // Show only first 50 when no search
    
    return users.filter(user =>
      user.name.toLowerCase().includes(deferredUserSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(deferredUserSearch.toLowerCase()) ||
      user.department.toLowerCase().includes(deferredUserSearch.toLowerCase()) ||
      user.role.toLowerCase().includes(deferredUserSearch.toLowerCase())
    )
  }, [users, deferredUserSearch])

  /**
   * Event handlers với useTransition
   */
  const handleProductSearch = (value: string) => {
    setProductSearch(value) // Immediate update for input
    // The filtering will use deferredValue automatically
  }

  const handleUserSearch = (value: string) => {
    setUserSearch(value) // Immediate update for input
    startUserTransition(() => {
      // Any additional expensive operations can go here
    })
  }

  const handleCategoryFilter = (category: string) => {
    startFilterTransition(() => {
      setCategoryFilter(category)
    })
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    startTransition(() => {
      setPriceRange({ min, max })
    })
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    startTransition(() => {
      setViewMode(mode)
    })
  }

  const handleSortChange = (sort: 'name' | 'price' | 'rating') => {
    startTransition(() => {
      setSortBy(sort)
    })
  }

  /**
   * Heavy computation example
   */
  const performHeavyTask = () => {
    setIsComputingHeavyTask(true)
    
    startTransition(() => {
      // Simulate heavy computation
      let result = 0
      for (let i = 0; i < 100000000; i++) {
        result += Math.sqrt(i) * Math.random()
      }
      setHeavyTaskResult(result)
      setIsComputingHeavyTask(false)
    })
  }

  /**
   * Counter examples - urgent vs transition updates
   */
  const incrementUrgentCounter = () => {
    // This is an urgent update - will block UI
    setUrgentCounter(prev => prev + 1)
  }

  const incrementTransitionCounter = () => {
    // This is a transition update - non-blocking
    startTransition(() => {
      setTransitionCounter(prev => prev + 1)
    })
  }

  // Get categories for filter
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ⚡ useTransition Hook Example
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hook để mark state updates as transitions (non-urgent) và keep UI responsive. 
          Essential cho large data operations và smooth user experiences.
        </p>
      </div>

      {/* Performance Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">
          🚦 Transition Status
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded ${isPending ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <div className="text-2xl font-bold">{isPending ? '⏳' : '✅'}</div>
            <div className="text-sm">Main Transition</div>
          </div>
          <div className={`p-4 rounded ${isFilterPending ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <div className="text-2xl font-bold">{isFilterPending ? '⏳' : '✅'}</div>
            <div className="text-sm">Filter Transition</div>
          </div>
          <div className={`p-4 rounded ${isUserSearchPending ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <div className="text-2xl font-bold">{isUserSearchPending ? '⏳' : '✅'}</div>
            <div className="text-sm">User Search</div>
          </div>
          <div className={`p-4 rounded ${isComputingHeavyTask ? 'bg-red-100' : 'bg-blue-100'}`}>
            <div className="text-2xl font-bold">{isComputingHeavyTask ? '🔄' : '💻'}</div>
            <div className="text-sm">Heavy Task</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-sm text-blue-700">
            💡 Transitions make state updates non-urgent, allowing urgent updates (like typing) to interrupt them.
          </p>
        </div>
      </div>

      {/* Counter Demo - Urgent vs Transition */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🔢 Urgent vs Transition Updates
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-red-800">❌ Urgent Updates (Blocking)</h4>
            <div className="text-center">
              <div className="text-6xl font-bold text-red-600 mb-4">{urgentCounter}</div>
              <button
                onClick={incrementUrgentCounter}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Increment Urgently
              </button>
              <p className="text-sm text-red-600 mt-2">
                This blocks the UI during updates
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-green-800">✅ Transition Updates (Non-blocking)</h4>
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-4">{transitionCounter}</div>
              <button
                onClick={incrementTransitionCounter}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                disabled={isPending}
              >
                {isPending ? 'Transitioning...' : 'Increment with Transition'}
              </button>
              <p className="text-sm text-green-600 mt-2">
                This allows UI to stay responsive
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Search & Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🛍️ Product Search & Filter (Large Dataset: {products.length} items)
        </h3>
        
        {/* Search Controls */}
        <div className="space-y-4 mb-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products:
              </label>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => handleProductSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <div className="text-xs text-gray-500 mt-1">
                Using deferredValue for smooth typing
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category:
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isFilterPending}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category} {isFilterPending && categoryFilter === category ? '⏳' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as 'name' | 'price' | 'rating')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ${priceRange.min} - ${priceRange.max}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange.min}
                onChange={(e) => handlePriceRangeChange(Number(e.target.value), priceRange.max)}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange.max}
                onChange={(e) => handlePriceRangeChange(priceRange.min, Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Grid View
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-medium">
              Found {filteredProducts.length} products
              {(isPending || isFilterPending) && (
                <span className="ml-2 text-sm text-yellow-600">⏳ Updating...</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Search: "{deferredProductSearch || 'All'}" | Category: {categoryFilter}
            </div>
          </div>
        </div>

        {/* Product Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-3'
        } ${(isPending || isFilterPending) ? 'opacity-60' : ''}`}>
          {filteredProducts.slice(0, 12).map(product => (
            <div
              key={product.id}
              className={`border rounded-lg p-4 hover:shadow-md cursor-pointer ${
                selectedProduct?.id === product.id ? 'border-blue-500 bg-blue-50' : ''
              } ${viewMode === 'list' ? 'flex items-center space-x-4' : ''}`}
              onClick={() => setSelectedProduct(product)}
            >
              <div className={viewMode === 'list' ? 'flex-1' : ''}>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-600">{product.category}</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-green-600">${product.price}</span>
                  <span className="text-yellow-500">{'⭐'.repeat(product.rating)}</span>
                </div>
                {product.inStock ? (
                  <span className="text-xs text-green-600">In Stock</span>
                ) : (
                  <span className="text-xs text-red-600">Out of Stock</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length > 12 && (
          <div className="text-center mt-4 text-sm text-gray-500">
            ... and {filteredProducts.length - 12} more products
          </div>
        )}
      </div>

      {/* User Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          👥 User Search (Dataset: {users.length} users)
        </h3>
        
        <div className="mb-4">
          <input
            type="text"
            value={userSearch}
            onChange={(e) => handleUserSearch(e.target.value)}
            placeholder="Search users by name, email, department, or role..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <div className="text-xs text-gray-500 mt-1">
            Using both useTransition and useDeferredValue
          </div>
        </div>

        <div className="mb-4">
          <div className="text-lg font-medium">
            {userSearch ? `Found ${filteredUsers.length} users` : `Showing first 50 of ${users.length} users`}
            {isUserSearchPending && (
              <span className="ml-2 text-sm text-yellow-600">⏳ Searching...</span>
            )}
          </div>
        </div>

        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-4 ${isUserSearchPending ? 'opacity-60' : ''}`}>
          {filteredUsers.slice(0, 9).map(user => (
            <div
              key={user.id}
              className={`p-4 border rounded-lg hover:shadow-md cursor-pointer ${
                selectedUser?.id === user.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.role}</div>
                  <div className="text-xs text-gray-500">{user.department}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heavy Task Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          💻 Heavy Computation (Non-blocking với useTransition)
        </h3>
        
        <div className="space-y-4">
          <button
            onClick={performHeavyTask}
            disabled={isComputingHeavyTask}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {isComputingHeavyTask ? '🔄 Computing...' : '🚀 Start Heavy Computation'}
          </button>
          
          {heavyTaskResult && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="font-medium text-green-800">Computation Result:</div>
              <div className="text-green-600 font-mono text-sm">
                {heavyTaskResult.toFixed(2)}
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            This heavy computation runs in a transition, so you can still interact with other UI elements while it's running.
            Try clicking the urgent counter button while the computation is running!
          </div>
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          ⚡ Performance Benefits
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-800 mb-2">✅ WITH useTransition:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• User input (typing) stays responsive</li>
              <li>• Urgent updates can interrupt non-urgent ones</li>
              <li>• Better perceived performance</li>
              <li>• Smooth interactions during heavy operations</li>
              <li>• Priority-based update scheduling</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-800 mb-2">❌ WITHOUT useTransition:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• All updates block the UI</li>
              <li>• Input lag during heavy operations</li>
              <li>• Poor user experience</li>
              <li>• Janky interactions</li>
              <li>• No update prioritization</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">
          💡 Best Practices cho useTransition
        </h3>
        <ul className="space-y-2 text-sm text-green-700">
          <li>• <strong>Large data operations:</strong> Wrap expensive state updates trong startTransition</li>
          <li>• <strong>Search & filtering:</strong> Combine với useDeferredValue cho smooth typing</li>
          <li>• <strong>Non-critical updates:</strong> Use cho updates không cần immediate response</li>
          <li>• <strong>Background processing:</strong> Perfect cho heavy computations</li>
          <li>• <strong>Don't overuse:</strong> Chỉ dùng cho truly expensive operations</li>
          <li>• <strong>User feedback:</strong> Show loading states using isPending</li>
          <li>• <strong>Priority:</strong> Urgent updates (user input) should stay outside transitions</li>
          <li>• <strong>Testing:</strong> Test trên slow devices để verify performance benefits</li>
        </ul>
      </div>
    </div>
  )
}

export default UseTransitionExample 