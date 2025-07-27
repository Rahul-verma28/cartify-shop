import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  return NextResponse.json({
    session,
    userId: session?.user?.id,
    userIdType: typeof session?.user?.id,
    userIdLength: session?.user?.id?.length,
  });
}
