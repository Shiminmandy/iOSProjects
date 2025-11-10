"use server";

import { supabaseServerClient } from "@/supabase/supabaseServer";

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

  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', workspaceId)
    .single();

  return [ data, error ];
}