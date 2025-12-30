import { workspaceInvite } from "@/actions/workspaces";
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { redirect } from "next/navigation";


{/***
    用于处理工作区邀请链接。用户访问 /create-workspace/[invite] 时，会自动加入工作区并重定向到工作区首页
    */}
const InvitePage = async ({
    params: {invite: inviteCode},  // 从路由参数params中解构出invite并赋值给inviteCode,等价于const inviteCode = params.invite
}: {
    params: {invite: string}     // 参数类型注解，invite是string类型
}) => {

    /** 接受邀请加入工作区 - 内部验证邀请码，检查用户是否已经加入工作区，检查用户是否是管理员，如果成功则添加到工作区成员和用户工作区 */
    await workspaceInvite(inviteCode);

    const supabase = await supabaseServerClient();

    /** 查询工作区数据，确保工作区存在，用于重定向到工作区首页 */
    const {data} = await supabase
    .from('workspaces')
    .select('*')
    .eq('invite_code', inviteCode)
    .single();

    if (data) {
        redirect(`/workspace/${data.id}`);
    }else{
        redirect('/create-workspace')
    }

    
}

{/** 
    1. 用户访问: /create-workspace/ABC123
    ↓
    2. Next.js 路由匹配: [invite]/page.ts
    ↓
    3. 提取参数: inviteCode = "ABC123"
    ↓
    4. 调用 workspaceInvite("ABC123")
    - 查询工作区
    - 检查用户状态
    - 添加用户到工作区
    - 添加工作区到用户
    ↓
    5. 再次查询工作区数据
    - 获取完整的 workspace 信息
    - 特别是 id: "workspace-456"
    ↓
    6. 检查 data 是否存在
    - data = { id: "workspace-456", ... } ✅
    ↓
    7. 重定向到: /workspace/workspace-456
    ↓
    8. 用户看到工作区页面 ✅
    
    */}