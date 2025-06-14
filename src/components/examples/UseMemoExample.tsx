'use client'

import { useState, useMemo, useRef, useEffect } from 'react'

/**
 * useMemo Hook Example - React Performance Optimization
 * 
 * Hook này memoize kết quả của một expensive calculation và chỉ re-calculate 
 * khi dependencies thay đổi. Rất hữu ích cho:
 * - Expensive calculations
 * - Complex object creation
 * - Filtering/sorting large datasets
 * - Preventing unnecessary re-renders
 * - Performance optimization
 */

interface User {
  id: number
  name: string
  age: number
  salary: number
  department: string
  active: boolean
}

interface Product {
  id: number
  name: string
  price: number
  category: string
  rating: number
}

// Mock data
const generateUsers = (count: number): User[] => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${names[i % names.length]} ${i + 1}`,
    age: 22 + Math.floor(Math.random() * 40),
    salary: 30000 + Math.floor(Math.random() * 120000),
    department: departments[Math.floor(Math.random() * departments.length)],
    active: Math.random() > 0.2
  }))
}

const generateProducts = (count: number): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports']
  const products = ['Laptop', 'Phone', 'Tablet', 'Shirt', 'Pants', 'Book', 'Chair', 'Ball']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${products[i % products.length]} ${i + 1}`,
    price: 10 + Math.floor(Math.random() * 1000),
    category: categories[Math.floor(Math.random() * categories.length)],
    rating: 1 + Math.floor(Math.random() * 5)
  }))
}

const UseMemoExample = () => {
  // State cho demo data
  const [users] = useState(() => generateUsers(1000))
  const [products] = useState(() => generateProducts(500))
  
  // State cho filters
  const [minSalary, setMinSalary] = useState(50000)
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [minRating, setMinRating] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  
  // State để demo re-render counting
  const [renderCount, setRenderCount] = useState(0)
  const [randomNumber, setRandomNumber] = useState(0)
  
  // Refs để track calculations
  const expensiveCalculationCount = useRef(0)
  const filterCalculationCount = useRef(0)
  const sortCalculationCount = useRef(0)

  // Track re-renders
  useEffect(() => {
    setRenderCount(prev => prev + 1)
  })

  /**
   * 1. Expensive calculation với useMemo
   * Tính toán statistical data từ large dataset
   */
  const userStatistics = useMemo(() => {
    console.log('🔄 Calculating expensive user statistics...')
    expensiveCalculationCount.current += 1
    
    // Simulate expensive calculation
    let total = 0
    for (let i = 0; i < 1000000; i++) {
      total += i
    }
    
    const activeUsers = users.filter(user => user.active)
    const averageSalary = activeUsers.reduce((sum, user) => sum + user.salary, 0) / activeUsers.length
    const maxSalary = Math.max(...activeUsers.map(user => user.salary))
    const minSalaryCalc = Math.min(...activeUsers.map(user => user.salary))
    
    const departmentStats = activeUsers.reduce((acc, user) => {
      acc[user.department] = (acc[user.department] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      averageSalary: Math.round(averageSalary),
      maxSalary,
      minSalary: minSalaryCalc,
      departmentStats,
      expensiveTotal: total
    }
  }, [users]) // Chỉ recalculate khi users array thay đổi

  /**
   * 2. Filtered data với useMemo
   * Filter users dựa trên multiple criteria
   */
  const filteredUsers = useMemo(() => {
    console.log('🔍 Filtering users...')
    filterCalculationCount.current += 1
    
    return users.filter(user => {
      const matchesSalary = user.salary >= minSalary
      const matchesDepartment = selectedDepartment === 'All' || user.department === selectedDepartment
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesSalary && matchesDepartment && matchesSearch && user.active
    })
  }, [users, minSalary, selectedDepartment, searchTerm])

  /**
   * 3. Sorted data với useMemo
   * Sort products by rating và price
   */
  const sortedProducts = useMemo(() => {
    console.log('📊 Sorting products...')
    sortCalculationCount.current += 1
    
    return products
      .filter(product => product.rating >= minRating)
      .sort((a, b) => {
        // Sort by rating first, then by price
        if (b.rating !== a.rating) {
          return b.rating - a.rating
        }
        return b.price - a.price
      })
  }, [products, minRating])

  /**
   * 4. Complex object creation với useMemo
   * Tạo complex configuration object
   */
  const chartConfig = useMemo(() => {
    console.log('📈 Creating chart configuration...')
    
    const salesByDepartment = userStatistics.departmentStats
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    
    return {
      type: 'doughnut',
      data: {
        labels: Object.keys(salesByDepartment),
        datasets: [{
          data: Object.values(salesByDepartment),
          backgroundColor: colors,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom' as const
          },
          title: {
            display: true,
            text: 'Employees by Department'
          }
        }
      },
      createdAt: new Date().toISOString()
    }
  }, [userStatistics.departmentStats])

  /**
   * 5. Expensive array operations với useMemo
   */
  const expensiveArrayOperations = useMemo(() => {
    console.log('🔄 Performing expensive array operations...')
    
    // Multiple array transformations
    const processedData = filteredUsers
      .map(user => ({
        ...user,
        salaryGrade: user.salary > 80000 ? 'Senior' : user.salary > 50000 ? 'Mid' : 'Junior',
        bonus: user.salary * 0.1
      }))
      .filter(user => user.age > 25)
      .reduce((acc, user) => {
        if (!acc[user.department]) {
          acc[user.department] = []
        }
        acc[user.department].push(user)
        return acc
      }, {} as Record<string, typeof processedData>)
    
    return processedData
  }, [filteredUsers])

  /**
   * WITHOUT useMemo - demonstrating the problem
   * Đây là ví dụ KHÔNG dùng useMemo để show sự khác biệt
   */
  const expensiveCalculationWithoutMemo = () => {
    console.log('❌ Expensive calculation WITHOUT useMemo - runs every render!')
    let result = 0
    for (let i = 0; i < 100000; i++) {
      result += i * Math.random()
    }
    return result
  }
  
  // Này sẽ chạy mỗi lần component re-render
  const inefficientResult = expensiveCalculationWithoutMemo()

  const departments = ['All', ...Object.keys(userStatistics.departmentStats)]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🧠 useMemo Hook Example
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hook để memoize expensive calculations và complex data transformations. 
          Chỉ re-calculate khi dependencies thay đổi, giúp optimize performance.
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
            <div className="text-sm text-blue-600">Component Re-renders</div>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <div className="text-2xl font-bold text-green-800">{expensiveCalculationCount.current}</div>
            <div className="text-sm text-green-600">Statistics Calculations</div>
          </div>
          <div className="bg-orange-100 p-4 rounded">
            <div className="text-2xl font-bold text-orange-800">{filterCalculationCount.current}</div>
            <div className="text-sm text-orange-600">Filter Operations</div>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <div className="text-2xl font-bold text-purple-800">{sortCalculationCount.current}</div>
            <div className="text-sm text-purple-600">Sort Operations</div>
          </div>
        </div>
        
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setRandomNumber(Math.random())}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🔄 Force Re-render (Random: {randomNumber.toFixed(4)})
          </button>
          <div className="text-sm text-gray-600 flex items-center">
            💡 Thay đổi filters sẽ trigger selective recalculations
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🎛️ Filters (Trigger useMemo recalculations)
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Salary: ${minSalary.toLocaleString()}
            </label>
            <input
              type="range"
              min="30000"
              max="150000"
              step="5000"
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department:
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Product Rating: {minRating}⭐
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* User Statistics - Expensive Calculation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          📈 User Statistics (useMemo - Expensive Calculation)
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-2xl font-bold text-gray-800">{userStatistics.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-2xl font-bold text-gray-800">{userStatistics.activeUsers}</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-2xl font-bold text-gray-800">${userStatistics.averageSalary.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Average Salary</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-2xl font-bold text-gray-800">${userStatistics.maxSalary.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Max Salary</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-2xl font-bold text-gray-800">${userStatistics.minSalary.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Min Salary</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-2xl font-bold text-gray-800">{userStatistics.expensiveTotal.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Calculation Result</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 rounded">
          <p className="text-sm text-green-700">
            ✅ <strong>useMemo optimization:</strong> Statistics chỉ được tính lại khi users array thay đổi, 
            không phải mỗi lần component re-render.
          </p>
        </div>
      </div>

      {/* Filtered Users */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🔍 Filtered Users (useMemo - Conditional Recalculation)
        </h3>
        <div className="mb-4">
          <div className="text-lg font-medium">
            Found {filteredUsers.length} users matching criteria
          </div>
          <div className="text-sm text-gray-600">
            Filter depends on: minSalary, selectedDepartment, searchTerm
          </div>
        </div>
        
        <div className="max-h-60 overflow-y-auto">
          <div className="grid gap-2">
            {filteredUsers.slice(0, 10).map(user => (
              <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.department} • Age {user.age}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${user.salary.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">
                    {user.salary > 80000 ? '🟢 Senior' : user.salary > 50000 ? '🟡 Mid' : '🔴 Junior'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredUsers.length > 10 && (
            <div className="text-center mt-3 text-sm text-gray-500">
              ... and {filteredUsers.length - 10} more users
            </div>
          )}
        </div>
      </div>

      {/* Sorted Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          📊 Top Products (useMemo - Sorting & Filtering)
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.slice(0, 9).map(product => (
            <div key={product.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-gray-600">{product.category}</div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-green-600">${product.price}</span>
                <span className="text-yellow-500">{'⭐'.repeat(product.rating)}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-700">
            ✅ <strong>Sorted & filtered:</strong> {sortedProducts.length} products with rating ≥ {minRating}⭐ 
            (recalculates only when minRating changes)
          </p>
        </div>
      </div>

      {/* Complex Data Processing */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🔄 Complex Data Processing (useMemo - Multiple Operations)
        </h3>
        <div className="grid gap-4">
          {Object.entries(expensiveArrayOperations).map(([department, users]) => (
            <div key={department} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-lg mb-2">{department} Department</h4>
              <div className="text-sm text-gray-600 mb-2">
                {users.length} employees • Avg Bonus: ${(users.reduce((sum, u) => sum + u.bonus, 0) / users.length).toFixed(0)}
              </div>
              <div className="flex flex-wrap gap-2">
                {users.slice(0, 3).map(user => (
                  <span key={user.id} className={`px-2 py-1 rounded text-xs ${
                    user.salaryGrade === 'Senior' ? 'bg-green-100 text-green-800' :
                    user.salaryGrade === 'Mid' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.name} ({user.salaryGrade})
                  </span>
                ))}
                {users.length > 3 && (
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                    +{users.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          ⚡ Performance Comparison
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-800 mb-2">✅ WITH useMemo:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Expensive calculations chỉ chạy khi cần thiết</li>
              <li>• Re-renders không affect unrelated computations</li>
              <li>• Complex data transformations được cached</li>
              <li>• Better user experience với faster UI updates</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-800 mb-2">❌ WITHOUT useMemo:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Calculations chạy mỗi lần render</li>
              <li>• Unnecessary computations slow down app</li>
              <li>• User interactions có thể bị lag</li>
              <li>• Result: {inefficientResult.toFixed(2)} (calculated every render!)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">
          💡 Best Practices cho useMemo
        </h3>
        <ul className="space-y-2 text-sm text-green-700">
          <li>• <strong>Expensive calculations:</strong> Chỉ dùng cho operations thực sự expensive</li>
          <li>• <strong>Dependency array:</strong> Luôn include tất cả dependencies để avoid stale closures</li>
          <li>• <strong>Reference equality:</strong> Dùng để prevent child component re-renders</li>
          <li>• <strong>Complex objects:</strong> Memoize objects/arrays được pass xuống children</li>
          <li>• <strong>Don't overuse:</strong> Không dùng cho simple calculations hoặc primitive values</li>
          <li>• <strong>Profile first:</strong> Measure performance trước khi optimize</li>
          <li>• <strong>Memory trade-off:</strong> useMemo dùng memory để trade cho speed</li>
        </ul>
      </div>
    </div>
  )
}

export default UseMemoExample 