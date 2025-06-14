### Ref Hooks

#### 4. useRef
**Mục đích**: Tạo reference đến DOM element hoặc lưu trữ mutable value
**Cú pháp**: `const ref = useRef(initialValue)`

```tsx
'use client'
import { useRef, useState } from 'react'

const FocusInput = () => {
  // Tạo ref để tham chiếu đến input element
  const inputRef = useRef<HTMLInputElement>(null)
  // Ref để đếm số lần render (không trigger re-render)
  const renderCount = useRef(0)
  const [text, setText] = useState('')
  
  // Tăng render count mỗi khi component render
  renderCount.current += 1
  
  // Handler để focus vào input
  const handleFocusInput = () => {
    // Sử dụng ref để truy cập DOM element
    inputRef.current?.focus()
  }
  
  // Handler để clear input
  const handleClearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
    setText('')
  }
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">
        Render count: {renderCount.current}
      </h3>
      <input
        ref={inputRef} // Gán ref vào input element
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border border-gray-300 px-3 py-2 rounded mr-2"
        placeholder="Nhập text..."
      />
      <button
        onClick={handleFocusInput}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Focus Input
      </button>
      <button
        onClick={handleClearInput}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Clear
      </button>
    </div>
  )
}
```

#### 5. useImperativeHandle
**Mục đích**: Tùy chỉnh instance value được exposed khi sử dụng ref
**Cú pháp**: `useImperativeHandle(ref, createHandle, deps?)`

```tsx
'use client'
import { forwardRef, useImperativeHandle, useRef } from 'react'

// Interface định nghĩa các method được expose
interface CustomInputHandle {
  focus: () => void
  clear: () => void
  getValue: () => string
}

// Custom Input component với forwardRef
const CustomInput = forwardRef<CustomInputHandle, { placeholder?: string }>(
  ({ placeholder }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    
    // Sử dụng useImperativeHandle để expose custom methods
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus()
      },
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = ''
        }
      },
      getValue: () => {
        return inputRef.current?.value || ''
      }
    }))
    
    return (
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="border border-gray-300 px-3 py-2 rounded"
      />
    )
  }
)

// Parent component sử dụng custom input
const InputController = () => {
  const customInputRef = useRef<CustomInputHandle>(null)
  
  const handleFocus = () => {
    // Gọi custom method từ child component
    customInputRef.current?.focus()
  }
  
  const handleClear = () => {
    customInputRef.current?.clear()
  }
  
  const handleGetValue = () => {
    const value = customInputRef.current?.getValue()
    alert(`Giá trị hiện tại: ${value}`)
  }
  
  return (
    <div className="p-4">
      <CustomInput ref={customInputRef} placeholder="Custom input..." />
      <div className="mt-4 space-x-2">
        <button
          onClick={handleFocus}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Focus
        </button>
        <button
          onClick={handleClear}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
        <button
          onClick={handleGetValue}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Get Value
        </button>
      </div>
    </div>
  )
}
```

### Effect Hooks

#### 6. useEffect
**Mục đích**: Thực hiện side effects trong function component
**Cú pháp**: `useEffect(effect, deps?)`

```tsx
'use client'
import { useEffect, useState } from 'react'

const DataFetcher = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState(0)
  
  // Effect chạy một lần khi component mount
  useEffect(() => {
    console.log('Component mounted')
    
    // Cleanup function chạy khi component unmount
    return () => {
      console.log('Component will unmount')
    }
  }, []) // Empty dependency array = chỉ chạy một lần
  
  // Effect chạy khi count thay đổi
  useEffect(() => {
    console.log(`Count changed to: ${count}`)
    document.title = `Count: ${count}`
    
    // Cleanup previous effect
    return () => {
      document.title = 'React App'
    }
  }, [count]) // Dependency array với count
  
  // Effect để fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        const mockData = [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' }
        ]
        
        setData(mockData)
      } catch (err) {
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, []) // Chỉ fetch một lần khi component mount
  
  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Data Fetcher</h3>
      
      <div className="mb-4">
        <span className="mr-4">Count: {count}</span>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Increment
        </button>
      </div>
      
      {loading && (
        <div className="text-blue-500">Loading data...</div>
      )}
      
      {error && (
        <div className="text-red-500">Error: {error}</div>
      )}
      
      {!loading && !error && (
        <ul className="list-disc list-inside">
          {data.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

#### 7. useLayoutEffect
**Mục đích**: Chạy synchronously sau tất cả DOM mutations
**Cú pháp**: `useLayoutEffect(effect, deps?)`

```tsx
'use client'
import { useLayoutEffect, useRef, useState } from 'react'

const LayoutEffectExample = () => {
  const [show, setShow] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)
  
  // useLayoutEffect chạy trước khi browser paint
  useLayoutEffect(() => {
    if (show && divRef.current) {
      // Đo kích thước element ngay sau khi DOM update
      const rect = divRef.current.getBoundingClientRect()
      console.log('Element dimensions:', rect)
      
      // Có thể modify style trước khi browser paint
      divRef.current.style.backgroundColor = 'lightblue'
    }
  }, [show])
  
  // useEffect sẽ chạy sau khi browser paint
  useEffect(() => {
    console.log('useEffect runs after paint')
  }, [show])
  
  return (
    <div className="p-4">
      <button
        onClick={() => setShow(!show)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        {show ? 'Hide' : 'Show'} Element
      </button>
      
      {show && (
        <div
          ref={divRef}
          className="w-32 h-32 border border-gray-400 p-4"
        >
          Measured element
        </div>
      )}
    </div>
  )
} 