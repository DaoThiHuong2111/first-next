# So sánh Server Actions vs API Endpoints trong Next.js

## 📋 Tổng quan

**Server Actions** là tính năng mới trong Next.js cho phép bạn chạy code server-side trực tiếp từ component mà không cần tạo API endpoints riêng biệt.

## 🔄 So sánh chi tiết

### 1. **Server Actions** (Cách mới)

#### ✅ Ưu điểm:
- **Đơn giản hóa code**: Không cần tạo API routes riêng
- **Type Safety**: TypeScript tự động infer types
- **Built-in Features**: Tự động handle loading states, error boundaries
- **Progressive Enhancement**: Hoạt động ngay cả khi JavaScript bị tắt
- **Optimistic Updates**: Dễ dàng implement với `useOptimistic`
- **Cache Management**: Tích hợp sẵn `revalidatePath`, `revalidateTag`
- **Security**: Tự động encrypt và validate

#### ❌ Nhược điểm:
- **Mới**: Chưa được support rộng rãi
- **Ít linh hoạt**: Khó customize response format
- **Debugging**: Khó debug hơn API routes truyền thống

### 2. **API Endpoints** (Cách truyền thống)

#### ✅ Ưu điểm:
- **Linh hoạt**: Hoàn toàn control response format
- **RESTful**: Tuân thủ chuẩn REST API
- **Reusability**: Có thể dùng cho nhiều client khác nhau
- **Caching**: Dễ implement HTTP caching headers
- **Debugging**: Dễ test và debug với tools như Postman

#### ❌ Nhược điểm:
- **Boilerplate Code**: Nhiều code lặp lại
- **Manual Handling**: Phải tự handle loading, error states
- **Type Safety**: Cần setup thêm để có type safety
- **Complexity**: Client-server communication phức tạp hơn

## 📊 So sánh Code

### Server Actions (28 dòng code chính)
```typescript
// 1 file duy nhất
'use server'

export async function createUser(formData: FormData) {
  // Logic xử lý
  revalidatePath('/users')
  redirect('/users')
}

// Component đơn giản
<form action={createUser}>
  {/* Form fields */}
</form>
```

### API Endpoints (60+ dòng code)
```typescript
// File 1: API Route (app/api/users/route.ts)
export async function POST(request: NextRequest) {
  // API logic
}

// File 2: Component với client logic
const [loading, setLoading] = useState(false)
const handleSubmit = async (e) => {
  // Fetch API, handle error, loading...
}
```

## 🎯 Khi nào dùng gì?

### Dùng **Server Actions** khi:
- ✅ Form submissions đơn giản
- ✅ Mutations cơ bản (CRUD)
- ✅ Muốn code gọn gàng, ít complexity
- ✅ Cần progressive enhancement
- ✅ App chỉ có Next.js frontend

### Dùng **API Endpoints** khi:
- ✅ Cần RESTful API cho multiple clients
- ✅ Complex response formatting
- ✅ Cần HTTP caching strategies
- ✅ Integration với external systems
- ✅ Microservices architecture

## 🚀 Kết luận

**Server Actions** là evolution tự nhiên của web development, làm cho việc xây dựng forms và mutations trở nên đơn giản hơn nhiều. Tuy nhiên, API Endpoints vẫn có chỗ đứng riêng cho các use cases phức tạp hơn.

Recommendation: **Bắt đầu với Server Actions cho các tính năng mới, chỉ chuyển sang API Endpoints khi thực sự cần thiết.** 