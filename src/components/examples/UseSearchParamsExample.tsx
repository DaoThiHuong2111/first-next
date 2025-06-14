'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'

/**
 * useSearchParams Hook Example - Next.js App Router
 * 
 * Hook này cung cấp interface để đọc và manipulate URL search parameters (query string).
 * Rất hữu ích cho:
 * - Search functionality với filters
 * - Pagination
 * - Sorting và filtering data
 * - Sharing URLs với state
 * - Form state trong URL
 */

interface SearchFilter {
  category: string
  minPrice: number
  maxPrice: number
  inStock: boolean
  sortBy: 'name' | 'price' | 'date'
  sortOrder: 'asc' | 'desc'
}

interface PaginationState {
  page: number
  limit: number
  total: number
}

const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports']
const sortOptions = [
  { value: 'name', label: 'Tên sản phẩm' },
  { value: 'price', label: 'Giá' },
  { value: 'date', label: 'Ngày tạo' }
]

const UseSearchParamsExample = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // State để demo search functionality
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<string[]>([])
  
  // Filters state từ URL params
  const [filters, setFilters] = useState<SearchFilter>({
    category: searchParams.get('category') || 'All',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 1000,
    inStock: searchParams.get('inStock') === 'true',
    sortBy: (searchParams.get('sortBy') as 'name' | 'price' | 'date') || 'name',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc'
  })
  
  // Pagination state từ URL params
  const [pagination, setPagination] = useState<PaginationState>({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    total: 100 // Mock total
  })

  /**
   * Update URL params mà không trigger page reload
   */
  const updateURLParams = useCallback((newParams: Record<string, string | number | boolean>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })
    
    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, router, pathname])

  /**
   * Clear specific parameter
   */
  const clearParam = useCallback((paramName: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(paramName)
    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, router, pathname])

  /**
   * Clear all parameters
   */
  const clearAllParams = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  /**
   * Handle search functionality
   */
  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true)
    updateURLParams({ q: query, page: 1 }) // Reset page khi search mới
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = query 
        ? [`Kết quả 1 cho "${query}"`, `Kết quả 2 cho "${query}"`, `Kết quả 3 cho "${query}"`]
        : []
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 1000)
  }, [updateURLParams])

  /**
   * Handle filter changes
   */
  const handleFilterChange = useCallback((key: keyof SearchFilter, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Update URL with new filter
    updateURLParams({
      ...newFilters,
      page: 1 // Reset page khi filter thay đổi
    })
  }, [filters, updateURLParams])

  /**
   * Handle pagination changes
   */
  const handlePageChange = useCallback((newPage: number) => {
    const newPagination = { ...pagination, page: newPage }
    setPagination(newPagination)
    updateURLParams({ page: newPage })
  }, [pagination, updateURLParams])

  /**
   * Advanced search với multiple parameters
   */
  const handleAdvancedSearch = useCallback(() => {
    const advancedParams = {
      q: 'advanced search',
      category: 'Electronics',
      minPrice: 100,
      maxPrice: 500,
      inStock: true,
      sortBy: 'price',
      sortOrder: 'desc',
      page: 1,
      tags: 'featured,popular',
      source: 'advanced-search'
    }
    
    updateURLParams(advancedParams)
  }, [updateURLParams])

  /**
   * Convert search params to readable format
   */
  const getParamsArray = () => {
    const params: Array<{ key: string; value: string }> = []
    searchParams.forEach((value, key) => {
      params.push({ key, value })
    })
    return params
  }

  /**
   * Check if specific param exists
   */
  const hasParam = (paramName: string) => searchParams.has(paramName)

  /**
   * Get all param names
   */
  const getParamNames = () => Array.from(searchParams.keys())

  /**
   * Export current state as shareable URL
   */
  const getShareableURL = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${pathname}?${searchParams.toString()}`
    }
    return ''
  }

  // Effect để sync state với URL params khi component mount
  useEffect(() => {
    const query = searchParams.get('q')
    if (query && query !== searchQuery) {
      setSearchQuery(query)
      handleSearch(query)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const paramsArray = getParamsArray()
  const paramNames = getParamNames()
  const shareableURL = getShareableURL()

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🔍 useSearchParams Hook Example
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hook để đọc và manipulate URL search parameters. 
          Rất hữu ích cho search, filtering, pagination và sharing URL state.
        </p>
      </div>

      {/* Current Search Params Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">
          📊 Current Search Parameters
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-3">Active Parameters:</h4>
            {paramsArray.length > 0 ? (
              <ul className="space-y-2">
                {paramsArray.map(({ key, value }) => (
                  <li key={key} className="flex items-center justify-between bg-blue-100 p-2 rounded">
                    <span className="font-medium">{key}:</span>
                    <code className="text-sm bg-blue-200 px-2 py-1 rounded">{value}</code>
                    <button
                      onClick={() => clearParam(key)}
                      className="text-red-600 hover:text-red-800 ml-2"
                      title="Xóa parameter này"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-blue-600 italic">Không có parameters nào</p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-blue-800 mb-3">Parameter Info:</h4>
            <ul className="space-y-1 text-sm">
              <li><strong>Total params:</strong> {paramsArray.length}</li>
              <li><strong>Param names:</strong> {paramNames.join(', ') || 'None'}</li>
              <li><strong>Has search:</strong> {hasParam('q') ? 'Yes' : 'No'}</li>
              <li><strong>Has pagination:</strong> {hasParam('page') ? 'Yes' : 'No'}</li>
            </ul>
            
            {paramsArray.length > 0 && (
              <button
                onClick={clearAllParams}
                className="mt-3 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                🗑️ Clear All Parameters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Functionality */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🔎 Search Functionality
        </h3>
        <p className="text-gray-600 mb-4">
          Search query được sync với URL parameter 'q'.
        </p>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Nhập từ khóa tìm kiếm..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              disabled={isSearching}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSearching ? '🔄 Searching...' : '🔍 Search'}
            </button>
          </div>
          
          {/* Quick Search Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Quick searches:</span>
            {['React hooks', 'Next.js', 'TypeScript', 'TailwindCSS'].map(term => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term)
                  handleSearch(term)
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
              >
                {term}
              </button>
            ))}
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Search Results:</h4>
              <ul className="space-y-1">
                {searchResults.map((result, index) => (
                  <li key={index} className="text-sm text-green-700">• {result}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🎛️ Advanced Filters
        </h3>
        <p className="text-gray-600 mb-4">
          Các filters được sync với URL parameters để có thể share và bookmark.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục:
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá từ: ${filters.minPrice}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá đến: ${filters.maxPrice}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* In Stock Filter */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Chỉ hàng có sẵn</span>
            </label>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sắp xếp theo:
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thứ tự:
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          📄 Pagination
        </h3>
        <p className="text-gray-600 mb-4">
          Pagination state được sync với URL parameter 'page'.
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              ⬅️ Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm rounded ${
                      pageNum === pagination.page
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next ➡️
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🚀 Advanced Search Params Features
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Preset Searches */}
          <div>
            <h4 className="font-medium mb-3">🎯 Preset Searches:</h4>
            <div className="space-y-2">
              <button
                onClick={handleAdvancedSearch}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                🔍 Advanced Search Demo
              </button>
              <button
                onClick={() => updateURLParams({
                  category: 'Electronics',
                  inStock: true,
                  sortBy: 'price',
                  sortOrder: 'asc'
                })}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                📱 Electronics Filter
              </button>
              <button
                onClick={() => updateURLParams({
                  minPrice: 0,
                  maxPrice: 100,
                  sortBy: 'price',
                  sortOrder: 'asc'
                })}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                💰 Budget Items
              </button>
            </div>
          </div>

          {/* URL Sharing */}
          <div>
            <h4 className="font-medium mb-3">🔗 URL Sharing:</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shareable URL:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={shareableURL}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l text-sm bg-gray-50"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareableURL)
                      alert('URL copied to clipboard!')
                    }}
                    className="px-3 py-2 bg-gray-500 text-white rounded-r text-sm hover:bg-gray-600"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                💡 URL này chứa tất cả current state và có thể được share hoặc bookmark.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Utility Functions Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🛠️ Utility Functions
        </h3>
        <p className="text-gray-600 mb-4">
          Các utility functions hữu ích khi làm việc với search parameters.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">🔍 Parameter Checking:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>searchParams.has('q'):</span>
                <span className={hasParam('q') ? 'text-green-600' : 'text-red-600'}>
                  {hasParam('q') ? 'true' : 'false'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>searchParams.has('page'):</span>
                <span className={hasParam('page') ? 'text-green-600' : 'text-red-600'}>
                  {hasParam('page') ? 'true' : 'false'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>searchParams.get('q'):</span>
                <code className="text-gray-600">"{searchParams.get('q') || 'null'}"</code>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">📊 Parameter Statistics:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total parameters:</span>
                <span className="font-medium">{paramsArray.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Query string length:</span>
                <span className="font-medium">{searchParams.toString().length} chars</span>
              </div>
              <div className="flex justify-between">
                <span>URL size:</span>
                <span className="font-medium">{shareableURL.length} chars</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          💡 Best Practices cho useSearchParams
        </h3>
        <ul className="space-y-2 text-sm text-yellow-700">
          <li>• <strong>URL State Management:</strong> Sử dụng URL params để persist state và enable sharing</li>
          <li>• <strong>Shallow Routing:</strong> Dùng router.push() để update URL mà không reload page</li>
          <li>• <strong>Parameter Validation:</strong> Luôn validate và sanitize URL parameters</li>
          <li>• <strong>Default Values:</strong> Cung cấp default values cho các optional parameters</li>
          <li>• <strong>URL Length:</strong> Hạn chế URL length để tránh vượt quá browser limits</li>
          <li>• <strong>SEO Friendly:</strong> Sử dụng meaningful parameter names cho SEO</li>
          <li>• <strong>Debouncing:</strong> Debounce frequent parameter updates để avoid spam</li>
        </ul>
      </div>
    </div>
  )
}

export default UseSearchParamsExample 