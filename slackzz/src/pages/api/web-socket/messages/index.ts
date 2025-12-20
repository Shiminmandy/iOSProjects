import { getUserDataPages } from "@/actions/get-user-data";
import SupabaseServerClientPages from "@/supabase/supabaseServerPages";
import { NextApiRequest} from "next";
import { SocketIoApiResponse } from "@/types/app";


export default async function handler(req: NextApiRequest, res: SocketIoApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {

    {/** 获取当前登陆用户数据 */}
    const userData = await getUserDataPages(req, res);

    // ① 验证：用户必须登录
    if (!userData) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { channelId, workspaceId } = req.query;

    // ② 接收：从 URL 获取参数
    if (!channelId || !workspaceId) {
      return res.status(400).json({ error: "Bad Request" });
    }

    // ② 接收：从请求体获取消息内容
    const {content, fileUrl} = req.body;

    if (!content && !fileUrl) {
      return res.status(400).json({ error: "Missing content or fileUrl" });
    }


    const supabase = await SupabaseServerClientPages(req, res);

    // ① 验证：用户必须是频道成员
    const {data: channelData, error: channelError} = await supabase
    .from('channels')
    .select('*')
    .eq('id', channelId)
    .contains('members', [userData.id]);

    if (!channelData?.length) {
      return res.status(403).json({ error: "Channel not found" });
    }

    // ③ 保存：插入消息到数据库
    const {error: creatingMessageError,data} = await supabase.from('messages').insert({
        user_id: userData.id,
        channel_id: channelId,
        workspace_id: workspaceId,
        content,
        fileUrl: fileUrl,
    })
    .select('*, user:user_id(*)')
    .order(`created_at`, {ascending: true})
    .single();

    if (creatingMessageError) {
      console.log("FAILED TO CREATE MESSAGE: ", creatingMessageError);
      return res.status(500).json({ error: "Failed to create message" });
    }

    {/** 如果服务器端存在socket实例，
      一旦有数据变化，supabase插入消息函数在上方，这里会触发广播，
      广播消息到所有连接的客户端 */}
    res?.socket?.server?.io?.emit(`channel:${channelId}:channel-messages`, data)

    return res.status(201).json({ message: 'Message created successfully' });

    
  } catch (error) {
    console.log("MESSAGE CREATION ERROR: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

