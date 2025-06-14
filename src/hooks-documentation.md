# Tài liệu về React và Next.js Hooks

## Tổng quan về Hooks

Hooks là một tính năng trong React cho phép bạn sử dụng state và các tính năng khác của React mà không cần viết class component. Hooks phải tuân theo một số quy tắc quan trọng:

### Quy tắc của Hooks (Rules of Hooks)

1. **Chỉ gọi Hooks ở top level**: Không gọi Hooks trong loops, conditions, hoặc nested functions
2. **Chỉ gọi Hooks từ React functions**: Chỉ gọi từ function components hoặc custom hooks

## React Built-in Hooks

### State Hooks

#### 1. useState
**Mục đích**: Quản lý state trong function component
**Cú pháp**: `const [state, setState] = useState(initialValue)`

```tsx
'use client'
import { useState } from 'react'

const Counter = () => {
  // Khởi tạo state count với giá trị ban đầu là 0
  const [count, setCount] = useState(0)
  
  // Handler cho việc tăng counter
  const handleIncrement = () => {
    setCount(count + 1) // Cập nhật state
  }
  
  // Handler cho việc giảm counter  
  const handleDecrement = () => {
    setCount(prevCount => prevCount - 1) // Sử dụng function updater
  }
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Counter: {count}</h2>
      <button 
        onClick={handleIncrement}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Tăng
      </button>
      <button 
        onClick={handleDecrement}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Giảm
      </button>
    </div>
  )
}
```

#### 2. useReducer
**Mục đích**: Quản lý state phức tạp với reducer function
**Cú pháp**: `const [state, dispatch] = useReducer(reducer, initialState)`

```tsx
'use client'
import { useReducer } from 'react'

// Định nghĩa các action types
type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }

// Reducer function để xử lý state updates
const counterReducer = (state: number, action: Action): number => {
  switch (action.type) {
    case 'increment':
      return state + 1
    case 'decrement':
      return state - 1
    case 'reset':
      return 0
    default:
      return state
  }
}

const CounterWithReducer = () => {
  // Sử dụng useReducer với reducer function và initial state
  const [count, dispatch] = useReducer(counterReducer, 0)
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Count: {count}</h2>
      <button 
        onClick={() => dispatch({ type: 'increment' })}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      >
        Tăng
      </button>
      <button 
        onClick={() => dispatch({ type: 'decrement' })}
        className="bg-orange-500 text-white px-4 py-2 rounded mr-2"
      >
        Giảm
      </button>
      <button 
        onClick={() => dispatch({ type: 'reset' })}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Reset
      </button>
    </div>
  )
}
```

### Context Hooks

#### 3. useContext
**Mục đích**: Đọc và subscribe vào context
**Cú pháp**: `const value = useContext(MyContext)`

```tsx
'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

// Tạo Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme Provider component
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook để sử dụng theme context
const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Component sử dụng context
const ThemedButton = () => {
  // Sử dụng useContext để lấy theme từ context
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className={`px-4 py-2 rounded ${
        theme === 'light' 
          ? 'bg-white text-black border border-gray-300' 
          : 'bg-gray-800 text-white'
      }`}
    >
      Theme hiện tại: {theme}
    </button>
  )
}
``` 