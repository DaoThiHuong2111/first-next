# React & Next.js Hooks Examples Project

Dự án này là một tập hợp đầy đủ các ví dụ về React và Next.js hooks được xây dựng với Next.js 15, TypeScript, và Tailwind CSS. Project cung cấp 22 interactive examples với đầy đủ documentation và best practices.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, hoặc bun

### Installation
```bash
# Clone repository
git clone <repository-url>
cd first-next

# Install dependencies
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Development
```bash
# Chạy development server
npm run dev
# hoặc
yarn dev
# hoặc  
pnpm dev
# hoặc
bun dev
```

Mở [http://localhost:3000](http://localhost:3000) trong browser để xem kết quả.

## 📚 Hooks Documentation

### 🎯 React State Hooks

#### `useState` - State Management
- **Mục đích**: Quản lý local state trong function component
- **Khi nào sử dụng**: Khi cần lưu trữ và update data local
- **Example**: Counter, form inputs, toggle states
- **Best Practice**: Sử dụng functional update cho performance optimization

#### `useReducer` - Complex State Management  
- **Mục đích**: Quản lý state phức tạp với reducer pattern
- **Khi nào sử dụng**: State logic phức tạp, multiple state values, state transitions
- **Example**: Form validation, shopping cart, game state
- **Best Practice**: Prefer cho complex state logic thay vì multiple useState

### 🌐 React Context Hooks

#### `useContext` - Context Consumption
- **Mục đích**: Đọc và subscribe vào React context  
- **Khi nào sử dụng**: Share data across component tree without prop drilling
- **Example**: Theme, authentication, user preferences
- **Best Practice**: Combine với useMemo cho performance optimization

### 🎯 React Ref Hooks

#### `useRef` - Mutable References
- **Mục đích**: Tạo mutable ref không trigger re-render
- **Khi nào sử dụng**: DOM manipulation, storing mutable values, focus management
- **Example**: Focus input, scrolling, timers
- **Best Practice**: Don't read/write current trong render

#### `useImperativeHandle` - Custom Ref Interface  
- **Mục đích**: Customize ref value exposed từ component
- **Khi nào sử dụng**: Khi cần expose specific methods thay vì entire DOM node
- **Example**: Custom input components, API-like components
- **Best Practice**: Use sparingly, prefer declarative patterns

### ⚡ React Effect Hooks

#### `useEffect` - Side Effects
- **Mục đích**: Thực hiện side effects trong function component  
- **Khi nào sử dụng**: Data fetching, subscriptions, DOM manipulation
- **Example**: API calls, event listeners, cleanup
- **Best Practice**: Always include dependencies, cleanup effects

#### `useLayoutEffect` - Synchronous Effects
- **Mục đích**: Effect chạy synchronously trước browser paint
- **Khi nào sử dụng**: DOM measurements, synchronous DOM mutations  
- **Example**: Measuring layout, preventing visual flicker
- **Best Practice**: Use useEffect unless cần synchronous timing

#### `useInsertionEffect` - CSS-in-JS Effects
- **Mục đích**: Insert dynamic CSS trước React makes DOM changes
- **Khi nào sử dụng**: CSS-in-JS libraries, dynamic styling
- **Example**: Styled-components, emotion
- **Best Practice**: Chỉ cho CSS-in-JS libraries

### 🧭 Next.js Navigation Hooks

#### `useRouter` - Programmatic Navigation  
- **Mục đích**: Navigate programmatically trong Next.js App Router
- **Khi nào sử dụng**: Form submissions, conditional navigation, programmatic routing
- **Example**: Redirect after login, dynamic navigation
- **Best Practice**: Use push() cho navigation, replace() cho redirects

#### `usePathname` - Current Path
- **Mục đích**: Lấy pathname hiện tại của URL
- **Khi nào sử dụng**: Conditional rendering based on route, navigation highlights
- **Example**: Active navigation links, conditional components
- **Best Practice**: Combine với useMemo cho performance

#### `useSearchParams` - URL Parameters
- **Mục đích**: Đọc và manipulate URL search parameters  
- **Khi nào sử dụng**: Filtering, pagination, search functionality
- **Example**: Search forms, filters, pagination
- **Best Practice**: Use useCallback cho param update functions

#### `useParams` - Route Parameters
- **Mục đích**: Lấy dynamic route parameters  
- **Khi nào sử dụng**: Dynamic routes với [param] trong Next.js
- **Example**: /posts/[id], /users/[userId]/posts/[postId]
- **Best Practice**: Validate parameters, handle missing params

#### `useSelectedLayoutSegment` - Layout Segment
- **Mục đích**: Đọc active layout segment cho navigation
- **Khi nào sử dụng**: Complex navigation systems, breadcrumbs
- **Example**: Multi-level navigation, active tab detection
- **Best Practice**: Use trong layout components

#### `useSelectedLayoutSegments` - All Layout Segments  
- **Mục đích**: Đọc tất cả active layout segments
- **Khi nào sử dụng**: Complex routing hierarchies, breadcrumb generation
- **Example**: Deep nested routes, navigation context
- **Best Practice**: Combine với breadcrumb components

#### `useLinkStatus` - Navigation Status
- **Mục đích**: Theo dõi loading state của navigation transitions
- **Khi nào sử dụng**: Loading indicators, user feedback durante navigation
- **Example**: Loading spinners, disabled states
- **Best Practice**: Provide visual feedback cho long navigations

### 🚀 React Performance Hooks  

#### `useMemo` - Memoized Values
- **Mục đích**: Cache expensive calculations between re-renders
- **Khi nào sử dụng**: Expensive computations, object/array creation
- **Example**: Filtered lists, computed values, object references
- **Best Practice**: Don't overuse, profile before optimizing

#### `useCallback` - Memoized Functions  
- **Mục đích**: Cache function definition between re-renders
- **Khi nào sử dụng**: Prevent child re-renders, stable references
- **Example**: Event handlers, functions passed to children
- **Best Practice**: Include dependencies, use với React.memo

### 🔧 React Utility Hooks

#### `useId` - Unique IDs
- **Mục đích**: Generate unique IDs consistent across server/client
- **Khi nào sử dụng**: Form labels, accessibility, SSR-safe IDs
- **Example**: Input labels, ARIA attributes
- **Best Practice**: Don't use cho keys trong lists

### ⚡ React Concurrent Hooks

#### `useTransition` - Non-blocking Updates  
- **Mục đích**: Mark state updates as non-blocking transitions
- **Khi nào sử dụng**: Large list updates, heavy computations
- **Example**: Search filtering, data visualization
- **Best Practice**: Use cho non-urgent updates

#### `useDeferredValue` - Deferred Updates
- **Mục đích**: Defer updating non-critical UI parts  
- **Khi nào sử dụng**: Performance optimization, smooth UX
- **Example**: Search suggestions, real-time previews
- **Best Practice**: Combine với useMemo

### 🔌 React External Store Hooks

#### `useSyncExternalStore` - External Store Subscription
- **Mục đích**: Subscribe to external data sources
- **Khi nào sử dụng**: Third-party state management, browser APIs
- **Example**: Redux, Zustand, localStorage
- **Best Practice**: Handle server-side rendering properly

### 🐛 React Debugging Hooks

#### `useDebugValue` - Custom Hook Labels  
- **Mục đích**: Display custom labels trong React DevTools
- **Khi nào sử dụng**: Custom hook development, debugging
- **Example**: Custom hook libraries, complex hooks
- **Best Practice**: Use format functions cho expensive values

## 📖 Cách Sử Dụng Hooks

### 1. Navigation trong Project
```bash
# Vào hooks examples page
http://localhost:3000/hooks-examples
```

### 2. Cấu Trúc File
```
src/
├── app/
│   └── hooks-examples/
│       └── page.tsx          # Main navigation page
├── components/
│   └── examples/
│       ├── UseStateExample.tsx
│       ├── UseEffectExample.tsx
│       └── ...               # Tất cả hook examples
```

### 3. Import và Sử Dụng
```typescript
// Import hook example component
import UseStateExample from '@/components/examples/UseStateExample'

// Sử dụng trong component
function MyComponent() {
  return <UseStateExample />
}
```

## ⚠️ Important Notes khi Sử dụng Hooks

### Rules of Hooks
1. **Chỉ call hooks ở top level** - Không trong loops, conditions, hoặc nested functions
2. **Chỉ call từ React functions** - Components hoặc custom hooks
3. **Consistent order** - Hooks phải được called theo same order mỗi render

### Performance Considerations
1. **useMemo & useCallback** - Don't overuse, có cost overhead
2. **Dependencies arrays** - Always include tất cả dependencies
3. **Effect cleanup** - Always cleanup subscriptions, timers, event listeners
4. **State colocation** - Keep state close to where it's used

### Best Practices  
1. **Custom hooks** - Extract logic vào reusable custom hooks
2. **Proper dependencies** - Include tất cả values used trong effect/memo
3. **Error boundaries** - Handle errors properly trong effects
4. **TypeScript** - Use types cho better development experience
5. **Testing** - Test custom hooks với React Testing Library

### Common Pitfalls
1. **Missing dependencies** - Eslint plugin sẽ warn về issues này
2. **Infinite loops** - Check dependencies arrays carefully  
3. **Stale closures** - Use callback style updates cho state
4. **Memory leaks** - Always cleanup effects
5. **Unnecessary re-renders** - Use React DevTools Profiler

## 🛠️ Development Tools

### React DevTools
- Install React DevTools extension
- Use Components tab để inspect hooks
- Profiler tab cho performance analysis

### Linting  
```bash
# ESLint với React Hooks plugin
npm run lint
```

### TypeScript
- Tất cả examples có full TypeScript support
- Types cho hook parameters và return values
- IntelliSense trong VS Code

## 🧪 Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter(0))
  
  act(() => {
    result.current.increment()
  })
  
  expect(result.current.count).toBe(1)
})
```

## 📚 Resources

- [React Docs - Hooks](https://react.dev/reference/react/hooks)
- [Next.js Docs - App Router](https://nextjs.org/docs/app)  
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-hook-example`
3. Commit changes: `git commit -am 'Add new hook example'`
4. Push to branch: `git push origin feature/new-hook-example`
5. Submit Pull Request

## 📄 License

This project is open source và available under the [MIT License](LICENSE).
