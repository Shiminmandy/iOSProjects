"use server";

import { redirect } from "next/navigation";
import { getUserData } from "@/actions/get-user-data";

export default async function Home() {
  const userData = await getUserData();

  if (!userData) {
    console.log("No user data found, redirecting to auth");
    return redirect("/auth");
  }

  const userWorkspaceId = userData.workspaces?.[0];

  if (!userWorkspaceId) {
    return redirect('/create-workspace')
  }

  if(userWorkspaceId) {
    return redirect(`/workspace/${userWorkspaceId}`);
  }

}
