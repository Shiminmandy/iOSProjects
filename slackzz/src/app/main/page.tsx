"use client";

import { useEffect, useState } from "react";
import { supabaseBrowserClient } from "@/supabase/supabaseClient";
import { User } from "@supabase/supabase-js";
import Typography from "@/components/ui/typography";

export default function MainPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabaseBrowserClient.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Typography variant="h2" text="Loading..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Typography variant="h2" text="Please sign in first" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-4xl mx-auto">
        <Typography 
          variant="h1" 
          text={`Welcome, ${user.email}!`} 
          className="mb-6"
        />
        
        <div className="bg-gray-100 p-6 rounded-lg">
          <Typography 
            variant="h2" 
            text="Successfully authenticated!" 
            className="mb-4"
          />
          <Typography 
            variant="p" 
            text="You have been redirected to the main page after Google authentication." 
          />
        </div>
      </div>
    </div>
  );
}
