
{/**
  page router, 有req和res，deprecated
  */}

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from "next";

export default function SupabaseServerClientPages(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          res.appendHeader("Set-Cookie", serialize(name, value, options));
        },
        remove(name: string, options: CookieOptions) {
          res.appendHeader("Set-Cookie", serialize(name, "", options));
        },
      },
    }
  );
  
  return supabase;
}
