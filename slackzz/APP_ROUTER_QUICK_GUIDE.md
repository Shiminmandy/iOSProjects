# App Router 快速指南 - 由浅入深

## 📌 一、基础概念（5分钟理解）

### Page Router vs App Router

#### Page Router（旧方式）
- 📁 **文件位置**: `/pages/api/*.ts`
- 🔧 **导出方式**: `export default function handler()`
- 📥 **参数**: 需要 `req` 和 `res` 两个参数
- 🔀 **HTTP 方法**: 手动判断 `req.method`
- ⚠️ **状态**: 不推荐新项目使用

#### App Router（新方式）⭐
- 📁 **文件位置**: `/app/api/*/route.ts`
- 🔧 **导出方式**: `export async function GET/POST/etc()`
- 📥 **参数**: 只需要 `req` 参数
- 🔀 **HTTP 方法**: 通过函数名自动识别
- ✅ **状态**: 官方推荐，符合 Web 标准

---

## 📊 二、核心区别对比

### 1. 文件结构
```
Page Router:
/pages/api/messages.ts          → /api/messages
/pages/api/messages/[id].ts    → /api/messages/:id

App Router:
/app/api/messages/route.ts      → /api/messages
/app/api/messages/[id]/route.ts → /api/messages/:id
```

### 2. 函数签名
```typescript
// Page Router ❌
export default function handler(
  req: NextApiRequest,    // 必须
  res: NextApiResponse     // 必须
) { }

// App Router ✅
export async function GET(req: Request) { }  // 只需要 req
export async function POST(req: Request) { }
```

### 3. HTTP 方法处理
```typescript
// Page Router ❌ - 手动判断
if (req.method === 'GET') { }
if (req.method === 'POST') { }

// App Router ✅ - 自动识别
export async function GET() { }
export async function POST() { }
```

### 4. 返回响应
```typescript
// Page Router ❌
return res.status(200).json({ data });

// App Router ✅
return NextResponse.json({ data });
```

---

## 🎯 三、官方推荐用法（App Router）

### 基础用法

#### GET 请求
```typescript
// /app/api/messages/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  return NextResponse.json({ id });
}
```

#### POST 请求
```typescript
export async function POST(req: Request) {
  const body = await req.json();
  
  return NextResponse.json({ data: body }, { status: 201 });
}
```

#### 动态路由
```typescript
// /app/api/messages/[id]/route.ts
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return NextResponse.json({ id });
}
```

---

## 🔑 四、主要使用需求

### 需求 1: 获取查询参数
```typescript
// ✅ App Router
const { searchParams } = new URL(req.url);
const channelId = searchParams.get('channelId');

// ❌ Page Router
const { channelId } = req.query;
```

### 需求 2: 获取请求体
```typescript
// ✅ App Router
const body = await req.json();

// ❌ Page Router
const body = req.body;
```

### 需求 3: 获取路径参数
```typescript
// ✅ App Router
export async function GET(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params;
}

// ❌ Page Router
const { messageId } = req.query;
```

### 需求 4: 设置响应状态码
```typescript
// ✅ App Router
return NextResponse.json(
  { error: 'Not found' },
  { status: 404 }
);

// ❌ Page Router
return res.status(404).json({ error: 'Not found' });
```

### 需求 5: 设置响应头
```typescript
// ✅ App Router
return NextResponse.json({ data }, {
  headers: { 'X-Custom-Header': 'value' }
});

// ❌ Page Router
res.setHeader('X-Custom-Header', 'value');
return res.json({ data });
```

### 需求 6: 处理 Cookies
```typescript
// ✅ App Router
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const response = NextResponse.next();
  const token = req.cookies.get('token');
  response.cookies.set('newToken', 'value');
  
  return response;
}

// ❌ Page Router
const token = req.cookies.token;
res.setHeader('Set-Cookie', 'newToken=value');
```

---

## 📚 五、进阶用法

### 1. 支持多个 HTTP 方法
```typescript
// /app/api/messages/[id]/route.ts

export async function GET(req: Request, { params }) {
  // 获取数据
}

export async function PATCH(req: Request, { params }) {
  // 更新数据
}

export async function DELETE(req: Request, { params }) {
  // 删除数据
}
```

### 2. 错误处理
```typescript
export async function GET(req: Request) {
  try {
    // 业务逻辑
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### 3. 类型安全
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // TypeScript 自动推断类型
  // ...
}
```

### 4. 流式响应（Streaming）
```typescript
export async function GET() {
  const stream = new ReadableStream({
    // 流式数据处理
  });
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}
```

---

## 🔄 六、迁移示例

### 示例：消息 API 迁移

#### Page Router（旧）
```typescript
// /pages/api/messages/[messageId].ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const { messageId } = req.query;
    // 删除逻辑
    return res.status(200).json({ success: true });
  }
  
  if (req.method === 'PATCH') {
    const { messageId } = req.query;
    const body = req.body;
    // 更新逻辑
    return res.status(200).json({ data });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
```

#### App Router（新）⭐
```typescript
// /app/api/messages/[messageId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params;
  // 删除逻辑
  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params;
  const body = await req.json();
  // 更新逻辑
  return NextResponse.json({ data });
}
```

**优势**:
- ✅ 代码更简洁（不需要手动判断方法）
- ✅ 类型更安全（params 自动推断类型）
- ✅ 符合 Web 标准（使用 Request/Response API）

---

## ✅ 七、最佳实践

### 1. 使用 NextRequest 而不是 Request
```typescript
// ✅ 推荐
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) { }

// ⚠️ 也可以，但功能较少
export async function GET(req: Request) { }
```

### 2. 统一错误处理
```typescript
export async function GET(req: NextRequest) {
  try {
    // 业务逻辑
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### 3. 参数验证
```typescript
export async function POST(req: NextRequest) {
  const body = await req.json();
  
  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // 继续处理
}
```

### 4. 异步参数处理
```typescript
// ✅ 正确 - params 是 Promise
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // 必须 await
}

// ❌ 错误 - params 不是 Promise
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;  // 类型错误
}
```

---

## 🎓 八、快速参考表

| 需求 | Page Router | App Router |
|------|------------|-----------|
| **文件位置** | `/pages/api/*.ts` | `/app/api/*/route.ts` |
| **导出** | `export default handler` | `export async function GET/POST` |
| **参数** | `req, res` | `req` (可选 `params`) |
| **查询参数** | `req.query` | `new URL(req.url).searchParams` |
| **路径参数** | `req.query` | `await params` |
| **请求体** | `req.body` | `await req.json()` |
| **Cookies** | `req.cookies` | `req.cookies` (NextRequest) |
| **返回响应** | `res.status().json()` | `NextResponse.json()` |
| **状态码** | `res.status(200)` | `{ status: 200 }` |

---

## 🚀 九、总结

### 为什么使用 App Router？

1. ✅ **更简洁**: 不需要手动判断 HTTP 方法
2. ✅ **更标准**: 使用 Web 标准 Request/Response API
3. ✅ **更安全**: 更好的类型支持和错误处理
4. ✅ **更现代**: 官方推荐，持续更新
5. ✅ **更灵活**: 支持流式响应、中间件等高级功能

### 迁移建议

- 🆕 **新项目**: 直接使用 App Router
- 🔄 **旧项目**: 逐步迁移，新功能用 App Router
- 📚 **学习**: 优先学习 App Router，Page Router 作为参考

---

## 📖 参考资源

- [Next.js Route Handlers 官方文档](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [从 Pages Router 迁移指南](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

