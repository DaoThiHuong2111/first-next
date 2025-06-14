'use client'

import { useState } from 'react'

/**
 * UseStateExample - Component demo useState hook
 * 
 * useState là hook cơ bản nhất trong React để quản lý state trong function component.
 * Nó trả về một mảng với 2 phần tử: [state, setState]
 * 
 * Cú pháp: const [state, setState] = useState(initialValue)
 */
const UseStateExample = () => {
  // 1. State đơn giản cho counter
  const [count, setCount] = useState(0)
  
  // 2. State cho string
  const [name, setName] = useState('')
  
  // 3. State cho object
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  })
  
  // 4. State cho array
  const [items, setItems] = useState<string[]>([])
  const [newItem, setNewItem] = useState('')
  
  // 5. State cho boolean
  const [isVisible, setIsVisible] = useState(false)
  
  // Handlers cho counter
  const handleIncrement = () => {
    // Cách 1: Cập nhật trực tiếp
    setCount(count + 1)
  }
  
  const handleDecrement = () => {
    // Cách 2: Sử dụng function updater (recommended khi dựa vào previous state)
    setCount(prevCount => prevCount - 1)
  }
  
  const handleReset = () => {
    setCount(0)
  }
  
  // Handler cho user object
  const handleUserChange = (field: keyof typeof user, value: string | number) => {
    // Cập nhật object state - phải tạo object mới (immutable)
    setUser(prevUser => ({
      ...prevUser, // Spread operator để giữ các field khác
      [field]: value // Cập nhật field cụ thể
    }))
  }
  
  // Handlers cho array
  const handleAddItem = () => {
    if (newItem.trim()) {
      // Thêm item vào array - tạo array mới
      setItems(prevItems => [...prevItems, newItem.trim()])
      setNewItem('') // Clear input
    }
  }
  
  const handleRemoveItem = (index: number) => {
    // Xóa item khỏi array - tạo array mới
    setItems(prevItems => prevItems.filter((_, i) => i !== index))
  }
  
  const handleClearItems = () => {
    setItems([])
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🎯 useState Hook Examples
      </h2>
      
      {/* 1. Counter Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">
          1. Counter với Number State
        </h3>
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-gray-700">
            Count: {count}
          </span>
          <button
            onClick={handleIncrement}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            +1
          </button>
          <button
            onClick={handleDecrement}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            -1
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* 2. String Input Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-green-600">
          2. Text Input với String State
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên của bạn..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-gray-700">
            <strong>Tên hiện tại:</strong> {name || '(chưa nhập)'}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Độ dài:</strong> {name.length} ký tự
          </p>
        </div>
      </div>
      
      {/* 3. Object State Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-purple-600">
          3. Form với Object State
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Tên"
            value={user.name}
            onChange={(e) => handleUserChange('name', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => handleUserChange('email', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="Tuổi"
            value={user.age || ''}
            onChange={(e) => handleUserChange('age', parseInt(e.target.value) || 0)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        {/* Hiển thị thông tin user */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Thông tin User:</h4>
          <pre className="text-sm text-purple-700">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
      
      {/* 4. Array State Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-orange-600">
          4. Todo List với Array State
        </h3>
        
        {/* Add new item */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Thêm item mới..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <button
            onClick={handleAddItem}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Thêm
          </button>
          <button
            onClick={handleClearItems}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
        
        {/* Items list */}
        <div className="space-y-2">
          <p className="font-semibold text-gray-700">
            Items ({items.length}):
          </p>
          {items.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có items nào</p>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-orange-50 p-3 rounded-lg"
              >
                <span className="text-gray-700">{item}</span>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Xóa
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* 5. Boolean State Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">
          5. Visibility Toggle với Boolean State
        </h3>
        
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors mb-4"
        >
          {isVisible ? 'Ẩn' : 'Hiện'} Content
        </button>
        
        {/* Conditional rendering dựa trên boolean state */}
        {isVisible && (
          <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
            <h4 className="font-semibold text-indigo-800 mb-2">
              🎉 Content được hiển thị!
            </h4>
            <p className="text-indigo-700">
              Đây là content chỉ hiển thị khi isVisible = true. 
              Boolean state rất hữu ích để điều khiển việc hiển thị/ẩn components,
              toggles, modals, accordions, và nhiều UI patterns khác.
            </p>
          </div>
        )}
      </div>
      
      {/* Notes */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">📝 Lưu ý quan trọng:</h4>
        <ul className="text-yellow-700 space-y-1 text-sm">
          <li>• State là immutable - luôn tạo giá trị mới thay vì mutate</li>
          <li>• Sử dụng function updater khi state mới phụ thuộc vào state cũ</li>
          <li>• Với object/array, sử dụng spread operator (...) để tạo copy</li>
          <li>• State update là asynchronous - không expect giá trị mới ngay lập tức</li>
          <li>• Mỗi state update sẽ trigger re-render component</li>
        </ul>
      </div>
    </div>
  )
}

export default UseStateExample 