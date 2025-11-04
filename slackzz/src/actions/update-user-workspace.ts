"use server";

import { supabaseServerClient } from "@/supabase/supabaseServer";

export const updateUserWorkspace = async (userId: string, workspaceId: string) => {
  const supabase = await supabaseServerClient();

  // Update the user record
  const {data:updateWorkspaceData, error: updateWorkspaceError} = await supabase.rpc("add_workspace_to_user", {
    user_id: userId,
    new_workspace: workspaceId,
  });

  return [updateWorkspaceData, updateWorkspaceError];
};

// 目的： 找到指定用户，将新工作区id追加到用户的workspaces数组中
// 第一步： 导出异步函数定义，参数是userId和workspaceId，关联到数据库表users和workspaces
// 第二步： 导入supabase服务器客户端获取实例，是server action，必须使用await
// 第三步： 更新用户记录， 调用数据库中定义的函数rpc，使用add_workspace_to_user函数，参数是userId和workspaceId，
// 结构赋值data和error，返回[updateWorkspaceData, updateWorkspaceError]，这两个都是自定义的变量名
