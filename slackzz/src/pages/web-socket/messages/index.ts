import { getUserDataPages } from "@/actions/get-user-data";
import SupabaseServerClientPages from "@/supabase/supabaseServerPages";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {

    {/** 获取当前登陆用户数据 */}
    const userData = await getUserDataPages(req, res);

    if (!userData) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { channelId, workspaceId } = req.query;

    if (!channelId || !workspaceId) {
      return res.status(400).json({ error: "Bad Request" });
    }

    const {content, fileUrl} = req.body;

    if (!content && !fileUrl) {
      return res.status(400).json({ error: "Missing content or fileUrl" });
    }


    const supabase = await SupabaseServerClientPages(req, res);

    const {data: channelData, error: channelError} = await supabase
    .from('channels')
    .select('*')
    .eq('id', channelId)
    .contains('members', [userData.id]);

    if (!channelData?.length) {
      return res.status(403).json({ error: "Channel not found" });
    }

    const {error: creatingMessageError} = await supabase.from('messages').insert({
        user_id: userData.id,
        channel_id: channelId,
        workspace_id: workspaceId,
        content,
        fileUrl: fileUrl,
    })
    .select('*, user:user_id(*)')
    .single();

    if (creatingMessageError) {
      console.log("FAILED TO CREATE MESSAGE: ", creatingMessageError);
      return res.status(500).json({ error: "Failed to create message" });
    }

    return res.status(201).json({ message: 'Message created successfully' });

    
  } catch (error) {
    console.log("MESSAGE CREATION ERROR: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
