# Server Actions 详细讲解文档

## 📋 目录

1. [add-member-to-workspace.ts 详解](#1-add-member-to-workspacets-详解)
2. [update-user-workspace.ts 详解](#2-update-user-workspacets-详解)
3. [channels.ts 详解](#3-channelsts-详解)
4. [函数间联动关系](#4-函数间联动关系)
5. [Supabase 数据库表联动](#5-supabase-数据库表联动)

---

## 1. add-member-to-workspace.ts 详解

server action, 一般顶端要标注“use server"，调用的是supabase javascript sdk，sdk中含有http api，也就是说rest api被包裹在supabase sdk中。而http api包括好几种：rest，graphql，rpc，soap。http api的广义定义是任何基于http协议的接口。

在不需要外部调用这部分的时候，适合使用server action。外部需要调用的例子：移动端/后端服务如付费第三方/第三方回调

### 代码逐行讲解

```typescript
// 第1行：从 querystring 导入 StringifyOptions 类型（实际未使用，可删除）
import { StringifyOptions } from "querystring";

// 第3行：导入 Supabase 服务器客户端
import { supabaseServerClient } from "@/supabase/supabaseServer";

// 第6行：导出异步函数，接收两个参数
export const addMemberToWorkspace = async(
    userId: string,        // 要添加的用户 ID
    workspaceId: number    // ⚠️ 类型错误！应该是 string，不是 number
) => {
  
    // 第8行：获取 Supabase 客户端实例
    // await 是必须的，因为这是异步操作
    const supabase = await supabaseServerClient();

    // 第11-14行：调用数据库函数 'add_member_to_workspace'
    const {
        data: addMemberToWorkspaceData,  // 成功返回的数据
        error: addMemberToWorkspaceError // 错误对象（如果有的话）
    } = await supabase.rpc('add_member_to_workspace', {
        user_id: userId,           // 传递用户 ID
        workspace_id: workspaceId, // 传递工作区 ID
    });

    // 第16行：返回数组形式 [数据, 错误]
    // 为什么用数组？方便解构赋值：const [data, error] = await func()
    return [addMemberToWorkspaceData, addMemberToWorkspaceError];
}
```

### 功能说明

- **目的**：将指定用户添加到工作区的成员列表
- **数据库操作**：调用 RPC 函数 `add_member_to_workspace`
- **影响的表**：`workspaces` 表的 `members` 字段

---

## 2. update-user-workspace.ts 详解

### 代码逐行讲解

```typescript
// 第1行："use server" 指令
// 告诉 Next.js 这是服务器端代码，只在服务器运行
"use server";

// 第3行：导入 Supabase 服务器客户端
import { supabaseServerClient } from "@/supabase/supabaseServer";

// 第5行：导出异步函数
export const updateUserWorkspace = async (
    userId: string,      // 用户 ID
    workspaceId: string  // 工作区 ID
) => {
    // 第6行：获取 Supabase 实例
    const supabase = await supabaseServerClient();

    // 第9-12行：调用数据库 RPC 函数
    const {
        data: updateWorkspaceData,  // 重命名返回的 data
        error: updateWorkspaceError // 重命名返回的 error
    } = await supabase.rpc("add_workspace_to_user", {
        user_id: userId,           // 参数1：用户 ID
        new_workspace: workspaceId // 参数2：新工作区 ID
    });

    // 第14行：返回 [数据, 错误] 数组
    return [updateWorkspaceData, updateWorkspaceError];
};

// 第17-22行：中文注释（开发者笔记）
// 目的：找到指定用户，将新工作区id追加到用户的workspaces数组中
// 实现步骤：
//   1. 导入 Supabase 客户端
//   2. 调用 RPC 函数 add_workspace_to_user
//   3. 返回结果
```

### 功能说明

- **目的**：将工作区 ID 添加到用户的 `workspaces` 数组
- **数据库操作**：调用 RPC 函数 `add_workspace_to_user`
- **影响的表**：`users` 表的 `workspaces` 字段

---

## 3. channels.ts 详解

这是**最复杂**的文件，包含创建频道的完整流程。

### 主函数：createChannel

```typescript
// 第1行："use server" 指令
"use server";

// 第3-4行：导入依赖
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { getUserData } from "./get-user-data";

// 第6-14行：函数定义和参数类型
export const createChannel = async ({
    name,        // 频道名称
    workspaceId, // 工作区 ID
    userId,      // 创建者 ID
}: {
    name: string;
    workspaceId: string;
    userId: string;
}) => {
    // 第15行：获取 Supabase 客户端
    const supabase = await supabaseServerClient();
  
    // 第16行：获取当前用户数据（验证身份）
    const userData = await getUserData();

    // 第18-20行：安全检查
    if (!userData) {
        return { error: "No user data" };  // 用户未登录
    }

    // ============ 步骤1：创建频道记录 ============
    // 第22-29行：向 channels 表插入新记录
    const { 
        error,                // 插入错误
        data: channelRecord   // 插入成功的记录
    } = await supabase
        .from("channels")     // 目标表
        .insert({
            name,                  // 频道名称
            workspace_id: workspaceId, // 所属工作区
            user_id: userId,       // 创建者
        })
        .select("*");         // 返回完整记录

    // 第31-33行：错误处理
    if (error) {
        return { error: "Insert Error" };
    }

    // ============ 步骤2：更新频道成员列表 ============
    // 第36-37行：调用 updateChannelMembers 函数
    const [updateChannelData, updateChannelMembersError] =
        await updateChannelMembers(
            channelRecord[0].id,  // 新频道的 ID
            userId                // 创建者 ID
        );

    // 第39-43行：错误处理和日志
    if (updateChannelMembersError) {
        console.error("❌ Update channel members error:", updateChannelMembersError);
        return { 
            error: "Update Members Channel Error", 
            details: updateChannelMembersError 
        };
    }
    console.log("✅ Channel members updated");

    // ============ 步骤3：更新用户的频道列表 ============
    // 第46-49行：调用 addChannelToUser 函数
    const [addChannelToUserData, addChannelToUserError] = 
        await addChannelToUser(
            userId,              // 用户 ID
            channelRecord[0].id  // 频道 ID
        );

    // 第51-55行：错误处理和日志
    if (addChannelToUserError) {
        console.error("❌ Add channel to user error:", addChannelToUserError);
        return { 
            error: "Add Channel to User Error", 
            details: addChannelToUserError 
        };
    }
    console.log("✅ Channel added to user");

    // ============ 步骤4：更新工作区的频道列表 ============
    // 第58-59行：调用 updateWorkspaceChannel 函数
    const [updateWorkspaceChannelData, updateWorkspaceChannelError] =
        await updateWorkspaceChannel(
            channelRecord[0].id, // 频道 ID
            workspaceId          // 工作区 ID
        );

    // 第61-65行：错误处理和日志
    if (updateWorkspaceChannelError) {
        console.error("❌ Update workspace error:", updateWorkspaceChannelError);
        return { 
            error: "Update Workspace Channel Error", 
            details: updateWorkspaceChannelError 
        };
    }
    console.log("✅ Workspace updated");

    // ============ 步骤5：返回成功结果 ============
    // 第67行：返回成功信息和新频道数据
    return { 
        success: true, 
        data: channelRecord[0]  // 新创建的频道完整信息
    };
};
```

### 辅助函数1：updateChannelMembers

```typescript
// 第72-85行：更新频道成员列表
export const updateChannelMembers = async (
    channelId: string,  // 频道 ID
    userId: string      // 要添加的用户 ID
) => {
    // 获取 Supabase 客户端
    const supabase = await supabaseServerClient();

    // 调用数据库 RPC 函数
    const { 
        data: updateChannelData, 
        error: updateChannelError 
    } = await supabase.rpc("update_channel_members", {
        new_member: userId,   // 新成员 ID
        channel_id: channelId // 目标频道 ID
    });

    // 返回 [数据, 错误]
    return [updateChannelData, updateChannelError];
};
```

**对应的 SQL 函数**：

```sql
CREATE OR REPLACE FUNCTION update_channel_members(
  new_member text,
  channel_id uuid
) RETURNS void AS $$
BEGIN
  UPDATE channels 
  SET members = COALESCE(channels.members, '{}') || array[new_member]
  WHERE channels.id = channel_id;
END;
$$ LANGUAGE plpgsql;
```

### 辅助函数2：addChannelToUser

```typescript
// 第87-96行：将频道添加到用户的频道列表
export const addChannelToUser = async (
    userId: string,    // 用户 ID
    channelId: string  // 频道 ID
) => {
    const supabase = await supabaseServerClient();
  
    const { 
        data: addChannelToUserData, 
        error: addChannelToUserError 
    } = await supabase.rpc("update_user_channels", {
        user_id: userId,      // 目标用户
        channel_id: channelId // 要添加的频道
    });

    return [addChannelToUserData, addChannelToUserError];
};
```

**对应的 SQL 函数**：

```sql
CREATE OR REPLACE FUNCTION update_user_channels(
  user_id uuid,
  channel_id text
) RETURNS void AS $$
BEGIN
  UPDATE users 
  SET channels = COALESCE(users.channels, '{}') || array[channel_id]
  WHERE users.id = user_id;
END;
$$ LANGUAGE plpgsql;
```

### 辅助函数3：updateWorkspaceChannel

```typescript
// 第98-112行：将频道添加到工作区的频道列表
export const updateWorkspaceChannel = async (
    channelId: string,   // 频道 ID
    workspaceId: string  // 工作区 ID
) => {
    const supabase = await supabaseServerClient();
  
    const {
        data: updateWorkspaceChannelData,
        error: updateWorkspaceChannelError,
    } = await supabase.rpc("add_channel_to_workspace", {
        channel_id: channelId,     // 要添加的频道
        workspace_id: workspaceId  // 目标工作区
    });

    return [updateWorkspaceChannelData, updateWorkspaceChannelError];
};
```

**对应的 SQL 函数**：

```sql
CREATE OR REPLACE FUNCTION add_channel_to_workspace(
  channel_id text,
  workspace_id uuid
) RETURNS void AS $$
BEGIN
  UPDATE workspaces 
  SET channels = COALESCE(workspaces.channels, '{}') || array[channel_id]
  WHERE workspaces.id = workspace_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. 函数间联动关系

### 🔄 创建频道的完整流程

```
用户点击"Create Channel"按钮
        ↓
前端调用 createChannel()
        ↓
┌───────────────────────────────────────────┐
│ createChannel() 主函数                     │
│                                           │
│ 步骤1: 插入 channels 表                    │
│   └─> 直接调用 supabase.from().insert()  │
│                                           │
│ 步骤2: 更新频道成员                        │
│   └─> 调用 updateChannelMembers()        │
│       └─> RPC: update_channel_members    │
│           └─> 更新 channels.members      │
│                                           │
│ 步骤3: 更新用户频道列表                    │
│   └─> 调用 addChannelToUser()            │
│       └─> RPC: update_user_channels      │
│           └─> 更新 users.channels        │
│                                           │
│ 步骤4: 更新工作区频道列表                  │
│   └─> 调用 updateWorkspaceChannel()      │
│       └─> RPC: add_channel_to_workspace  │
│           └─> 更新 workspaces.channels   │
│                                           │
│ 步骤5: 返回成功结果                        │
└───────────────────────────────────────────┘
        ↓
前端收到结果，刷新页面
        ↓
频道列表显示新频道 ✅
```

### 📊 函数调用层次图

```
Layer 1 (前端)
    └─> createChannel()
      
Layer 2 (主业务逻辑)
    ├─> getUserData()          [验证用户]
    ├─> supabase.insert()      [创建记录]
    ├─> updateChannelMembers() [更新成员]
    ├─> addChannelToUser()     [关联用户]
    └─> updateWorkspaceChannel() [关联工作区]

Layer 3 (数据库操作)
    ├─> RPC: update_channel_members
    ├─> RPC: update_user_channels
    └─> RPC: add_channel_to_workspace

Layer 4 (PostgreSQL)
    ├─> UPDATE channels SET members = ...
    ├─> UPDATE users SET channels = ...
    └─> UPDATE workspaces SET channels = ...
```

---

## 5. Supabase 数据库表联动

### 📦 数据库表结构

#### **users 表**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  workspaces TEXT[],  -- 用户所属的工作区 ID 数组
  channels TEXT[],    -- 用户所属的频道 ID 数组
  created_at TIMESTAMP
);
```

#### **workspaces 表**

```sql
CREATE TABLE workspaces (
  id UUID PRIMARY KEY,
  name TEXT,
  slug TEXT,
  super_admin UUID,    -- 超级管理员 ID
  members TEXT[],      -- 成员 ID 数组
  channels TEXT[],     -- 频道 ID 数组
  regulators TEXT[],   -- 管理员 ID 数组
  created_at TIMESTAMP
);
```

#### **channels 表**

```sql
CREATE TABLE channels (
  id UUID PRIMARY KEY,
  name TEXT,
  workspace_id UUID,   -- 所属工作区 ID
  user_id UUID,        -- 创建者 ID
  members TEXT[],      -- 成员 ID 数组
  regulators TEXT[],   -- 管理员 ID 数组
  created_at TIMESTAMP
);
```

### 🔗 表之间的关系图

```
┌─────────────────────┐
│      users          │
│ ─────────────────── │
│ id: UUID            │
│ workspaces: TEXT[]  │────┐
│ channels: TEXT[]    │──┐ │
└─────────────────────┘  │ │
                         │ │
         ┌───────────────┘ │
         │                 │
         ↓                 ↓
┌─────────────────────┐ ┌─────────────────────┐
│    workspaces       │ │     channels        │
│ ─────────────────── │ │ ─────────────────── │
│ id: UUID            │ │ id: UUID            │
│ members: TEXT[]     │ │ workspace_id: UUID  │←┐
│ channels: TEXT[]    │─→│ members: TEXT[]     │ │
│ super_admin: UUID   │ │ user_id: UUID       │ │
└─────────────────────┘ └─────────────────────┘ │
         ↑                         │              │
         └─────────────────────────┘              │
                                                  │
                          └───────────────────────┘
```

### 🔄 创建频道时的数据流动

```
1. 创建频道记录
   INSERT INTO channels (name, workspace_id, user_id)
   VALUES ('fun', 'workspace-123', 'user-456')
   RETURNING id;
   
   结果: channel_id = 'channel-789'

2. 更新频道成员列表
   UPDATE channels 
   SET members = members || ARRAY['user-456']
   WHERE id = 'channel-789';
   
   channels表变化:
   ├─ id: 'channel-789'
   ├─ name: 'fun'
   ├─ workspace_id: 'workspace-123'
   ├─ user_id: 'user-456'
   └─ members: ['user-456'] ✅

3. 更新用户频道列表
   UPDATE users 
   SET channels = channels || ARRAY['channel-789']
   WHERE id = 'user-456';
   
   users表变化:
   ├─ id: 'user-456'
   ├─ workspaces: ['workspace-123']
   └─ channels: [..., 'channel-789'] ✅

4. 更新工作区频道列表
   UPDATE workspaces 
   SET channels = channels || ARRAY['channel-789']
   WHERE id = 'workspace-123';
   
   workspaces表变化:
   ├─ id: 'workspace-123'
   ├─ members: ['user-456']
   └─ channels: [..., 'channel-789'] ✅
```

### 📝 多对多关系维护

这个系统使用**数组字段**来维护多对多关系，而不是传统的关联表。

#### **传统方式（关联表）**

```sql
-- 需要额外的表
CREATE TABLE user_channels (
  user_id UUID,
  channel_id UUID,
  PRIMARY KEY (user_id, channel_id)
);
```

#### **当前方式（数组字段）**

```sql
-- 直接在表中存储数组
users.channels: ['channel-1', 'channel-2']
channels.members: ['user-1', 'user-2']
```

**优点**：

- ✅ 查询简单：`SELECT * FROM users WHERE 'channel-id' = ANY(channels)`
- ✅ 更新方便：`UPDATE users SET channels = channels || ARRAY['new-id']`
- ✅ 减少 JOIN 操作

**缺点**：

- ❌ 数组大小有限制
- ❌ 数据可能不一致（需要同步更新多个表）
- ❌ 删除操作复杂

---

## 6. 完整示例：创建频道 "fun"

### 前端代码

```tsx
// CreateChannelDialog.tsx
const onSubmit = async ({ name }: FormData) => {
  const result = await createChannel({
    name: 'fun',
    workspaceId: 'workspace-123',
    userId: 'user-456'
  });
  
  if (result.success) {
    toast.success('频道创建成功！');
    router.refresh();
  }
}
```

### 后端执行流程

```
1. createChannel() 被调用
   参数: { name: 'fun', workspaceId: '...', userId: '...' }

2. 插入 channels 表
   SQL: INSERT INTO channels ...
   结果: { id: 'channel-789', name: 'fun', ... }

3. 调用 updateChannelMembers('channel-789', 'user-456')
   RPC: update_channel_members
   SQL: UPDATE channels SET members = ... WHERE id = 'channel-789'
   结果: channels.members = ['user-456']

4. 调用 addChannelToUser('user-456', 'channel-789')
   RPC: update_user_channels
   SQL: UPDATE users SET channels = ... WHERE id = 'user-456'
   结果: users.channels = [..., 'channel-789']

5. 调用 updateWorkspaceChannel('channel-789', 'workspace-123')
   RPC: add_channel_to_workspace
   SQL: UPDATE workspaces SET channels = ... WHERE id = 'workspace-123'
   结果: workspaces.channels = [..., 'channel-789']

6. 返回成功
   return { success: true, data: { id: 'channel-789', ... } }
```

### 数据库最终状态

```
channels 表:
┌──────────────┬──────┬────────────────┬──────────┬──────────────┐
│ id           │ name │ workspace_id   │ user_id  │ members      │
├──────────────┼──────┼────────────────┼──────────┼──────────────┤
│ channel-789  │ fun  │ workspace-123  │ user-456 │ ['user-456'] │
└──────────────┴──────┴────────────────┴──────────┴──────────────┘

users 表:
┌──────────┬────────────────────┬─────────────────────────┐
│ id       │ workspaces         │ channels                │
├──────────┼────────────────────┼─────────────────────────┤
│ user-456 │ ['workspace-123']  │ [..., 'channel-789']    │
└──────────┴────────────────────┴─────────────────────────┘

workspaces 表:
┌────────────────┬─────────────────────┬─────────────────────┐
│ id             │ members             │ channels            │
├────────────────┼─────────────────────┼─────────────────────┤
│ workspace-123  │ ['user-456']        │ [..., 'channel-789']│
└────────────────┴─────────────────────┴─────────────────────┘
```

---

## 7. 常见问题

### Q1: 为什么返回 `[data, error]` 而不是 `{ data, error }`？

**A:** 数组解构更简洁：

```typescript
// 数组方式
const [data, error] = await someFunc();

// 对象方式（需要重命名避免冲突）
const { data: myData, error: myError } = await someFunc();
```

### Q2: 为什么不用事务（Transaction）？

**A:** 应该使用！当前代码的问题是如果某个步骤失败，之前的操作不会回滚。建议改用单个 RPC 函数：

```sql
CREATE OR REPLACE FUNCTION create_channel_complete(...)
RETURNS json AS $$
BEGIN
  -- 所有操作在一个事务中
  INSERT INTO channels ...;
  UPDATE channels ...;
  UPDATE users ...;
  UPDATE workspaces ...;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

### Q3: COALESCE 的作用是什么？

**A:** 处理 NULL 值：

```sql
COALESCE(channels.members, '{}')
-- 如果 members 是 NULL，用空数组 {} 代替
-- 这样 || array[new_member] 就不会出错
```

---

## 8. 总结

### 核心要点

1. **Server Actions** 使用 `"use server"` 标记
2. **RPC 调用** 用于执行数据库函数
3. **数组操作** 使用 `||` 运算符追加元素
4. **错误处理** 每个步骤都检查错误
5. **数据同步** 多个表需要保持一致性

### 改进建议

1. ✅ 使用单个 RPC 函数实现原子性
2. ✅ 添加 TypeScript 类型检查
3. ✅ 统一返回格式（都用对象或都用数组）
4. ✅ 添加更详细的错误日志
5. ✅ 考虑使用关联表代替数组字段（大规模应用）

---

**文档创建时间：** 2024年11月
**作者：** AI Assistant
**版本：** 1.0
