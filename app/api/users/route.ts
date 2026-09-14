import { db, users } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { NextResponse } from "next/server";

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 },
    );
  }

  const email = user.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json(
      { message: "The authenticated user does not have a primary email." },
      { status: 422 },
    );
  }

  const userData = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (userData.length > 0) {
    return NextResponse.json(userData[0]);
  }

  const result = await db
    .insert(users)
    .values({
      name: user.fullName,
      email,
    })
    .returning();

  return NextResponse.json(result[0]);
}
