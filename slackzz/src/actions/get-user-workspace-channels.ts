"use server";

import { supabaseServerClient } from "@/supabase/supabaseServer";
import { Channel } from "@/types/app";


/**
 * 根据传入的workspaceId和userId，先查用户所在工作区有哪些频道 ID → 再查这些频道的详情 → 最后过滤出用户是成员的频道
 */
export const getUserWorkspaceChannels = async (
  workspaceId: string,
  userId: string
) => {
  const supabase = await supabaseServerClient();
  const { data: workspaceData, error: workspaceError } = await supabase
    .from("workspaces")
    .select("channels")
    .eq("id", workspaceId)
    .single();

  if (workspaceError ) {
    return { error: "Failed to fetch workspace channels" };
  }

  const channelIds = workspaceData.channels;

  if (!channelIds || channelIds.length === 0) {
    console.log("No channels found");


    return [];
  }

  const {data: channelsData, error: channelsError} = await supabase
  .from('channels')
  .select('*')
  .in('id', channelIds);

  if (channelsError) {
    console.error(channelsError);

    return [];
  }

  /**
   * 这个用户在这个工作区能看到的频道列表
   */
  const userWorkspaceChannels = channelsData.filter(channel => 
    channel.members.includes(userId)
  );

  return userWorkspaceChannels as Channel[];
};
