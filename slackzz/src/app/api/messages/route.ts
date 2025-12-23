import { getUserData } from "@/actions/get-user-data";
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { NextResponse } from "next/server";

/**
 * 计算分页查询的起始位置和结束位置
 * @param page 页码
 * @param size 每页条数
 * @returns 起始位置和结束位置
 */
function getPagination(page: number, size: number) {
  const limit = size ? +size : 10;
  const from = page ? page * limit : 0;
  const to = page ? from + limit - 1 : limit - 1;
  return { from, to };
}

export async function GET(req: Request) {
  try {
    const supabase = await supabaseServerClient();
    {
      /** 获取当前登陆用户数据 */
    }
    const userData = await getUserData();

    if (!userData) {
      return new Response("Unauthorized", { status: 401 });
    }

    {
      /** URL函数是javascript内置的类，用来处理URL地址。 */
    }
    const { searchParams } = new URL(req.url);

    {
      /** 获取URL中的channelId参数 */
    }
    const channelId = searchParams.get("channelId");

    if (!channelId) {
      return new Response("Bad Request", { status: 400 });
    }
    {
      /** 获取URL中的page和size参数 
       * Numebr（）和 ParseInt（）有区别
      */
    }
    const page = Number(searchParams.get("page"));
    const size = Number(searchParams.get("size"));

    const { from, to } = getPagination(page, size);

    const { data, error } = await supabase
      .from("messages")
      .select("*, user_id (*)")
      .eq("channel_id", channelId)
      .range(from, to)
      .order("created_at", { ascending: true });

    if (error) {
      console.log("FAILED TO FETCH MESSAGES: ", error);
      return new Response("Bad Request", { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.log("SERVER ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
