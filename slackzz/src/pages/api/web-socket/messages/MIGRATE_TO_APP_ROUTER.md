# 从 Page Router 迁移到 App Router 指南

本文档说明如何将 `/pages/api/web-socket/messages/[messageId].ts` 迁移到 App Router。

---

## 📋 目录

1. [核心变化](#核心变化)
2. [迁移步骤](#迁移步骤)
3. [完整代码对比](#完整代码对比)
4. [Socket.IO 处理方案](#socketio-处理方案)
5. [注意事项](#注意事项)

---

## 🔄 核心变化

### 文件位置
- **Page Router**: `/pages/api/web-socket/messages/[messageId].ts`
- **App Router**: `/app/api/web-socket/messages/[messageId]/route.ts`

### 函数签名
- **Page Router**: 
  ```typescript
  export default async function handler(
    req: NextApiRequest,
    res: SocketIoApiResponse
  )
  ```
- **App Router**: 
  ```typescript
  export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ messageId: string }> }
  )
  
  export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ messageId: string }> }
  )
  ```

### 参数获取方式

| 参数类型 | Page Router | App Router |
|---------|------------|-----------|
| **路径参数** | `req.query.messageId` | `const { messageId } = await params` |
| **查询参数** | `req.query.channelId` | `searchParams.get('channelId')` |
| **请求体** | `req.body` | `await req.json()` |

### 返回响应
- **Page Router**: `res.status(200).json({ data })`
- **App Router**: `NextResponse.json({ data })`

### Socket.IO 访问
- **Page Router**: `res?.socket?.server?.io?.emit()`
- **App Router**: `getSocketServer()?.emit()` (需要全局管理器)

---

## 🚀 迁移步骤

### 步骤 1: 创建全局 Socket.IO 管理器

由于 App Router 无法直接访问 `res.socket.server.io`，需要创建一个全局管理器。

**文件**: `src/lib/socket-server.ts`

```typescript
import { Server as SocketServer } from "socket.io";
import { Server as NetServer } from "http";

let ioInstance: SocketServer | null = null;

export function getSocketServer(): SocketServer | null {
  return ioInstance;
}

export function initializeSocketServer(httpServer: NetServer): SocketServer {
  if (!ioInstance) {
    const path = "/api/web-socket/io";
    ioInstance = new SocketServer(httpServer, {
      path,
      addTrailingSlash: false,
    });
  }
  return ioInstance;
}

export function setSocketServer(io: SocketServer | null): void {
  ioInstance = io;
}
```

### 步骤 2: 更新 Socket.IO 初始化文件

**文件**: `/pages/api/web-socket/io.ts` (保持 Page Router 用于初始化)

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { SocketIoApiResponse } from "@/types/app";
import { initializeSocketServer, setSocketServer } from "@/lib/socket-server";

const handler = async (req: NextApiRequest, res: SocketIoApiResponse) => {
  if (!res.socket.server.io) {
    const io = initializeSocketServer(
      res.socket.server.io as unknown as NetServer
    );
    res.socket.server.io = io;
    setSocketServer(io); // 保存到全局
  }
  res.end();
};

export default handler;
```

### 步骤 3: 创建 App Router Route Handler

**文件**: `/app/api/web-socket/messages/[messageId]/route.ts`

完整代码见下方 [完整代码对比](#完整代码对比) 部分。

---

## 📝 完整代码对比

### Page Router 版本（当前）

```typescript
// /pages/api/web-socket/messages/[messageId].ts
export default async function handler(
  req: NextApiRequest,
  res: SocketIoApiResponse
) {
  // 手动判断 HTTP 方法
  if (!["DELETE", "PATCH"].includes(req.method!)) {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 用户认证
    const userData = await getUserDataPages(req, res);
    if (!userData) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 获取参数
    const { messageId, channelId, workspaceId } = req.query;
    const { content } = req.body;

    // Supabase 客户端
    const supabase = await SupabaseServerClientPages(req, res);

    // 业务逻辑...
    
    // Socket.IO 广播
    res?.socket?.server?.io?.emit(
      `channel:${channelId}:channel-messages:update`,
      updatedMessage
    );

    return res.status(200).json({ message: updatedMessage });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
```

### App Router 版本（迁移后）

```typescript
// /app/api/web-socket/messages/[messageId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserData } from "@/actions/get-user-data";
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { SupabaseClient } from "@supabase/supabase-js";
import { getSocketServer } from "@/lib/socket-server";

/**
 * DELETE 请求：删除消息
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    // ========== 步骤 1: 用户身份验证 ==========
    const userData = await getUserData();

    if (!userData) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ========== 步骤 2: 请求参数提取与验证 ==========
    const { messageId } = await params; // 路径参数
    const { searchParams } = new URL(req.url); // 查询参数
    const channelId = searchParams.get("channelId");
    const workspaceId = searchParams.get("workspaceId");

    if (!messageId || !channelId || !workspaceId) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    // ========== 步骤 3: 初始化 Supabase 客户端 ==========
    const supabase = await supabaseServerClient();

    // ========== 步骤 4: 查询消息数据 ==========
    const { data: messageData, error } = await supabase
      .from("messages")
      .select("*, user:user_id(*)")
      .eq("id", messageId)
      .single();

    if (error || !messageData) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // ========== 步骤 5: 权限判断 ==========
    const isMessageOwner = messageData.user_id === userData.id;
    const isAdmin = userData.type === "admin";
    const isRegulator = userData.type === "regulator";
    const canEditMessage = isMessageOwner || !messageData.is_deleted;

    if (!canEditMessage) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // ========== 步骤 6: 执行删除操作 ==========
    await deleteMessage(supabase, messageId);

    // ========== 步骤 7: 重新查询更新后的消息 ==========
    const { data: updatedMessage, error: messageError } = await supabase
      .from("messages")
      .select("*, user:user_id(*)")
      .order("created_at", { ascending: true })
      .eq("id", messageId)
      .single();

    if (messageError || !updatedMessage) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 500 }
      );
    }

    // ========== 步骤 8: Socket.IO 实时广播 ==========
    const io = getSocketServer();
    if (io) {
      io.emit(
        `channel:${channelId}:channel-messages:update`,
        updatedMessage
      );
    }

    // ========== 步骤 9: 返回成功响应 ==========
    return NextResponse.json({ message: updatedMessage });
  } catch (error) {
    console.log("MESSAGE DELETE ERROR: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH 请求：更新消息内容
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    // ========== 步骤 1: 用户身份验证 ==========
    const userData = await getUserData();

    if (!userData) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ========== 步骤 2: 请求参数提取与验证 ==========
    const { messageId } = await params;
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");
    const workspaceId = searchParams.get("workspaceId");

    if (!messageId || !channelId || !workspaceId) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    // 从请求体中提取消息内容
    const body = await req.json();
    const { content } = body;

    // ========== 步骤 3: 初始化 Supabase 客户端 ==========
    const supabase = await supabaseServerClient();

    // ========== 步骤 4: 查询消息数据 ==========
    const { data: messageData, error } = await supabase
      .from("messages")
      .select("*, user:user_id(*)")
      .eq("id", messageId)
      .single();

    if (error || !messageData) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // ========== 步骤 5: 权限判断 ==========
    const isMessageOwner = messageData.user_id === userData.id;

    // 只有消息所有者可以编辑
    if (!isMessageOwner) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // ========== 步骤 6: 执行更新操作 ==========
    await updateMessageContent(supabase, messageId, content);

    // ========== 步骤 7: 重新查询更新后的消息 ==========
    const { data: updatedMessage, error: messageError } = await supabase
      .from("messages")
      .select("*, user:user_id(*)")
      .order("created_at", { ascending: true })
      .eq("id", messageId)
      .single();

    if (messageError || !updatedMessage) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 500 }
      );
    }

    // ========== 步骤 8: Socket.IO 实时广播 ==========
    const io = getSocketServer();
    if (io) {
      io.emit(
        `channel:${channelId}:channel-messages:update`,
        updatedMessage
      );
    }

    // ========== 步骤 9: 返回成功响应 ==========
    return NextResponse.json({ message: updatedMessage });
  } catch (error) {
    console.log("MESSAGE UPDATE ERROR: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * 更新消息内容函数
 */
async function updateMessageContent(
  supabase: SupabaseClient,
  messageId: string,
  content: string
) {
  await supabase
    .from("messages")
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .select("*, user:user_id(*)")
    .eq("id", messageId)
    .single();
}

/**
 * 删除消息函数（软删除）
 */
async function deleteMessage(supabase: SupabaseClient, messageId: string) {
  await supabase
    .from("messages")
    .update({
      content: "This message has been deleted",
      file_url: null,
      is_deleted: true,
    })
    .select("*, user:user_id(*)")
    .eq("id", messageId)
    .single();
}
```

---

## 🔌 Socket.IO 处理方案

### 问题
App Router 的 Route Handlers 使用 Web 标准的 `Request`/`Response` API，无法直接访问 Node.js 底层的 `res.socket.server.io`。

### 解决方案
创建全局 Socket.IO 实例管理器，让 App Router 可以访问 Socket.IO 实例。

### 实现步骤

1. **创建全局管理器** (`src/lib/socket-server.ts`)
   - 存储 Socket.IO 实例
   - 提供 `getSocketServer()` 函数供 App Router 使用

2. **在 Page Router 中初始化** (`/pages/api/web-socket/io.ts`)
   - 保持这个文件用于初始化 Socket.IO
   - 初始化后将实例保存到全局管理器

3. **在 App Router 中使用**
   - 通过 `getSocketServer()` 获取实例
   - 使用 `io.emit()` 进行广播

### 代码示例

```typescript
// 在 App Router Route Handler 中
import { getSocketServer } from "@/lib/socket-server";

export async function DELETE(req: NextRequest, { params }) {
  // ... 业务逻辑 ...
  
  // Socket.IO 广播
  const io = getSocketServer();
  if (io) {
    io.emit(`channel:${channelId}:channel-messages:update`, updatedMessage);
  }
  
  return NextResponse.json({ message: updatedMessage });
}
```

---

## ⚠️ 注意事项

### 1. 路径参数是 Promise
- ✅ **正确**: `const { messageId } = await params;`
- ❌ **错误**: `const { messageId } = params;` (类型错误)

### 2. 查询参数获取方式
- ✅ **正确**: `const { searchParams } = new URL(req.url); const id = searchParams.get('id');`
- ❌ **错误**: `req.query.id` (App Router 中没有 `req.query`)

### 3. 请求体解析
- ✅ **正确**: `const body = await req.json();`
- ❌ **错误**: `req.body` (需要异步解析)

### 4. Socket.IO 初始化
- ⚠️ Socket.IO 初始化仍需在 Page Router 中完成
- ⚠️ App Router 通过全局管理器访问实例
- ⚠️ 确保 Socket.IO 在 App Router 使用前已初始化

### 5. 用户认证函数
- Page Router: `getUserDataPages(req, res)`
- App Router: `getUserData()` (不需要 req/res)

### 6. Supabase 客户端
- Page Router: `SupabaseServerClientPages(req, res)`
- App Router: `supabaseServerClient()` (不需要 req/res)

---

## 📊 迁移检查清单

- [ ] 创建全局 Socket.IO 管理器 (`src/lib/socket-server.ts`)
- [ ] 更新 Socket.IO 初始化文件 (`/pages/api/web-socket/io.ts`)
- [ ] 创建 App Router Route Handler (`/app/api/web-socket/messages/[messageId]/route.ts`)
- [ ] 将 `DELETE` 方法迁移到 `export async function DELETE()`
- [ ] 将 `PATCH` 方法迁移到 `export async function PATCH()`
- [ ] 更新参数获取方式（`await params` + `searchParams`）
- [ ] 更新请求体解析（`await req.json()`）
- [ ] 更新 Socket.IO 访问方式（`getSocketServer()`）
- [ ] 更新返回响应方式（`NextResponse.json()`）
- [ ] 更新用户认证（`getUserData()`）
- [ ] 更新 Supabase 客户端（`supabaseServerClient()`）
- [ ] 测试 DELETE 功能
- [ ] 测试 PATCH 功能
- [ ] 测试 Socket.IO 广播功能

---

## 🔗 相关资源

- [Next.js Route Handlers 官方文档](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [从 Pages Router 迁移指南](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Socket.IO 官方文档](https://socket.io/docs/v4/)

---

## 📝 总结

### 主要变化
1. ✅ 文件位置：`/pages/api` → `/app/api/*/route.ts`
2. ✅ 函数签名：`export default handler` → `export async function GET/POST/etc`
3. ✅ 参数：`req, res` → `req` (+ `params`)
4. ✅ HTTP 方法：手动判断 → 函数名自动识别
5. ✅ Socket.IO：`res.socket.server.io` → `getSocketServer()`

### 优势
- ✅ 更符合 Web 标准
- ✅ 代码更简洁（不需要手动判断 HTTP 方法）
- ✅ 更好的类型支持
- ✅ 官方推荐的新方式

### 注意事项
- ⚠️ Socket.IO 初始化仍需在 Page Router 中完成
- ⚠️ 路径参数是 Promise，必须 `await`
- ⚠️ 查询参数通过 `searchParams` 获取

