"use server";

import { supabaseServerClient } from "@/supabase/supabaseServer";
import { getUserData } from "./get-user-data";

export const createChannel = async ({
  name,
  workspaceId,
  userId,
}: {
  name: string;
  workspaceId: string;
  userId: string;
}) => {
  const supabase = await supabaseServerClient();
  const userData = await getUserData();

  if (!userData) {
    return { error: "No user data" };
  }

  const { error, data: channelRecord } = await supabase
    .from("channels")
    .insert({
      name,
      workspace_id: workspaceId,
      user_id: userId,
    })
    .select("*");

  if (error) {
    return { error: "Insert Error" };
  }

  // Update channel members array
  const [updateChannelData, updateChannelMembersError] =
    await updateChannelMembers(channelRecord[0].id, userId);

  if (updateChannelMembersError) {
    return { error: "Update Members Channel Error" };
  }

  // Add channel to user's channels array
  const [addChannelToUserData, addChannelToUserError] = await addChannelToUser(
    userId,
    channelRecord[0].id
  );

  if (addChannelToUserError) {
    return { error: "Add Channel to User Error" };
  }

  // Add channel to workspace
  const [updateWorkspaceChannelData, updateWorkspaceChannelError] =
    await updateWorkspaceChannel(channelRecord[0].id, workspaceId);

  if (updateWorkspaceChannelError) {
    return { error: "Update Workspace Channel Error" };
  }

  
};

export const updateChannelMembers = async (
  channelId: string,
  userId: string
) => {
  const supabase = await supabaseServerClient();

  const { data: updateChannelData, error: updateChannelError } =
    await supabase.rpc("update_channel_members", {
      new_member: userId,
      channel_id: channelId,
    });

  return [updateChannelData, updateChannelError];
};

export const addChannelToUser = async (userId: string, channelId: string) => {
  const supabase = await supabaseServerClient();
  const { data: addChannelToUserData, error: addChannelToUserError } =
    await supabase.rpc("update_user_channels", {
      user_id: userId,
      channel_id: channelId,
    });

  return [addChannelToUserData, addChannelToUserError];
};

export const updateWorkspaceChannel = async (
  channelId: string,
  workspaceId: string
) => {
  const supabase = await supabaseServerClient();
  const {
    data: updateWorkspaceChannelData,
    error: updateWorkspaceChannelError,
  } = await supabase.rpc("add_channel_to_workspace", {
    channel_id: channelId,
    workspace_id: workspaceId,
  });

  return [updateWorkspaceChannelData, updateWorkspaceChannelError];
};

{/* 更新频道监管者
  参数: 
  channelId: string, 频道ID
  userId: string，用户ID
  */}
export const updateChannelRegulators = async (channelId: string, userId: string) => {

  const supabase = await supabaseServerClient();
  const {data: updateChannelData, error: updateChannelError} = await supabase
  .rpc("update_channel_regulators", {
    new_regulator: userId,
    channel_id: channelId,
  });

  return [updateChannelData, updateChannelError];
};

{/* 
  输入参数:
- new_regulator = "user-123"
- channel_id = "channel-456"

执行前:
channels 表:
┌─────────────┬─────────────────────┐
│ id          │ regulators          │
├─────────────┼─────────────────────┤
│ channel-456 │ ["user-alice"]      │
└─────────────┴─────────────────────┘

执行 SQL:
UPDATE channels 
SET regulators = regulators || array['user-123']
WHERE id = 'channel-456'

执行后:
channels 表:
┌─────────────┬─────────────────────────────┐
│ id          │ regulators                   │
├─────────────┼─────────────────────────────┤
│ channel-456 │ ["user-alice", "user-123"]  │
└─────────────┴─────────────────────────────┘
  */}