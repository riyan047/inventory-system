import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  const productTypes = await prisma.productType.findMany();
  return Response.json(productTypes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return new Response("Unauthorized", { status: 403 });
  }

  const { name, schema } = await req.json();

  const created = await prisma.productType.create({
    data: {
      name,
      schema,
    },
  });

  return Response.json(created);
}
