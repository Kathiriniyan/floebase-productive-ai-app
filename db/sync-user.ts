import type { currentUser } from "@clerk/nextjs/server";

import { db, users } from "@/db";

type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

function getUserEmail(user: ClerkUser) {
  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId,
  );

  return primaryEmail?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
}

function getUserName(user: ClerkUser, email: string) {
  const fullName = user.fullName?.trim();
  const firstName = user.firstName?.trim();
  const lastName = user.lastName?.trim();
  const nameFromParts = [firstName, lastName].filter(Boolean).join(" ");

  return fullName || nameFromParts || email;
}

export async function syncClerkUser(user: ClerkUser) {
  const email = getUserEmail(user);

  if (!email) {
    throw new Error(`Unable to sync Clerk user ${user.id}: no email address found.`);
  }

  const userProfile = {
    clerkId: user.id,
    email,
    name: getUserName(user, email),
    imageUrl: user.imageUrl,
    updatedAt: new Date(),
  };

  const [syncedUser] = await db
    .insert(users)
    .values(userProfile)
    .onConflictDoUpdate({
      target: users.clerkId,
      set: userProfile,
    })
    .returning();

  return syncedUser;
}
