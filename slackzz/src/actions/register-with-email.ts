"use server";


import { supabaseServerClient } from "@/supabase/supabaseServer";


export async function registerWithEmail({email}: {email:string}) {

    const supabase = await supabaseServerClient();

    // 使用 signInWithOtp，允许自动创建用户
    const {data, error} = await supabase.auth.signInWithOtp({
      email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: true,
        emailRedirectTo: process.env.NEXT_PUBLIC_CURRENT_ORIGIN,
      },
    })

    return {data, error};
  }