'use client'

import { useReducer } from 'react'

/**
 * UseReducerExample - Component demo useReducer hook
 * 
 * useReducer là hook để quản lý state phức tạp với reducer pattern.
 * Phù hợp khi state có logic phức tạp hoặc multiple sub-values.
 * 
 * Cú pháp: const [state, dispatch] = useReducer(reducer, initialState)
 */

// 1. Định nghĩa types cho counter reducer
interface CounterState {
  count: number
  step: number
}

type CounterAction = 
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'ADD_STEP' }

// Counter reducer function
const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'INCREMENT':
      // Tăng count theo step hiện tại
      return { ...state, count: state.count + state.step }
    
    case 'DECREMENT':
      // Giảm count theo step hiện tại
      return { ...state, count: state.count - state.step }
    
    case 'RESET':
      // Reset count về 0, giữ nguyên step
      return { ...state, count: 0 }
    
    case 'SET_STEP':
      // Cập nhật step size
      return { ...state, step: action.payload }
    
    case 'ADD_STEP':
      // Thêm step vào count
      return { ...state, count: state.count + state.step }
    
    default:
      // Trả về state hiện tại nếu action không được nhận diện
      return state
  }
}

// 2. Định nghĩa types cho todo reducer
interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
}

type TodoAction = 
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'completed' }
  | { type: 'CLEAR_COMPLETED' }

// Todo reducer function
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'ADD_TODO':
      // Thêm todo mới với ID duy nhất
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(), // Simple ID generation
            text: action.payload,
            completed: false
          }
        ]
      }
    
    case 'TOGGLE_TODO':
      // Toggle completed status của todo
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      }
    
    case 'DELETE_TODO':
      // Xóa todo theo ID
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      }
    
    case 'SET_FILTER':
      // Cập nhật filter
      return {
        ...state,
        filter: action.payload
      }
    
    case 'CLEAR_COMPLETED':
      // Xóa tất cả todos đã completed
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      }
    
    default:
      return state
  }
}

const UseReducerExample = () => {
  // 1. Counter reducer usage
  const [counterState, counterDispatch] = useReducer(counterReducer, {
    count: 0,
    step: 1
  })
  
  // 2. Todo reducer usage
  const [todoState, todoDispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all'
  })
  
  // Filtered todos based on current filter
  const filteredTodos = todoState.todos.filter(todo => {
    switch (todoState.filter) {
      case 'active':
        return !todo.completed
      case 'completed':
        return todo.completed
      default:
        return true
    }
  })
  
  // Statistics
  const totalTodos = todoState.todos.length
  const completedTodos = todoState.todos.filter(todo => todo.completed).length
  const activeTodos = totalTodos - completedTodos
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        ⚙️ useReducer Hook Examples
      </h2>
      
      {/* Counter Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">
          1. Advanced Counter với Multiple Actions
        </h3>
        
        <div className="space-y-4">
          {/* Current state display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-800">
              Count: {counterState.count}
            </div>
            <div className="text-sm text-blue-600">
              Step size: {counterState.step}
            </div>
          </div>
          
          {/* Step size control */}
          <div className="flex items-center space-x-4">
            <label className="font-medium text-gray-700">Step size:</label>
            <input
              type="number"
              min="1"
              value={counterState.step}
              onChange={(e) => counterDispatch({ 
                type: 'SET_STEP', 
                payload: parseInt(e.target.value) || 1 
              })}
              className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => counterDispatch({ type: 'INCREMENT' })}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            >
              +{counterState.step} (INCREMENT)
            </button>
            
            <button
              onClick={() => counterDispatch({ type: 'DECREMENT' })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              -{counterState.step} (DECREMENT)
            </button>
            
            <button
              onClick={() => counterDispatch({ type: 'ADD_STEP' })}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
            >
              +{counterState.step} (ADD_STEP)
            </button>
            
            <button
              onClick={() => counterDispatch({ type: 'RESET' })}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Reset (RESET)
            </button>
          </div>
        </div>
      </div>
      
      {/* Todo Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-green-600">
          2. Todo App với Complex State Management
        </h3>
        
        {/* Add new todo */}
        <div className="mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const text = formData.get('todoText') as string
              if (text.trim()) {
                todoDispatch({ type: 'ADD_TODO', payload: text.trim() })
                e.currentTarget.reset()
              }
            }}
            className="flex space-x-2"
          >
            <input
              name="todoText"
              type="text"
              placeholder="Thêm todo mới..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Thêm
            </button>
          </form>
        </div>
        
        {/* Statistics */}
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{totalTodos}</div>
              <div className="text-sm text-green-500">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{activeTodos}</div>
              <div className="text-sm text-blue-500">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{completedTodos}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>
        
        {/* Filter buttons */}
        <div className="flex space-x-2 mb-4">
          {(['all', 'active', 'completed'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => todoDispatch({ type: 'SET_FILTER', payload: filter })}
              className={`px-4 py-2 rounded transition-colors ${
                todoState.filter === filter
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
          
          {completedTodos > 0 && (
            <button
              onClick={() => todoDispatch({ type: 'CLEAR_COMPLETED' })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors ml-4"
            >
              Clear Completed
            </button>
          )}
        </div>
        
        {/* Todo list */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">
              {todoState.filter === 'all' 
                ? 'Chưa có todos nào' 
                : `Không có todos ${todoState.filter}`}
            </p>
          ) : (
            filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  todo.completed 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => todoDispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                
                <span
                  className={`flex-1 ${
                    todo.completed 
                      ? 'line-through text-gray-500' 
                      : 'text-gray-800'
                  }`}
                >
                  {todo.text}
                </span>
                
                <button
                  onClick={() => todoDispatch({ type: 'DELETE_TODO', payload: todo.id })}
                  className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Xóa
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Notes */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
        <h4 className="font-semibold text-yellow-800 mb-3">📝 useReducer vs useState:</h4>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-medium text-yellow-700 mb-2">✅ Dùng useReducer khi:</h5>
            <ul className="text-yellow-600 space-y-1">
              <li>• State có cấu trúc phức tạp (nested objects/arrays)</li>
              <li>• Logic cập nhật state phức tạp</li>
              <li>• Multiple related state values</li>
              <li>• Cần predictable state transitions</li>
              <li>• Dễ test logic trong reducer</li>
              <li>• State transitions có thể trace được</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-yellow-700 mb-2">✅ Dùng useState khi:</h5>
            <ul className="text-yellow-600 space-y-1">
              <li>• State đơn giản (primitives)</li>
              <li>• Logic cập nhật đơn giản</li>
              <li>• Independent state values</li>
              <li>• Component nhỏ, ít logic</li>
              <li>• Không cần trace state changes</li>
              <li>• Performance không quan trọng</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-yellow-200">
          <h5 className="font-medium text-yellow-700 mb-2">🔧 Reducer Pattern Benefits:</h5>
          <ul className="text-yellow-600 space-y-1 text-sm">
            <li>• <strong>Centralized Logic:</strong> Tất cả state updates ở một nơi</li>
            <li>• <strong>Type Safety:</strong> Actions có types rõ ràng</li>
            <li>• <strong>Debugging:</strong> Dễ trace qua action logs</li>
            <li>• <strong>Testing:</strong> Reducer là pure function, dễ test</li>
            <li>• <strong>Predictability:</strong> Same action + state = same result</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UseReducerExample 