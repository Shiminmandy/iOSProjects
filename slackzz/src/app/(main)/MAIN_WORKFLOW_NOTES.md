## （main）目录下工作流笔记（已逐条校对 + 补全）

> 目标：用“工作流/时间线”的方式解释 `src/app/(main)/` 下的路由与 `children` 注入。
> 
> 适用代码：
> - `src/app/(main)/layout.tsx`
> - `src/app/(main)/page.tsx`
> - `src/app/(main)/workspace/[workspaceId]/page.tsx`
> - `src/app/(main)/workspace/[workspaceId]/channels/[channelId]/page.tsx`

---

### 0. 先纠正两个最容易混淆的点（你原笔记里不够准确的地方）

- **（main）不是 URL 的一部分**
  - ✅ 正确说法：`(main)` 是 Next.js 的 **Route Group（路由分组）**，只用于组织代码、套用 layout，不会出现在 URL 中。
  - 例如：`src/app/(main)/page.tsx` 对应 URL 仍然是 `/`。

- **Next.js 不会“先加载 layout 再加载 page”，更准确是“layout 包裹 page 的渲染结果”**
  - ✅ 你可以理解为：最终 UI = `layout.tsx` 返回的外壳 + `{children}`（页面内容）
  - `{children}` = 该次路由命中的 `page.tsx` 的渲染结果（JSX/React Element）

---

### 1. （main）的外壳：`layout.tsx`

#### 1.1 它在工作流里的位置
当用户访问 `(main)` 路由树下任意页面（例如 `/`、`/workspace/:id`、`/workspace/:id/channels/:id`），Next.js 会把该页面的渲染结果作为 `children` 传给 `(main)/layout.tsx`。

你可以把它理解成：

- 访问 `/workspace/abc` 时：
  - 命中 `workspace/[workspaceId]/page.tsx`（页面内容）
  - 然后 Next.js 运行 `(main)/layout.tsx`，把上面页面内容塞给 `{children}`

#### 1.2 它解决的需求（你原笔记正确，但这里补全）
- **全站共享主题**：`ThemeProvider`
- **全站共享颜色偏好**：`ColorPreferencesProvider`
- **全站共享 WebSocket 单例连接**：`WebSocketProvider`
- **统一布局/背景/边距**：`MainContent`

#### 1.3 “切换页面 layout 不卸载”这句话的边界
- ✅ 正确场景：在同一 `(main)` 路由树内用 `router.push()` 切换页面，`layout` 通常会保持，不会重新挂载（因此 Provider 不重建）。
- ⚠️ 例外：刷新页面、离开 `(main)` 路由树、或者某些导致整棵树重建的情况，layout 仍会重新执行。

#### 1.4 你笔记里第 5 点需要修正
- ❌ 原句："此项目使用 bun sdk，tsx 无需编译成 jsx"
- ✅ 更准确：
  - bun 只是运行脚本（`bun run dev`），真正编译 TS/TSX 的是 Next.js 的构建链路（SWC/webpack 等）。
  - TSX 最终仍会被编译成 JS（React runtime 可执行的代码）。

---

### 2. 页面内容：所有命名为 `page.tsx` 的文件

> 你的笔记总体正确，但补充几点：

- `page.tsx` 是 App Router 里“路由入口文件”的默认命名（也可以是 `page.js`）。
- 同级还可能出现：`layout.tsx`、`loading.tsx`、`error.tsx`、`not-found.tsx` 等，它们不是页面，但影响工作流。

---

### 3. 顶层入口页：`src/app/(main)/page.tsx`（URL：`/`）

#### 3.1 它在做什么（工作流）
1. 服务器端执行 `Home()`（这是 Server Component / server-side logic）
2. `getUserData()`：获取当前登录用户
3. 如果没登录：`redirect('/auth')`
4. 如果登录：读取用户的第一个 workspaceId
5. 若用户没有任何 workspace：`redirect('/create-workspace')`
6. 若用户有 workspace：`redirect('/workspace/${userWorkspaceId}')`

#### 3.2 你笔记里“action function”这个词要小心
- 你写的“action function”想表达“从服务端拿数据”，方向没错。
- 但在 Next.js 里，**Server Action** 通常特指带 `"use server"` 并可从客户端直接调用的函数。
- `getUserData()` 在你的项目里是“服务端函数/数据获取函数”，不一定要称为 Server Action。

---

### 4. Workspace 主页：`src/app/(main)/workspace/[workspaceId]/page.tsx`（URL：`/workspace/:workspaceId`）

#### 4.1 它代表什么页面
- ✅ 你的描述正确：这是“进入某个 workspace，但还没进入具体 channel”的页面。

#### 4.2 它的工作流
1. Next.js 从 URL 解析动态参数：`params.workspaceId`
2. `getUserData()` 做登录校验；无用户则 `redirect('/auth')`
3. 查询并准备渲染需要的数据：
   - **用户加入的所有 workspaces 的详细数据**（用于侧边栏切换）
   - **当前 workspace 的详细数据**（用于显示名称、信息等）
   - **当前 workspace 下该用户可见的 channels**（用于频道列表）
4. 渲染 UI：
   - `Sidebar`（工作区切换/用户信息）
   - `InfoSection`（频道列表）
   - `currentChannelId=''`（不高亮频道）

#### 4.3 你笔记里“每个 page 文件都有登录校验”
- ✅ 你的项目现在确实是这么写的。
- ⚠️ 但从框架角度说：这不是“必须”，而是你的项目选择。也可以在更上层统一做鉴权。

---

### 5. Channel 页面：`src/app/(main)/workspace/[workspaceId]/channels/[channelId]/page.tsx`

#### 5.1 它代表什么页面
- ✅ 你的描述正确：在某个 workspace 内选择了某个具体频道。

#### 5.2 它的工作流
1. Next.js 从 URL 得到：`workspaceId`、`channelId`
2. 登录校验：无用户则 `redirect('/auth')`
3. 加载数据：
   - 用户 workspaces 列表
   - 当前 workspace 详情
   - 用户在该 workspace 可见的 channels
4. 从 channels 列表中 `find()` 出 `currentChannelData`
   - 找不到就 `redirect('/')`（可能是没权限或不存在）
5. 渲染聊天界面（你现在用 `ChatGroup` 封装了原先的 Sidebar/InfoSection/TextEditor 等）

---

### 6. 一句总结（把你整份笔记串起来）

- `layout.tsx`：提供“外壳”和全局能力（主题/颜色/WebSocket/布局）
- `page.tsx`：提供“具体页面内容”，并由 Next.js 注入到 layout 的 `{children}`
- 动态路由 `[workspaceId]` / `[channelId]`：决定 `params` 的 key 与值，驱动页面加载不同 workspace/channel 的数据



