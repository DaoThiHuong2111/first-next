'use client'

import { useState, useCallback, useMemo, useRef, useEffect, memo } from 'react'

/**
 * useCallback Hook Example - React Function Memoization
 * 
 * Hook này memoize một function và chỉ tạo function mới khi dependencies thay đổi.
 * Rất hữu ích cho:
 * - Preventing child component re-renders
 * - Optimizing event handlers
 * - Stable references for useEffect dependencies
 * - Performance optimization với expensive function creation
 * - Custom hooks với stable callback references
 */

interface TodoItem {
  id: number
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

interface User {
  id: number
  name: string
  email: string
}

// Child component với memo để demonstrate re-render prevention
const TodoCard = memo(({ 
  todo, 
  onToggle, 
  onDelete, 
  onPriorityChange 
}: {
  todo: TodoItem
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onPriorityChange: (id: number, priority: 'low' | 'medium' | 'high') => void
}) => {
  const renderCount = useRef(0)
  renderCount.current += 1

  console.log(`🔄 TodoCard ${todo.id} rendered ${renderCount.current} times`)

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800', 
    high: 'bg-red-100 text-red-800'
  }

  return (
    <div className={`p-4 border rounded-lg ${todo.completed ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="rounded"
          />
          <span className={todo.completed ? 'line-through' : ''}>{todo.text}</span>
          <span className={`px-2 py-1 rounded text-xs ${priorityColors[todo.priority]}`}>
            {todo.priority}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={todo.priority}
            onChange={(e) => onPriorityChange(todo.id, e.target.value as 'low' | 'medium' | 'high')}
            className="text-xs px-2 py-1 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Renders: {renderCount.current}
      </div>
    </div>
  )
})

TodoCard.displayName = 'TodoCard'

// Child component để demo search functionality
const SearchableUserList = memo(({
  users,
  onUserSelect,
  searchTerm
}: {
  users: User[]
  onUserSelect: (user: User) => void
  searchTerm: string
}) => {
  const renderCount = useRef(0)
  renderCount.current += 1

  console.log(`🔍 SearchableUserList rendered ${renderCount.current} times`)

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">
        Found {filteredUsers.length} users • Component renders: {renderCount.current}
      </div>
      {filteredUsers.slice(0, 5).map(user => (
        <div
          key={user.id}
          onClick={() => onUserSelect(user)}
          className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
        >
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-600">{user.email}</div>
        </div>
      ))}
    </div>
  )
})

SearchableUserList.displayName = 'SearchableUserList'

const UseCallbackExample = () => {
  // Todo state
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: 'Learn useCallback', completed: false, priority: 'high' },
    { id: 2, text: 'Build React app', completed: false, priority: 'medium' },
    { id: 3, text: 'Write documentation', completed: true, priority: 'low' }
  ])
  const [newTodo, setNewTodo] = useState('')

  // User state
  const [users] = useState<User[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com' },
    { id: 5, name: 'Eve Wilson', email: 'eve@example.com' }
  ])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Performance tracking
  const [renderCount, setRenderCount] = useState(0)
  const [callbackCreationCount, setCallbackCreationCount] = useState(0)
  const callbackRefs = useRef({
    handleToggle: 0,
    handleDelete: 0,
    handlePriorityChange: 0,
    handleUserSelect: 0
  })

  // Track component re-renders
  useEffect(() => {
    setRenderCount(prev => prev + 1)
  })

  /**
   * 1. WITH useCallback - Optimized event handlers
   * Functions được memoize và chỉ tạo mới khi dependencies thay đổi
   */
  const handleToggleTodo = useCallback((id: number) => {
    console.log('✅ handleToggleTodo called with useCallback')
    callbackRefs.current.handleToggle += 1
    
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }, []) // Empty dependencies - function never changes

  const handleDeleteTodo = useCallback((id: number) => {
    console.log('🗑️ handleDeleteTodo called with useCallback')
    callbackRefs.current.handleDelete += 1
    
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, []) // Empty dependencies

  const handlePriorityChange = useCallback((id: number, priority: 'low' | 'medium' | 'high') => {
    console.log('🎯 handlePriorityChange called with useCallback')
    callbackRefs.current.handlePriorityChange += 1
    
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, priority } : todo
    ))
  }, []) // Empty dependencies

  const handleUserSelect = useCallback((user: User) => {
    console.log('👤 handleUserSelect called with useCallback')
    callbackRefs.current.handleUserSelect += 1
    
    setSelectedUser(user)
  }, []) // Empty dependencies

  /**
   * 2. useCallback với dependencies
   * Function được tạo mới khi searchTerm thay đổi
   */
  const handleSearch = useCallback((term: string) => {
    console.log('🔍 handleSearch called - searchTerm dependency changed')
    setSearchTerm(term)
  }, []) // Could include dependencies here if needed

  /**
   * 3. Complex useCallback với multiple dependencies
   */
  const handleAddTodo = useCallback(() => {
    if (newTodo.trim()) {
      const newId = Math.max(...todos.map(t => t.id), 0) + 1
      setTodos(prev => [...prev, {
        id: newId,
        text: newTodo.trim(),
        completed: false,
        priority: 'medium'
      }])
      setNewTodo('')
      setCallbackCreationCount(prev => prev + 1)
    }
  }, [newTodo, todos]) // Depends on newTodo and todos

  /**
   * 4. useCallback for async operations
   */
  const handleAsyncOperation = useCallback(async (todoId: number) => {
    console.log('⏳ Starting async operation...')
    
    // Simulate API call
    setTimeout(() => {
      setTodos(prev => prev.map(todo =>
        todo.id === todoId 
          ? { ...todo, text: `${todo.text} (Updated)` }
          : todo
      ))
      console.log('✅ Async operation completed')
    }, 1000)
  }, [])

  /**
   * 5. WITHOUT useCallback - demonstrating the problem
   * Tạo function mới mỗi lần render
   */
  const handleToggleTodoWithoutCallback = (id: number) => {
    console.log('❌ handleToggleTodoWithoutCallback - NEW function created every render!')
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  /**
   * 6. useCallback với custom hook pattern
   */
  const useTodoActions = useCallback(() => {
    return {
      addTodo: (text: string) => {
        const newId = Math.max(...todos.map(t => t.id), 0) + 1
        setTodos(prev => [...prev, {
          id: newId,
          text,
          completed: false,
          priority: 'medium'
        }])
      },
      clearCompleted: () => {
        setTodos(prev => prev.filter(todo => !todo.completed))
      },
      markAllCompleted: () => {
        setTodos(prev => prev.map(todo => ({ ...todo, completed: true })))
      }
    }
  }, [todos])

  const todoActions = useTodoActions()

  // Statistics
  const completedTodos = todos.filter(todo => todo.completed).length
  const totalTodos = todos.length

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🔄 useCallback Hook Example
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hook để memoize functions và prevent unnecessary child component re-renders. 
          Essential cho performance optimization khi pass callbacks xuống children.
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
            <div className="text-sm text-blue-600">Parent Re-renders</div>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <div className="text-2xl font-bold text-green-800">{callbackRefs.current.handleToggle}</div>
            <div className="text-sm text-green-600">Toggle Calls</div>
          </div>
          <div className="bg-orange-100 p-4 rounded">
            <div className="text-2xl font-bold text-orange-800">{callbackRefs.current.handleDelete}</div>
            <div className="text-sm text-orange-600">Delete Calls</div>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <div className="text-2xl font-bold text-purple-800">{callbackCreationCount}</div>
            <div className="text-sm text-purple-600">AddTodo Creations</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-sm text-blue-700">
            💡 Check console để see callback creation logs. Memo components chỉ re-render khi props thay đổi.
          </p>
        </div>
      </div>

      {/* Todo Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          📝 Todo Management (useCallback Optimization)
        </h3>
        
        {/* Add Todo */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Add new todo..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Todo
          </button>
        </div>

        {/* Todo Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-2xl font-bold">{totalTodos}</div>
            <div className="text-sm text-gray-600">Total Todos</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-2xl font-bold text-green-800">{completedTodos}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="bg-orange-50 p-4 rounded">
            <div className="text-2xl font-bold text-orange-800">{totalTodos - completedTodos}</div>
            <div className="text-sm text-orange-600">Remaining</div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={todoActions.markAllCompleted}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Mark All Complete
          </button>
          <button
            onClick={todoActions.clearCompleted}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Clear Completed
          </button>
        </div>

        {/* Todo List với Memoized Components */}
        <div className="space-y-3">
          <h4 className="font-medium">Todo List (Memoized Components):</h4>
          {todos.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onPriorityChange={handlePriorityChange}
            />
          ))}
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded">
          <p className="text-sm text-green-700">
            ✅ <strong>useCallback benefit:</strong> TodoCard components chỉ re-render khi todo data thay đổi, 
            không phải khi parent re-renders với cùng callback functions.
          </p>
        </div>
      </div>

      {/* User Search Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          👥 User Search (useCallback with Dependencies)
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <SearchableUserList
              users={users}
              onUserSelect={handleUserSelect}
              searchTerm={searchTerm}
            />
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Selected User:</h4>
            {selectedUser ? (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-medium">{selectedUser.name}</div>
                <div className="text-sm text-gray-600">{selectedUser.email}</div>
                <div className="text-xs text-gray-500 mt-2">
                  User selection calls: {callbackRefs.current.handleUserSelect}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-gray-500">
                No user selected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Async Operations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          ⏳ Async Operations với useCallback
        </h3>
        
        <div className="space-y-3">
          {todos.map(todo => (
            <div key={todo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>{todo.text}</span>
              <button
                onClick={() => handleAsyncOperation(todo.id)}
                className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
              >
                Update Async
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-purple-50 rounded">
          <p className="text-sm text-purple-700">
            ⏳ <strong>Async useCallback:</strong> Function reference stable across re-renders, 
            safe để dùng trong useEffect dependencies hoặc pass xuống children.
          </p>
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          ⚡ Performance Comparison
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-800 mb-2">✅ WITH useCallback:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Functions có stable reference across renders</li>
              <li>• Child components với memo không unnecessary re-render</li>
              <li>• useEffect dependencies stable, tránh infinite loops</li>
              <li>• Better performance cho complex component trees</li>
              <li>• Consistent behavior cho event handlers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-800 mb-2">❌ WITHOUT useCallback:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• New function created every render</li>
              <li>• Child components re-render unnecessarily</li>
              <li>• useEffect triggers với function dependencies</li>
              <li>• Performance degradation với large lists</li>
              <li>• Memory overhead from function recreation</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded">
          <h4 className="font-medium text-yellow-800 mb-2">📝 Code Example:</h4>
          <pre className="text-xs text-yellow-800 overflow-x-auto">
{`// ✅ WITH useCallback
const handleClick = useCallback((id) => {
  setItems(prev => prev.filter(item => item.id !== id))
}, []) // Stable reference

// ❌ WITHOUT useCallback  
const handleClick = (id) => {
  setItems(prev => prev.filter(item => item.id !== id))
} // New function every render`}
          </pre>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">
          💡 Best Practices cho useCallback
        </h3>
        <ul className="space-y-2 text-sm text-green-700">
          <li>• <strong>Memoized children:</strong> Dùng với React.memo components để prevent re-renders</li>
          <li>• <strong>useEffect dependencies:</strong> Stable function references cho effect dependencies</li>
          <li>• <strong>Event handlers:</strong> Optimize event handlers pass xuống deep component trees</li>
          <li>• <strong>Dependency array:</strong> Include tất cả values used inside function</li>
          <li>• <strong>Don't overuse:</strong> Chỉ dùng khi thực sự cần thiết cho performance</li>
          <li>• <strong>Custom hooks:</strong> Return stable functions từ custom hooks</li>
          <li>• <strong>Async operations:</strong> Stable references cho async functions</li>
          <li>• <strong>Testing:</strong> Easier to test với consistent function references</li>
        </ul>
      </div>
    </div>
  )
}

export default UseCallbackExample 