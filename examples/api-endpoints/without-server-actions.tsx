'use client' // 🔥 BẮT BUỘC: Component này cần chạy trên client để handle state

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 📱 COMPONENT SỬ DỤNG API ENDPOINTS (Cách truyền thống)
 * 
 * Phức tạp hơn vì phải:
 * - Quản lý loading state thủ công
 * - Quản lý error state thủ công  
 * - Handle form submission thủ công
 * - Gọi API endpoint thủ công
 * - Handle redirect thủ công
 */
export default function CreateUserWithoutServerAction() {
  // 🔄 STATE MANAGEMENT: Phải tự quản lý tất cả states
  const [isLoading, setIsLoading] = useState(false) // Loading state
  const [error, setError] = useState('') // Error state
  const router = useRouter() // Router để redirect

  /**
   * 📝 FORM SUBMIT HANDLER - Phải tự code tất cả logic
   * 
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // 🛑 Prevent default form submission behavior
    e.preventDefault()
    
    // 🔄 Manually set loading state
    setIsLoading(true)
    setError('') // Clear previous errors

    // 📝 Manually extract form data
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string

    try {
      // 🌐 MANUAL API CALL - Phải tự gọi fetch()
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Phải set headers thủ công
        },
        body: JSON.stringify({ name, email }), // Phải serialize data
      })

      // ❌ MANUAL ERROR HANDLING - Phải tự check response status
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Không thể tạo user')
      }

      // 📦 Parse response data
      const user = await response.json()
      console.log('User created:', user)
      
      // 🚀 MANUAL REDIRECT - Phải tự điều hướng
      router.push('/users')
      router.refresh() // Phải tự refresh để update cache
      
    } catch (error) {
      // 💥 MANUAL ERROR STATE UPDATE
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra')
    } finally {
      // 🔄 MANUAL LOADING STATE UPDATE - Phải tự tắt loading
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Tạo User - API Endpoints
      </h2>
      
      {/* 
        📝 FORM VỚI MANUAL SUBMIT HANDLER
        - onSubmit={handleSubmit}: Phải tự định nghĩa handler
        - Không có action prop như Server Actions
      */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tên
          </label>
          {/* 
            🔒 MANUAL LOADING STATE
            - disabled={isLoading}: Phải tự disable khi loading
            - CSS class phải tự handle disabled state
          */}
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={isLoading} // 🔄 Phải tự disable khi loading
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={isLoading} // 🔄 Phải tự disable khi loading
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
        
        {/* 
          💥 MANUAL ERROR DISPLAY
          - Phải tự check và hiển thị error
          - Phải tự styling cho error state
        */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {/* 
          🚀 MANUAL BUTTON STATE
          - disabled={isLoading}: Phải tự disable
          - {isLoading ? ...}: Phải tự change text
          - disabled CSS classes phải tự handle  
        */}
        <button
          type="submit"
          disabled={isLoading} // 🔄 Phải tự disable khi loading
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {/* 📝 MANUAL LOADING TEXT - Phải tự thay đổi text */}
          {isLoading ? 'Đang tạo...' : 'Tạo User'}
        </button>
      </form>
      
      <div className="mt-4 p-3 bg-red-50 rounded-md">
        <h3 className="text-sm font-medium text-red-800">❌ Nhược điểm API Endpoints:</h3>
        <ul className="text-sm text-red-700 mt-1 space-y-1">
          <li>• Cần tạo API endpoint riêng (/api/users)</li>
          <li>• Nhiều boilerplate code</li>
          <li>• Phải handle loading state thủ công</li>
          <li>• Phải handle error thủ công</li>
          <li>• Cần client-side logic phức tạp</li>
        </ul>
      </div>
    </div>
  )
}
