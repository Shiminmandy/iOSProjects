import { getUserData } from "@/actions/get-user-data";
import { supabaseServerClient } from "@/supabase/supabaseServer";

/**
 * 计算分页查询的起始位置和结束位置
 * @param page 页码
 * @param size 每页条数
 * @returns 起始位置和结束位置
 */
function getPagination(page: number, size: number) {
    const limit = size? +size : 10;
    const from = page ? page * limit : 0
    const to = page ? from + limit - 1 : limit - 1;
    return {from, to};
}




export async function GET(req: Request) {

    const supabase = await supabaseServerClient();
    const userData = await getUserData();
    {/** URL函数是javascript内置的类，用来处理URL地址。 */}
    const {searchParams} = new URL(req.url);
    const channelId = searchParams.get('channel_id');
  try {
  } catch (error) {
    console.log("SERVER ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
