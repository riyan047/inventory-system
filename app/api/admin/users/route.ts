import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN")
    return new Response("Unauthorized", { status: 403 });

  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true },
  });

  return Response.json(users);
}
