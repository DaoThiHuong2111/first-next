'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

/**
 * UseContextExample - Component demo useContext hook
 * 
 * useContext cho phép component đọc và subscribe vào context data.
 * Context giúp truyền data qua component tree mà không cần prop drilling.
 * 
 * Cú pháp: const value = useContext(MyContext)
 */

// 1. Theme Context - Quản lý theme của ứng dụng
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  colors: {
    background: string
    text: string
    primary: string
    secondary: string
  }
}

// Tạo Theme Context với default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme Provider Component
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  // Toggle function để chuyển đổi theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }
  
  // Colors dựa trên theme hiện tại
  const colors = {
    light: {
      background: '#ffffff',
      text: '#1f2937',
      primary: '#3b82f6',
      secondary: '#e5e7eb'
    },
    dark: {
      background: '#1f2937',
      text: '#f9fafb',
      primary: '#60a5fa',
      secondary: '#374151'
    }
  }
  
  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    colors: colors[theme]
  }
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// 2. User Context - Quản lý thông tin user
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

interface UserContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// User Provider Component
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  
  const login = (userData: User) => {
    setUser(userData)
    console.log('User logged in:', userData)
  }
  
  const logout = () => {
    setUser(null)
    console.log('User logged out')
  }
  
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser(prevUser => ({ ...prevUser!, ...updates }))
      console.log('User updated:', updates)
    }
  }
  
  const contextValue: UserContextType = {
    user,
    login,
    logout,
    updateUser
  }
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

// 3. Custom hooks để sử dụng contexts
const useTheme = () => {
  const context = useContext(ThemeContext)
  // Kiểm tra xem component có được wrap trong Provider không
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// 4. Components sử dụng context
const Header = () => {
  // Sử dụng multiple contexts
  const { theme, toggleTheme, colors } = useTheme()
  const { user, logout } = useUser()
  
  return (
    <header
      className="p-4 rounded-lg mb-6 border"
      style={{ 
        backgroundColor: colors.background,
        borderColor: colors.secondary,
        color: colors.text
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            React Context Demo
          </h2>
          <p className="text-sm opacity-80">
            Theme: {theme} | User: {user ? user.name : 'Guest'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded transition-colors"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.background
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'} 
            Switch to {theme === 'light' ? 'Dark' : 'Light'}
          </button>
          
          {/* User Action Button */}
          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 rounded border transition-colors"
              style={{ 
                borderColor: colors.secondary,
                color: colors.text
              }}
            >
              Logout
            </button>
          ) : (
            <span className="text-sm opacity-70">Not logged in</span>
          )}
        </div>
      </div>
    </header>
  )
}

const UserProfile = () => {
  const { colors } = useTheme()
  const { user, updateUser } = useUser()
  
  if (!user) {
    return (
      <div 
        className="p-4 rounded-lg border text-center"
        style={{ 
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
          color: colors.text
        }}
      >
        <p className="mb-2">No user logged in</p>
        <p className="text-sm opacity-70">
          Use the login form below to see user profile
        </p>
      </div>
    )
  }
  
  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        backgroundColor: colors.background,
        borderColor: colors.secondary,
        color: colors.text
      }}
    >
      <h3 className="text-lg font-semibold mb-3">User Profile</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => updateUser({ name: e.target.value })}
            className="w-full px-3 py-2 rounded border"
            style={{ 
              backgroundColor: colors.background,
              borderColor: colors.secondary,
              color: colors.text
            }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => updateUser({ email: e.target.value })}
            className="w-full px-3 py-2 rounded border"
            style={{ 
              backgroundColor: colors.background,
              borderColor: colors.secondary,
              color: colors.text
            }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Role:</label>
          <select
            value={user.role}
            onChange={(e) => updateUser({ role: e.target.value as User['role'] })}
            className="w-full px-3 py-2 rounded border"
            style={{ 
              backgroundColor: colors.background,
              borderColor: colors.secondary,
              color: colors.text
            }}
          >
            <option value="guest">Guest</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">ID:</label>
          <input
            type="text"
            value={user.id}
            disabled
            className="w-full px-3 py-2 rounded border opacity-50"
            style={{ 
              backgroundColor: colors.secondary,
              borderColor: colors.secondary,
              color: colors.text
            }}
          />
        </div>
      </div>
    </div>
  )
}

const LoginForm = () => {
  const { colors } = useTheme()
  const { user, login } = useUser()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as User['role']
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email) {
      login({
        id: Date.now(), // Simple ID generation
        ...formData
      })
      // Reset form
      setFormData({ name: '', email: '', role: 'user' })
    }
  }
  
  if (user) {
    return null // Hide form when user is logged in
  }
  
  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ 
        backgroundColor: colors.background,
        borderColor: colors.secondary,
        color: colors.text
      }}
    >
      <h3 className="text-lg font-semibold mb-3">Login Form</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your name"
            className="w-full px-3 py-2 rounded border"
            style={{ 
              backgroundColor: colors.background,
              borderColor: colors.secondary,
              color: colors.text
            }}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded border"
            style={{ 
              backgroundColor: colors.background,
              borderColor: colors.secondary,
              color: colors.text
            }}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Role:</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as User['role'] }))}
            className="w-full px-3 py-2 rounded border"
            style={{ 
              backgroundColor: colors.background,
              borderColor: colors.secondary,
              color: colors.text
            }}
          >
            <option value="guest">Guest</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full px-4 py-2 rounded font-medium transition-opacity hover:opacity-80"
          style={{ 
            backgroundColor: colors.primary,
            color: colors.background
          }}
        >
          Login
        </button>
      </form>
    </div>
  )
}

// Main component với tất cả providers
const UseContextExample = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🌐 useContext Hook Examples
      </h2>
      
      {/* Wrap components trong providers */}
      <ThemeProvider>
        <UserProvider>
          {/* Components sử dụng context */}
          <div className="space-y-6">
            <Header />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserProfile />
              <LoginForm />
            </div>
          </div>
        </UserProvider>
      </ThemeProvider>
      
      {/* Notes */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-8">
        <h4 className="font-semibold text-blue-800 mb-3">📝 Context Best Practices:</h4>
        
        <div className="space-y-4 text-blue-700 text-sm">
          <div>
            <h5 className="font-medium mb-2">✅ Khi nào nên dùng Context:</h5>
            <ul className="space-y-1 ml-4">
              <li>• Global data: theme, authentication, language</li>
              <li>• Tránh prop drilling qua nhiều levels</li>
              <li>• Data được nhiều components sử dụng</li>
              <li>• Configuration hoặc settings</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium mb-2">⚠️ Lưu ý quan trọng:</h5>
            <ul className="space-y-1 ml-4">
              <li>• Context value thay đổi → tất cả consumers re-render</li>
              <li>• Tách context thành nhiều contexts nhỏ</li>
              <li>• Sử dụng useMemo cho context value nếu expensive</li>
              <li>• Tạo custom hooks để encapsulate context logic</li>
              <li>• Luôn provide default value hoặc throw error</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium mb-2">🔧 Pattern được recommend:</h5>
            <ul className="space-y-1 ml-4">
              <li>• Provider + Custom Hook pattern</li>
              <li>• Type-safe contexts với TypeScript</li>
              <li>• Compound component pattern</li>
              <li>• Context composition cho complex apps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UseContextExample 