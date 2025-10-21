import { supabaseServerClient } from "@/supabase/supabaseServer";
import { User } from "@/types/app";

// 获取用户数据data，如果用户不存在，则返回null
export const getUserData = async (): Promise<User | null> => {
    const supabase = await supabaseServerClient();

    // 跳过data属性直接获取user
    const {data : {user},} = await supabase.auth.getUser();

    if (!user) {
        console.log('NO USER', user);
        return null;
    }

    // 查询users表，获取用户数据data中所有字段
    const {data, error} =  await supabase
      .from('users')
      .select('*')
      .eq('id', user.id);

    if (error) {
        console.log(error);
        return null;
    }

    return data? data[0] : null;
}