'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * useRouter Hook Example - Next.js App Router
 * 
 * Hook này cung cấp các method để điều hướng programmatically trong Next.js App Router.
 * Khác với Pages Router, App Router sử dụng useRouter từ 'next/navigation'.
 * 
 * Các method chính:
 * - push(href): Điều hướng đến route mới (thêm vào history)
 * - replace(href): Thay thế route hiện tại (không thêm vào history)
 * - refresh(): Reload route hiện tại
 * - back(): Quay lại trang trước
 * - forward(): Tiến tới trang tiếp theo
 * - prefetch(href): Prefetch route để load nhanh hơn
 */

interface NavigationItem {
  path: string
  label: string
  description: string
  icon: string
}

const navigationItems: NavigationItem[] = [
  {
    path: '/',
    label: 'Home',
    description: 'Trang chủ',
    icon: '🏠'
  },
  {
    path: '/about',
    label: 'About',
    description: 'Giới thiệu',
    icon: 'ℹ️'
  },
  {
    path: '/products',
    label: 'Products',
    description: 'Sản phẩm',
    icon: '📦'
  },
  {
    path: '/products/1',
    label: 'Product Detail',
    description: 'Chi tiết sản phẩm',
    icon: '🔍'
  },
  {
    path: '/contact?tab=general',
    label: 'Contact',
    description: 'Liên hệ với query params',
    icon: '📞'
  }
]

const UseRouterExample = () => {
  const router = useRouter()
  const [currentPath, setCurrentPath] = useState<string>('')
  const [isNavigating, setIsNavigating] = useState<boolean>(false)
  
  /**
   * Điều hướng với push() - thêm vào history stack
   */
  const handlePushNavigation = (path: string) => {
    setIsNavigating(true)
    setCurrentPath(path)
    
    // Simulate navigation delay
    setTimeout(() => {
      router.push(path)
      setIsNavigating(false)
    }, 500)
  }
  
  /**
   * Điều hướng với replace() - thay thế entry hiện tại
   */
  const handleReplaceNavigation = (path: string) => {
    setIsNavigating(true)
    setCurrentPath(path)
    
    setTimeout(() => {
      router.replace(path)
      setIsNavigating(false)
    }, 500)
  }
  
  /**
   * Dynamic route navigation với parameters
   */
  const handleDynamicNavigation = () => {
    const userId = Math.floor(Math.random() * 100) + 1
    const productId = Math.floor(Math.random() * 50) + 1
    
    setIsNavigating(true)
    
    setTimeout(() => {
      router.push(`/users/${userId}/products/${productId}`)
      setIsNavigating(false)
    }, 500)
  }
  
  /**
   * Navigation với query parameters
   */
  const handleQueryNavigation = () => {
    const searchQuery = 'react+hooks'
    const page = Math.floor(Math.random() * 10) + 1
    const sort = ['name', 'date', 'popularity'][Math.floor(Math.random() * 3)]
    
    setIsNavigating(true)
    
    setTimeout(() => {
      router.push(`/search?q=${searchQuery}&page=${page}&sort=${sort}`)
      setIsNavigating(false)
    }, 500)
  }
  
  /**
   * Prefetch route để cải thiện performance
   */
  const handlePrefetchRoute = (path: string) => {
    router.prefetch(path)
    alert(`🚀 Đã prefetch route: ${path}`)
  }
  
  /**
   * Browser history navigation
   */
  const handleHistoryNavigation = (direction: 'back' | 'forward') => {
    setIsNavigating(true)
    
    if (direction === 'back') {
      router.back()
    } else {
      router.forward()
    }
    
    setTimeout(() => setIsNavigating(false), 500)
  }
  
  /**
   * Refresh current route
   */
  const handleRefresh = () => {
    setIsNavigating(true)
    router.refresh()
    setTimeout(() => setIsNavigating(false), 500)
  }
  
  /**
   * Complex navigation với conditional logic
   */
  const handleConditionalNavigation = () => {
    const userRole = ['admin', 'user', 'guest'][Math.floor(Math.random() * 3)]
    
    setIsNavigating(true)
    
    let targetPath = '/'
    
    switch (userRole) {
      case 'admin':
        targetPath = '/admin/dashboard'
        break
      case 'user':
        targetPath = '/dashboard'
        break
      case 'guest':
        targetPath = '/login'
        break
    }
    
    setTimeout(() => {
      router.push(targetPath)
      setIsNavigating(false)
    }, 500)
    
    alert(`👤 User role: ${userRole} → Điều hướng đến: ${targetPath}`)
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🧭 useRouter Hook Example
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hook để điều hướng programmatically trong Next.js App Router. 
          Cung cấp các method push(), replace(), back(), forward(), refresh() và prefetch().
        </p>
      </div>
      
      {/* Loading Indicator */}
      {isNavigating && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Đang điều hướng...</span>
          </div>
        </div>
      )}
      
      {/* Current Path Display */}
      {currentPath && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                🎯 <strong>Đang điều hướng đến:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{currentPath}</code>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 1. Basic Navigation với push() */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          📍 1. Basic Navigation với push()
        </h3>
        <p className="text-gray-600 mb-4">
          Method <code>push()</code> điều hướng đến route mới và thêm entry vào browser history.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handlePushNavigation(item.path)}
              disabled={isNavigating}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors disabled:opacity-50"
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* 2. Replace Navigation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          🔄 2. Replace Navigation
        </h3>
        <p className="text-gray-600 mb-4">
          Method <code>replace()</code> thay thế route hiện tại thay vì thêm vào history.
        </p>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleReplaceNavigation('/login')}
            disabled={isNavigating}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            🔐 Replace với Login
          </button>
          <button
            onClick={() => handleReplaceNavigation('/dashboard')}
            disabled={isNavigating}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            📊 Replace với Dashboard
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-700">
            💡 <strong>Khác biệt:</strong> replace() không thêm entry vào history, 
            nên user không thể quay lại trang trước bằng nút Back.
          </p>
        </div>
      </div>
      
      {/* 3. Dynamic Routes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          🎲 3. Dynamic Routes Navigation
        </h3>
        <p className="text-gray-600 mb-4">
          Điều hướng đến dynamic routes với parameters được generate ngẫu nhiên.
        </p>
        
        <button
          onClick={handleDynamicNavigation}
          disabled={isNavigating}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
        >
          🎯 Điều hướng đến User Profile ngẫu nhiên
        </button>
        
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700">
            <strong>Example:</strong> <code>/users/[userId]/products/[productId]</code>
          </p>
        </div>
      </div>
      
      {/* 4. Query Parameters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          🔍 4. Query Parameters Navigation
        </h3>
        <p className="text-gray-600 mb-4">
          Điều hướng với URL search parameters để truyền data.
        </p>
        
        <button
          onClick={handleQueryNavigation}
          disabled={isNavigating}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          🔎 Search với Query Parameters
        </button>
        
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Example:</strong> <code>/search?q=react+hooks&page=3&sort=popularity</code>
          </p>
        </div>
      </div>
      
      {/* 5. Browser History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          ⏪ 5. Browser History Navigation
        </h3>
        <p className="text-gray-600 mb-4">
          Điều khiển browser history với back() và forward().
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={() => handleHistoryNavigation('back')}
            disabled={isNavigating}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
          >
            ⬅️ Go Back
          </button>
          <button
            onClick={() => handleHistoryNavigation('forward')}
            disabled={isNavigating}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
          >
            ➡️ Go Forward
          </button>
          <button
            onClick={handleRefresh}
            disabled={isNavigating}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
      
      {/* 6. Prefetch Routes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          🚀 6. Route Prefetching
        </h3>
        <p className="text-gray-600 mb-4">
          Prefetch routes để cải thiện performance bằng cách load trước.
        </p>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePrefetchRoute('/products')}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            🚀 Prefetch Products
          </button>
          <button
            onClick={() => handlePrefetchRoute('/about')}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            🚀 Prefetch About
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-700">
            💡 <strong>Performance tip:</strong> Prefetch các routes mà user có khả năng visit để giảm loading time.
          </p>
        </div>
      </div>
      
      {/* 7. Conditional Navigation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          🎭 7. Conditional Navigation
        </h3>
        <p className="text-gray-600 mb-4">
          Navigation dựa trên logic điều kiện (user role, authentication, etc).
        </p>
        
        <button
          onClick={handleConditionalNavigation}
          disabled={isNavigating}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          🎭 Navigate theo User Role
        </button>
        
        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-700">
            <strong>Logic:</strong> Admin → /admin/dashboard, User → /dashboard, Guest → /login
          </p>
        </div>
      </div>
      
      {/* Best Practices */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          💡 Best Practices cho useRouter
        </h3>
        <ul className="space-y-2 text-sm text-yellow-700">
          <li>• <strong>push() vs replace():</strong> Dùng push() cho navigation thông thường, replace() cho redirect</li>
          <li>• <strong>Prefetch:</strong> Prefetch các routes quan trọng để cải thiện UX</li>
          <li>• <strong>Loading states:</strong> Luôn hiển thị loading indicator khi navigate</li>
          <li>• <strong>Error handling:</strong> Xử lý lỗi navigation gracefully</li>
          <li>• <strong>Conditional navigation:</strong> Check permissions trước khi navigate</li>
          <li>• <strong>Query params:</strong> Encode special characters trong query string</li>
        </ul>
      </div>
    </div>
  )
}

export default UseRouterExample 