"use server";

import { supabaseServerClient } from "@/supabase/supabaseServer";
import { getUserData } from "./get-user-data";
import { addMemberToWorkspace } from "./add-member-to-workspace";
import { updateUserWorkspace } from "./update-user-workspace";

// 批量获取用户工作区数据
export const getUserWorkspaceData = async (workspaceIds: Array<string>) => {
  const supabase = await supabaseServerClient();

  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .in("id", workspaceIds);

    return [ data, error ];
};


// 获取特定工作区数据
export const getCurrentWorkspaceData = async (workspaceId: string) => {

  const supabase = await supabaseServerClient();

  /** 
   * 查询制定工作区的所有字段，通过channels(*)关联查询该工作区的所有频道，返回结果包含工作区数据和频道数据
   */
  const { data, error } = await supabase
    .from('workspaces')
    .select('*, channels(*)')
    .eq('id', workspaceId)
    .single();

  if (error) {
    return [null,error];
  }

  /** 获取当前工作区成员数据 */
  const {members} = data;

  /** 
   * 并行查询所有成员的详细信息
   *  1. 调用: getCurrentWorkspaceData("workspace-123")
        ↓
      2. 查询工作区数据
        SELECT * FROM workspaces WHERE id = 'workspace-123'
        + 关联查询 channels
        ↓
      3. 获取数据
        data = {
          id: "workspace-123",
          members: ["user-1", "user-2", "user-3"],
          channels: [...]
        }
        ↓
      4. 提取成员 ID
        members = ["user-1", "user-2", "user-3"]
        ↓
      5. 并行查询成员详细信息
        Promise.all([
          SELECT * FROM users WHERE id = 'user-1',
          SELECT * FROM users WHERE id = 'user-2',
          SELECT * FROM users WHERE id = 'user-3'
        ])
        ↓
      6. 获取成员数据
        memberDetails = [
          { id: "user-1", name: "Alice", ... },
          { id: "user-2", name: "Bob", ... },
          { id: "user-3", name: "Charlie", ... }
        ]
        ↓
      7. 更新 data.members
        data.members = memberDetails
        ↓
      8. 返回结果
        return [data, null]
   */

        // 可以使用in优化查询，一次性查询多个用户数据
  const memberDetails = await Promise.all(
    members.map(async (memberId: string) => {
      const {data: userData, error: userError} = await supabase
      .from('users')
      .select('*')
      .eq('id', memberId)
      .single();

      if (userError) {
        console.log(`Error fetching user data for member ${memberId}`, userError);
        return null;
      }
      return userData;

    })
  )

  data.members = memberDetails.filter(member => member !== null);

  return [ data, error ];
}

{/** 接受邀请加入工作区 
  步骤	操作	    目的
  1	获取用户数据	身份验证
  2	查询工作区	验证邀请码
  3	错误处理	处理查询失败
  4	检查成员状态	避免重复添加
  5	检查管理员状态	避免重复操作
  6	添加到工作区成员	更新 workspaces.members
  7	添加到用户工作区	更新 users.workspaces
  */}

export const workspaceInvite = async (inviteCode: string) => {

  const supabase = await supabaseServerClient();
  const userData = await getUserData();

  const {data, error} = await supabase
  .from('workspaces')
  .select('*')
  .eq('invite_code', inviteCode)
  .single();

  if (error) {
    console.log('Error fetching workspace invite', error);
    return;
  }

  const isUserMember = data?.members?.includes(userData?.id);

  if (isUserMember) {
    console.log('User is already a member of this workspace');
    return;
  }

  if (data?.super_admin === userData?.id) {
    console.log('User is the super admin of this workspace');
    return;
  }

  await addMemberToWorkspace(userData?.id!, data?.id);
  await updateUserWorkspace(userData?.id!, data?.id);

}