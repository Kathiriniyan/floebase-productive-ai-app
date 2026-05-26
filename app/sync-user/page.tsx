import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { syncClerkUser } from "@/db/sync-user";

export default async function SyncUserPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  await syncClerkUser(user);

  redirect("/");
}
