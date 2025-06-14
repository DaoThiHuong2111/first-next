# 📚 Tổng kết Function Hooks trong React và Next.js

## 🚀 Giới thiệu về Context7

Theo yêu cầu sử dụng mcp_Context7, tôi đã thu thập tài liệu từ:

### React Documentation
- **Library ID**: `/reactjs/react.dev`
- **Trust Score**: 9.0
- **Code Snippets**: 2,791 ví dụ
- **Nội dung**: Tài liệu chính thức về React Hooks với các quy tắc và best practices

### Next.js Documentation  
- **Library ID**: `/vercel/next.js`
- **Trust Score**: 10.0
- **Code Snippets**: 4,511 ví dụ
- **Nội dung**: Tài liệu đầy đủ về Next.js hooks cho App Router

## 📋 Danh sách tất cả Function Hooks

### 🔥 React Built-in Hooks

#### State Management Hooks
| Hook | Mục đích | Use Case | Ghi chú |
|------|----------|----------|---------|
| `useState` | Quản lý state trong component | Form inputs, counters, toggles | Hook cơ bản nhất, dễ sử dụng |
| `useReducer` | Quản lý state phức tạp với reducer | Complex state logic, multiple actions | Tốt cho state có nhiều sub-values |

#### Context Hooks
| Hook | Mục đích | Use Case | Ghi chú |
|------|----------|----------|---------|
| `useContext` | Đọc và subscribe vào context | Theme, authentication, global state | Tránh prop drilling |

#### Ref Hooks
| Hook | Mục đích | Use Case | Ghi chú |
|------|----------|----------|---------|
| `useRef` | Tham chiếu DOM hoặc mutablevalue | Focus elements, scroll position | Không trigger re-render |
| `useImperativeHandle` | Customize ref exposed value | Custom component APIs | Hiếm khi sử dụng |

#### Effect Hooks
| Hook | Mục đích | Use Case | Ghi chú |
|------|----------|----------|---------|
| `useEffect` | Side effects trong component | Data fetching, subscriptions | Chạy sau khi render |
| `useLayoutEffect` | Synchronous effects | DOM measurements, mutations | Chạy trước browser paint |

#### Performance Hooks
| Hook | Mục đích | Use Case | Ghi chú |
|------|----------|----------|---------|
| `useMemo` | Memoize expensive calculations | Heavy computations | Chỉ dùng khi thực sự cần |
| `useCallback` | Memoize functions | Prevent unnecessary re-renders | Hữu ích với React.memo |

#### Other Hooks
| Hook | Mục đích | Use Case | Ghi chú |
|------|----------|----------|---------|
| `useDebugValue` | Debug custom hooks | Development debugging | Chỉ dùng trong custom hooks |

### 🚀 Next.js Hooks (App Router)

#### Navigation Hooks
| Hook | Mục đích | Use Case | Ghi chú |
|------|----------|----------|---------|
| `useRouter` | Programmatic navigation | Button clicks, form submissions | Client-side only |
| `usePathname` | Get current pathname | Active nav links, conditional rendering | Client-side only |
| `useSearchParams` | Read URL query parameters | Search, filters, pagination | Client-side only |
| `useParams` | Get dynamic route parameters | Dynamic pages, slug-based routes | Client-side only |

#### Specialized Hooks
| Hook | Mục đích | Use Case | Ghi chú |  
|------|----------|----------|---------|
| `useLinkStatus` | Track link navigation status | Loading indicators | Với Next.js Link |
| `useSelectedLayoutSegment` | Get active layout segment | Nested layouts | Advanced routing |
| `useSelectedLayoutSegments` | Get active layout segments | Complex nested layouts | Advanced routing |
| `useReportWebVitals` | Monitor web vitals | Performance tracking | Analytics integration |

## 🎯 Quy tắc quan trọng khi sử dụng Hooks

### Rules of Hooks
1. **Chỉ gọi Hooks ở top level**: Không trong loops, conditions, nested functions
2. **Chỉ gọi từ React functions**: Function components hoặc custom hooks
3. **Hook phải pure**: Không mutate arguments trực tiếp
4. **Dependencies phải accurate**: useEffect, useMemo, useCallback cần deps chính xác

### Best Practices
- Sử dụng TypeScript cho type safety
- Tạo custom hooks để reuse logic
- Optimize performance với useMemo/useCallback khi cần
- Sử dụng ESLint plugin để check rules
- Clean up effects để tránh memory leaks

## 🔧 Custom Hooks Examples

### useLocalStorage Hook
```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}
```

### useDebounce Hook
```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

## 🎉 Kết luận

Hooks là một tính năng mạnh mẽ trong React và Next.js, giúp:
- ✅ Tái sử dụng stateful logic
- ✅ Tổ chức code tốt hơn
- ✅ Tránh "wrapper hell" của HOCs
- ✅ Dễ test và maintain

**Tổng số hooks được documented**: 15+ hooks với ví dụ chi tiết và use cases thực tế.

---

**Tài liệu này được tạo bằng Context7 và tuân theo các quy tắc best practice từ React và Next.js official documentation.** 