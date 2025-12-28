/**
 * ============================================
 * 文件作用 (File Purpose)
 * ============================================
 * 
 * 这是一个 Next.js API 路由处理器，用于处理频道消息的更新和删除操作。
 * 主要功能：
 * 1. PATCH 请求：更新消息内容（仅消息所有者可以编辑）
 * 2. DELETE 请求：删除消息（消息所有者、管理员、监管者可以删除）
 * 3. 通过 Socket.IO 实时广播消息变更到所有连接的客户端
 * 
 * ============================================
 * 文件如何被触发 (How This File Is Triggered)
 * ============================================
 * 
 * 1. 前端触发方式：
 *    - 删除消息：用户在聊天界面点击删除按钮，触发 axios.delete() 请求
 *      调用路径：/api/web-socket/messages/[messageId]?channelId=xxx&workspaceId=xxx
 *    - 编辑消息：用户在聊天界面编辑消息后提交表单，触发 axios.patch() 请求
 *      调用路径：/api/web-socket/messages/[messageId]?channelId=xxx&workspaceId=xxx
 * 
 * 2. 路由匹配：
 *    - Next.js 动态路由：[messageId] 会被解析为实际的消息 ID
 *    - 查询参数：channelId 和 workspaceId 从 URL 查询字符串获取
 * 
 * 3. 触发位置：
 *    - 组件：src/components/chat-item.tsx
 *    - 删除：handleDelete() 函数（第 88-94 行）
 *    - 编辑：onSubmit() 函数（需要实现 PATCH 请求）
 * 
 * ============================================
 * 工作流 (Workflow)
 * ============================================
 * 
 * 1. 请求验证阶段：
 *    ├─ 检查请求方法是否为 PATCH 或 DELETE
 *    ├─ 验证用户身份（getUserDataPages）
 *    └─ 验证请求参数（messageId, channelId, workspaceId）
 * 
 * 2. 权限验证阶段：
 *    ├─ 从数据库查询消息数据（包含用户信息）
 *    ├─ 判断用户身份：
 *    │   ├─ isMessageOwner：是否为消息所有者
 *    │   ├─ isAdmin：是否为管理员
 *    │   └─ isRegulator：是否为监管者
 *    └─ 根据操作类型检查权限：
 *        ├─ PATCH：仅消息所有者可以编辑
 *        └─ DELETE：消息所有者、管理员、监管者可以删除（且消息未被删除）
 * 
 * 3. 数据操作阶段：
 *    ├─ PATCH 请求：
 *    │   └─ 调用 updateMessageContent() 更新消息内容和 updated_at 时间戳
 *    └─ DELETE 请求：
 *        └─ 调用 deleteMessage() 软删除消息（设置 is_deleted=true，清空 file_url）
 * 
 * 4. 响应与广播阶段：
 *    ├─ 重新查询更新后的消息数据（包含用户关联信息）
 *    ├─ 通过 Socket.IO 广播消息更新事件：
 *    │   └─ 事件名：channel:${channelId}:channel-messages:update
 *    │   └─ 数据：更新后的完整消息对象
 *    └─ 返回 HTTP 200 响应，包含更新后的消息数据
 * 
 * ============================================
 */

import { NextApiRequest } from "next";
import { SocketIoApiResponse } from "@/types/app";
import { getUserDataPages } from "@/actions/get-user-data";
import SupabaseServerClientPages from "@/supabase/supabaseServerPages";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * 主处理器函数
 * 
 * 作用：
 * - 处理消息的更新（PATCH）和删除（DELETE）请求
 * - 执行权限验证、数据操作和实时广播
 * 
 * @param req - Next.js API 请求对象，包含：
 *              - method: 请求方法（PATCH 或 DELETE）
 *              - query: URL 查询参数（messageId, channelId, workspaceId）
 *              - body: 请求体（PATCH 时包含 content 字段）
 * @param res - Socket.IO 扩展的响应对象，支持实时广播
 * @returns JSON 响应，包含操作结果或错误信息
 */
export default async function handler(
  req: NextApiRequest,
  res: SocketIoApiResponse
) {
  // ========== 步骤 1: 请求方法验证 ==========
  // 只允许 PATCH（更新）和 DELETE（删除）请求
  if (!["DELETE", "PATCH"].includes(req.method!)) {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ========== 步骤 2: 用户身份验证 ==========
    // 从请求中获取当前登录用户的数据（包含用户 ID、类型等信息）
    const userData = await getUserDataPages(req, res);

    if (!userData) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // ========== 步骤 3: 请求参数提取与验证 ==========
    // 从 URL 查询参数中提取消息 ID、频道 ID 和工作区 ID
    const { messageId, channelId, workspaceId } = req.query as Record<
      string,
      string
    >;

    // 验证必需参数是否存在
    if (!messageId || !channelId || !workspaceId) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // 从请求体中提取消息内容（PATCH 请求时需要）
    const { content } = req.body;

    // ========== 步骤 4: 初始化 Supabase 客户端 ==========
    // 获取服务端 Supabase 客户端实例，用于数据库操作
    const supabase = await SupabaseServerClientPages(req, res);

    // ========== 步骤 5: 查询消息数据 ==========
    // 从数据库查询目标消息，同时关联查询用户信息
    // select("*, user:user_id(*)") 表示查询消息的所有字段，并通过 user_id 外键关联用户表
    const { data: messageData, error } = await supabase
      .from("messages")
      .select("*, user:user_id(*)")
      .eq("id", messageId)
      .single();

    // 如果消息不存在，返回 404 错误
    if (error || !messageData) {
      return res.status(404).json({ error: "Message not found" });
    }

    // ========== 步骤 6: 权限判断 ==========
    // 用户类型：'user'（普通用户）、'admin'（管理员）、'regulator'（监管者）
    const isMessageOwner = messageData.user_id === userData.id; // 是否为消息所有者
    const isAdmin = userData.type === "admin"; // 是否为管理员
    const isRegulator = userData.type === "regulator"; // 是否为监管者

    // 编辑权限：只有消息所有者可以编辑，且消息未被删除
    const canEditMessage = isMessageOwner || !messageData.is_deleted;

    // 如果用户没有编辑权限，返回 403 错误
    if (!canEditMessage) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // ========== 步骤 7: 执行具体操作 ==========
    if (req.method === "PATCH") {
      // PATCH 请求：更新消息内容
      // 只有消息所有者可以编辑自己的消息
      if (!isMessageOwner) {
        return res.status(403).json({ error: "Forbidden" });
      }

      // 调用更新函数，更新消息内容和更新时间戳
      await updateMessageContent(supabase, messageId, content);
    } else if (req.method === "DELETE") {
      // DELETE 请求：删除消息
      // 消息所有者、管理员、监管者都可以删除（已在 canEditMessage 中验证）
      await deleteMessage(supabase, messageId);
    }

    // ========== 步骤 8: 重新查询更新后的消息 ==========
    // 操作完成后，重新查询消息数据（包含关联的用户信息）
    // 确保返回给客户端的是最新的完整数据
    const { data: updatedMessage, error: messageError } = await supabase
      .from("messages")
      .select("*, user:user_id(*)")
      .order("created_at", { ascending: true })
      .eq("id", messageId)
      .single();

    // 如果查询失败，返回 500 错误
    if (messageError || !updatedMessage) {
      return res.status(500).json({ error: "Message not found" });
    }

    // ========== 步骤 9: Socket.IO 实时广播 ==========
    // 通过 Socket.IO 向所有连接到该频道的客户端广播消息更新事件
    // 事件名格式：channel:{channelId}:channel-messages:update
    // 这样所有在该频道的用户都能实时看到消息的变更
    //TODO: 理解广播事件中的事件名
    res?.socket?.server?.io?.emit(
      `channel:${channelId}:channel-messages:update`,
      updatedMessage
    );

    // ========== 步骤 10: 返回成功响应 ==========
    // 返回 HTTP 200 状态码和更新后的消息数据
    return res.status(200).json({ message: updatedMessage });
  } catch (error) {
    // ========== 错误处理 ==========
    // 捕获所有未预期的错误，记录日志并返回 500 错误
    console.log("MESSAGE UPDATE ERROR: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * 更新消息内容函数
 * 
 * 作用：
 * - 更新指定消息的内容和更新时间戳
 * - 用于 PATCH 请求处理消息编辑操作
 * 
 * 操作说明：
 * - 更新 content 字段为新的消息内容
 * - 更新 updated_at 字段为当前时间（ISO 8601 格式）
 * - 返回更新后的完整消息数据（包含关联的用户信息）
 * 
 * @param supabase - Supabase 客户端实例，用于执行数据库操作
 * @param messageId - 要更新的消息 ID
 * @param content - 新的消息内容（HTML 格式字符串）
 * @returns Promise，执行更新操作（不返回数据，由调用方重新查询）
 */
async function updateMessageContent(
  supabase: SupabaseClient,
  messageId: string,
  content: string
) {
  await supabase
    .from("messages")
    .update({
      content, // 更新消息内容
      updated_at: new Date().toISOString(), // 更新修改时间戳
    })
    .select("*, user:user_id(*)") // 返回更新后的消息和关联的用户信息
    .eq("id", messageId) // 匹配指定 ID 的消息
    .single(); // 返回单条记录
}

/**
 * 删除消息函数（软删除）
 * 
 * 作用：
 * - 执行消息的软删除操作（不真正删除记录，而是标记为已删除）
 * - 用于 DELETE 请求处理消息删除操作
 * 
 * 操作说明：
 * - 将 content 字段设置为删除提示文本："This message has been deleted"
 * - 清空 file_url 字段（删除关联的文件）
 * - 设置 is_deleted 标志为 true
 * - 返回更新后的完整消息数据（包含关联的用户信息）
 * 
 * 注意：
 * - 这是软删除（soft delete），消息记录仍保留在数据库中
 * - 前端可以通过 is_deleted 字段判断消息是否已删除
 * - 已删除的消息内容会被替换为固定文本，文件链接会被清除
 * 
 * @param supabase - Supabase 客户端实例，用于执行数据库操作
 * @param messageId - 要删除的消息 ID
 * @returns Promise，执行删除操作（不返回数据，由调用方重新查询）
 */
async function deleteMessage(supabase: SupabaseClient, messageId: string) {
  await supabase
    .from("messages")
    .update({
      content: "This message has been deleted", // 替换消息内容为删除提示
      file_url: null, // 清空文件链接
      is_deleted: true, // 标记消息为已删除状态
    })
    .select("*, user:user_id(*)") // 返回更新后的消息和关联的用户信息
    .eq("id", messageId) // 匹配指定 ID 的消息
    .single(); // 返回单条记录
}
