'use client'

import { useImperativeHandle, forwardRef, useRef, useState } from 'react'

/**
 * UseImperativeHandleExample - Component demo useImperativeHandle hook
 * 
 * useImperativeHandle cho phép tùy chỉnh ref value được exposed từ component.
 * Thường được dùng với forwardRef để tạo reusable components.
 * 
 * Cú pháp: useImperativeHandle(ref, createHandle, [deps])
 */

// 1. Input Component với imperative methods
interface CustomInputHandle {
  focus: () => void
  clear: () => void
  setValue: (value: string) => void
  getValue: () => string
  validate: () => boolean
}

interface CustomInputProps {
  placeholder?: string
  required?: boolean
  minLength?: number
  onValidation?: (isValid: boolean) => void
}

const CustomInput = forwardRef<CustomInputHandle, CustomInputProps>(
  ({ placeholder, required = false, minLength = 0, onValidation }, ref) => {
    const [value, setValue] = useState('')
    const [isValid, setIsValid] = useState(true)
    const inputRef = useRef<HTMLInputElement>(null)
    
    // Expose imperative methods qua ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus()
      },
      
      clear: () => {
        setValue('')
        setIsValid(true)
        inputRef.current?.focus()
      },
      
      setValue: (newValue: string) => {
        setValue(newValue)
        validateInput(newValue)
      },
      
      getValue: () => {
        return value
      },
      
      validate: () => {
        const valid = validateInput(value)
        return valid
      }
    }), [value, required, minLength]) // Dependencies
    
    const validateInput = (inputValue: string) => {
      let valid = true
      
      if (required && !inputValue.trim()) {
        valid = false
      }
      
      if (minLength > 0 && inputValue.length < minLength) {
        valid = false
      }
      
      setIsValid(valid)
      onValidation?.(valid)
      return valid
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      validateInput(newValue)
    }
    
    return (
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-lg transition-colors ${
            isValid 
              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' 
              : 'border-red-500 focus:ring-2 focus:ring-red-500'
          }`}
        />
        
        {!isValid && (
          <div className="text-red-500 text-sm">
            {required && !value.trim() && 'This field is required'}
            {minLength > 0 && value.length < minLength && 
              `Minimum length is ${minLength} characters`}
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          Current: "{value}" | Length: {value.length} | Valid: {isValid ? '✅' : '❌'}
        </div>
      </div>
    )
  }
)

CustomInput.displayName = 'CustomInput'

// 2. Counter Component với imperative API
interface CounterHandle {
  increment: () => void
  decrement: () => void
  reset: () => void
  setValue: (value: number) => void
  getValue: () => number
}

interface CounterProps {
  initialValue?: number
  min?: number  
  max?: number
  step?: number
}

const Counter = forwardRef<CounterHandle, CounterProps>(
  ({ initialValue = 0, min = -Infinity, max = Infinity, step = 1 }, ref) => {
    const [count, setCount] = useState(initialValue)
    
    useImperativeHandle(ref, () => ({
      increment: () => {
        setCount(prev => Math.min(max, prev + step))
      },
      
      decrement: () => {
        setCount(prev => Math.max(min, prev - step))
      },
      
      reset: () => {
        setCount(initialValue)
      },
      
      setValue: (value: number) => {
        const clampedValue = Math.max(min, Math.min(max, value))
        setCount(clampedValue)
      },
      
      getValue: () => {
        return count
      }
    }), [min, max, step, initialValue])
    
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-3xl font-bold text-gray-800 mb-2">
          {count}
        </div>
        <div className="text-sm text-gray-500">
          Range: {min} to {max} | Step: {step}
        </div>
      </div>
    )
  }
)

Counter.displayName = 'Counter'

// 3. Modal Component với imperative controls
interface ModalHandle {
  show: () => void
  hide: () => void
  toggle: () => void
  isVisible: () => boolean
}

interface ModalProps {
  title: string
  children: React.ReactNode
}

const Modal = forwardRef<ModalHandle, ModalProps>(
  ({ title, children }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    
    useImperativeHandle(ref, () => ({
      show: () => setIsVisible(true),
      hide: () => setIsVisible(false),
      toggle: () => setIsVisible(prev => !prev),
      isVisible: () => isVisible
    }), [isVisible])
    
    if (!isVisible) return null
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div>
            {children}
          </div>
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'

// Main Example Component
const UseImperativeHandleExample = () => {
  // Refs for imperative controls
  const inputRef1 = useRef<CustomInputHandle>(null)
  const inputRef2 = useRef<CustomInputHandle>(null)
  const counterRef = useRef<CounterHandle>(null)
  const modalRef = useRef<ModalHandle>(null)
  
  // States for demo
  const [formValues, setFormValues] = useState({ input1: '', input2: '' })
  const [validationResults, setValidationResults] = useState({ input1: true, input2: true })
  
  // Input control handlers
  const handleFocusInput1 = () => {
    inputRef1.current?.focus()
  }
  
  const handleClearInput1 = () => {
    inputRef1.current?.clear()
  }
  
  const handleSetInput1Value = () => {
    inputRef1.current?.setValue('Preset value from parent!')
  }
  
  const handleGetAllValues = () => {
    const value1 = inputRef1.current?.getValue() || ''
    const value2 = inputRef2.current?.getValue() || ''
    setFormValues({ input1: value1, input2: value2 })
  }
  
  const handleValidateAll = () => {
    const valid1 = inputRef1.current?.validate() || false
    const valid2 = inputRef2.current?.validate() || false
    setValidationResults({ input1: valid1, input2: valid2 })
    
    if (valid1 && valid2) {
      modalRef.current?.show()
    }
  }
  
  // Counter control handlers
  const handleIncrementCounter = () => {
    counterRef.current?.increment()
  }
  
  const handleDecrementCounter = () => {
    counterRef.current?.decrement()
  }
  
  const handleResetCounter = () => {
    counterRef.current?.reset()
  }
  
  const handleSetCounterValue = () => {
    const randomValue = Math.floor(Math.random() * 100)
    counterRef.current?.setValue(randomValue)
  }
  
  const handleGetCounterValue = () => {
    const value = counterRef.current?.getValue()
    alert(`Counter value: ${value}`)
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🔧 useImperativeHandle Hook Examples
      </h2>
      
      {/* Custom Input Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">
          1. Custom Input với Imperative Methods
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Input 1 (Required, min 3 chars):</h4>
            <CustomInput
              ref={inputRef1}
              placeholder="Enter name..."
              required={true}
              minLength={3}
              onValidation={(isValid) => 
                setValidationResults(prev => ({ ...prev, input1: isValid }))
              }
            />
            
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={handleFocusInput1}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Focus
              </button>
              <button
                onClick={handleClearInput1}  
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleSetInput1Value}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Set Value
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Input 2 (Required, min 5 chars):</h4>
            <CustomInput
              ref={inputRef2}
              placeholder="Enter description..."
              required={true}
              minLength={5}
              onValidation={(isValid) => 
                setValidationResults(prev => ({ ...prev, input2: isValid }))
              }
            />
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-3">Form Controls:</h4>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={handleGetAllValues}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
            >
              Get All Values
            </button>
            <button
              onClick={handleValidateAll}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
            >
              Validate & Show Modal
            </button>
          </div>
          
          <div className="text-sm space-y-1">
            <p><strong>Values:</strong> {JSON.stringify(formValues)}</p>
            <p><strong>Validation:</strong> {JSON.stringify(validationResults)}</p>
          </div>
        </div>
      </div>
      
      {/* Counter Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-green-600">
          2. Counter với Imperative API
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Counter
              ref={counterRef}
              initialValue={10}
              min={0}
              max={100}
              step={2}
            />
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Counter Controls:</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleIncrementCounter}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              >
                Increment
              </button>
              <button
                onClick={handleDecrementCounter}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              >
                Decrement
              </button>
              <button
                onClick={handleResetCounter}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleSetCounterValue}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                Random Value
              </button>
              <button
                onClick={handleGetCounterValue}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded col-span-2 transition-colors"
              >
                Get Current Value
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-purple-600">
          3. Modal với Imperative Controls
        </h3>
        
        <div className="flex space-x-3">
          <button
            onClick={() => modalRef.current?.show()}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
          >
            Show Modal
          </button>
          <button
            onClick={() => modalRef.current?.hide()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            Hide Modal
          </button>
          <button
            onClick={() => modalRef.current?.toggle()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Toggle Modal
          </button>
        </div>
      </div>
      
      {/* Modal Component */}
      <Modal ref={modalRef} title="Form Validation Success! 🎉">
        <div className="space-y-4">
          <p className="text-gray-700">
            Congratulations! All form inputs are valid.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="font-medium text-green-800 mb-2">Form Data:</h4>
            <div className="text-sm text-green-700">
              <p><strong>Input 1:</strong> {formValues.input1}</p>
              <p><strong>Input 2:</strong> {formValues.input2}</p>
            </div>
          </div>
          <button
            onClick={() => modalRef.current?.hide()}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
          >
            Close Modal
          </button>
        </div>
      </Modal>
      
      {/* Notes */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
        <h4 className="font-semibold text-yellow-800 mb-3">📝 useImperativeHandle Best Practices:</h4>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-medium text-yellow-700 mb-2">✅ Khi nào nên dùng:</h5>
            <ul className="text-yellow-600 space-y-1">
              <li>• Tạo reusable components với imperative API</li>
              <li>• Integration với third-party libraries</li>
              <li>• Focus management, form controls</li>
              <li>• Animation controls</li>
              <li>• Custom input components</li>
              <li>• Modal, popup controls</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-yellow-700 mb-2">⚠️ Lưu ý quan trọng:</h5>
            <ul className="text-yellow-600 space-y-1">
              <li>• Chỉ dùng khi thật sự cần thiết</li>
              <li>• Prefer declarative patterns</li>
              <li>• Luôn dùng với forwardRef</li>
              <li>• Include dependencies array</li>
              <li>• Document imperative methods</li>
              <li>• Type-safe với TypeScript interfaces</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-yellow-200">
          <h5 className="font-medium text-yellow-700 mb-2">🔧 Pattern Example:</h5>
          <code className="block bg-yellow-100 p-3 rounded text-sm text-yellow-800">
            {`const MyComponent = forwardRef<Handle, Props>((props, ref) => {
  useImperativeHandle(ref, () => ({
    method1: () => { /* implementation */ },
    method2: () => { /* implementation */ }
  }), [dependencies])
  
  return <div>...</div>
})`}
          </code>
        </div>
      </div>
    </div>
  )
}

export default UseImperativeHandleExample 