"use server";


import { supabaseServerClient } from "@/supabase/supabaseServer";

// 若邮箱存在且已验证，则按照无密码登录处理，发送magic link给用户
// 若邮箱不存在或未验证，则创建新用户并发送confirm link给用户
export async function registerWithEmail({email}: {email:string}) {

    const supabase = await supabaseServerClient();

    // 使用 signInWithOtp，允许自动创建用户
    const {data, error} = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_CURRENT_ORIGIN,
      },
    })

    return {data, error};
  }