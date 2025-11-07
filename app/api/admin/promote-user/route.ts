import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return new Response("Unauthorized", { status: 403 });
  }
  const { userId } = await req.json();

  await prisma.user.update({
    where: { id: userId },
    data: { role: "ADMIN" },
  });

  return new Response("User promoted to ADMIN", { status: 200 });
}
