"use server";


import { supabaseServerClient } from "@/supabase/supabaseServer";


export async function registerWithEmail({email}: {email:string}) {

    const supabase = await supabaseServerClient();

    const {data, error} = await supabase.auth.signInWithOtp({
      email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: false,
        emailRedirectTo: process.env.NEXT_PUBLIC_CURRENT_ORIGIN,
      },
    })

    return {data, error};
  }